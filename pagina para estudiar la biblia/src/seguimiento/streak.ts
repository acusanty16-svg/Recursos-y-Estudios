import { daysBetween, toDayKey, toWeekKey } from '../model/reference';
import type { ReadingEvent, StreakState } from '../model/types';

/**
 * Gamificación ética:
 * - La racha premia constancia, no castiga el descanso.
 * - Un "día de gracia" por semana ISO permite fallar un día sin perder todo.
 * - El día de hoy sin lectura NO rompe la racha (el día aún no termina).
 */
export const GRACE_DAYS_PER_WEEK = 1;

export function uniqueReadingDays(events: readonly ReadingEvent[]): readonly string[] {
  return [...new Set(events.map((event) => event.day))].sort();
}

interface StreakAnalysis {
  readonly current: number;
  readonly graceUsedThisWeek: number;
}

/**
 * Recorre hacia atrás desde hoy.
 * El día de gracia solo se consume si existe una lectura anterior que preserve
 * la racha; así no se "gasta" gracia cuando el usuario nunca ha leído.
 */
function analyzeStreak(days: readonly string[], today: string): StreakAnalysis {
  const daySet = new Set(days);
  if (daySet.size === 0) return { current: 0, graceUsedThisWeek: 0 };

  const sorted = [...daySet].sort();
  const graceWeeks = new Set<string>();
  let streak = 0;
  let cursor = today;

  // Tope defensivo: 10 años. Evita bucles infinitos con datos corruptos.
  for (let guard = 0; guard < 3660; guard += 1) {
    if (daySet.has(cursor)) {
      streak += 1;
    } else if (cursor === today) {
      // Hoy todavía puede leerse: no rompe ni suma.
    } else {
      const weekKey = toWeekKey(parseDay(cursor));
      const hasEarlierReading = sorted.some((day) => day < cursor);
      if (hasEarlierReading && !graceWeeks.has(weekKey)) {
        graceWeeks.add(weekKey);
      } else {
        break;
      }
    }

    cursor = shiftDay(cursor, -1);
  }

  const todayWeek = toWeekKey(parseDay(today));
  return {
    current: streak,
    graceUsedThisWeek: graceWeeks.has(todayWeek) ? 1 : 0,
  };
}

/** Racha actual con día de gracia semanal. */
export function computeCurrentStreak(days: readonly string[], today: string = toDayKey()): number {
  return analyzeStreak(days, today).current;
}

/** Mejor racha histórica: días estrictamente consecutivos. */
export function computeLongestStreak(days: readonly string[]): number {
  const sorted = [...new Set(days)].sort();
  let longest = 0;
  let run = 0;
  let previous: string | null = null;

  for (const day of sorted) {
    if (previous !== null && daysBetween(previous, day) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    previous = day;
  }

  return longest;
}

export function buildStreakState(events: readonly ReadingEvent[], today: string = toDayKey()): StreakState {
  const days = uniqueReadingDays(events);
  const lastReadDay = days.length > 0 ? (days[days.length - 1] ?? null) : null;
  const analysis = analyzeStreak(days, today);

  return {
    current: analysis.current,
    longest: computeLongestStreak(days),
    graceUsedThisWeek: analysis.graceUsedThisWeek,
    weekKey: toWeekKey(parseDay(today)),
    lastReadDay,
    totalDays: days.length,
  };
}

/** Día de gracia disponible esta semana. */
export function hasGraceAvailable(state: StreakState): boolean {
  return state.graceUsedThisWeek < GRACE_DAYS_PER_WEEK;
}

function parseDay(day: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) return new Date();
  const [, year, month, date] = match;
  return new Date(Number(year), Number(month) - 1, Number(date));
}

function shiftDay(day: string, delta: number): string {
  const date = parseDay(day);
  date.setDate(date.getDate() + delta);
  return toDayKey(date);
}
