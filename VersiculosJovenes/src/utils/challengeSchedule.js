// Calendario oficial Desafío 119:9
// Semana 1: 16–22 nov (Salmo 51:10)
// Semana 2: 23–29 nov (1 Corintios 10:12)
// Semana 3: 30 nov – 6 dic (2 Timoteo 1:7)
// Semana 4: 7–13 dic (2 Timoteo 2:22)
// Semana 5 (Semana de Gracia): 14–18 dic ("¡Prepárate para el gran final!")
// Gran Final: 19 de diciembre ("¡Demuestra lo aprendido y recibe tu reconocimiento!")

export const CHALLENGE_META = {
  title: 'DESAFÍO 119:9',
  slogan: '¡Es hora de demostrar lo que has guardado en tu corazón!',
  baseReference: 'Salmos 119:9',
  graceWeekStart: '2026-12-14',
  graceWeekEnd: '2026-12-18',
  grandFinaleDate: '2026-12-19',
};

export function getLocalTodayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseIsoDayUtc(dayKey) {
  const [y, m, d] = dayKey.split('-').map(Number);
  return Date.UTC(y || 2026, (m || 1) - 1, d || 1);
}

export function daysBetweenKeys(fromKey, toKey) {
  return Math.round((parseIsoDayUtc(toKey) - parseIsoDayUtc(fromKey)) / 86_400_000);
}

export function isWeekDateUnlocked(nivel, todayKey) {
  if (!nivel?.unlockDate) return true;
  return todayKey >= nivel.unlockDate;
}

export function getChallengePhase(niveles = [], todayKey = getLocalTodayKey()) {
  const unlockedWeeks = niveles.filter((n) => isWeekDateUnlocked(n, todayKey));
  const isGrandFinaleUnlocked = todayKey >= CHALLENGE_META.grandFinaleDate;
  const isGraceWeekUnlocked = todayKey >= CHALLENGE_META.graceWeekStart;
  const daysToGrandFinale = Math.max(0, daysBetweenKeys(todayKey, CHALLENGE_META.grandFinaleDate));

  let activeWeekId = unlockedWeeks[unlockedWeeks.length - 1]?.id || 1;
  let phaseLabel = `Semana ${activeWeekId} en curso`;

  if (isGrandFinaleUnlocked) {
    phaseLabel = 'Gran Final · 19 de Diciembre';
  } else if (isGraceWeekUnlocked) {
    phaseLabel = 'Semana 5 · Semana de Gracia';
  }

  return {
    todayKey,
    unlockedCount: unlockedWeeks.length,
    activeWeekId,
    isGraceWeekUnlocked,
    isGrandFinaleUnlocked,
    daysToGrandFinale,
    phaseLabel,
  };
}

export function formatShortDateEs(dayKey) {
  if (!dayKey) return '';
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const parts = dayKey.split('-').map(Number);
  const day = parts[2] || 1;
  const monthName = months[Math.max(0, Math.min(11, (parts[1] || 1) - 1))];
  return `${day} ${monthName}`;
}
