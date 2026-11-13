import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LockOpen,
  Zap,
  Bug,
  Crosshair,
  Flame,
  Star,
  Target,
  Copy,
  Check,
  Volume2,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cleanWord } from '../../utils/themeConfig';
import { getYouthApplication } from '../../utils/youthApplications';
import { soundFX } from '../../utils/soundEffects';

const QUICK_GAMES = [
  { id: 'cloze', label: 'Código Oculto', icon: LockOpen },
  { id: 'speed', label: 'Pulso Veloz', icon: Zap },
  { id: 'intruder', label: 'Caza-Glitches', icon: Bug },
  { id: 'sniper', label: 'Radar Citas', icon: Crosshair },
  { id: 'mastery', label: 'Modo Leyenda', icon: Flame },
];

export default function VerseStation({
  verse,
  theme,
  completedGames = {},
  isMissionDone = false,
  hasPrev = false,
  hasNext = false,
  onPrevMission,
  onNextMission,
  onToggleMissionDone,
  onOpenGame,
  onExploreVerse,
}) {
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const youthChallenge = useMemo(() => getYouthApplication(verse), [verse]);

  const keySet = useMemo(
    () => new Set((verse.palabrasClave || []).map((k) => cleanWord(k))),
    [verse.palabrasClave]
  );

  const tokens = useMemo(() => {
    return verse.texto.split(/\s+/).map((raw, idx) => {
      const cleaned = cleanWord(raw);
      const isKey = keySet.has(cleaned);
      return { id: idx, raw, cleaned, isKey };
    });
  }, [verse.texto, keySet]);

  const starsCount = Object.values(completedGames).filter(Boolean).length;

  const handleKeywordClick = (token) => {
    soundFX.playClick();
    onExploreVerse(verse.id);
    if (selectedKeyword === token.cleaned) {
      setSelectedKeyword(null);
    } else {
      setSelectedKeyword(token.cleaned);
    }
  };

  const handleCopy = () => {
    soundFX.playClick();
    const shareText = `“${verse.texto}” — ${verse.referencia}\n\n🎯 Reto Juvenil: ${youthChallenge}`;
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`${verse.texto}. ${verse.referencia}`);
    utterance.lang = 'es-ES';
    utterance.rate = 0.96;
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.article
      key={verse.id}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative"
    >
      {/* Main Interactive Station Card */}
      <div
        className={`rounded-3xl glass-panel-interactive border p-6 sm:p-8 transition-all ${
          starsCount > 0 ? theme.borderGlow : 'border-white/15'
        }`}
      >
        {/* Top Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3.5 py-1 rounded-xl font-mono text-xs font-bold border ${theme.badgeBg}`}>
              NIVEL 0{verse.nivel} · VERSÍCULO 0{verse.semana}/08
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-zinc-300">
              {verse.categoria}
            </span>
          </div>

          {/* 5 Mastery Stars + Utilities */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-950/90 border border-white/10"
              title={`${starsCount} de 5 juegos superados en este versículo`}
            >
              {[1, 2, 3, 4, 5].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-4 h-4 transition-all ${
                    starIdx <= starsCount
                      ? 'text-amber-400 fill-amber-400 scale-105'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl border transition ${
                speaking
                  ? `${theme.badgeBg}`
                  : 'bg-zinc-900/80 hover:bg-zinc-800 border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Escuchar versículo"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition"
              title="Copiar versículo y reto práctico"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title & Reference */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-5">
          <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {verse.titulo}
          </h3>
          <span className={`font-mono text-base sm:text-lg font-bold ${theme.accentText} shrink-0`}>
            — {verse.referencia}
          </span>
        </div>

        {/* Kinetic Interactive Verse Text */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/90 border border-white/10 mb-5 relative overflow-hidden">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-3 text-xl sm:text-2xl lg:text-[27px] leading-relaxed font-medium text-zinc-100">
            {tokens.map((token) => {
              if (!token.isKey) {
                return (
                  <span key={token.id} className="transition-colors hover:text-white">
                    {token.raw}
                  </span>
                );
              }

              const isSelected = selectedKeyword === token.cleaned;

              return (
                <motion.button
                  key={token.id}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleKeywordClick(token)}
                  className={`px-2.5 py-0.5 rounded-xl border font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-zinc-950 border-white shadow-lg'
                      : `${theme.wordHighlight} border`
                  }`}
                  title="Toca esta palabra clave para entrenarla"
                >
                  {token.raw}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedKeyword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3"
              >
                <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className={`w-3.5 h-3.5 ${theme.accentText}`} />
                  Palabra clave seleccionada: <strong className="text-white uppercase">“{selectedKeyword}”</strong>
                </span>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onOpenGame(verse, 'cloze');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold ${theme.buttonGhost}`}
                >
                  Jugar Código Oculto →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Single Direct Youth Practical Application Box */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-zinc-900/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${theme.badgeBg}`}>
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[11px] font-mono uppercase tracking-wider font-bold block ${theme.accentText}`}>
                APLICACIÓN PRÁCTICA JUVENIL
              </span>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed mt-0.5">
                {youthChallenge}
              </p>
            </div>
          </div>

          {onToggleMissionDone && (
            <button
              onClick={() => {
                soundFX.playCorrect(2);
                onToggleMissionDone(verse.id);
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 border transition ${
                isMissionDone
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-200 border-white/15'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isMissionDone ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{isMissionDone ? '¡Reto Cumplido!' : 'Marcar Hecho (+50 XP)'}</span>
            </button>
          )}
        </div>

        {/* Bottom Arcade Launchpad + Prev/Next Mission Controls */}
        <div className="pt-5 border-t border-white/10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gamepad2 className={`w-4 h-4 ${theme.accentText}`} />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Elige un Juego para ganar estrellas en este versículo:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {QUICK_GAMES.map((g) => {
                const Icon = g.icon;
                const isBeaten = Boolean(completedGames[g.id]);

                return (
                  <motion.button
                    key={g.id}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      soundFX.playClick();
                      onOpenGame(verse, g.id);
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all ${
                      isBeaten
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 hover:bg-emerald-500/25'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{g.label}</span>
                    {isBeaten && <Check className="w-3 h-3 text-emerald-400" />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Direct Mission Stepper Buttons (Zero Scroll) */}
          <div className="flex items-center gap-2 self-end xl:self-center shrink-0">
            <button
              onClick={() => {
                soundFX.playClick();
                onPrevMission();
              }}
              disabled={!hasPrev}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-35 border border-white/10 text-xs font-mono font-bold text-zinc-200 flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onNextMission();
              }}
              disabled={!hasNext}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-extrabold flex items-center gap-1 transition disabled:opacity-35 ${theme.buttonPrimary}`}
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
