import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Keyboard, Mic, RotateCcw, Sparkles, Eye } from 'lucide-react';
import { cleanWord } from '../../utils/themeConfig';
import { soundFX } from '../../utils/soundEffects';

export default function BlindMastery({ verse, theme, onComplete }) {
  const [subMode, setSubMode] = useState('initials'); // 'initials' | 'pulse'
  const words = useMemo(() => verse.texto.split(/\s+/), [verse.texto]);

  // Mode 1: Initials states
  const [revealedCount, setRevealedCount] = useState(0);
  const [wrongKey, setWrongKey] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const currentWord = words[revealedCount] || '';
  const targetInitial = useMemo(() => {
    const cleaned = cleanWord(currentWord);
    return cleaned ? cleaned[0].toUpperCase() : '';
  }, [currentWord]);

  // Generate 6 letter buttons for mobile/click users including targetInitial
  const letterOptions = useMemo(() => {
    if (!targetInitial) return [];
    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVYZ'.split('').filter((l) => l !== targetInitial);
    const randomLetters = alphabet.sort(() => Math.random() - 0.5).slice(0, 5);
    return [targetInitial, ...randomLetters].sort();
  }, [targetInitial, revealedCount]);

  const handleAdvanceWord = () => {
    if (isDone) return;
    const next = revealedCount + 1;
    setRevealedCount(next);
    if (next >= words.length) {
      soundFX.playWin();
      setIsDone(true);
      onComplete(250);
    } else {
      soundFX.playCorrect(1);
    }
  };

  const handleLetterInput = (letter) => {
    if (isDone || !targetInitial) return;
    if (letter.toUpperCase() === targetInitial) {
      handleAdvanceWord();
    } else {
      soundFX.playWrong();
      setWrongKey(true);
      setTimeout(() => setWrongKey(false), 350);
    }
  };

  // Physical keyboard listener for Initials or Spacebar Pulse
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isDone) return;
      if (subMode === 'pulse' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleAdvanceWord();
      } else if (subMode === 'initials' && e.key.length === 1 && /[a-zA-ZñÑ]/.test(e.key)) {
        const normalized = e.key
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
        handleLetterInput(normalized);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleReset = () => {
    setRevealedCount(0);
    setIsDone(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/80 border border-white/10 rounded-2xl p-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> Misión 05 // Modo Leyenda (Recitación a Ciegas)
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            Demuestra que llevas el versículo grabado en la mente ({revealedCount}/{words.length} palabras)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSubMode('initials');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition ${
              subMode === 'initials'
                ? `${theme.badgeBg} font-bold`
                : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" /> Iniciales
          </button>
          <button
            onClick={() => {
              setSubMode('pulse');
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition ${
              subMode === 'pulse'
                ? `${theme.badgeBg} font-bold`
                : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Pulso Voz
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Blind Matrix Display */}
      <div
        className={`p-6 sm:p-8 rounded-2xl bg-zinc-950/90 border transition-colors ${
          wrongKey ? 'border-rose-500/70' : 'border-white/10'
        }`}
      >
        <div className="flex flex-wrap gap-2 items-center leading-relaxed">
          {words.map((word, idx) => {
            const isRevealed = idx < revealedCount;
            const isCurrent = idx === revealedCount;

            return (
              <motion.span
                key={idx}
                animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                className={`px-2.5 py-1 rounded-lg font-medium text-base sm:text-lg transition-all ${
                  isRevealed
                    ? 'bg-white/10 text-white'
                    : isCurrent
                    ? `${theme.wordHighlight} border font-mono text-sm`
                    : 'bg-zinc-900/70 text-transparent select-none border border-white/5'
                }`}
              >
                {isRevealed ? word : isCurrent ? '¿ ___ ?' : word.replace(/./g, '•')}
              </motion.span>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>{verse.referencia}</span>
          <span>
            {subMode === 'initials'
              ? 'Escribe en tu teclado o toca la inicial de la siguiente palabra'
              : 'Recita en voz alta y pulsa ESPACIO o el botón para comprobar'}
          </span>
        </div>
      </div>

      {/* Controls */}
      {!isDone ? (
        subMode === 'initials' ? (
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              ¿Con qué letra empieza la palabra #{revealedCount + 1}? (También puedes usar tu teclado):
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {letterOptions.map((letter) => (
                <motion.button
                  key={letter}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleLetterInput(letter)}
                  className="py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-white/40 font-mono text-lg font-bold text-white shadow-md transition"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdvanceWord}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 ${theme.buttonPrimary}`}
            >
              <Eye className="w-5 h-5" />
              Revelar Siguiente Palabra (o pulsa ESPACIO)
            </motion.button>
          </div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/15 to-transparent border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/25 flex items-center justify-center text-amber-300">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h5 className="text-lg font-bold text-white">
                ¡Dominio de Leyenda Completado! (+250 XP)
              </h5>
              <p className="text-sm text-zinc-300">
                Has recitado {verse.referencia} de principio a fin sin ayuda visual.
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm hover:bg-amber-300 transition"
          >
            Repetir Hazгаña
          </button>
        </motion.div>
      )}
    </div>
  );
}
