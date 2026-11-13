import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LockOpen,
  Zap,
  Bug,
  Crosshair,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
} from 'lucide-react';
import { getTheme } from '../../utils/themeConfig';
import ClozeGame from './ClozeGame';
import SpeedOrderGame from './SpeedOrderGame';
import IntruderGame from './IntruderGame';
import ReferenceSniper from './ReferenceSniper';
import BlindMastery from './BlindMastery';

const GAME_MODES = [
  {
    id: 'cloze',
    label: 'Código Oculto',
    shortDesc: 'Palabras Clave',
    icon: LockOpen,
  },
  {
    id: 'speed',
    label: 'Pulso Veloz',
    shortDesc: 'Contrarreloj',
    icon: Zap,
  },
  {
    id: 'intruder',
    label: 'Caza-Glitches',
    shortDesc: 'Detectar Intrusos',
    icon: Bug,
  },
  {
    id: 'sniper',
    label: 'Radar de Citas',
    shortDesc: 'Francotirador',
    icon: Crosshair,
  },
  {
    id: 'mastery',
    label: 'Modo Leyenda',
    shortDesc: 'A Ciegas',
    icon: Flame,
  },
];

export default function GameArenaModal({
  verse,
  level,
  allVerses,
  initialMode = 'cloze',
  completedGamesForVerse = {},
  onClose,
  onWinGame,
  onSelectVerse,
}) {
  const [activeTab, setActiveTab] = useState(initialMode);

  useEffect(() => {
    setActiveTab(initialMode || 'cloze');
  }, [initialMode, verse?.id]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!verse) return null;

  const theme = getTheme(level?.temaColor || 'amber');
  const currentIndex = allVerses.findIndex((v) => v.id === verse.id);
  const prevVerse = currentIndex > 0 ? allVerses[currentIndex - 1] : null;
  const nextVerse = currentIndex < allVerses.length - 1 ? allVerses[currentIndex + 1] : null;

  const handleComplete = (gameId, xpAmount) => {
    onWinGame(verse.id, gameId, xpAmount, theme.hex);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-3xl bg-[#0B0D14] border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Ambient Top Glow */}
          <div
            className={`absolute -top-28 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-gradient-to-b ${theme.bgGlow} blur-3xl pointer-events-none`}
          />

          {/* Top Console Header */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-white/10 bg-zinc-950/60">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${theme.badgeBg}`}>
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                    NIVEL 0{verse.nivel} · MISIÓN 0{verse.semana}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className={`text-xs font-mono font-bold ${theme.accentText}`}>
                    {verse.referencia}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                  {verse.titulo}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {prevVerse && (
                <button
                  onClick={() => onSelectVerse(prevVerse)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition hidden sm:flex items-center gap-1 text-xs font-mono"
                  title={`Anterior: ${prevVerse.referencia}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {nextVerse && (
                <button
                  onClick={() => onSelectVerse(nextVerse)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition hidden sm:flex items-center gap-1 text-xs font-mono"
                  title={`Siguiente: ${nextVerse.referencia}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-300 border border-white/10 transition"
                aria-label="Cerrar consola"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 5 Game Mode Selector Tabs */}
          <div className="relative z-10 px-5 sm:px-7 py-3 bg-zinc-900/50 border-b border-white/10 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {GAME_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeTab === mode.id;
                const isDone = Boolean(completedGamesForVerse[mode.id]);

                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveTab(mode.id)}
                    className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border ${
                      isActive
                        ? `${theme.badgeBg} font-bold shadow-lg`
                        : 'bg-zinc-950/70 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <div className="leading-none flex items-center gap-1.5">
                        <span>{mode.label}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] font-mono opacity-65 block mt-0.5">
                        {mode.shortDesc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Game Body */}
          <div className="relative z-10 p-5 sm:p-7 overflow-y-auto flex-1">
            {activeTab === 'cloze' && (
              <ClozeGame
                key={`cloze-${verse.id}`}
                verse={verse}
                theme={theme}
                onComplete={(xp) => handleComplete('cloze', xp)}
              />
            )}
            {activeTab === 'speed' && (
              <SpeedOrderGame
                key={`speed-${verse.id}`}
                verse={verse}
                theme={theme}
                onComplete={(xp) => handleComplete('speed', xp)}
              />
            )}
            {activeTab === 'intruder' && (
              <IntruderGame
                key={`intruder-${verse.id}`}
                verse={verse}
                theme={theme}
                onComplete={(xp) => handleComplete('intruder', xp)}
              />
            )}
            {activeTab === 'sniper' && (
              <ReferenceSniper
                key={`sniper-${verse.id}`}
                verse={verse}
                allVerses={allVerses}
                theme={theme}
                onComplete={(xp) => handleComplete('sniper', xp)}
              />
            )}
            {activeTab === 'mastery' && (
              <BlindMastery
                key={`mastery-${verse.id}`}
                verse={verse}
                theme={theme}
                onComplete={(xp) => handleComplete('mastery', xp)}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
