import { MAX_NOTE_LENGTH, MAX_TAGS_PER_NOTE } from '../model/constants';
import { buildClipboardText, formatCitation, formatReference, normalizeTag, toDayKey } from '../model/reference';
import type {
  Bookmark,
  Highlight,
  HighlightColor,
  MemorizedVerse,
  Note,
  NoteCategory,
  TranslationId,
  VerseReference,
} from '../model/types';
import { getBookByNumber } from '../model/canon';
import { translate } from '../i18n';
import {
  deleteBookmark,
  deleteHighlight,
  deleteMemorizedVerse,
  deleteNote,
  putBookmark,
  putHighlight,
  putMemorizedVerse,
  putNote,
} from './idb';
import { notifyLocalChange, recordDeletion } from './sync-events';
import { appStore, showToast } from './store';

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function referenceKey(reference: VerseReference): string {
  return `${reference.bookNumber}:${reference.chapter}:${reference.verse}`;
}

export function sanitizeTags(raw: string): readonly string[] {
  const tags = raw
    .split(',')
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);
  return [...new Set(tags)].slice(0, MAX_TAGS_PER_NOTE);
}

export function findNoteForVerse(
  notes: readonly Note[],
  reference: VerseReference,
  translationId: TranslationId,
): Note | undefined {
  return notes.find(
    (note) =>
      note.reference !== undefined &&
      note.translationId === translationId &&
      note.reference.bookNumber === reference.bookNumber &&
      note.reference.chapter === reference.chapter &&
      note.reference.verse === reference.verse,
  );
}

export function findHighlightForVerse(
  highlights: readonly Highlight[],
  reference: VerseReference,
): Highlight | undefined {
  return highlights.find(
    (highlight) =>
      highlight.reference.bookNumber === reference.bookNumber &&
      highlight.reference.chapter === reference.chapter &&
      highlight.reference.verse === reference.verse,
  );
}

export function findBookmarkForVerse(
  bookmarks: readonly Bookmark[],
  reference: VerseReference,
): Bookmark | undefined {
  return bookmarks.find(
    (bookmark) =>
      bookmark.reference.bookNumber === reference.bookNumber &&
      bookmark.reference.chapter === reference.chapter &&
      bookmark.reference.verse === reference.verse,
  );
}

export function findMemorizedForVerse(
  memorized: readonly MemorizedVerse[],
  reference: VerseReference,
): MemorizedVerse | undefined {
  return memorized.find(
    (item) =>
      item.reference.bookNumber === reference.bookNumber &&
      item.reference.chapter === reference.chapter &&
      item.reference.verse === reference.verse,
  );
}

export interface CreateNoteInput {
  readonly category?: NoteCategory;
  readonly title?: string;
  readonly speaker?: string;
  readonly eventDate?: string;
  readonly reference?: VerseReference;
  readonly linkedReferences?: readonly VerseReference[];
  readonly translationId: TranslationId;
  readonly body: string;
  readonly tags: readonly string[];
}

export async function createNote(input: CreateNoteInput): Promise<Note | null> {
  const body = input.body.trim().slice(0, MAX_NOTE_LENGTH);
  if (body.length === 0) return null;

  const now = Date.now();
  const title = input.title?.trim();
  const speaker = input.speaker?.trim();
  const eventDate = input.eventDate?.trim();
  const category = input.category ?? (input.reference ? 'verse' : 'study');

  const note: Note = {
    id: newId(),
    category,
    translationId: input.translationId,
    body,
    tags: input.tags.slice(0, MAX_TAGS_PER_NOTE),
    createdAt: now,
    updatedAt: now,
    ...(title ? { title } : {}),
    ...(speaker ? { speaker } : {}),
    ...(eventDate ? { eventDate } : {}),
    ...(input.reference ? { reference: input.reference } : {}),
    ...(input.linkedReferences && input.linkedReferences.length > 0
      ? { linkedReferences: input.linkedReferences }
      : {}),
  };

  try {
    await putNote(note);
  } catch {
    // Se mantiene en memoria aunque IndexedDB falle.
  }

  appStore.setState((state) => ({ ...state, notes: [...state.notes, note] }));
  showToast(translate(appStore.getState().preferences.uiLanguage, 'reader.savedNote'), 'success');
  notifyLocalChange();
  return note;
}

export interface UpdateNotePatch {
  readonly category?: NoteCategory;
  readonly title?: string | undefined;
  readonly speaker?: string | undefined;
  readonly eventDate?: string | undefined;
  readonly reference?: VerseReference | undefined;
  readonly linkedReferences?: readonly VerseReference[];
  readonly body: string;
  readonly tags: readonly string[];
}

