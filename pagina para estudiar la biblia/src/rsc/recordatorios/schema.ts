import { z } from 'zod';

export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const reminderSchema = z
  .object({
    id: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/),
    titleEs: z.string().min(1).max(120),
    titleEn: z.string().min(1).max(120),
    messageEs: z.string().min(1).max(280),
    messageEn: z.string().min(1).max(280),
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    days: z.array(z.enum(WEEKDAYS)).min(1).max(7),
    enabled: z.boolean(),
  })
  .strict();

export const remindersFileSchema = z
  .object({
    version: z.string().min(1),
    reminders: z.array(reminderSchema).min(1).max(50),
  })
  .strict();

export type Reminder = z.infer<typeof reminderSchema>;
export type RemindersFile = z.infer<typeof remindersFileSchema>;
