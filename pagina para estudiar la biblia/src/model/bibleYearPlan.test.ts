import { describe, expect, it } from 'vitest';
import {
  BIBLE_YEAR_PLAN,
  YEAR_PLAN_DAYS_COUNT,
  formatYearPlanDaySummary,
  getSuggestedPlanDay,
} from './bibleYearPlan';

describe('Plan Mixto Biblia en un año (365 días)', () => {
  it('contiene exactamente 365 días y cubre los 1.189 capítulos únicos de la Biblia', () => {
    expect(BIBLE_YEAR_PLAN).toHaveLength(YEAR_PLAN_DAYS_COUNT);

    const seen = new Set<string>();
    let totalChapters = 0;

    for (const day of BIBLE_YEAR_PLAN) {
      expect(day.readings.length).toBeGreaterThanOrEqual(2);
      for (const r of day.readings) {
        const key = `${r.bookNumber}:${r.chapter}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
        totalChapters += 1;
      }
    }

    expect(totalChapters).toBe(1189);
    expect(seen.size).toBe(1189);
  });

  it('el Día 1 empieza en Génesis, Salmos y Mateo, y agrupa rangos correctamente', () => {
    const day1 = BIBLE_YEAR_PLAN[0]!;
    const summary = formatYearPlanDaySummary(day1, 'es');
    expect(summary).toContain('Génesis 1');
    expect(summary).toContain('Salmos 1');
    expect(summary).toContain('Mateo 1');
  });

  it('calcula correctamente el día sugerido a partir de la fecha de inicio', () => {
    expect(getSuggestedPlanDay('2026-11-18', '2026-11-18')).toBe(1);
    expect(getSuggestedPlanDay('2026-11-18', '2026-11-27')).toBe(10);
    expect(getSuggestedPlanDay('2026-01-01', '2026-12-31')).toBe(365);
  });
});
