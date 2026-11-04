import { readingPlansFileSchema, type PlanDay, type Reading, type ReadingPlan, type ReadingPlansFile } from './schema';
import rawData from './plan-lectura.mock.json';
import { appError, ok, type AppError, type Result } from '../../model/errors';

/**
 * Co-location: JSON + modelo de validación en la misma carpeta.
 * Se valida en runtime antes de exponer tipos estáticos.
 */
export function validateReadingPlans(input: unknown): Result<ReadingPlansFile, AppError> {
  const parsed = readingPlansFileSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path.join('.') ?? 'raíz';
    return {
      ok: false,
      error: appError('VALIDATION', `JSON de planes inválido en "${path}": ${firstIssue?.message ?? 'forma inesperada'}`),
    };
  }
  return ok(parsed.data);
}

const mockResult = validateReadingPlans(rawData);
if (!mockResult.ok) {
  throw new Error(mockResult.error.message);
}
export const READING_PLANS_MOCK: ReadingPlansFile = mockResult.value;

export function findPlan(planId: string): ReadingPlan | undefined {
  return READING_PLANS_MOCK.plans.find((plan) => plan.id === planId);
}

export { readingPlansFileSchema };
export type { Reading, PlanDay, ReadingPlan, ReadingPlansFile };
