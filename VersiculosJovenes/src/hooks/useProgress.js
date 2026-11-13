import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'icaf_verses_progress_v2';

const initialState = {
  playerName: 'Joven ICAF',
  xp: 0,
  streak: 1,
  completedGames: {}, // { [verseId]: { cloze: true, speed: true, intruder: true, sniper: true, mastery: true } }
  exploredVerses: [], // [verseId]
  completedMissions: [], // [verseId] practical applications completed
  claimedChests: {}, // { '1-3': true, '1-5': true, '1-8': true }
  leaderUnlockAll: false, // Allows leaders to preview locked levels if desired
  lastRewardToast: null,
};

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...initialState, ...JSON.parse(raw), lastRewardToast: null } : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      const { lastRewardToast, ...persisted } = progress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // ignore storage errors
    }
  }, [progress]);

  const fireCelebration = useCallback((colorHex = '#f59e0b', particleCount = 75) => {
    try {
      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.65 },
        colors: [colorHex, '#ffffff', '#38bdf8', '#a78bfa'],
      });
    } catch {
      // fallback
    }
  }, []);

  const recordGameWin = useCallback(
    (verseId, gameType, xpReward = 150, colorHex = '#f59e0b') => {
      setProgress((prev) => {
        const currentVerseGames = prev.completedGames[verseId] || {};
        const wasAlreadyMastered = Object.values(currentVerseGames).some(Boolean);
        const isFirstTimeForGame = !currentVerseGames[gameType];
        const earnedXp = isFirstTimeForGame ? xpReward : Math.round(xpReward * 0.35);

        const nextGamesForVerse = {
          ...currentVerseGames,
          [gameType]: true,
        };
        const starsNow = Object.values(nextGamesForVerse).filter(Boolean).length;

        let toastMessage = `+${earnedXp} XP · ¡Reto superado!`;
        if (!wasAlreadyMastered) {
          toastMessage = `🔓 ¡Versículo Desbloqueado! +${earnedXp} XP (Avanzas hacia el siguiente nivel)`;
        } else if (isFirstTimeForGame && starsNow === 5) {
          toastMessage = `👑 ¡5/5 Estrellas! Maestro absoluto del versículo (+${earnedXp} XP)`;
        }

        return {
          ...prev,
          xp: prev.xp + earnedXp,
          streak: prev.streak + 1,
          completedGames: {
            ...prev.completedGames,
            [verseId]: nextGamesForVerse,
          },
          lastRewardToast: {
            id: Date.now(),
            text: toastMessage,
            xp: earnedXp,
          },
        };
      });
      fireCelebration(colorHex);
    },
    [fireCelebration]
  );

  const claimMilestoneChest = useCallback(
    (levelId, milestoneNumber, xpBonus, title, colorHex = '#f59e0b') => {
      const key = `${levelId}-${milestoneNumber}`;
      setProgress((prev) => {
        if (prev.claimedChests[key]) return prev;
        return {
          ...prev,
          xp: prev.xp + xpBonus,
          claimedChests: {
            ...prev.claimedChests,
            [key]: true,
          },
          lastRewardToast: {
            id: Date.now(),
            text: `🎁 ¡Micro-Recompensa "${title}" reclamada! +${xpBonus} XP`,
            xp: xpBonus,
          },
        };
      });
      fireCelebration(colorHex, 110);
    },
    [fireCelebration]
  );

  const markVerseExplored = useCallback((verseId) => {
    setProgress((prev) => {
      if (prev.exploredVerses.includes(verseId)) return prev;
      return {
        ...prev,
        xp: prev.xp + 25,
        exploredVerses: [...prev.exploredVerses, verseId],
        lastRewardToast: {
          id: Date.now(),
          text: '⚡ +25 XP por analizar palabra clave',
          xp: 25,
        },
      };
    });
  }, []);

  const toggleMissionDone = useCallback((verseId) => {
    setProgress((prev) => {
      const doneList = prev.completedMissions || [];
      if (doneList.includes(verseId)) return prev;
      return {
        ...prev,
        xp: prev.xp + 50,
        completedMissions: [...doneList, verseId],
        lastRewardToast: {
          id: Date.now(),
          text: '🎯 +50 XP por completar la Aplicación Práctica',
          xp: 50,
        },
      };
    });
  }, []);

  const toggleLeaderUnlockAll = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      leaderUnlockAll: !prev.leaderUnlockAll,
    }));
  }, []);

  const setPlayerName = useCallback((name) => {
    setProgress((prev) => ({
      ...prev,
      playerName: name,
    }));
  }, []);

  const awardBonusXp = useCallback((amount = 200, message = '⚔️ +200 XP por completar Duelo Versus') => {
    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      lastRewardToast: {
        id: Date.now(),
        text: message,
        xp: amount,
      },
    }));
  }, []);

  const clearToast = useCallback(() => {
    setProgress((prev) => ({ ...prev, lastRewardToast: null }));
  }, []);

  const getVerseStars = useCallback(
    (verseId) => {
      const games = progress.completedGames[verseId] || {};
      return Object.values(games).filter(Boolean).length;
    },
    [progress.completedGames]
  );

  const getLevelMasteryCount = useCallback(
    (levelId, versiculos) => {
      const levelVerses = versiculos.filter((v) => v.nivel === levelId);
      return levelVerses.filter((v) => getVerseStars(v.id) >= 1).length;
    },
    [getVerseStars]
  );

  // Nivel 1 siempre abierto. Nivel N se abre al completar los 8 versículos del Nivel N-1 (o si el modo líder está activo).
  const isLevelUnlocked = useCallback(
    (levelId, versiculos) => {
      if (levelId === 1 || progress.leaderUnlockAll) return true;
      const prevLevelMastered = getLevelMasteryCount(levelId - 1, versiculos);
      return prevLevelMastered >= 8;
    },
    [progress.leaderUnlockAll, getLevelMasteryCount]
  );

  const getTotalMasteredCount = useCallback(
    (versiculos) => versiculos.filter((v) => getVerseStars(v.id) >= 1).length,
    [getVerseStars]
  );

  return {
    progress,
    recordGameWin,
    claimMilestoneChest,
    markVerseExplored,
    toggleMissionDone,
    toggleLeaderUnlockAll,
    setPlayerName,
    awardBonusXp,
    clearToast,
    getVerseStars,
    getLevelMasteryCount,
    isLevelUnlocked,
    getTotalMasteredCount,
    fireCelebration,
  };
}
