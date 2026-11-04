import { z } from 'zod';

export const readingSchema = z
  .object({
    bookNumber: z.number().int().min(1).max(66),
    chapter: z.number().int().min(1).max(150),
  })
  .strict();

export const planDaySchema = z
  .object({
    day: z.number().int().min(1).max(365),
    labelEs: z.string().min(1).max(160),
    labelEn: z.string().min(1).max(160),
    readings: z.array(readingSchema).min(1).max(20),
  })
  .strict();

export const readingPlanSchema = z
  .object({
    id: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/),
    titleEs: z.string().min(1).max(120),
    titleEn: z.string().min(1).max(120),
    descriptionEs: z.string().min(1).max(400),
    descriptionEn: z.string().min(1).max(400),
    days: z.array(planDaySchema).min(1).max(365),
  })
  .strict();

export const readingPlansFileSchema = z
  .object({
    version: z.string().min(1),
    plans: z.array(readingPlanSchema).min(1).max(50),
  })
  .strict();

export type Reading = z.infer<typeof readingSchema>;
export type PlanDay = z.infer<typeof planDaySchema>;
export type ReadingPlan = z.infer<typeof readingPlanSchema>;
export type ReadingPlansFile = z.infer<typeof readingPlansFileSchema>;
