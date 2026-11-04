import { versiculosFileSchema, type VerseEntry, type VersiculosFile } from './schema';
import rawData from './versiculos.mock.json';
import type { AppError } from '../../model/errors';
import { appError, ok, type Result } from '../../model/errors';
import type { TranslationId } from '../../model/types';

/**
 * Co-location: el JSON y su modelo viven juntos.
 * `validateVersiculos` es la única puerta de entrada: nunca se confía en el JSON crudo.
 */
export function validateVersiculos(input: unknown): Result<VersiculosFile, AppError> {
  const parsed = versiculosFileSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path.join('.') ?? 'raíz';
    return {
      ok: false,
      error: appError('VALIDATION', `JSON de versículos inválido en "${path}": ${firstIssue?.message ?? 'forma inesperada'}`),
    };
  }
  return ok(parsed.data);
}

/** Datos mock validados al cargar el módulo (falla rápido en desarrollo). */
const mockResult = validateVersiculos(rawData);
if (!mockResult.ok) {
  throw new Error(mockResult.error.message);
}
export const VERSICULOS_MOCK: VersiculosFile = mockResult.value;

export function findMockVerse(
  bookNumber: number,
  chapter: number,
  verse: number,
): VerseEntry | undefined {
  return VERSICULOS_MOCK.verses.find(
    (entry) => entry.bookNumber === bookNumber && entry.chapter === chapter && entry.verse === verse,
  );
}

export function getVerseText(entry: VerseEntry, translationId: TranslationId): string | undefined {
  return entry.translations[translationId];
}

export { versiculosFileSchema };
export type { VerseEntry, VersiculosFile };
