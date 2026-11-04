import { z } from 'zod';
import { TRANSLATION_IDS } from '../../model/types';

/**
 * Esquema de validación en runtime para el JSON de versículos.
 * Los tipos estáticos se INFIEREN del esquema: una sola fuente de verdad.
 */
export const verseEntrySchema = z
  .object({
    bookNumber: z.number().int().min(1).max(66),
    chapter: z.number().int().min(1).max(150),
    verse: z.number().int().min(1).max(200),
    translations: z
      .partialRecord(z.enum(TRANSLATION_IDS), z.string().min(1).max(5000))
      .refine((value) => Object.keys(value).length > 0, {
        message: 'Cada versículo debe tener al menos una traducción.',
      }),
  })
  .strict();

export const versiculosFileSchema = z
  .object({
    version: z.string().min(1),
    generatedAt: z.iso.datetime(),
    description: z.string().min(1).max(500).optional(),
    verses: z.array(verseEntrySchema).min(1).max(40_000),
  })
  .strict();

export type VerseEntry = z.infer<typeof verseEntrySchema>;
export type VersiculosFile = z.infer<typeof versiculosFileSchema>;
