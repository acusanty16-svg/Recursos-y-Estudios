import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  X,
  Trophy,
  User,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/soundEffects';

export default function VersusModal({ versiculos, activeLevelId, onClose, onAwardXp }) {
  const [stage, setStage] = useState('setup'); // 'setup' | 'battle' | 'winner'
  const [player1, setPlayer1] = useState('Jugador 1');
  const [player2, setPlayer2] = useState('Jugador 2');
  const totalRounds = 6; // 3 turnos por persona

  // Battle state
  const [roundIndex, setRoundIndex] = useState(0);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [battleSeed, setBattleSeed] = useState(0);

  const isTurnPlayer1 = roundIndex % 2 === 0;
  const activePlayerName = isTurnPlayer1
    ? player1.trim() || 'Jugador 1'
    : player2.trim() || 'Jugador 2';

  // Generate 1v1 questions from current level (or all verses as fallback)
  const questions = useMemo(() => {
    const pool = versiculos.filter((v) => v.nivel === activeLevelId);
    const safePool = pool.length >= 4 ? pool : versiculos;

    const built = [];
    for (let i = 0; i < totalRounds; i++) {
      const target = safePool[Math.floor(Math.random() * safePool.length)];
      const isKeywordChallenge = i % 2 === 0 && (target.palabrasClave || []).length > 0;

      if (isKeywordChallenge) {
        const keyWord =
          target.palabrasClave[Math.floor(Math.random() * target.palabrasClave.length)];
        const decoyWords = ['camino', 'verdad', 'corazón', 'gloria', 'fuerza', 'espíritu', 'mundo', 'cielo']
          .filter((w) => w.toLowerCase() !== keyWord.toLowerCase())
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options = [keyWord, ...decoyWords].sort(() => Math.random() - 0.5);
        const maskedText = target.texto.replace(
          new RegExp(keyWord, 'i'),
          ' [ ¿ ______ ? ] '
        );

        built.push({
          id: i,
          promptLabel: `COMPLETA LA PALABRA CLAVE (${target.referencia})`,
          promptText: maskedText,
          correct: keyWord,
          options,
        });
      } else {
        const distractors = versiculos
          .filter((v) => v.referencia !== target.referencia)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => v.referencia);

        const options = [target.referencia, ...distractors].sort(
          () => Math.random() - 0.5
        );

        built.push({
          id: i,
          promptLabel: 'ACIERTA LA CITA BÍBLICA EXACTA',
          promptText: `“${target.texto}”`,
          correct: target.referencia,
          options,
        });
      }
    }
    return built;
  }, [versiculos, activeLevelId, totalRounds, battleSeed]);

  const currentQ = questions[roundIndex];

  useEffect(() => {
    if (stage !== 'battle' || selectedAnswer !== null) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 2) {
          handleAnswer('__TIMEOUT__');
          return 0;
        }
        return prev - 1.6;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [stage, roundIndex, selectedAnswer]);

  const startBattle = () => {
    soundFX.playClick();
    setBattleSeed((s) => s + 1);
    setRoundIndex(0);
    setScore1(0);
    setScore2(0);
    setSelectedAnswer(null);
    setTimeLeft(100);
    setStage('battle');
  };

  const handleAnswer = (option) => {
    if (selectedAnswer !== null || stage !== 'battle') return;
    setSelectedAnswer(option);

    const isCorrect = option === currentQ.correct;
    const points = isCorrect ? 100 + Math.round(timeLeft) : 0;

    if (isCorrect) {
      soundFX.playCorrect(2);
      if (isTurnPlayer1) setScore1((s) => s + points);
      else setScore2((s) => s + points);
    } else {
      soundFX.playWrong();
    }

    setTimeout(() => {
      if (roundIndex + 1 >= totalRounds) {
        setStage('winner');
        soundFX.playWin();
        if (onAwardXp) onAwardXp(200);
        try {
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      } else {
        setRoundIndex((r) => r + 1);
        setSelectedAnswer(null);
        setTimeLeft(100);
      }
    }, 1000);
  };

  const name1 = player1.trim() || 'Jugador 1';
  const name2 = player2.trim() || 'Jugador 2';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-3xl bg-[#0B0D14] border border-white/15 shadow-2xl overflow-hidden my-auto"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 block">
                  MODO DUELO // 1 CONTRA 1
                </span>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-white">
                  Duelo entre 2 Personas
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {stage === 'setup' && (
              <div className="space-y-6">
                <p className="text-sm text-zinc-300">
                  Escribe el nombre de las dos personas que van a competir. Tendréis 3 turnos cada uno para demostrar quién domina mejor los versículos del Nivel 0{activeLevelId}.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
                    <label className="text-xs font-mono uppercase text-sky-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Persona 1
                    </label>
                    <input
                      type="text"
                      value={player1}
                      onChange={(e) => setPlayer1(e.target.value)}
                      placeholder="Nombre del Jugador 1"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white font-bold focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <label className="text-xs font-mono uppercase text-amber-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Persona 2
                    </label>
                    <input
                      type="text"
                      value={player2}
                      onChange={(e) => setPlayer2(e.target.value)}
                      placeholder="Nombre del Jugador 2"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  onClick={startBattle}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 text-zinc-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>¡Empezar Duelo ({name1} vs {name2})!</span>
                </button>
              </div>
            )}

            {stage === 'battle' && currentQ && (
              <div className="space-y-6">
                {/* 2-Player Scoreboard */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isTurnPlayer1
                        ? 'bg-sky-500/20 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.2)]'
                        : 'bg-zinc-900/50 border-white/10 opacity-60'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase text-sky-300 block">
                        {isTurnPlayer1 ? '⚡ TU TURNO' : 'ESPERANDO'}
                      </span>
                      <span className="text-base font-extrabold text-white">{name1}</span>
                    </div>
                    <span className="text-2xl font-mono font-extrabold text-sky-400">
                      {score1}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      !isTurnPlayer1
                        ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                        : 'bg-zinc-900/50 border-white/10 opacity-60'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-300 block">
                        {!isTurnPlayer1 ? '⚡ TU TURNO' : 'ESPERANDO'}
                      </span>
                      <span className="text-base font-extrabold text-white">{name2}</span>
                    </div>
                    <span className="text-2xl font-mono font-extrabold text-amber-400">
                      {score2}
                    </span>
                  </div>
                </div>

                {/* Timer bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>
                      RONDA {roundIndex + 1} DE {totalRounds}
                    </span>
                    <span className="text-white font-bold">
                      Turno de: {activePlayerName}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-100 ${
                        isTurnPlayer1 ? 'bg-sky-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${timeLeft}%` }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    {currentQ.promptLabel}
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                    {currentQ.promptText}
                  </p>
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt) => {
                    const isRight = opt === currentQ.correct;
                    const isPicked = selectedAnswer === opt;
                    let cls =
                      'bg-zinc-900 hover:bg-zinc-800 border-white/10 text-white';
                    if (selectedAnswer !== null) {
                      if (isRight) cls = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
                      else if (isPicked) cls = 'bg-rose-500/25 border-rose-400 text-rose-200';
                      else cls = 'bg-zinc-900/40 border-white/5 text-zinc-600';
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className={`p-4 rounded-xl border font-mono text-base font-bold flex items-center justify-between transition ${cls}`}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && isRight && (
                          <Check className="w-5 h-5 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {stage === 'winner' && (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mx-auto">
                  <Trophy className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    GANADOR DEL DUELO 1 VS 1
                  </span>
                  <h4 className="text-3xl font-display font-extrabold text-white">
                    {score1 > score2
                      ? `¡Gana ${name1}!`
                      : score2 > score1
                      ? `¡Gana ${name2}!`
                      : '¡Empate entre ambos!'}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10">
                    <span className="text-xs font-mono text-sky-400 block">{name1}</span>
                    <span className="text-2xl font-mono font-extrabold text-white">
                      {score1} pts
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10">
                    <span className="text-xs font-mono text-amber-400 block">{name2}</span>
                    <span className="text-2xl font-mono font-extrabold text-white">
                      {score2} pts
                    </span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={startBattle}
                    className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Jugar Revancha
                  </button>
                  <button
                    onClick={() => setStage('setup')}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/15 transition"
                  >
                    Cambiar Nombres
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
