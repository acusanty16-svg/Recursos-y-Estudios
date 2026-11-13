import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, RotateCcw, Award, Check, X } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export default function ReferenceSniper({ verse, allVerses, theme, onComplete }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedRef, setSelectedRef] = useState(null);
  const [timeLeft, setTimeLeft] = useState(100); // percentage 100 -> 0
  const [isFinished, setIsFinished] = useState(false);

  // Build 5 rounds starting with the current verse, then 4 others from the same level (or nearby)
  const questions = useMemo(() => {
    const sameLevel = allVerses.filter((v) => v.nivel === verse.nivel && v.id !== verse.id);
    const shuffledLevel = [...sameLevel].sort(() => Math.random() - 0.5).slice(0, 4);
    const targetVerses = [verse, ...shuffledLevel];

    return targetVerses.map((target, idx) => {
      const distractors = allVerses
        .filter((v) => v.referencia !== target.referencia)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v) => v.referencia);

      const options = [target.referencia, ...distractors].sort(() => Math.random() - 0.5);

      return {
        id: idx,
        target,
        mode: idx % 2 === 0 ? 'texto' : 'contexto',
        options,
      };
    });
  }, [verse, allVerses]);

  const currentQ = questions[round];

  useEffect(() => {
    if (isFinished || selectedRef !== null) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 2) {
          handleAnswer('__TIMEOUT__');
          return 0;
        }
        return prev - 1.5;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [round, isFinished, selectedRef]);

  const handleAnswer = (ref) => {
    if (selectedRef !== null || isFinished) return;
    setSelectedRef(ref);

    const isCorrect = ref === currentQ.target.referencia;
    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      soundFX.playCorrect(nextScore);
      setScore(nextScore);
    } else {
      soundFX.playWrong();
    }

    setTimeout(() => {
      if (round + 1 >= questions.length) {
        setIsFinished(true);
        if (nextScore >= 3) {
          onComplete(150 + nextScore * 30);
        }
      } else {
        setRound((r) => r + 1);
        setSelectedRef(null);
        setTimeLeft(100);
      }
    }, 950);
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setSelectedRef(null);
    setTimeLeft(100);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/80 border border-white/10 rounded-2xl p-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5" /> Misión 04 // Francotirador de Citas (Nivel {verse.nivel})
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            Identifica la referencia bíblica exacta antes de que se agote el radar
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-white/10 font-mono text-xs text-zinc-300">
            RONDA <span className="text-white font-bold">{round + 1}</span>/{questions.length} · ACIERTOS:{' '}
            <span className={theme.accentText}>{score}</span>
          </div>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished && currentQ ? (
          <motion.div
            key={round}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-5"
          >
            {/* Energy timer bar */}
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-100 ${theme.progressFill}`}
                style={{ width: `${timeLeft}%` }}
              />
            </div>

            {/* Prompt Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-3">
              <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/5 text-zinc-400">
                {currentQ.mode === 'texto'
                  ? 'PISTA // TEXTO DEL VERSÍCULO'
                  : `PISTA // TEMA: ${currentQ.target.titulo.toUpperCase()}`}
              </span>
              <p className="text-lg sm:text-xl font-medium text-zinc-100 leading-relaxed">
                “{currentQ.mode === 'texto' ? currentQ.target.texto : currentQ.target.misionInfantil}”
              </p>
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isTarget = opt === currentQ.target.referencia;
                const isPicked = selectedRef === opt;

                let btnStyle =
                  'bg-zinc-900 hover:bg-zinc-800 border-white/10 hover:border-white/30 text-white';
                if (selectedRef !== null) {
                  if (isTarget) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                  } else if (isPicked && !isTarget) {
                    btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
                  } else {
                    btnStyle = 'bg-zinc-900/40 border-white/5 text-zinc-600';
                  }
                }

                return (
                  <motion.button
                    key={opt}
                    whileHover={selectedRef === null ? { scale: 1.02 } : {}}
                    whileTap={selectedRef === null ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(opt)}
                    className={`p-4 rounded-xl border font-mono text-base font-bold flex items-center justify-between transition-all ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedRef !== null && isTarget && <Check className="w-5 h-5 text-emerald-400" />}
                    {selectedRef !== null && isPicked && !isTarget && (
                      <X className="w-5 h-5 text-rose-400" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
                  REPORTE DE PRECISIÓN
                </span>
                <h5 className="text-xl font-bold text-white">
                  Acertaste {score} de {questions.length} citas bíblicas
                </h5>
                <p className="text-sm text-zinc-400">
                  {score >= 4
                    ? '¡Puntería bíblica impecable! Dominas las referencias de este nivel.'
                    : 'Sigue entrenando para asociar cada verdad con su cita al instante.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className={`px-6 py-3 rounded-xl font-bold text-sm ${theme.buttonPrimary}`}
            >
              Volver a Disparar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
