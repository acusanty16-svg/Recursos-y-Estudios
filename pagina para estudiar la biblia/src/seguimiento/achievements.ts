import type { ReadingStats } from './stats';

export interface Achievement {
  readonly id: string;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly descriptionEs: string;
  readonly descriptionEn: string;
  readonly icon: string;
  readonly unlocked: boolean;
  readonly progress: number;
  readonly target: number;
}

type Rule = {
  readonly id: string;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly descriptionEs: string;
  readonly descriptionEn: string;
  readonly icon: string;
  readonly target: number;
  readonly value: (stats: ReadingStats) => number;
};

const RULES: readonly Rule[] = [
  {
    id: 'primer-paso',
    titleEs: 'Primer paso',
    titleEn: 'First step',
    descriptionEs: 'Registra tu primer día de lectura.',
    descriptionEn: 'Log your first reading day.',
    icon: '🌱',
    target: 1,
    value: (stats) => stats.totalDays,
  },
  {
    id: 'constante-7',
    titleEs: 'Constante',
    titleEn: 'Consistent',
    descriptionEs: 'Sostén una racha de 7 días.',
    descriptionEn: 'Keep a 7-day streak.',
    icon: '🔥',
    target: 7,
    value: (stats) => stats.longestStreak,
  },
  {
    id: 'constante-30',
    titleEs: 'Disciplina',
    titleEn: 'Discipline',
    descriptionEs: 'Sostén una racha de 30 días.',
    descriptionEn: 'Keep a 30-day streak.',
    icon: '🏅',
    target: 30,
    value: (stats) => stats.longestStreak,
  },
  {
    id: 'explorador',
    titleEs: 'Explorador',
    titleEn: 'Explorer',
    descriptionEs: 'Lee en 10 libros distintos.',
    descriptionEn: 'Read across 10 different books.',
    icon: '🧭',
    target: 10,
    value: (stats) => stats.booksTouched,
  },
  {
    id: 'escriba',
    titleEs: 'Escriba',
    titleEn: 'Scribe',
    descriptionEs: 'Escribe 10 notas personales.',
    descriptionEn: 'Write 10 personal notes.',
    icon: '✍️',
    target: 10,
    value: (stats) => stats.notesCount,
  },
  {
    id: 'maraton',
    titleEs: 'Maratón',
    titleEn: 'Marathon',
    descriptionEs: 'Completa 100 capítulos únicos.',
    descriptionEn: 'Complete 100 unique chapters.',
    icon: '📚',
    target: 100,
    value: (stats) => stats.uniqueChapters,
  },
];

export function computeAchievements(stats: ReadingStats): readonly Achievement[] {
  return RULES.map((rule) => {
    const raw = rule.value(stats);
    const progress = Math.min(raw, rule.target);
    return {
      id: rule.id,
      titleEs: rule.titleEs,
      titleEn: rule.titleEn,
      descriptionEs: rule.descriptionEs,
      descriptionEn: rule.descriptionEn,
      icon: rule.icon,
      unlocked: raw >= rule.target,
      progress,
      target: rule.target,
    };
  });
}
