import { describe, expect, it } from 'vitest';
import { computeCurrentStreak, computeLongestStreak, buildStreakState, hasGraceAvailable } from './streak';
import type { ReadingEvent } from '../model/types';

function event(day: string, chapter = 1): ReadingEvent {
  return {
    id: `${day}:43:${chapter}:RV1960`,
    day,
    bookNumber: 43,
    chapter,
    translationId: 'RV1960',
    timestamp: 0,
  };
}

describe('computeCurrentStreak', () => {
  it('devuelve 0 sin lecturas', () => {
    expect(computeCurrentStreak([], '2026-11-03')).toBe(0);
  });

  it('cuenta días consecutivos terminando hoy', () => {
    const days = ['2026-11-01', '2026-11-02', '2026-11-03'];
    expect(computeCurrentStreak(days, '2026-11-03')).toBe(3);
  });

  it('no rompe la racha si hoy aún no se ha leído', () => {
    const days = ['2026-10-31', '2026-11-01', '2026-11-02'];
    expect(computeCurrentStreak(days, '2026-11-03')).toBe(3);
  });

  it('usa el día de gracia semanal para un hueco de un día', () => {
    // 2026-11-02 es lunes; el hueco del domingo 2026-11-01 cae en la semana anterior.
    const days = ['2026-10-31', '2026-11-02', '2026-11-03'];
    expect(computeCurrentStreak(days, '2026-11-03')).toBe(3);
  });

  it('rompe la racha con dos huecos en la misma semana', () => {
    // Viernes 2026-11-06 con huecos el 4 y el 5: solo hay un día de gracia.
    const days = ['2026-11-02', '2026-11-06'];
    expect(computeCurrentStreak(days, '2026-11-06')).toBe(1);
  });
});

describe('computeLongestStreak', () => {
  it('encuentra la secuencia más larga', () => {
    const days = ['2026-01-01', '2026-01-02', '2026-01-03', '2026-02-01', '2026-02-02'];
    expect(computeLongestStreak(days)).toBe(3);
  });

  it('ignora duplicados', () => {
    expect(computeLongestStreak(['2026-01-01', '2026-01-01', '2026-01-02'])).toBe(2);
  });
});

describe('buildStreakState', () => {
  it('calcula totales y último día', () => {
    const state = buildStreakState([event('2026-11-02'), event('2026-11-03')], '2026-11-03');
    expect(state.current).toBe(2);
    expect(state.totalDays).toBe(2);
    expect(state.lastReadDay).toBe('2026-11-03');
    expect(state.weekKey).toBe('2026-11-02');
  });

  it('expone el día de gracia disponible', () => {
    const state = buildStreakState([], '2026-11-03');
    expect(hasGraceAvailable(state)).toBe(true);
  });
});
