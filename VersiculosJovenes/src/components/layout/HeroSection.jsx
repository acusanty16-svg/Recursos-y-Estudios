import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDown,
  Gamepad2,
  BookOpen,
  Flame,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Play,
  Lock,
  Gift,
  Award,
} from 'lucide-react';
import { getTheme } from '../../utils/themeConfig';

export default function HeroSection({
  niveles,
  versiculos = [],
  activeLevelId,
  totalMastered,
  xp,
  getLevelMasteryCount,
  isLevelUnlocked,
  onStartJourney,
  onOpenRandomGame,
  onOpenSpecificGame,
  onSelectLevel,
}) {
  const activeLevel = niveles.find((n) => n.id === activeLevelId) || niveles[0];
  const levelVerses = versiculos.filter((v) => v.nivel === activeLevel.id);
  const [verseIdx, setVerseIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [solvedMini, setSolvedMini] = useState(false);

  const currentVerse = levelVerses[verseIdx % Math.max(1, levelVerses.length)] || versiculos[0];
  const theme = getTheme(activeLevel?.temaColor || 'amber');

  const targetKeyword = (currentVerse?.palabrasClave && currentVerse.palabrasClave[0]) || 'Lámpara';
  const miniOptions = [targetKeyword, 'Sombra', 'Silencio'].sort((a, b) =>
    a.localeCompare(b)
  );

  const handleNextFeatured = () => {
    setVerseIdx((p) => p + 1);
    setSelectedWord(null);
    setSolvedMini(false);
  };

  const handleTryOption = (opt) => {
    setSelectedWord(opt);
    if (opt === targetKeyword) {
      setSolvedMini(true);
    }
  };

  const parts = (currentVerse?.texto || '').split(new RegExp(`(${targetKeyword})`, 'i'));
  const activeLevelMastered = getLevelMasteryCount(activeLevel.id, versiculos);

  // Calculate next micro-reward milestone in the current level (3, 5, or 8)
  const nextMilestone =
    activeLevelMastered < 3 ? 3 : activeLevelMastered < 5 ? 5 : 8;
  const remainingForChest = Math.max(0, nextMilestone - activeLevelMastered);

  return (
    <section
      id="top"
      className="relative min-h-[88vh] pt-24 pb-12 px-4 sm:px-6 flex flex-col justify-between overflow-hidden"
    >
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-dot-matrix opacity-40 pointer-events-none" />
      <div
        className={`absolute -top-32 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-bl ${theme.bgGlow} blur-[140px] pointer-events-none transition-all duration-700`}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Identity, Active Level Status & Micro-Reward Tracker */}
          <div className="lg:col-span-7 space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md"
            >
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${theme.badgeBg}`}>
                NIVEL ACTIVO 0{activeLevel.id}
              </span>
              <span className="text-xs font-medium text-zinc-300 pr-1">
                Insignia en juego: <strong className="text-white">{activeLevel.insignia}</strong>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="space-y-4"
            >
              <h1 className="font-display font-extrabold text-5xl sm:text-6xl xl:text-7xl tracking-tight leading-[1.02] text-white">
                ICAF<span className={theme.accentText}>-Verses</span>
                <span className="block text-2xl sm:text-4xl font-bold text-zinc-300 mt-3 leading-tight">
                  Supera retos, gana recompensas y desbloquea cada nivel.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
                Cada nivel contiene <strong className="text-white">8 misiones bíblicas</strong>. Domínalas en los 5 juegos arcade para abrir cofres de experiencia y desbloquear el siguiente nivel.
              </p>
            </motion.div>

            {/* Next Micro-Reward Progress Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/75 border border-white/10 max-w-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${theme.badgeBg}`}>
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    PRÓXIMA MICRO-RECOMPENSA (NIVEL 0{activeLevel.id})
                  </span>
                  <p className="text-sm sm:text-base font-bold text-white">
                    {remainingForChest === 0
                      ? '¡Has completado todos los hitos de este nivel!'
                      : `Te ${remainingForChest === 1 ? 'falta 1 versículo' : `faltan ${remainingForChest} versículos`} para abrir el Cofre (${activeLevelMastered}/${nextMilestone})`}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <span className="text-xs font-mono text-emerald-400 font-bold block">
                  +{nextMilestone === 3 ? 200 : nextMilestone === 5 ? 350 : 600} XP
                </span>
                <span className="text-[11px] font-mono text-zinc-500">Bono de Hito</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3.5"
            >
              <button
                onClick={onStartJourney}
                className={`px-7 py-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] ${theme.buttonPrimary}`}
              >
                <span>Ir a las 8 Misiones del Nivel 0{activeLevel.id}</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenRandomGame}
                className="px-6 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-sm sm:text-base border border-white/15 transition-all flex items-center gap-2.5"
              >
                <Gamepad2 className={`w-5 h-5 ${theme.accentText}`} />
                <span>Partida Rápida</span>
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Live Mini-Challenge Preview of Current Level */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, type: 'spring', stiffness: 220, damping: 24 }}
            className="lg:col-span-5"
          >
            <div
              className={`relative rounded-3xl glass-panel border ${theme.borderGlow} p-6 sm:p-7 shadow-2xl overflow-hidden`}
            >
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    RETO RÁPIDO · NIVEL 0{activeLevel.id}
                  </span>
                </div>

                <button
                  onClick={handleNextFeatured}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Otro versículo</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVerse.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                      Misión 0{currentVerse.semana} · {currentVerse.categoria}
                    </span>
                    <span className={`font-mono text-sm font-bold ${theme.accentText}`}>
                      {currentVerse.referencia}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-950/90 border border-white/10 text-lg sm:text-xl font-medium leading-relaxed text-zinc-100">
                    “
                    {parts.map((part, idx) => {
                      if (part.toLowerCase() === targetKeyword.toLowerCase()) {
                        return (
                          <span
                            key={idx}
                            className={`inline-flex items-center px-3 py-0.5 mx-1 rounded-xl font-mono text-base font-bold border transition-all ${
                              solvedMini
                                ? `${theme.wordHighlight}`
                                : 'bg-white/10 border-dashed border-white/40 text-amber-300'
                            }`}
                          >
                            {solvedMini ? part : '¿ ______ ?'}
                          </span>
                        );
                      }
                      return <span key={idx}>{part}</span>;
                    })}
                    ”
                  </div>

                  {!solvedMini ? (
                    <div className="space-y-2.5">
                      <p className="text-xs font-mono text-zinc-400">
                        ⚡ Toca la palabra correcta para completar el versículo:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {miniOptions.map((opt) => {
                          const isWrong = selectedWord === opt && opt !== targetKeyword;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleTryOption(opt)}
                              className={`py-2.5 px-3 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-all ${
                                isWrong
                                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                                  : 'bg-zinc-900 hover:bg-zinc-800 border-white/10 hover:border-white/30 text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>¡Correcto! Gana estrellas en el modo completo:</span>
                      </div>
                      <button
                        onClick={() => onOpenSpecificGame(currentVerse, 'cloze')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-400 text-zinc-950 font-mono text-xs font-bold hover:bg-emerald-300 transition shrink-0 flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" /> Entrenar
                      </button>
                    </motion.div>
                  )}

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 line-clamp-1">
                      {currentVerse.titulo}
                    </span>
                    <button
                      onClick={() => onOpenSpecificGame(currentVerse, 'speed')}
                      className={`text-xs font-mono font-bold flex items-center gap-1 ${theme.accentText} hover:underline shrink-0`}
                    >
                      <span>Abrir Consola (5 Juegos)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Bottom 6-Level Progression Bar (Locked Levels until previous is beaten) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 pt-6 border-t border-white/10"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Ruta de Ascenso // Completa los 8 versículos de un nivel para desbloquear el siguiente:
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Total Dominados: <strong className="text-white">{totalMastered}/48</strong> ·{' '}
              <strong className="text-emerald-400">{xp} XP</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {niveles.map((nivel) => {
              const t = getTheme(nivel.temaColor);
              const unlocked = isLevelUnlocked(nivel.id, versiculos);
              const count = getLevelMasteryCount(nivel.id, versiculos);
              const isSelected = nivel.id === activeLevelId;

              return (
                <button
                  key={nivel.id}
                  onClick={() => onSelectLevel(nivel.id)}
                  className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 group ${
                    isSelected
                      ? `${t.badgeBg} border-2 shadow-lg`
                      : unlocked
                      ? 'bg-zinc-900/70 hover:bg-zinc-900 border-white/10 hover:border-white/25'
                      : 'bg-zinc-950/60 border-white/5 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        unlocked ? t.accentText : 'text-zinc-500'
                      }`}
                    >
                      NIVEL 0{nivel.id}
                    </span>
                    {unlocked ? (
                      <span className="text-[11px] font-mono text-zinc-300 font-bold">
                        {count}/8
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white truncate block">
                      {nivel.nombre.split('·')[1]?.trim() || nivel.nombreCorto}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Award className="w-3 h-3 shrink-0" />
                      {unlocked ? nivel.insignia : 'Bloqueado'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
