import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION } from '../model/constants';
import type {
  Bookmark,
  Chapter,
  Highlight,
  ImportKind,
  ImportedFileMeta,
  MemorizedVerse,
  Note,
  ReadingEvent,
} from '../model/types';

interface HandleRecord {
  readonly kind: ImportKind;
  readonly handle: FileSystemFileHandle;
  readonly savedAt: number;
}

interface MetaRecord {
  readonly key: string;
  readonly value: string;
}

interface SantiDB extends DBSchema {
  chapters: { key: string; value: Chapter };
  notes: { key: string; value: Note; indexes: { 'by-ref': string } };
  highlights: { key: string; value: Highlight; indexes: { 'by-ref': string } };
  bookmarks: { key: string; value: Bookmark; indexes: { 'by-ref': string } };
  memorized: { key: string; value: MemorizedVerse; indexes: { 'by-ref': string } };
  events: { key: string; value: ReadingEvent; indexes: { 'by-day': string } };
  handles: { key: ImportKind; value: HandleRecord };
  meta: { key: string; value: MetaRecord };
}

export type AppDatabase = IDBPDatabase<SantiDB>;

let dbPromise: Promise<AppDatabase> | null = null;

/**
 * Conexión perezosa y única. IndexedDB es la fuente de verdad local:
 * capítulos, notas, eventos, handles de archivos y metadatos de importación.
 */
export function getDb(): Promise<AppDatabase> {
  dbPromise ??= openDB<SantiDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('chapters')) {
        db.createObjectStore('chapters');
      }
      if (!db.objectStoreNames.contains('notes')) {
        const store = db.createObjectStore('notes', { keyPath: 'id' });
        store.createIndex('by-ref', ['reference.bookNumber', 'reference.chapter', 'reference.verse']);
      }
      if (!db.objectStoreNames.contains('highlights')) {
        const store = db.createObjectStore('highlights', { keyPath: 'id' });
        store.createIndex('by-ref', ['reference.bookNumber', 'reference.chapter', 'reference.verse']);
      }
      if (!db.objectStoreNames.contains('bookmarks')) {
        const store = db.createObjectStore('bookmarks', { keyPath: 'id' });
        store.createIndex('by-ref', ['reference.bookNumber', 'reference.chapter', 'reference.verse']);
      }
      if (!db.objectStoreNames.contains('memorized')) {
        const store = db.createObjectStore('memorized', { keyPath: 'id' });
        store.createIndex('by-ref', ['reference.bookNumber', 'reference.chapter', 'reference.verse']);
      }
      if (!db.objectStoreNames.contains('events')) {
        const store = db.createObjectStore('events', { keyPath: 'id' });
        store.createIndex('by-day', 'day');
      }
      if (!db.objectStoreNames.contains('handles')) {
        db.createObjectStore('handles', { keyPath: 'kind' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    },
  });
  return dbPromise;
}

export function chapterKey(translationId: string, bookNumber: number, chapter: number): string {
  return `${translationId}:${bookNumber}:${chapter}`;
}

/* ------------------------------- Capítulos ------------------------------- */

export async function getCachedChapter(
  translationId: string,
  bookNumber: number,
  chapter: number,
): Promise<Chapter | undefined> {
  const db = await getDb();
  return db.get('chapters', chapterKey(translationId, bookNumber, chapter));
}

export async function putCachedChapter(chapter: Chapter): Promise<void> {
  const db = await getDb();
  await db.put('chapters', chapter, chapterKey(chapter.translationId, chapter.bookNumber, chapter.chapter));
}

export async function clearChapterCache(): Promise<void> {
  const db = await getDb();
  await db.clear('chapters');
}

/* --------------------------------- Notas --------------------------------- */

export async function getAllNotes(): Promise<readonly Note[]> {
  const db = await getDb();
  return db.getAll('notes');
}

export async function putNote(note: Note): Promise<void> {
  const db = await getDb();
  await db.put('notes', note);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('notes', id);
}

/* ------------------------------ Subrayados ------------------------------- */

export async function getAllHighlights(): Promise<readonly Highlight[]> {
  const db = await getDb();
  return db.getAll('highlights');
}

export async function putHighlight(highlight: Highlight): Promise<void> {
  const db = await getDb();
  await db.put('highlights', highlight);
}

export async function deleteHighlight(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('highlights', id);
}

/* ------------------------------- Favoritos ------------------------------- */

export async function getAllBookmarks(): Promise<readonly Bookmark[]> {
  const db = await getDb();
  return db.getAll('bookmarks');
}

export async function putBookmark(bookmark: Bookmark): Promise<void> {
  const db = await getDb();
  await db.put('bookmarks', bookmark);
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('bookmarks', id);
}

