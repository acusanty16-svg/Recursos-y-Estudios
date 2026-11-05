import { MAX_NOTE_LENGTH, MAX_TAGS_PER_NOTE } from '../model/constants';
import { buildClipboardText, formatCitation, formatReference, normalizeTag, toDayKey } from '../model/reference';
import type {
  Bookmark,
  Highlight,
  HighlightColor,
  MemorizedVerse,
  Note,
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

export async function createNote(input: {
  readonly reference: VerseReference;
  readonly translationId: TranslationId;
  readonly body: string;
  readonly tags: readonly string[];
}): Promise<Note | null> {
  const body = input.body.trim().slice(0, MAX_NOTE_LENGTH);
  if (body.length === 0) return null;

  const now = Date.now();
  const note: Note = {
    id: newId(),
    reference: input.reference,
    translationId: input.translationId,
    body,
    tags: input.tags.slice(0, MAX_TAGS_PER_NOTE),
    createdAt: now,
    updatedAt: now,
  };

  try {
    await putNote(note);
  } catch {
    // Se mantiene en memoria aunque IndexedDB falle.
  }

  appStore.setState((state) => ({ ...state, notes: [...state.notes, note] }));
  showToast(translate(appStore.getState().preferences.uiLanguage, 'reader.savedNote'), 'success');
  return note;
}

export async function updateNote(
  id: string,
  patch: { readonly body: string; readonly tags: readonly string[] },
): Promise<void> {
  const { notes } = appStore.getState();
  const existing = notes.find((note) => note.id === id);
  if (!existing) return;

  const body = patch.body.trim().slice(0, MAX_NOTE_LENGTH);
  if (body.length === 0) {
    await removeNote(id);
    return;
  }

  const updated: Note = {
    ...existing,
    body,
    tags: patch.tags.slice(0, MAX_TAGS_PER_NOTE),
    updatedAt: Date.now(),
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
}

export async function removeNote(id: string): Promise<void> {
  try {
    await deleteNote(id);
  } catch {
    // La UI no debe bloquearse por un fallo de IndexedDB.
  }
  appStore.setState((state) => ({ ...state, notes: state.notes.filter((note) => note.id !== id) }));
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

/** Exporta notas, subrayados, guardados y versículos para memorizar a Markdown. */
export function exportMarkdown(): void {
  const { notes, highlights, bookmarks, memorizedVerses, preferences } = appStore.getState();
  const language = preferences.uiLanguage;
  const lines: string[] = [
    `# ${translate(language, 'notes.title')} — Santi's Versicles`,
    '',
    `> ${toDayKey()}`,
    '',
  ];

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.reference.bookNumber !== b.reference.bookNumber) return a.reference.bookNumber - b.reference.bookNumber;
    if (a.reference.chapter !== b.reference.chapter) return a.reference.chapter - b.reference.chapter;
    return a.reference.verse - b.reference.verse;
  });

  lines.push(`## ${translate(language, 'notes.tabNotes')}`, '');
  if (sortedNotes.length === 0) {
    lines.push(`_${translate(language, 'reader.noNotes')}_`, '');
  }
  for (const note of sortedNotes) {
    const book = getBookByNumber(note.reference.bookNumber);
    lines.push(`### ${formatCitation(note.reference, note.translationId, language)}`);
    if (book) lines.push(`*${book.nameEs} ${note.reference.chapter}*`);
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

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `santis-versicles-${toDayKey()}.md`;
  anchor.click();
  URL.revokeObjectURL(url);

  showToast(translate(language, 'notes.exported'), 'success');
}
