import { songsFileSchema, type SongEntry, type SongsFile } from './schema';
import rawData from './canciones.mock.json';
import type { AppError } from '../../model/errors';
import { appError, ok, type Result } from '../../model/errors';
import type { Song } from '../../model/types';

export function validateSongsFile(input: unknown): Result<SongsFile, AppError> {
  const parsed = songsFileSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path.join('.') ?? 'raíz';
    return {
      ok: false,
      error: appError('VALIDATION', `JSON de canciones inválido en "${path}": ${firstIssue?.message ?? 'forma inesperada'}`),
    };
  }
  return ok(parsed.data);
}

const mockResult = validateSongsFile(rawData);
if (!mockResult.ok) {
  throw new Error(mockResult.error.message);
}

export const SONGS_FILE_MOCK: SongsFile = mockResult.value;

export const BUILTIN_SONGS: readonly Song[] = SONGS_FILE_MOCK.songs.map((entry) => ({
  id: entry.id,
  title: entry.title,
  artist: entry.artist,
  originalKey: entry.originalKey,
  category: entry.category,
  content: entry.content,
  isBuiltIn: true,
  createdAt: 0,
  updatedAt: 0,
  ...(entry.capo !== undefined ? { capo: entry.capo } : {}),
  ...(entry.bpm !== undefined ? { bpm: entry.bpm } : {}),
  ...(entry.timeSignature !== undefined ? { timeSignature: entry.timeSignature } : {}),
  ...(entry.bibleReference !== undefined ? { bibleReference: entry.bibleReference } : {}),
  ...(entry.notes !== undefined ? { notes: entry.notes } : {}),
}));

export { songsFileSchema };
export type { SongEntry, SongsFile };
