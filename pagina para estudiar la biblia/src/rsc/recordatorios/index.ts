import { remindersFileSchema, type Reminder, type RemindersFile } from './schema';
import rawData from './recordatorios.mock.json';
import { appError, ok, type AppError, type Result } from '../../model/errors';

export function validateReminders(input: unknown): Result<RemindersFile, AppError> {
  const parsed = remindersFileSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path.join('.') ?? 'raíz';
    return {
      ok: false,
      error: appError('VALIDATION', `JSON de recordatorios inválido en "${path}": ${firstIssue?.message ?? 'forma inesperada'}`),
    };
  }
  return ok(parsed.data);
}

const mockResult = validateReminders(rawData);
if (!mockResult.ok) {
  throw new Error(mockResult.error.message);
}
export const REMINDERS_MOCK: RemindersFile = mockResult.value;

export function findReminder(id: string): Reminder | undefined {
  return REMINDERS_MOCK.reminders.find((reminder) => reminder.id === id);
}

export { remindersFileSchema };
export type { Reminder, RemindersFile, Weekday } from './schema';
export { WEEKDAYS } from './schema';
