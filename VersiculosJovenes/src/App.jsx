import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import data from './data/versiculos.json';
import { useProgress } from './hooks/useProgress';
import NavbarHUD from './components/layout/NavbarHUD';
import LevelSection from './components/scrollytelling/LevelSection';
import GameArenaModal from './components/games/GameArenaModal';
import VersusModal from './components/games/VersusModal';
import { Sparkles, Lock } from 'lucide-react';

export default function App() {
  const { niveles, versiculos } = data;
  const {
    progress,
    recordGameWin,
    claimMilestoneChest,
    markVerseExplored,
    toggleMissionDone,
    toggleLeaderUnlockAll,
    setPlayerName,
    awardBonusXp,
    clearToast,
    getLevelMasteryCount,
    isLevelUnlocked,
    getTotalMasteredCount,
  } = useProgress();

  const [activeLevelId, setActiveLevelId] = useState(1);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [lockedNotice, setLockedNotice] = useState(null);
  const [versusOpen, setVersusOpen] = useState(false);
  const [arenaState, setArenaState] = useState({
    isOpen: false,
    verse: null,
    mode: 'cloze',
  });

  // Auto-hide micro-reward toast after 4s
  useEffect(() => {
    if (!progress.lastRewardToast) return;
    const t = setTimeout(() => clearToast(), 4000);
    return () => clearTimeout(t);
  }, [progress.lastRewardToast, clearToast]);

  // Auto-hide locked notice after 3.5s
  useEffect(() => {
    if (!lockedNotice) return;
    const t = setTimeout(() => setLockedNotice(null), 3500);
    return () => clearTimeout(t);
  }, [lockedNotice]);

  const totalMastered = getTotalMasteredCount(versiculos);

  const handleSelectLevel = useCallback(
    (levelId) => {
      if (!isLevelUnlocked(levelId, versiculos)) {
        setLockedNotice(
          `🔒 El Nivel 0${levelId} está bloqueado. Completa los 8 versículos del Nivel 0${
            levelId - 1
          } para desbloquearlo (o activa el Modo Líder en tu perfil).`
        );
        return;
      }

      setActiveLevelId(levelId);
      setActiveVerseIndex(0);
    },
    [isLevelUnlocked, versiculos]
  );

  const handleJumpToVerse = useCallback(
    (verse) => {
      if (!isLevelUnlocked(verse.nivel, versiculos)) {
        setLockedNotice(
          `🔒 Ese versículo pertenece al Nivel 0${verse.nivel}. Supera el Nivel 0${
            verse.nivel - 1
          } primero.`
        );
        return;
      }
      setActiveLevelId(verse.nivel);
      const levelVerses = versiculos
        .filter((v) => v.nivel === verse.nivel)
        .sort((a, b) => a.semana - b.semana);
      const idx = levelVerses.findIndex((v) => v.id === verse.id);
      setActiveVerseIndex(idx !== -1 ? idx : 0);
    },
    [isLevelUnlocked, versiculos]
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

  const activeNivelObj =
    niveles.find((n) => n.id === activeLevelId) || niveles[0];
  const nextNivelObj =
    niveles.find((n) => n.id === activeLevelId + 1) || null;
  const activeLevelVerses = versiculos
    .filter((v) => v.nivel === activeNivelObj.id)
    .sort((a, b) => a.semana - b.semana);

  const activeArenaLevel = arenaState.verse
    ? niveles.find((n) => n.id === arenaState.verse.nivel)
    : activeNivelObj;

  return (
    <div
      id="top"
      className="min-h-screen bg-[#07080C] text-zinc-100 relative selection:bg-amber-500/30 selection:text-amber-200 flex flex-col justify-between"
    >
      {/* Top Sticky HUD */}
      <NavbarHUD
        niveles={niveles}
        versiculos={versiculos}
        activeLevelId={activeLevelId}
        playerName={progress.playerName || 'Joven ICAF'}
        onChangePlayerName={setPlayerName}
        xp={progress.xp}
        totalMastered={totalMastered}
        leaderUnlockAll={progress.leaderUnlockAll}
        onToggleLeaderUnlock={toggleLeaderUnlockAll}
        getLevelMasteryCount={getLevelMasteryCount}
        isLevelUnlocked={isLevelUnlocked}
        onSelectLevel={handleSelectLevel}
        onJumpToVerse={handleJumpToVerse}
        onOpenVersus={() => setVersusOpen(true)}
      />

      {/* Micro-Reward & Lock Floating Toast Notifications */}
      <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {progress.lastRewardToast && (
            <motion.div
              key={progress.lastRewardToast.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className="pointer-events-auto p-4 rounded-2xl bg-zinc-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
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
              className="pointer-events-auto p-4 rounded-2xl bg-zinc-900/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-zinc-200 leading-snug">
                {lockedNotice}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content: Title + Verse Container + Games directly */}
      <main className="relative z-10 flex-1">
        <LevelSection
          key={activeNivelObj.id}
          niveles={niveles}
          versiculos={versiculos}
          nivel={activeNivelObj}
          nextNivel={nextNivelObj}
          verses={activeLevelVerses}
          activeVerseIndex={activeVerseIndex}
          onSelectVerseIndex={setActiveVerseIndex}
          onSelectLevel={handleSelectLevel}
          isLevelUnlocked={isLevelUnlocked}
          getLevelMasteryCount={getLevelMasteryCount}
          completedGames={progress.completedGames}
          completedMissions={progress.completedMissions || []}
          claimedChests={progress.claimedChests}
          levelMasteryCount={getLevelMasteryCount(activeNivelObj.id, versiculos)}
          isNextLevelUnlocked={
            nextNivelObj ? isLevelUnlocked(nextNivelObj.id, versiculos) : false
          }
          onClaimChest={claimMilestoneChest}
          onToggleMissionDone={toggleMissionDone}
          onAdvanceToNextLevel={(nextId) => handleSelectLevel(nextId)}
          onOpenGame={handleOpenGame}
          onExploreVerse={markVerseExplored}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 sm:px-6 bg-zinc-950/80">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-300 font-bold">ICAF-Verses</span>
          </div>
          <div>6 NIVELES · 5 JUEGOS · DUELO 1 VS 1</div>
        </div>
      </footer>

      {/* 5-Game Interactive Arena Modal */}
      {arenaState.isOpen && arenaState.verse && (
        <GameArenaModal
          verse={arenaState.verse}
          level={activeArenaLevel}
          allVerses={activeLevelVerses}
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

      {/* 1v1 Duel Modal (2 Personas) */}
      {versusOpen && (
        <VersusModal
          versiculos={versiculos}
          activeLevelId={activeLevelId}
          onClose={() => setVersusOpen(false)}
          onAwardXp={(amt) => awardBonusXp(amt)}
        />
      )}
    </div>
  );
}
