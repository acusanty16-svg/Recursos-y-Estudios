import { BUILTIN_SONGS } from '../rsc/canciones';
import type { Song, SongCategory } from '../model/types';
import { translate } from '../i18n';
import { deleteSongRecord, putSong } from './idb';
import { appStore, showToast } from './store';
import { loadTombstones, notifyLocalChange, recordDeletion } from './sync-events';

function newSongId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `song-${crypto.randomUUID()}`;
  }
  return `song-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Combina el repertorio base precargado (`BUILTIN_SONGS`) con las canciones
 * añadidas o editadas por el usuario en IndexedDB/Google Drive, respetando borrados.
 */
export function getEffectiveSongs(userSongs: readonly Song[]): readonly Song[] {
  const tombstones = loadTombstones().songs;
  const byId = new Map<string, Song>();

  for (const builtIn of BUILTIN_SONGS) {
    if (!tombstones[builtIn.id]) {
      byId.set(builtIn.id, builtIn);
    }
  }
  for (const custom of userSongs) {
    byId.set(custom.id, custom);
  }

  return [...byId.values()].sort((a, b) => a.title.localeCompare(b.title, 'es'));
}

export interface SaveSongInput {
  readonly id?: string | undefined;
  readonly title: string;
  readonly artist: string;
  readonly originalKey: string;
  readonly capo?: number | undefined;
  readonly bpm?: number | undefined;
  readonly timeSignature?: string | undefined;
  readonly category: SongCategory;
  readonly content: string;
  readonly bibleReference?: string | undefined;
  readonly notes?: string | undefined;
}

export async function saveSong(input: SaveSongInput): Promise<Song> {
  const now = Date.now();
  const { songs, preferences } = appStore.getState();
  const existing = input.id ? songs.find((item) => item.id === input.id) : undefined;
  const id = input.id ?? newSongId();

  const song: Song = {
    id,
    title: input.title.trim(),
    artist: input.artist.trim() || 'Anónimo',
    originalKey: input.originalKey.trim() || 'C',
    category: input.category,
    content: input.content.trim(),
    isBuiltIn: false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...(input.capo !== undefined && input.capo > 0 ? { capo: input.capo } : {}),
    ...(input.bpm !== undefined && input.bpm > 0 ? { bpm: input.bpm } : {}),
    ...(input.timeSignature?.trim() ? { timeSignature: input.timeSignature.trim() } : {}),
    ...(input.bibleReference?.trim() ? { bibleReference: input.bibleReference.trim() } : {}),
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
  };

  try {
    await putSong(song);
  } catch {
    // El estado en memoria sigue disponible aunque IndexedDB falle.
  }

  appStore.setState((state) => ({
    ...state,
    songs: [...state.songs.filter((item) => item.id !== song.id), song],
  }));

  showToast(translate(preferences.uiLanguage, 'music.songSaved'), 'success');
  notifyLocalChange();
  return song;
}

export async function deleteSong(id: string): Promise<void> {
  const { preferences } = appStore.getState();
  try {
    await deleteSongRecord(id);
  } catch {
    // Ignorado.
  }

  appStore.setState((state) => ({
    ...state,
    songs: state.songs.filter((item) => item.id !== id),
  }));

  recordDeletion('songs', id);
  showToast(translate(preferences.uiLanguage, 'music.songDeleted'), 'info');
}

export async function importSongsBatch(entries: readonly SaveSongInput[]): Promise<number> {
  const now = Date.now();
  const imported: Song[] = entries.map((entry, idx) => ({
    id: entry.id ?? `imported-${now}-${idx}`,
    title: entry.title.trim(),
    artist: entry.artist.trim() || 'Anónimo',
    originalKey: entry.originalKey.trim() || 'C',
    category: entry.category,
    content: entry.content.trim(),
    isBuiltIn: false,
    createdAt: now,
    updatedAt: now,
    ...(entry.capo !== undefined && entry.capo > 0 ? { capo: entry.capo } : {}),
    ...(entry.bpm !== undefined && entry.bpm > 0 ? { bpm: entry.bpm } : {}),
    ...(entry.timeSignature?.trim() ? { timeSignature: entry.timeSignature.trim() } : {}),
    ...(entry.bibleReference?.trim() ? { bibleReference: entry.bibleReference.trim() } : {}),
    ...(entry.notes?.trim() ? { notes: entry.notes.trim() } : {}),
  }));

  for (const song of imported) {
    try {
      await putSong(song);
    } catch {
      // Continuar con el resto.
    }
  }

  appStore.setState((state) => {
    const map = new Map(state.songs.map((item) => [item.id, item]));
    for (const song of imported) map.set(song.id, song);
    return { ...state, songs: [...map.values()] };
  });

  notifyLocalChange();
  return imported.length;
}
