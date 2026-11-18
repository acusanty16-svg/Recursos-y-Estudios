import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { getLocalTodayKey, isWeekDateUnlocked } from '../utils/challengeSchedule';
import { isSupabaseConfigured, upsertPlayerScore } from '../lib/supabasePlayers';

const STORAGE_KEY = 'desafio_119_9_progress_v1';

function generatePlayerId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `pl_${crypto.randomUUID()}`;
  }
  return `pl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createInitialState() {
  return {
    playerId: generatePlayerId(),
    playerName: '',
    profileConfirmed: false,
    xp: 0,
    verseXp: {}, // { [verseId]: number } -> mide cuánto ha estudiado cada versículo
    streak: 1,
    completedGames: {}, // { [verseId]: { cloze: true, ... } }
    exploredVerses: [],
    completedMissions: [],
    finaleCompleted: false,
    finaleBestScore: 0,
    leaderUnlockAll: false,
    previewDate: null,
    lastRewardToast: null,
  };
}

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    const base = createInitialState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      return {
        ...base,
        ...parsed,
        playerId: parsed.playerId || base.playerId,
        verseXp: parsed.verseXp || {},
        profileConfirmed: Boolean(parsed.profileConfirmed || (parsed.playerName && parsed.playerName !== 'Joven Desafío 119:9')),
        lastRewardToast: null,
      };
    } catch {
      return base;
    }
  });

  const [syncStatus, setSyncStatus] = useState(() =>
    isSupabaseConfigured() ? 'ready' : 'local_only'
  );
  const syncTimerRef = useRef(null);

  useEffect(() => {
    try {
      const { lastRewardToast, ...persisted } = progress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // ignore storage errors
    }
  }, [progress]);

  // Sincronización automática debounced hacia Supabase cuando el jugador confirma su perfil o gana XP
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSyncStatus('local_only');
      return;
    }
    if (!progress.profileConfirmed || !progress.playerName.trim()) {
      return;
    }

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      setSyncStatus('syncing');
      const masteredCount = Object.values(progress.completedGames || {}).filter((g) =>
        Object.values(g || {}).some(Boolean)
      ).length;

      const res = await upsertPlayerScore({
        id: progress.playerId,
        name: progress.playerName.trim(),
        xp: progress.xp,
        verseXp: progress.verseXp || {},
        masteredCount,
        finaleBestScore: progress.finaleBestScore || 0,
      });

      setSyncStatus(res.ok ? 'synced' : 'error');
    }, 350);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [
    progress.playerId,
    progress.playerName,
    progress.profileConfirmed,
    progress.xp,
    progress.verseXp,
    progress.completedGames,
    progress.finaleBestScore,
  ]);

  const effectiveTodayKey =
    progress.leaderUnlockAll && progress.previewDate
      ? progress.previewDate
      : getLocalTodayKey();

  const fireCelebration = useCallback((colorHex = '#22d3ee', particleCount = 75) => {
    try {
      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.65 },
        colors: [colorHex, '#22d3ee', '#ff5d6c', '#ffffff'],
      });
    } catch {
      // fallback
    }
  }, []);

  const recordGameWin = useCallback(
    (verseId, gameType, xpReward = 150, colorHex = '#22d3ee') => {
      setProgress((prev) => {
        const currentVerseGames = prev.completedGames[verseId] || {};
        const wasAlreadyMastered = Object.values(currentVerseGames).some(Boolean);
        const isFirstTimeForGame = !currentVerseGames[gameType];
        const earnedXp = isFirstTimeForGame ? xpReward : Math.round(xpReward * 0.45);

        const nextGamesForVerse = {
          ...currentVerseGames,
          [gameType]: true,
        };
        const starsNow = Object.values(nextGamesForVerse).filter(Boolean).length;
        const prevVerseXp = prev.verseXp?.[verseId] || 0;
        const nextVerseXp = prevVerseXp + earnedXp;

        let toastMessage = `+${earnedXp} XP · ¡Repaso sumado al versículo!`;
        if (!wasAlreadyMastered) {
          toastMessage = `🔓 ¡Versículo Guardado! +${earnedXp} XP (${nextVerseXp} XP en este pasaje)`;
        } else if (isFirstTimeForGame && starsNow === 5) {
          toastMessage = `👑 ¡5/5 Estrellas en la semana! +${earnedXp} XP`;
        }

        return {
          ...prev,
          xp: prev.xp + earnedXp,
          verseXp: {
            ...(prev.verseXp || {}),
            [verseId]: nextVerseXp,
          },
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

  const recordFinaleResult = useCallback(
    (score, isFinaleMode) => {
      setProgress((prev) => {
        const passed = score >= 70;
        const xpEarned = isFinaleMode ? (passed ? 500 : 160) : 240;
        const perVerseBonus = Math.round(xpEarned / 4);
        const updatedVerseXp = { ...(prev.verseXp || {}) };
        for (const vid of [1, 2, 3, 4]) {
          updatedVerseXp[vid] = (updatedVerseXp[vid] || 0) + perVerseBonus;
        }

        return {
          ...prev,
          xp: prev.xp + xpEarned,
          verseXp: updatedVerseXp,
          finaleCompleted: prev.finaleCompleted || (isFinaleMode && passed),
          finaleBestScore: isFinaleMode
            ? Math.max(prev.finaleBestScore || 0, score)
            : prev.finaleBestScore,
          lastRewardToast: {
            id: Date.now(),
            text: isFinaleMode
              ? passed
                ? `🏆 ¡Gran Final superada con ${score}%! +${xpEarned} XP`
                : `💪 Gran Final completada (${score}%). +${xpEarned} XP`
              : `⚡ ¡Repaso de Semana de Gracia completado (${score}%)! +${xpEarned} XP`,
            xp: xpEarned,
          },
        };
      });
      fireCelebration(score >= 70 ? '#ff5d6c' : '#22d3ee', 120);
    },
    [fireCelebration]
  );

  const markVerseExplored = useCallback((verseId) => {
    setProgress((prev) => {
      if (prev.exploredVerses.includes(verseId)) return prev;
      const bonus = 25;
      return {
        ...prev,
        xp: prev.xp + bonus,
        verseXp: {
          ...(prev.verseXp || {}),
          [verseId]: (prev.verseXp?.[verseId] || 0) + bonus,
        },
        exploredVerses: [...prev.exploredVerses, verseId],
        lastRewardToast: {
          id: Date.now(),
          text: '⚡ +25 XP por estudiar palabra clave del versículo',
          xp: bonus,
        },
      };
    });
  }, []);

  const toggleMissionDone = useCallback((verseId) => {
    setProgress((prev) => {
      const doneList = prev.completedMissions || [];
      if (doneList.includes(verseId)) return prev;
      const bonus = 50;
      return {
        ...prev,
        xp: prev.xp + bonus,
        verseXp: {
          ...(prev.verseXp || {}),
          [verseId]: (prev.verseXp?.[verseId] || 0) + bonus,
        },
        completedMissions: [...doneList, verseId],
        lastRewardToast: {
          id: Date.now(),
          text: '🎯 +50 XP por completar la Aplicación Práctica',
          xp: bonus,
        },
      };
    });
  }, []);

  const confirmPlayerProfile = useCallback((name) => {
    const clean = name.trim();
    if (!clean) return;
    setProgress((prev) => ({
      ...prev,
      playerName: clean,
      profileConfirmed: true,
    }));
  }, []);

  const switchNewPlayer = useCallback((name) => {
    const clean = name.trim();
    if (!clean) return;
    setProgress({
      ...createInitialState(),
      playerId: generatePlayerId(),
      playerName: clean,
      profileConfirmed: true,
    });
  }, []);

  const toggleLeaderUnlockAll = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      leaderUnlockAll: !prev.leaderUnlockAll,
      previewDate: !prev.leaderUnlockAll ? prev.previewDate : null,
    }));
  }, []);

  const setPreviewDate = useCallback((dayKey) => {
    setProgress((prev) => ({
      ...prev,
      leaderUnlockAll: true,
      previewDate: dayKey,
    }));
  }, []);

  const setPlayerName = useCallback((name) => {
    setProgress((prev) => ({
      ...prev,
      playerName: name,
      profileConfirmed: Boolean(name.trim()),
    }));
  }, []);

  const awardBonusXp = useCallback(
    (amount = 200, message = '⚔️ +200 XP por completar Duelo 1v1', verseId = null) => {
      setProgress((prev) => {
        const nextVerseXp = { ...(prev.verseXp || {}) };
        if (verseId) {
          nextVerseXp[verseId] = (nextVerseXp[verseId] || 0) + amount;
        } else {
          // Reparte el bono proporcionalmente entre las semanas abiertas o Semana 1
          nextVerseXp[1] = (nextVerseXp[1] || 0) + Math.round(amount / 2);
        }
        return {
          ...prev,
          xp: prev.xp + amount,
          verseXp: nextVerseXp,
          lastRewardToast: {
            id: Date.now(),
            text: message,
            xp: amount,
          },
        };
      });
    },
    []
  );

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

  const getVerseXp = useCallback(
    (verseId) => (progress.verseXp && progress.verseXp[verseId]) || 0,
    [progress.verseXp]
  );

  const getLevelMasteryCount = useCallback(
    (levelId, versiculos) => {
      const levelVerses = versiculos.filter((v) => v.nivel === levelId);
      return levelVerses.filter((v) => getVerseStars(v.id) >= 1).length;
    },
    [getVerseStars]
  );

  const isLevelUnlocked = useCallback(
    (levelId, _versiculos, niveles = []) => {
      if (progress.leaderUnlockAll && !progress.previewDate) return true;
      const targetNivel = niveles.find((n) => n.id === levelId);
      if (!targetNivel) return levelId === 1;
      return isWeekDateUnlocked(targetNivel, effectiveTodayKey);
    },
    [progress.leaderUnlockAll, progress.previewDate, effectiveTodayKey]
  );

  const getTotalMasteredCount = useCallback(
    (versiculos) => versiculos.filter((v) => getVerseStars(v.id) >= 1).length,
    [getVerseStars]
  );

  return {
    progress,
    syncStatus,
    effectiveTodayKey,
    recordGameWin,
    recordFinaleResult,
    markVerseExplored,
    toggleMissionDone,
    confirmPlayerProfile,
    switchNewPlayer,
    toggleLeaderUnlockAll,
    setPreviewDate,
    setPlayerName,
    awardBonusXp,
    clearToast,
    getVerseStars,
    getVerseXp,
    getLevelMasteryCount,
    isLevelUnlocked,
    getTotalMasteredCount,
    fireCelebration,
  };
}
