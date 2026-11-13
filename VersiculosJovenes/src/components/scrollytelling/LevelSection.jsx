import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Gift,
  Lock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { getTheme } from '../../utils/themeConfig';
import { soundFX } from '../../utils/soundEffects';
import VerseStation from './VerseStation';

const MILESTONES = [
  { count: 3, xp: 200, title: 'Cofre de Bronce' },
  { count: 5, xp: 350, title: 'Cofre de Plata' },
  { count: 8, xp: 600, title: 'Cofre Maestro' },
];

export default function LevelSection({
  niveles = [],
  versiculos = [],
  nivel,
  nextNivel,
  verses,
  activeVerseIndex = 0,
  onSelectVerseIndex,
  onSelectLevel,
  isLevelUnlocked,
  getLevelMasteryCount,
  completedGames,
  completedMissions = [],
  claimedChests = {},
  levelMasteryCount,
  isNextLevelUnlocked,
  onClaimChest,
  onToggleMissionDone,
  onAdvanceToNextLevel,
  onOpenGame,
  onExploreVerse,
}) {
  const theme = getTheme(nivel.temaColor);
  const remainingToUnlockNext = Math.max(0, verses.length - levelMasteryCount);

  const safeIndex = Math.min(Math.max(0, activeVerseIndex), verses.length - 1);
  const activeVerse = verses[safeIndex] || verses[0];

  return (
    <section
      id="active-level-stage"
      className="relative pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto"
    >
      {/* Ambient Radial Level Glow */}
      <div
        className={`absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-3xl h-80 bg-gradient-to-b ${theme.bgGlow} blur-[140px] pointer-events-none -z-10`}
      />

      {/* ONLY THE TITLE AT THE TOP */}
      <div className="text-center mb-6">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-white">
          ICAF<span className={theme.accentText}>-Verses</span>
        </h1>
      </div>

      {/* IMMEDIATELY BELOW THE TITLE: THE VERSE CONTAINER & ITS 5 GAMES */}
      <AnimatePresence mode="wait">
        {activeVerse && (
          <VerseStation
            key={activeVerse.id}
            verse={activeVerse}
            theme={theme}
            completedGames={completedGames[activeVerse.id] || {}}
            isMissionDone={completedMissions.includes(activeVerse.id)}
            hasPrev={safeIndex > 0}
            hasNext={safeIndex < verses.length - 1}
            onPrevMission={() => onSelectVerseIndex(Math.max(0, safeIndex - 1))}
            onNextMission={() =>
              onSelectVerseIndex(Math.min(verses.length - 1, safeIndex + 1))
            }
            onToggleMissionDone={onToggleMissionDone}
            onOpenGame={onOpenGame}
            onExploreVerse={onExploreVerse}
          />
        )}
      </AnimatePresence>

      {/* BELOW THE VERSE: LEVELS SELECTOR */}
      <div className="mt-8 p-5 rounded-3xl bg-zinc-900/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Niveles ({nivel.nombre})
          </span>
          <span className={`text-xs font-mono font-bold ${theme.accentText}`}>
            {levelMasteryCount}/8 versículos completados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {niveles.map((lvl) => {
            const unlocked = isLevelUnlocked(lvl.id, versiculos);
            const isCurrent = lvl.id === nivel.id;
            const lTheme = getTheme(lvl.temaColor);
            const count = getLevelMasteryCount(lvl.id, versiculos);

            return (
              <button
                key={lvl.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectLevel(lvl.id);
                }}
                className={`p-3 rounded-2xl font-mono text-xs transition-all flex items-center justify-between border ${
                  isCurrent
                    ? `${lTheme.badgeBg} font-bold border-2 shadow-md`
                    : unlocked
                    ? 'bg-zinc-950/80 text-zinc-300 border-white/10 hover:border-white/25 hover:text-white'
                    : 'bg-zinc-950/40 text-zinc-600 border-white/5'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {!unlocked && <Lock className="w-3 h-3" />}
                  <span>Nivel {lvl.id}</span>
                </span>
                {unlocked && <span className="text-[11px] opacity-85">{count}/8</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* BELOW LEVELS: COMPACT MICRO-REWARDS */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MILESTONES.map((m) => {
          const chestKey = `${nivel.id}-${m.count}`;
          const isClaimed = Boolean(claimedChests[chestKey]);
          const isReady = levelMasteryCount >= m.count && !isClaimed;

          return (
            <motion.button
              key={m.count}
              whileHover={isReady ? { scale: 1.02 } : {}}
              whileTap={isReady ? { scale: 0.98 } : {}}
              disabled={!isReady}
              onClick={() => {
                soundFX.playWin();
                onClaimChest(nivel.id, m.count, m.xp, m.title, theme.hex);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                isClaimed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : isReady
                  ? `${theme.badgeBg} border-2 cursor-pointer shadow-lg`
                  : 'bg-zinc-900/50 border-white/10 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider block">
                  RECOMPENSA ({m.count}/8 VERSÍCULOS)
                </span>
                <p className="text-xs font-bold text-white">
                  {m.title} (+{m.xp} XP)
                </p>
              </div>

              <div className="shrink-0">
                {isClaimed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isReady ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-zinc-950 font-mono text-xs font-extrabold animate-bounce">
                    <Gift className="w-3.5 h-3.5" /> Abrir
                  </span>
                ) : (
                  <Lock className="w-4 h-4 text-zinc-600" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Advance to Next Level Banner */}
      {nextNivel && isNextLevelUnlocked && (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${theme.badgeBg}`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                ¡Nivel 0{nextNivel.id} ({nextNivel.nombreCorto}) Desbloqueado!
              </h4>
              <p className="text-xs text-zinc-400">
                Ya has completado los 8 versículos de este nivel.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playWin();
              onAdvanceToNextLevel(nextNivel.id);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-extrabold flex items-center gap-1.5 shrink-0 ${theme.buttonPrimary}`}
          >
            <span>Avanzar al Nivel 0{nextNivel.id}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
