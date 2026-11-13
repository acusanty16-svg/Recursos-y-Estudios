import { lampClubFileSchema, type LampClubFile, type LampLevel, type LampVerseEntry } from './schema';
import rawData from './club-lampara.mock.json';
import { appError, ok, type AppError, type Result } from '../../model/errors';

export function validateLampClub(input: unknown): Result<LampClubFile, AppError> {
  const parsed = lampClubFileSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path.join('.') ?? 'raíz';
    return {
      ok: false,
      error: appError('VALIDATION', `JSON de Club de la Lámpara inválido en "${path}": ${firstIssue?.message ?? 'forma inesperada'}`),
    };
  }
  return ok(parsed.data);
}

const mockResult = validateLampClub(rawData);
if (!mockResult.ok) {
  throw new Error(mockResult.error.message);
}

export const LAMP_CLUB_FILE: LampClubFile = mockResult.value;
export const LAMP_CLUB_LEVELS: readonly LampLevel[] = LAMP_CLUB_FILE.levels;
export const TOTAL_LAMP_VERSES = LAMP_CLUB_LEVELS.reduce((sum, level) => sum + level.verses.length, 0);

export { lampClubFileSchema };
export type { LampClubFile, LampLevel, LampVerseEntry };
