import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

// Divide un versículo en bloques tácticos de 2 a 5 palabras para el reto de velocidad
function splitIntoChunks(texto) {
  const words = texto.split(/\s+/);
  if (words.length <= 4) {
    return words.map((w, idx) => ({ id: idx, text: w }));
  }

  const targetChunkSize = Math.max(2, Math.ceil(words.length / 6));
  const chunks = [];
  for (let i = 0; i < words.length; i += targetChunkSize) {
    chunks.push({
      id: chunks.length,
      text: words.slice(i, i + targetChunkSize).join(' '),
    });
  }
  return chunks;
}

export default function SpeedOrderGame({ verse, theme, onComplete }) {
  const orderedChunks = useMemo(() => splitIntoChunks(verse.texto), [verse.texto]);

  const [shuffledChunks, setShuffledChunks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wrongId, setWrongId] = useState(null);
  const [combo, setCombo] = useState(1);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const copy = [...orderedChunks].sort(() => Math.random() - 0.5);
    // Ensure it's not already in exact order if length > 1
    if (copy.length > 1 && copy.every((c, idx) => c.id === idx)) {
      copy.reverse();
    }
    setShuffledChunks(copy);
    setSelectedIds([]);
    setElapsedMs(0);
    setIsRunning(true);
    setCombo(1);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, [orderedChunks]);

  useEffect(() => {
    if (!isRunning || isWon) return;
    const interval = setInterval(() => {
      setElapsedMs((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, isWon]);

  const handleChunkClick = (chunk) => {
    if (isWon) return;
    const expectedId = selectedIds.length;

    if (chunk.id === expectedId) {
      const nextSelected = [...selectedIds, chunk.id];
      setSelectedIds(nextSelected);
      setCombo((c) => Math.min(c + 1, 5));

      if (nextSelected.length === orderedChunks.length) {
        soundFX.playWin();
        setIsWon(true);
        setIsRunning(false);
        const timeBonus = Math.max(0, 120 - Math.floor(elapsedMs / 250));
        onComplete(160 + timeBonus);
      } else {
        soundFX.playCorrect(combo);
      }
    } else {
      soundFX.playWrong();
      setWrongId(chunk.id);
      setCombo(1);
      setTimeout(() => setWrongId(null), 450);
    }
  };

  const seconds = (elapsedMs / 1000).toFixed(1);
  const rank =
    elapsedMs < 9000 ? 'RANGO S // RELÁMPAGO' : elapsedMs < 16000 ? 'RANGO A // VELOZ' : 'RANGO B // COMPLETADO';

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/80 border border-white/10 rounded-2xl p-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Misión 02 // Pulso de Velocidad
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            Reconstruye los fragmentos en orden exacto contra el reloj
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 font-mono text-xs flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${theme.accentText}`} />
            <span>COMBO x{combo}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-white/10 font-mono text-sm text-white flex items-center gap-2">
            <Timer className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>{seconds}s</span>
          </div>

          <button
            onClick={initGame}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition"
            title="Reiniciar cronómetro"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Assembly Zone (Constructed Verse) */}
      <div className="min-h-[120px] p-5 sm:p-6 rounded-2xl bg-zinc-950/90 border border-white/10 flex flex-col justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {selectedIds.length === 0 ? (
            <p className="text-zinc-500 font-mono text-sm italic">
              Toca el primer bloque de abajo para iniciar la secuencia de {verse.referencia}...
            </p>
          ) : (
            selectedIds.map((id, idx) => {
              const chunk = orderedChunks.find((c) => c.id === id);
              return (
                <motion.span
                  key={id}
                  layoutId={`chunk-${id}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`px-3.5 py-2 rounded-xl font-medium text-sm sm:text-base border ${theme.wordHighlight}`}
                >
                  <span className="text-[10px] font-mono opacity-60 mr-1.5">0{idx + 1}</span>
                  {chunk?.text}
                </motion.span>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>PROGRESO: {selectedIds.length} / {orderedChunks.length} BLOQUES</span>
          <span>{verse.referencia}</span>
        </div>
      </div>

      {/* Shuffled Blocks Zone */}
      <AnimatePresence mode="wait">
        {!isWon ? (
          <motion.div
            key="blocks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {shuffledChunks.map((chunk) => {
              const isSelected = selectedIds.includes(chunk.id);
              const isWrong = wrongId === chunk.id;

              if (isSelected) return null;

              return (
                <motion.button
                  key={chunk.id}
                  layout
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  animate={
                    isWrong
                      ? { x: [-8, 8, -6, 6, 0], borderColor: 'rgba(244,63,94,0.8)' }
                      : {}
                  }
                  onClick={() => handleChunkClick(chunk)}
                  className="text-left p-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-white/10 hover:border-white/25 transition-all flex items-center justify-between gap-3 group shadow-md"
                >
                  <span className="text-zinc-100 font-medium text-sm sm:text-base group-hover:text-white">
                    {chunk.text}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="won"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                  {rank}
                </span>
                <h5 className="text-lg font-bold text-white">
                  ¡Ensamblado en {seconds} segundos!
                </h5>
              </div>
            </div>
            <button
              onClick={initGame}
              className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition"
            >
              Superar mi tiempo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
