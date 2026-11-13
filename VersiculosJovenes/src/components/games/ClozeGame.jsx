import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Sparkles, RotateCcw, CheckCircle2, HelpCircle, Heart } from 'lucide-react';
import { cleanWord } from '../../utils/themeConfig';
import { soundFX } from '../../utils/soundEffects';

const DECOY_POOL = [
  'montaña', 'silencio', 'trueno', 'espejo', 'riqueza', 'sombra',
  'orgullo', 'distancia', 'corona', 'tormenta', 'fuego', 'viento',
  'espada', 'templo', 'desierto', 'muralla', 'cosecha', 'altar'
];

export default function ClozeGame({ verse, theme, onComplete }) {
  // Parse verse words and identify which tokens match palabrasClave
  const parsedTokens = useMemo(() => {
    const rawWords = verse.texto.split(/\s+/);
    const keySet = new Set((verse.palabrasClave || []).map((k) => cleanWord(k)));
    const usedKeys = new Set();

    return rawWords.map((raw, idx) => {
      const cleaned = cleanWord(raw);
      // Match first occurrence of each keyword (or up to 6 blanks max for playability)
      const isKey = keySet.has(cleaned) && !usedKeys.has(cleaned) && usedKeys.size < 6;
      if (isKey) usedKeys.add(cleaned);

      // Extract leading/trailing punctuation so blank looks clean
      const match = raw.match(/^([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*)(.*?)([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*)$/);
      const prefix = match ? match[1] : '';
      const coreWord = match ? match[2] : raw;
      const suffix = match ? match[3] : '';

      return {
        id: idx,
        raw,
        prefix,
        coreWord,
        suffix,
        cleaned,
        isBlank: isKey,
      };
    });
  }, [verse]);

  const blanks = useMemo(() => parsedTokens.filter((t) => t.isBlank), [parsedTokens]);

  const wordBank = useMemo(() => {
    const realWords = blanks.map((b, idx) => ({
      id: `real-${idx}`,
      word: b.coreWord,
      cleaned: b.cleaned,
      isDecoy: false,
    }));

    const existingCleaned = new Set(realWords.map((r) => r.cleaned));
    const decoys = DECOY_POOL.filter((d) => !existingCleaned.has(cleanWord(d)))
      .slice(0, 4)
      .map((d, idx) => ({
        id: `decoy-${idx}`,
        word: d,
        cleaned: cleanWord(d),
        isDecoy: true,
      }));

    return [...realWords, ...decoys].sort(() => Math.random() - 0.5);
  }, [blanks]);

  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [filledIds, setFilledIds] = useState([]); // token.id of filled blanks
  const [usedBankIds, setUsedBankIds] = useState([]);
  const [lives, setLives] = useState(3);
  const [shakeId, setShakeId] = useState(null);
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [hintUsed, setHintUsed] = useState(false);

  const targetBlank = blanks[currentBlankIndex];

  const handleSelectWord = (item) => {
    if (status !== 'playing' || !targetBlank) return;

    if (item.cleaned === targetBlank.cleaned) {
      const nextFilled = [...filledIds, targetBlank.id];
      const nextUsed = [...usedBankIds, item.id];
      setFilledIds(nextFilled);
      setUsedBankIds(nextUsed);
      setHintUsed(false);

      if (currentBlankIndex + 1 >= blanks.length) {
        soundFX.playWin();
        setStatus('won');
        onComplete(180 + lives * 25);
      } else {
        soundFX.playCorrect(currentBlankIndex + 1);
        setCurrentBlankIndex((prev) => prev + 1);
      }
    } else {
      soundFX.playWrong();
      setShakeId(item.id);
      setTimeout(() => setShakeId(null), 500);
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setStatus('lost');
      }
    }
  };

  const handleReset = () => {
    setCurrentBlankIndex(0);
    setFilledIds([]);
    setUsedBankIds([]);
    setLives(3);
    setStatus('playing');
    setHintUsed(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/80 border border-white/10 rounded-2xl p-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Misión 01 // Desencriptar Palabras Clave
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            Toca la palabra exacta para el hueco iluminado ({filledIds.length}/{blanks.length})
          </h4>
        </div>

        <div className="flex items-center gap-4">
          {/* Lives */}
          <div className="flex items-center gap-1.5 bg-zinc-950/90 px-3 py-1.5 rounded-xl border border-white/10">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 transition-all duration-300 ${
                  heart <= lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-zinc-700 scale-75'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setHintUsed(true)}
            disabled={hintUsed || status !== 'playing'}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-40 transition"
            title="Ver la primera letra de la palabra actual"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Pista
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition"
            title="Reiniciar juego"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verse Interactive Display */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/80 border border-white/10 leading-relaxed text-lg sm:text-xl font-medium select-none">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3">
          {parsedTokens.map((token) => {
            if (!token.isBlank) {
              return (
                <span key={token.id} className="text-zinc-300">
                  {token.raw}
                </span>
              );
            }

            const isFilled = filledIds.includes(token.id);
            const isCurrentTarget = targetBlank && targetBlank.id === token.id && status === 'playing';

            return (
              <span key={token.id} className="inline-flex items-baseline">
                {token.prefix && <span className="text-zinc-400">{token.prefix}</span>}
                <motion.span
                  layout
                  initial={{ scale: 0.95 }}
                  animate={{
                    scale: isCurrentTarget ? 1.05 : 1,
                  }}
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-xl font-mono text-sm sm:text-base transition-all duration-300 mx-0.5 ${
                    isFilled
                      ? `${theme.wordHighlight} border font-bold`
                      : isCurrentTarget
                      ? `bg-white/10 ${theme.activeBorder} border-2 text-white shadow-[0_0_20px_rgba(255,255,255,0.12)]`
                      : 'bg-zinc-900 border border-dashed border-zinc-700 text-zinc-600'
                  }`}
                >
                  {isFilled ? (
                    token.coreWord
                  ) : isCurrentTarget ? (
                    <span className="flex items-center gap-1 text-xs sm:text-sm tracking-widest">
                      {hintUsed ? (
                        <span className={theme.accentText}>
                          {token.coreWord.slice(0, 2)}...
                        </span>
                      ) : (
                        '⚡ ELEGIR'
                      )}
                    </span>
                  ) : (
                    '••••••'
                  )}
                </motion.span>
                {token.suffix && <span className="text-zinc-400">{token.suffix}</span>}
              </span>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>CITA: {verse.referencia}</span>
          <span>CATEGORÍA: {verse.categoria.toUpperCase()}</span>
        </div>
      </div>

      {/* Word Bank or Result State */}
      <AnimatePresence mode="wait">
        {status === 'playing' && (
          <motion.div
            key="bank"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Banco de Datos (Cuidado con las palabras señuelo):
            </p>
            <div className="flex flex-wrap gap-2.5">
              {wordBank.map((item) => {
                const isUsed = usedBankIds.includes(item.id);
                const isShaking = shakeId === item.id;

                return (
                  <motion.button
                    key={item.id}
                    disabled={isUsed}
                    whileHover={!isUsed ? { scale: 1.04, y: -2 } : {}}
                    whileTap={!isUsed ? { scale: 0.95 } : {}}
                    animate={
                      isShaking
                        ? { x: [-6, 6, -6, 6, 0], backgroundColor: 'rgba(244, 63, 94, 0.25)' }
                        : {}
                    }
                    onClick={() => handleSelectWord(item)}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm sm:text-base transition-all ${
                      isUsed
                        ? 'bg-zinc-900/40 text-zinc-700 border border-zinc-800/40 cursor-not-allowed line-through'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-white/10 hover:border-white/30 shadow-md'
                    }`}
                  >
                    {item.word}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {status === 'won' && (
          <motion.div
            key="won"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h5 className="text-lg font-bold text-white flex items-center gap-2">
                  ¡Código Desencriptado! <Sparkles className="w-4 h-4 text-amber-400" />
                </h5>
                <p className="text-sm text-zinc-300">
                  Has dominado todas las palabras clave de {verse.referencia}. (+{180 + lives * 25} XP)
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm hover:bg-emerald-400 transition"
            >
              Jugar otra vez
            </button>
          </motion.div>
        )}

        {status === 'lost' && (
          <motion.div
            key="lost"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h5 className="text-lg font-bold text-white">Sin escudos disponibles</h5>
                <p className="text-sm text-zinc-300">
                  Lee el versículo con calma y vuelve a intentarlo para fijarlo en tu mente.
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-400 transition"
            >
              Reintentar Misión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
