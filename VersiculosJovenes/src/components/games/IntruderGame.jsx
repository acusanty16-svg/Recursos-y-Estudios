import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bug, ShieldCheck, RotateCcw, Sparkles, AlertTriangle } from 'lucide-react';
import { cleanWord } from '../../utils/themeConfig';
import { soundFX } from '../../utils/soundEffects';

const GLITCH_SUBSTITUTES = [
  'espejismo', 'silencio', 'laberinto', 'fortuna', 'olvido',
  'tormenta', 'ceniza', 'muralla', 'orgullo', 'relámpago',
  'sombra', 'abismo', 'misterio', 'frontera', 'imperio'
];

export default function IntruderGame({ verse, theme, onComplete }) {
  const [seed, setSeed] = useState(0);

  const { tokens, totalIntruders } = useMemo(() => {
    const rawWords = verse.texto.split(/\s+/);
    const keySet = new Set((verse.palabrasClave || []).map((k) => cleanWord(k)));
    const candidateIndices = [];

    rawWords.forEach((w, idx) => {
      if (keySet.has(cleanWord(w)) || cleanWord(w).length >= 5) {
        candidateIndices.push(idx);
      }
    });

    // Pick up to 3 words to corrupt
    const shuffledCandidates = [...candidateIndices].sort(() => Math.random() - 0.5);
    const chosenIndices = new Set(shuffledCandidates.slice(0, Math.min(3, Math.max(1, candidateIndices.length))));
    const shuffledGlitches = [...GLITCH_SUBSTITUTES].sort(() => Math.random() - 0.5);

    let glitchCounter = 0;
    const builtTokens = rawWords.map((raw, idx) => {
      const match = raw.match(/^([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*)(.*?)([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*)$/);
      const prefix = match ? match[1] : '';
      const coreWord = match ? match[2] : raw;
      const suffix = match ? match[3] : '';

      const isCorrupted = chosenIndices.has(idx);
      const fakeCore = isCorrupted
        ? shuffledGlitches[glitchCounter++ % shuffledGlitches.length]
        : coreWord;

      return {
        id: idx,
        prefix,
        originalCore: coreWord,
        fakeCore,
        suffix,
        isCorrupted,
      };
    });

    return {
      tokens: builtTokens,
      totalIntruders: chosenIndices.size,
    };
  }, [verse, seed]);

  const [purgedIds, setPurgedIds] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrongTokenId, setWrongTokenId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleWordClick = (token) => {
    if (isCompleted) return;

    if (token.isCorrupted) {
      if (purgedIds.includes(token.id)) return;
      const nextPurged = [...purgedIds, token.id];
      setPurgedIds(nextPurged);

      if (nextPurged.length === totalIntruders) {
        soundFX.playWin();
        setIsCompleted(true);
        onComplete(Math.max(100, 175 - mistakes * 20));
      } else {
        soundFX.playCorrect(nextPurged.length);
      }
    } else {
      soundFX.playWrong();
      setMistakes((m) => m + 1);
      setWrongTokenId(token.id);
      setTimeout(() => setWrongTokenId(null), 450);
    }
  };

  const handleReset = () => {
    setPurgedIds([]);
    setMistakes(0);
    setIsCompleted(false);
    setSeed((s) => s + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/80 border border-white/10 rounded-2xl p-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5" /> Misión 03 // Cazador de Glitches
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            Se han infiltrado {totalIntruders} palabras falsas en el texto. ¡Detéctalas y haz clic en ellas!
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-white/10 font-mono text-xs text-zinc-300">
            GLITCHES PURGADOS:{' '}
            <span className="text-white font-bold">
              {purgedIds.length}/{totalIntruders}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition"
            title="Generar nuevos intrusos"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verse Scanner Area */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/90 border border-white/10 leading-relaxed">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3">
          {tokens.map((token) => {
            const isPurged = purgedIds.includes(token.id);
            const showFake = token.isCorrupted && !isPurged;
            const isWrongClick = wrongTokenId === token.id;

            return (
              <motion.button
                key={`${seed}-${token.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isWrongClick
                    ? { x: [-5, 5, -5, 5, 0], color: '#fb7185' }
                    : {}
                }
                onClick={() => handleWordClick(token)}
                className={`px-2 py-1 rounded-lg text-lg sm:text-xl font-medium transition-all ${
                  isPurged
                    ? `${theme.wordHighlight} border font-bold`
                    : 'hover:bg-white/10 text-zinc-200'
                }`}
              >
                {token.prefix}
                {showFake ? (
                  <span className="underline decoration-dotted decoration-white/25 underline-offset-4">
                    {token.fakeCore}
                  </span>
                ) : (
                  <span>{token.originalCore}</span>
                )}
                {token.suffix}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400">
          <span>CITA: {verse.referencia}</span>
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Errores de escaneo: {mistakes}
          </span>
        </div>
      </div>

      {/* Status Footer */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h5 className="text-lg font-bold text-white flex items-center gap-2">
                ¡Texto Bíblico Restaurado al 100%! <Sparkles className="w-4 h-4 text-amber-400" />
              </h5>
              <p className="text-sm text-zinc-300">
                Ninguna palabra infiltrada pudo engañarte en {verse.referencia}.
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm hover:bg-emerald-400 transition"
          >
            Nuevo Escaneo
          </button>
        </motion.div>
      )}
    </div>
  );
}
