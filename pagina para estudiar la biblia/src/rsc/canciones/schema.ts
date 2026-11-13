import { z } from 'zod';
import { SONG_CATEGORIES } from '../../model/types';

export const songEntrySchema = z
  .object({
    id: z.string().min(1).max(120),
    title: z.string().min(1).max(200),
    artist: z.string().min(1).max(160),
    originalKey: z.string().min(1).max(12),
    capo: z.number().int().min(0).max(12).optional(),
    bpm: z.number().int().min(30).max(260).optional(),
    timeSignature: z.string().min(1).max(12).optional(),
    category: z.enum(SONG_CATEGORIES),
    content: z.string().min(1).max(25_000),
    bibleReference: z.string().min(1).max(120).optional(),
    notes: z.string().max(2000).optional(),
  })
  .strict();

export const songsFileSchema = z
  .object({
    version: z.string().min(1),
    generatedAt: z.string().min(1).optional(),
    description: z.string().max(500).optional(),
    songs: z.array(songEntrySchema).min(1).max(2000),
  })
  .strict();

export type SongEntry = z.infer<typeof songEntrySchema>;
export type SongsFile = z.infer<typeof songsFileSchema>;
