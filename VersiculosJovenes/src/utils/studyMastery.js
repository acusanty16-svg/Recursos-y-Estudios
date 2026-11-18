// Niveles de estudio/dominio por versículo determinados por la XP acumulada en ese pasaje
export const STUDY_LEVELS = [
  {
    id: 'unstarted',
    minXp: 0,
    label: 'Sin empezar',
    shortLabel: 'Nuevo',
    badgeClass: 'bg-zinc-900 text-zinc-400 border-white/10',
    barClass: 'bg-zinc-700',
    percentBase: 0,
  },
  {
    id: 'explored',
    minXp: 1,
    label: 'Explorado',
    shortLabel: 'Explorado',
    badgeClass: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
    barClass: 'bg-cyan-400/70',
    percentBase: 25,
  },
  {
    id: 'practicing',
    minXp: 150,
    label: 'En Proceso',
    shortLabel: 'Practicando',
    badgeClass: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/50',
    barClass: 'bg-cyan-400',
    percentBase: 55,
  },
  {
    id: 'guarded',
    minXp: 350,
    label: 'Guardado',
    shortLabel: 'Guardado',
    badgeClass: 'bg-coral-400/15 text-coral-300 border-coral-400/45',
    barClass: 'bg-gradient-to-r from-cyan-400 to-coral-400',
    percentBase: 80,
  },
  {
    id: 'master',
    minXp: 650,
    label: 'Maestro 119:9',
    shortLabel: 'Maestro',
    badgeClass: 'bg-gradient-to-r from-cyan-400/25 to-coral-400/25 text-white border-cyan-300/60',
    barClass: 'bg-gradient-to-r from-cyan-400 via-white to-coral-400',
    percentBase: 100,
  },
];

export const MAX_STUDY_XP_TARGET = 650;

export function getVerseStudyStatus(verseXp = 0) {
  let current = STUDY_LEVELS[0];
  let next = STUDY_LEVELS[1];

  for (let i = 0; i < STUDY_LEVELS.length; i += 1) {
    if (verseXp >= STUDY_LEVELS[i].minXp) {
      current = STUDY_LEVELS[i];
      next = STUDY_LEVELS[i + 1] || null;
    }
  }

  const progressPercent = Math.min(100, Math.round((verseXp / MAX_STUDY_XP_TARGET) * 100));
  const xpToNext = next ? Math.max(0, next.minXp - verseXp) : 0;

  return {
    xp: verseXp,
    current,
    next,
    progressPercent,
    xpToNext,
  };
}
