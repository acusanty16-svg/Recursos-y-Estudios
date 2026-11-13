/**
 * Barrel de recursos. Permite importar `@rsc` sin exponer rutas con espacios.
 * Cada recurso mantiene su JSON + esquema Zod co-localizados.
 */
export {
  VERSICULOS_MOCK,
  validateVersiculos,
  findMockVerse,
  getVerseText,
  type VerseEntry,
  type VersiculosFile,
} from './versiculos';

export {
  READING_PLANS_MOCK,
  validateReadingPlans,
  findPlan,
  type Reading,
  type PlanDay,
  type ReadingPlan,
  type ReadingPlansFile,
} from './plan de lectura';

export {
  REMINDERS_MOCK,
  validateReminders,
  findReminder,
  WEEKDAYS,
  type Reminder,
  type RemindersFile,
  type Weekday,
} from './recordatorios';

export {
  SONGS_FILE_MOCK,
  BUILTIN_SONGS,
  validateSongsFile,
  type SongEntry,
  type SongsFile,
} from './canciones';

export {
  LAMP_CLUB_FILE,
  LAMP_CLUB_LEVELS,
  validateLampClub,
  type LampClubFile,
  type LampLevel,
  type LampVerseEntry,
} from './club-lampara';

export type ImportKind = 'versiculos' | 'plan-lectura' | 'recordatorios' | 'canciones';