export async function updateNote(id: string, patch: UpdateNotePatch): Promise<void> {
  const { notes } = appStore.getState();
  const existing = notes.find((note) => note.id === id);
  if (!existing) return;

  const body = patch.body.trim().slice(0, MAX_NOTE_LENGTH);
  if (body.length === 0) {
    await removeNote(id);
    return;
  }

  const nextCategory = patch.category ?? existing.category ?? 'verse';
  const nextTitle = patch.title !== undefined ? patch.title.trim() : existing.title;
  const nextSpeaker = patch.speaker !== undefined ? patch.speaker.trim() : existing.speaker;
  const nextDate = patch.eventDate !== undefined ? patch.eventDate.trim() : existing.eventDate;
  const nextRef = patch.reference !== undefined ? patch.reference : existing.reference;

  const updated: Note = {
    id: existing.id,
    category: nextCategory,
    translationId: existing.translationId,
    body,
    tags: patch.tags.slice(0, MAX_TAGS_PER_NOTE),
    createdAt: existing.createdAt,
    updatedAt: Date.now(),
    ...(nextTitle ? { title: nextTitle } : {}),
    ...(nextSpeaker ? { speaker: nextSpeaker } : {}),
    ...(nextDate ? { eventDate: nextDate } : {}),
    ...(nextRef ? { reference: nextRef } : {}),
    ...(patch.linkedReferences && patch.linkedReferences.length > 0
      ? { linkedReferences: patch.linkedReferences }
      : existing.linkedReferences && existing.linkedReferences.length > 0
        ? { linkedReferences: existing.linkedReferences }
        : {}),
  };

  try {
    await putNote(updated);
  } catch {
    // Sin persistencia, al menos la sesión actual refleja el cambio.
  }

  appStore.setState((state) => ({
    ...state,
    notes: state.notes.map((note) => (note.id === id ? updated : note)),
  }));
  showToast(translate(appStore.getState().preferences.uiLanguage, 'reader.savedNote'), 'success');
  notifyLocalChange();
}

export async function removeNote(id: string): Promise<void> {
  try {
    await deleteNote(id);
  } catch {
    // La UI no debe bloquearse por un fallo de IndexedDB.
  }
  appStore.setState((state) => ({ ...state, notes: state.notes.filter((note) => note.id !== id) }));
  recordDeletion('notes', id);
  showToast(translate(appStore.getState().preferences.uiLanguage, 'reader.deletedNote'), 'info');
}

export async function toggleHighlight(
  reference: VerseReference,
  translationId: TranslationId,
  color: HighlightColor,
): Promise<void> {
  const { highlights } = appStore.getState();
  const existing = findHighlightForVerse(highlights, reference);

  if (existing) {
    try {
      await deleteHighlight(existing.id);
    } catch {
      // Ignorado: el estado en memoria manda.
    }
    appStore.setState((state) => ({
      ...state,
      highlights: state.highlights.filter((highlight) => highlight.id !== existing.id),
    }));
    recordDeletion('highlights', existing.id);
    return;
  }

  const highlight: Highlight = {
    id: newId(),
    reference,
    translationId,
    color,
    createdAt: Date.now(),
  };

  try {
    await putHighlight(highlight);
  } catch {
    // Ignorado.
  }
  appStore.setState((state) => ({ ...state, highlights: [...state.highlights, highlight] }));
  notifyLocalChange();
}

export async function toggleBookmark(reference: VerseReference, translationId: TranslationId): Promise<void> {
  const { bookmarks, preferences } = appStore.getState();
  const existing = findBookmarkForVerse(bookmarks, reference);

  if (existing) {
    try {
      await deleteBookmark(existing.id);
    } catch {
      // Ignorado.
    }
    appStore.setState((state) => ({
      ...state,
      bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== existing.id),
    }));
    recordDeletion('bookmarks', existing.id);
    showToast(translate(preferences.uiLanguage, 'reader.unbookmarked'), 'info');
    return;
  }

  const bookmark: Bookmark = {
    id: newId(),
    reference,
    translationId,
    createdAt: Date.now(),
  };

  try {
    await putBookmark(bookmark);
  } catch {
    // Ignorado.
  }
  appStore.setState((state) => ({ ...state, bookmarks: [...state.bookmarks, bookmark] }));
  showToast(translate(preferences.uiLanguage, 'reader.bookmarked'), 'success');
  notifyLocalChange();
}

export async function toggleMemorizedVerse(
  reference: VerseReference,
  translationId: TranslationId,
  text: string,
): Promise<void> {
  const { memorizedVerses, preferences } = appStore.getState();
  const existing = findMemorizedForVerse(memorizedVerses, reference);

  if (existing) {
    try {
      await deleteMemorizedVerse(existing.id);
    } catch {
      // Ignorado: el estado en memoria manda.
    }
    appStore.setState((state) => ({
      ...state,
      memorizedVerses: state.memorizedVerses.filter((item) => item.id !== existing.id),
    }));
    recordDeletion('memorized', existing.id);
    showToast(translate(preferences.uiLanguage, 'reader.unmemorized'), 'info');
    return;
  }

  const memorized: MemorizedVerse = {
    id: newId(),
    reference,
    translationId,
    text: text.trim(),
    createdAt: Date.now(),
  };

  try {
    await putMemorizedVerse(memorized);
  } catch {
    // Ignorado.
  }
  appStore.setState((state) => ({
    ...state,
    memorizedVerses: [...state.memorizedVerses, memorized],
  }));
  showToast(translate(preferences.uiLanguage, 'reader.memorized'), 'success');
  notifyLocalChange();
}

