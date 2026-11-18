// Aplicaciones prácticas juveniles para los 4 versículos oficiales del Desafío 119:9
export const YOUTH_APPLICATIONS = {
  1: 'Hoy haz un alto de 2 minutos antes de dormir, sé honesto con Dios sobre lo que quieres limpiar de tu mente o redes, y ora con tus propias palabras pidiéndole un corazón limpio.',
  2: 'No subestimes una tentación pequeña ni creas que "a mí no me va a pasar". Identifica hoy una situación o hábito donde podrías tropezar y pon un límite claro a tiempo.',
  3: 'Cuando sientas miedo a quedar mal en clase, en el grupo o frente a amigos por defender tu fe, recuerda que el Espíritu de Dios te da poder, amor y dominio propio.',
  4: 'Escapa activamente de lo que apaga tu vida espiritual y busca esta semana rodearte de amigos que invocan al Señor de corazón limpio para animarse mutuamente.',
};

export const getYouthApplication = (verse) => {
  return YOUTH_APPLICATIONS[verse.id] || verse.misionInfantil || '';
};

// Sistema de Rangos del Desafío 119:9
export const PLAYER_RANKS = [
  { minXp: 0, title: 'Retador 119:9', badge: '⚡', color: 'text-cyan-300' },
  { minXp: 350, title: 'Corazón Limpio', badge: '💙', color: 'text-cyan-400' },
  { minXp: 900, title: 'Guardia Firme', badge: '🛡️', color: 'text-coral-400' },
  { minXp: 1800, title: 'Espíritu Valiente', badge: '🔥', color: 'text-coral-300' },
  { minXp: 2800, title: 'Campeón 119:9', badge: '🏆', color: 'text-white' },
];

export function getPlayerRank(xp = 0) {
  let current = PLAYER_RANKS[0];
  let next = PLAYER_RANKS[1] || null;

  for (let i = 0; i < PLAYER_RANKS.length; i++) {
    if (xp >= PLAYER_RANKS[i].minXp) {
      current = PLAYER_RANKS[i];
      next = PLAYER_RANKS[i + 1] || null;
    }
  }

  const progressToNext = next
    ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
    : 100;

  return { current, next, progressToNext };
}
