import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import data from './data/versiculos.json';
import { useProgress } from './hooks/useProgress';
import {
  CHALLENGE_META,
  formatShortDateEs,
  getChallengePhase,
} from './utils/challengeSchedule';
import NavbarHUD from './components/layout/NavbarHUD';
import DesafioBrandMark from './components/layout/DesafioBrandMark';
import PlayerWelcomeModal from './components/layout/PlayerWelcomeModal';
import LeaderboardModal from './components/layout/LeaderboardModal';
import LevelSection from './components/scrollytelling/LevelSection';
import GameArenaModal from './components/games/GameArenaModal';
import GrandFinaleModal from './components/games/GrandFinaleModal';
import VersusModal from './components/games/VersusModal';
import { Sparkles, Lock } from 'lucide-react';

export default function App() {
  const { niveles, versiculos } = data;
  const {
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
    getVerseXp,
    getLevelMasteryCount,
    isLevelUnlocked,
    getTotalMasteredCount,
  } = useProgress();

  const phaseInfo = useMemo(
    () => getChallengePhase(niveles, effectiveTodayKey),
    [niveles, effectiveTodayKey]
  );

  const [activeLevelId, setActiveLevelId] = useState(() => phaseInfo.activeWeekId || 1);
  const [lockedNotice, setLockedNotice] = useState(null);
  const [versusOpen, setVersusOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [finalModalMode, setFinalModalMode] = useState(null); // null | 'grace' | 'finale'
  const [arenaState, setArenaState] = useState({
    isOpen: false,
    verse: null,
    mode: 'cloze',
  });

  // Mantener la semana seleccionada dentro de las desbloqueadas cuando cambia la fecha de vista previa
  useEffect(() => {
    if (!isLevelUnlocked(activeLevelId, versiculos, niveles)) {
      setActiveLevelId(phaseInfo.activeWeekId || 1);
    }
  }, [activeLevelId, isLevelUnlocked, versiculos, niveles, phaseInfo.activeWeekId]);

  useEffect(() => {
    if (!progress.lastRewardToast) return;
    const t = setTimeout(() => clearToast(), 4000);
    return () => clearTimeout(t);
  }, [progress.lastRewardToast, clearToast]);

  useEffect(() => {
    if (!lockedNotice) return;
    const t = setTimeout(() => setLockedNotice(null), 3500);
    return () => clearTimeout(t);
  }, [lockedNotice]);

  const unlockedVerses = useMemo(
    () => versiculos.filter((v) => isLevelUnlocked(v.nivel, versiculos, niveles)),
    [versiculos, isLevelUnlocked, niveles]
  );

  const totalMastered = getTotalMasteredCount(versiculos);

  const handleSelectLevel = useCallback(
    (levelId) => {
      if (!isLevelUnlocked(levelId, versiculos, niveles)) {
        const target = niveles.find((n) => n.id === levelId);
        const dateLabel = target ? formatShortDateEs(target.unlockDate) : '';
        setLockedNotice(
          `🔒 La Semana ${levelId} se desbloquea el ${dateLabel}. ¡Cada lunes se abre el siguiente versículo!`
        );
        return;
      }
      setActiveLevelId(levelId);
    },
    [isLevelUnlocked, versiculos, niveles]
  );

  const handleJumpToVerse = useCallback(
    (verse) => {
      if (!isLevelUnlocked(verse.nivel, versiculos, niveles)) {
        setLockedNotice(`🔒 La Semana ${verse.nivel} todavía no está abierta.`);
        return;
      }
      setActiveLevelId(verse.nivel);
    },
    [isLevelUnlocked, versiculos, niveles]
  );

  const handleOpenGame = useCallback((verse, mode = 'cloze') => {
    setArenaState({
      isOpen: true,
      verse,
      mode,
    });
  }, []);

  const handleCloseArena = useCallback(() => {
    setArenaState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleOpenFinalChallenge = useCallback(
    (mode) => {
      const hasPreviewOverride = progress.leaderUnlockAll && !progress.previewDate;
      if (mode === 'grace' && !phaseInfo.isGraceWeekUnlocked && !hasPreviewOverride) {
        setLockedNotice(
          `⏳ La Semana 5 (Semana de Gracia) se abre el ${formatShortDateEs(
            CHALLENGE_META.graceWeekStart
          )} para preparar la Gran Final.`
        );
        return;
      }
      if (mode === 'finale' && !phaseInfo.isGrandFinaleUnlocked && !hasPreviewOverride) {
        setLockedNotice(
          `🏆 La Gran Final se abre el 19 de diciembre. ¡Guarda los 4 versículos en tu corazón!`
        );
        return;
      }
      setFinalModalMode(mode);
    },
    [progress.leaderUnlockAll, progress.previewDate, phaseInfo]
  );

  const activeNivelObj = niveles.find((n) => n.id === activeLevelId) || niveles[0];
  const activeLevelVerses = versiculos.filter((v) => v.nivel === activeNivelObj.id);
  const activeArenaLevel = arenaState.verse
    ? niveles.find((n) => n.id === arenaState.verse.nivel)
    : activeNivelObj;

  return (
    <div
      id="top"
      className="min-h-screen text-zinc-100 relative selection:bg-cyan-400/30 selection:text-cyan-200 flex flex-col justify-between"
    >
      <NavbarHUD
        niveles={niveles}
        versiculos={versiculos}
        activeLevelId={activeLevelId}
        playerName={progress.playerName || 'Joven Desafío 119:9'}
        onChangePlayerName={setPlayerName}
        xp={progress.xp}
        totalMastered={totalMastered}
        leaderUnlockAll={progress.leaderUnlockAll}
        previewDate={progress.previewDate}
        onSetPreviewDate={setPreviewDate}
        onToggleLeaderUnlock={toggleLeaderUnlockAll}
        getLevelMasteryCount={getLevelMasteryCount}
        isLevelUnlocked={isLevelUnlocked}
        onSelectLevel={handleSelectLevel}
        onJumpToVerse={handleJumpToVerse}
        onOpenVersus={() => setVersusOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
      />

      {/* Toasts flotantes Cian / Coral */}
      <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {progress.lastRewardToast && (
            <motion.div
              key={progress.lastRewardToast.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className="pointer-events-auto p-4 rounded-2xl bg-zinc-950/95 border border-cyan-400/45 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                {progress.lastRewardToast.text}
              </p>
            </motion.div>
          )}

          {lockedNotice && (
            <motion.div
              key="locked-toast"
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className="pointer-events-auto p-4 rounded-2xl bg-zinc-950/95 border border-coral-400/45 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-coral-400/20 flex items-center justify-center text-coral-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-zinc-200 leading-snug">
                {lockedNotice}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex-1">
        <LevelSection
          niveles={niveles}
          nivel={activeNivelObj}
          verses={activeLevelVerses}
          activeTodayKey={effectiveTodayKey}
          leaderUnlockAll={progress.leaderUnlockAll && !progress.previewDate}
          getVerseXp={getVerseXp}
          onSelectLevel={handleSelectLevel}
          isLevelUnlocked={isLevelUnlocked}
          getLevelMasteryCount={getLevelMasteryCount}
          completedGames={progress.completedGames}
          completedMissions={progress.completedMissions || []}
          onToggleMissionDone={toggleMissionDone}
          onOpenGame={handleOpenGame}
          onExploreVerse={markVerseExplored}
          onOpenFinalChallenge={handleOpenFinalChallenge}
        />
      </main>

      {/* Pie de página Desafío 119:9 */}
      <footer className="border-t border-white/10 py-6 px-4 sm:px-6 bg-zinc-950/80">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2.5">
            <DesafioBrandMark size={24} />
            <span className="font-bold">
              <span className="text-cyan-400">DESAFÍO</span>{' '}
              <span className="text-coral-400">119:9</span>
            </span>
          </div>
          <div>4 SEMANAS · SEMANA DE GRACIA · GRAN FINAL 19 DE DICIEMBRE</div>
        </div>
      </footer>

      {/* Arena de los 5 Minijuegos */}
      {arenaState.isOpen && arenaState.verse && (
        <GameArenaModal
          verse={arenaState.verse}
          level={activeArenaLevel}
          allVerses={unlockedVerses}
          initialMode={arenaState.mode}
          completedGamesForVerse={progress.completedGames[arenaState.verse.id] || {}}
          onClose={handleCloseArena}
          onWinGame={recordGameWin}
          onSelectVerse={(nextV) =>
            setArenaState((prev) => ({
              ...prev,
              verse: nextV,
            }))
          }
        />
      )}

      {/* Duelo 1v1 solo con versículos ya desbloqueados */}
      {versusOpen && (
        <VersusModal
          versiculos={unlockedVerses.length > 0 ? unlockedVerses : [versiculos[0]]}
          activeLevelId={activeLevelId}
          onClose={() => setVersusOpen(false)}
          onAwardXp={(amt) => awardBonusXp(amt)}
        />
      )}

      {/* Semana 5 (Gracia) / Gran Final 19 de Diciembre */}
      {finalModalMode && (
        <GrandFinaleModal
          mode={finalModalMode}
          verses={versiculos}
          playerName={progress.playerName}
          onChangePlayerName={setPlayerName}
          onClose={() => setFinalModalMode(null)}
          onComplete={(score, isFinale) => recordFinaleResult(score, isFinale)}
        />
      )}

      {/* Modal de Ranking Online + Nivel de Estudio por Versículo */}
      <LeaderboardModal
        open={leaderboardOpen}
        niveles={niveles}
        effectiveTodayKey={effectiveTodayKey}
        leaderUnlockAll={progress.leaderUnlockAll && !progress.previewDate}
        currentPlayer={{
          playerId: progress.playerId,
          playerName: progress.playerName,
          profileConfirmed: progress.profileConfirmed,
          xp: progress.xp,
          verseXp: progress.verseXp,
          masteredCount: totalMastered,
          finaleBestScore: progress.finaleBestScore,
        }}
        syncStatus={syncStatus}
        onSwitchNewPlayer={switchNewPlayer}
        onClose={() => setLeaderboardOpen(false)}
      />

      {/* Registro rápido la primera vez que entra un joven */}
      <PlayerWelcomeModal
        open={!progress.profileConfirmed}
        onConfirm={confirmPlayerProfile}
      />
    </div>
  );
}
