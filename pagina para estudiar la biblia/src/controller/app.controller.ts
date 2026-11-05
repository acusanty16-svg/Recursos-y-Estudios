import { getBookByNumber } from '../model/canon';
import { STORAGE_KEYS } from '../model/constants';
import { errorMessage } from '../model/errors';
import { toDayKey } from '../model/reference';
import type { Chapter, ReadingEvent, StreakState, TranslationId } from '../model/types';
import { buildStreakState } from '../seguimiento/streak';
import { loadChapter } from './bible.service';
import {
  getAllBookmarks,
  getAllEvents,
  getAllHighlights,
  getAllImportedMeta,
  getAllMemorizedVerses,
  getAllNotes,
  putEvent,
} from './idb';
import { loadPreferences, updatePreferences } from './preferences.controller';
import { appStore } from './store';

let loadToken = 0;
let bootStarted = false;

export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window;
}

function readNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

/**
 * Arranque único de la aplicación.
 * Orden: preferencias (síncrono, evita flash de tema) → IndexedDB → estado.
 */
export async function bootstrapApp(): Promise<void> {
  if (bootStarted) return;
  bootStarted = true;
  loadPreferences();

  appStore.setState((state) => ({
    ...state,
    fileSystemSupported: isFileSystemAccessSupported(),
    notificationPermission: readNotificationPermission(),
  }));

  try {
    const [notes, highlights, bookmarks, memorizedVerses, events, importedMeta] = await Promise.all([
      getAllNotes(),
      getAllHighlights(),
      getAllBookmarks(),
      getAllMemorizedVerses(),
      getAllEvents(),
      getAllImportedMeta(),
    ]);

    const streak = buildStreakState(events);

    appStore.setState((state) => ({
      ...state,
      notes,
      highlights,
      bookmarks,
      memorizedVerses,
      events,
      importedMeta,
      streak,
      bootStatus: 'ready',
    }));

    // Reanuda la última ubicación persistida, si existe.
    const saved = localStorage.getItem(STORAGE_KEYS.onboarding);
    if (saved) {
      const parsed = parseLocation(saved);
      if (parsed) {
        await goToChapter(parsed.bookNumber, parsed.chapter);
        return;
      }
    }
    await goToChapter(43, 1);
  } catch (cause) {
    appStore.setState((state) => ({
      ...state,
      bootStatus: 'ready',
      chapterStatus: 'error',
      chapterError: errorMessage(cause),
    }));
  }
}

function parseLocation(raw: string): { bookNumber: number; chapter: number } | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;
    const bookNumber = candidate.bookNumber;
    const chapter = candidate.chapter;
    if (typeof bookNumber !== 'number' || typeof chapter !== 'number') return null;
    if (!getBookByNumber(bookNumber)) return null;
    return { bookNumber, chapter };
  } catch {
    return null;
  }
}

function persistLocation(bookNumber: number, chapter: number): void {
  localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify({ bookNumber, chapter }));
}

/** Cambia de capítulo y dispara la carga con protección contra respuestas fuera de orden. */
export async function goToChapter(bookNumber: number, chapter: number): Promise<void> {
  const book = getBookByNumber(bookNumber);
  if (!book) return;
  const safeChapter = Math.min(Math.max(1, chapter), book.chapters);
  const { preferences } = appStore.getState();

  appStore.setState((state) => ({
    ...state,
    location: { bookNumber, chapter: safeChapter },
    chapterStatus: 'loading',
    chapterError: null,
  }));

  persistLocation(bookNumber, safeChapter);
  await loadCurrentChapter(preferences.activeTranslation);
}

export async function loadCurrentChapter(translationId: TranslationId, forceNetwork = false): Promise<void> {
  const { location } = appStore.getState();
  const token = ++loadToken;

  appStore.setState((state) => ({ ...state, chapterStatus: 'loading', chapterError: null }));

  const result = await loadChapter(translationId, location.bookNumber, location.chapter, { forceNetwork });

  if (token !== loadToken) return;

  if (!result.ok) {
    if (result.error.code === 'ABORTED') return;
    appStore.setState((state) => ({
      ...state,
      chapterStatus: 'error',
      chapterError: result.error.message,
    }));
    return;
  }

  appStore.setState((state) => ({
    ...state,
    chapter: result.value,
    chapterStatus: 'ready',
    chapterError: null,
  }));

  await recordReading(result.value);
}

/** Registra el capítulo como lectura del día. Idempotente por día+capítulo+traducción. */
export async function recordReading(chapter: Chapter): Promise<void> {
  const day = toDayKey();
  const id = `${day}:${chapter.bookNumber}:${chapter.chapter}:${chapter.translationId}`;
  const { events } = appStore.getState();
  if (events.some((event) => event.id === id)) return;

  const event: ReadingEvent = {
    id,
    day,
    bookNumber: chapter.bookNumber,
    chapter: chapter.chapter,
    translationId: chapter.translationId,
    timestamp: Date.now(),
  };

  const nextEvents = [...events, event];
  const streak = buildStreakState(nextEvents);

  appStore.setState((state) => ({ ...state, events: nextEvents, streak }));
  persistStreak(streak);

  try {
    await putEvent(event);
  } catch {
    // El estado en memoria ya refleja la lectura; IndexedDB reintentará en la próxima sesión.
  }
}

function persistStreak(streak: StreakState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(streak));
  } catch {
    // Almacenamiento lleno o bloqueado: no es crítico.
  }
}

export function setTranslation(translationId: TranslationId): void {
  updatePreferences({ activeTranslation: translationId });
  void loadCurrentChapter(translationId);
}

export function setCompareTranslation(translationId: TranslationId | null): void {
  appStore.setState((state) => ({ ...state, compareTranslation: translationId }));
}

export function goToReference(bookNumber: number, chapter: number): void {
  void goToChapter(bookNumber, chapter);
}

export function nextChapter(): void {
  const { location } = appStore.getState();
  const book = getBookByNumber(location.bookNumber);
  if (!book) return;
  if (location.chapter < book.chapters) {
    void goToChapter(location.bookNumber, location.chapter + 1);
    return;
  }
  const nextBook = getBookByNumber(location.bookNumber + 1);
  if (nextBook) void goToChapter(nextBook.number, 1);
}

export function previousChapter(): void {
  const { location } = appStore.getState();
  const book = getBookByNumber(location.bookNumber);
  if (!book) return;
  if (location.chapter > 1) {
    void goToChapter(location.bookNumber, location.chapter - 1);
    return;
  }
  const previousBook = getBookByNumber(location.bookNumber - 1);
  if (previousBook) void goToChapter(previousBook.number, previousBook.chapters);
}