/* ------------------------------- Memorizar ------------------------------- */

export async function getAllMemorizedVerses(): Promise<readonly MemorizedVerse[]> {
  const db = await getDb();
  return db.getAll('memorized');
}

export async function putMemorizedVerse(verse: MemorizedVerse): Promise<void> {
  const db = await getDb();
  await db.put('memorized', verse);
}

export async function deleteMemorizedVerse(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('memorized', id);
}

/**
 * Reemplaza las colecciones sincronizadas de una sola vez.
 * Se usa al aplicar una fusión de Drive para evitar estados intermedios.
 */
export async function replaceSyncedData(data: {
  readonly notes: readonly Note[];
  readonly highlights: readonly Highlight[];
  readonly bookmarks: readonly Bookmark[];
  readonly memorizedVerses: readonly MemorizedVerse[];
}): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(['notes', 'highlights', 'bookmarks', 'memorized'], 'readwrite');
  const notesStore = tx.objectStore('notes');
  const highlightsStore = tx.objectStore('highlights');
  const bookmarksStore = tx.objectStore('bookmarks');
  const memorizedStore = tx.objectStore('memorized');

  // Todas las peticiones se encolan de forma síncrona: así la transacción
  // no se cierra entre los clear y los put.
  await Promise.all([
    notesStore.clear(),
    highlightsStore.clear(),
    bookmarksStore.clear(),
    memorizedStore.clear(),
    ...data.notes.map((note) => notesStore.put(note)),
    ...data.highlights.map((highlight) => highlightsStore.put(highlight)),
    ...data.bookmarks.map((bookmark) => bookmarksStore.put(bookmark)),
    ...data.memorizedVerses.map((verse) => memorizedStore.put(verse)),
  ]);

  await tx.done;
}

/* --------------------------- Eventos de lectura -------------------------- */

export async function getAllEvents(): Promise<readonly ReadingEvent[]> {
  const db = await getDb();
  return db.getAll('events');
}

export async function putEvent(event: ReadingEvent): Promise<void> {
  const db = await getDb();
  await db.put('events', event);
}

/* ----------------------- Handles de archivos (FSA) ----------------------- */

export async function saveFileHandle(
  kind: ImportKind,
  handle: FileSystemFileHandle,
): Promise<void> {
  const db = await getDb();
  await db.put('handles', { kind, handle, savedAt: Date.now() });
}

export async function getFileHandle(kind: ImportKind): Promise<FileSystemFileHandle | undefined> {
  const db = await getDb();
  const record = await db.get('handles', kind);
  return record?.handle;
}

export async function deleteFileHandle(kind: ImportKind): Promise<void> {
  const db = await getDb();
  await db.delete('handles', kind);
}

/* ------------------------- Metadatos de importación ---------------------- */

export async function saveImportedMeta(meta: ImportedFileMeta): Promise<void> {
  const db = await getDb();
  await db.put('meta', { key: `import:${meta.kind}`, value: JSON.stringify(meta) });
}

export async function getAllImportedMeta(): Promise<readonly ImportedFileMeta[]> {
  const db = await getDb();
  const records = await db.getAll('meta');
  const result: ImportedFileMeta[] = [];
  for (const record of records) {
    if (!record.key.startsWith('import:')) continue;
    try {
      const parsed = JSON.parse(record.value) as Partial<ImportedFileMeta>;
      if (
        typeof parsed.kind === 'string' &&
        typeof parsed.fileName === 'string' &&
        typeof parsed.importedAt === 'number' &&
        typeof parsed.itemCount === 'number'
      ) {
        result.push({
          kind: parsed.kind,
          fileName: parsed.fileName,
          importedAt: parsed.importedAt,
          itemCount: parsed.itemCount,
        });
      }
    } catch {
      // Metadato corrupto: se ignora en lugar de romper la carga.
    }
  }
  return result;
}

/* --------------------- Datos validados para API Explorer ----------------- */

export async function saveResourceData(kind: ImportKind, json: string): Promise<void> {
  const db = await getDb();
  await db.put('meta', { key: `data:${kind}`, value: json });
}

export async function getResourceData(kind: ImportKind): Promise<string | undefined> {
  const db = await getDb();
  const record = await db.get('meta', `data:${kind}`);
  return record?.value;
}

export async function clearResourceData(kind: ImportKind): Promise<void> {
  const db = await getDb();
  await db.delete('meta', `data:${kind}`);
}

export async function clearAllUserData(): Promise<void> {
  const db = await getDb();
  await Promise.all([
    db.clear('notes'),
    db.clear('highlights'),
    db.clear('bookmarks'),
    db.clear('memorized'),
    db.clear('events'),
    db.clear('handles'),
    db.clear('meta'),
  ]);
}