export async function removeMemorizedVerse(id: string): Promise<void> {
  const { preferences } = appStore.getState();
  try {
    await deleteMemorizedVerse(id);
  } catch {
    // La UI no debe bloquearse por un fallo de IndexedDB.
  }
  appStore.setState((state) => ({
    ...state,
    memorizedVerses: state.memorizedVerses.filter((item) => item.id !== id),
  }));
  recordDeletion('memorized', id);
  showToast(translate(preferences.uiLanguage, 'reader.unmemorized'), 'info');
}

export async function copyVerse(
  reference: VerseReference,
  translationId: TranslationId,
  text: string,
): Promise<void> {
  const language = appStore.getState().preferences.uiLanguage;
  const payload = buildClipboardText(reference, translationId, text, language);
  try {
    await navigator.clipboard.writeText(payload);
    showToast(translate(language, 'common.copied'), 'success');
  } catch {
    showToast(translate(language, 'common.error'), 'error');
  }
}

/** Genera el Markdown completo; lo usan la descarga local y la exportación a Drive. */
export function buildMarkdownExport(): string {
  const { notes, highlights, bookmarks, memorizedVerses, preferences } = appStore.getState();
  const language = preferences.uiLanguage;
  const lines: string[] = [
    `# ${translate(language, 'notes.title')} — Santi's Versicles`,
    '',
    `> ${toDayKey()}`,
    '',
  ];

  const sortedNotes = [...notes].sort((a, b) => {
    const refA = a.reference;
    const refB = b.reference;
    if (refA && refB) {
      if (refA.bookNumber !== refB.bookNumber) return refA.bookNumber - refB.bookNumber;
      if (refA.chapter !== refB.chapter) return refA.chapter - refB.chapter;
      return refA.verse - refB.verse;
    }
    if (refA) return 1;
    if (refB) return -1;
    return b.updatedAt - a.updatedAt;
  });

  lines.push(`## ${translate(language, 'notes.tabNotes')}`, '');
  if (sortedNotes.length === 0) {
    lines.push(`_${translate(language, 'reader.noNotes')}_`, '');
  }
  for (const note of sortedNotes) {
    const category = note.category ?? 'verse';
    const headingParts: string[] = [];
    if (note.title) headingParts.push(note.title);
    if (note.reference) headingParts.push(formatCitation(note.reference, note.translationId, language));
    const heading = headingParts.length > 0 ? headingParts.join(' · ') : `[${category.toUpperCase()}]`;
    lines.push(`### ${heading}`);
    const meta: string[] = [`[${category}]`];
    if (note.speaker) meta.push(note.speaker);
    if (note.eventDate) meta.push(note.eventDate);
    if (note.reference) {
      const book = getBookByNumber(note.reference.bookNumber);
      if (book) meta.push(`${book.nameEs} ${note.reference.chapter}`);
    }
    if (meta.length > 0) lines.push(`*${meta.join(' · ')}*`);
    lines.push('', note.body, '');
    if (note.tags.length > 0) lines.push(`\`${note.tags.join('` `')}\``, '');
  }

  lines.push(`## ${translate(language, 'notes.tabHighlights')}`, '');
  for (const highlight of highlights) {
    lines.push(`- ${formatReference(highlight.reference, language)} — ${highlight.color}`);
  }
  if (highlights.length === 0) lines.push(`_${translate(language, 'notes.noHighlights')}_`);
  lines.push('');

  lines.push(`## ${translate(language, 'notes.tabBookmarks')}`, '');
  for (const bookmark of bookmarks) {
    lines.push(`- ${formatCitation(bookmark.reference, bookmark.translationId, language)}`);
  }
  if (bookmarks.length === 0) lines.push(`_${translate(language, 'notes.noBookmarks')}_`);
  lines.push('');

  const sortedMemorized = [...memorizedVerses].sort((a, b) => {
    if (a.reference.bookNumber !== b.reference.bookNumber) return a.reference.bookNumber - b.reference.bookNumber;
    if (a.reference.chapter !== b.reference.chapter) return a.reference.chapter - b.reference.chapter;
    return a.reference.verse - b.reference.verse;
  });

  lines.push(`## ${translate(language, 'notes.tabMemorize')}`, '');
  if (sortedMemorized.length === 0) {
    lines.push(`_${translate(language, 'notes.noMemorized')}_`, '');
  }
  for (const item of sortedMemorized) {
    const book = getBookByNumber(item.reference.bookNumber);
    lines.push(`### ${formatCitation(item.reference, item.translationId, language)}`);
    if (book) lines.push(`*${book.nameEs} ${item.reference.chapter}*`);
    lines.push('', item.text, '');
  }

  return lines.join('\n');
}

/** Exporta notas, subrayados, guardados y versículos para memorizar a Markdown. */
export function exportMarkdown(): void {
  const language = appStore.getState().preferences.uiLanguage;
  const blob = new Blob([buildMarkdownExport()], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `santis-versicles-${toDayKey()}.md`;
  anchor.click();
  URL.revokeObjectURL(url);

  showToast(translate(language, 'notes.exported'), 'success');
}
