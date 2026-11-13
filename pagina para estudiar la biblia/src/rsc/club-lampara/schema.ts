import { z } from 'zod';

export const lampVerseSchema = z
  .object({
    id: z.string().min(1).max(60),
    level: z.number().int().min(1).max(6),
    bookNumber: z.number().int().min(1).max(66),
    chapter: z.number().int().min(1).max(150),
    verseStart: z.number().int().min(1).max(200),
    verseEnd: z.number().int().min(1).max(200),
    referenceLabel: z.string().min(1).max(80),
  })
  .strict();

export const lampLevelSchema = z
  .object({
    level: z.number().int().min(1).max(6),
    titleEs: z.string().min(1).max(100),
    titleEn: z.string().min(1).max(100),
    subtitleEs: z.string().min(1).max(200),
    subtitleEn: z.string().min(1).max(200),
    verses: z.array(lampVerseSchema).min(1),
  })
  .strict();

export const lampClubFileSchema = z
  .object({
    version: z.string().min(1),
    name: z.string().min(1),
    levels: z.array(lampLevelSchema).min(1),
  })
  .strict();

export type LampVerseEntry = z.infer<typeof lampVerseSchema>;
export type LampLevel = z.infer<typeof lampLevelSchema>;
export type LampClubFile = z.infer<typeof lampClubFileSchema>;
