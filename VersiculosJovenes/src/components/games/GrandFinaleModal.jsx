import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, Download, RotateCcw, Trophy, X } from 'lucide-react';
import { cleanWord } from '../../utils/themeConfig';
import { soundFX } from '../../utils/soundEffects';

function buildBlanksForVerse(texto, mode, seed) {
  const words = texto.split(/\s+/).filter(Boolean);
  const step = mode === 'finale' ? 2 : 3;
  return words.map((raw, idx) => {
    const match = raw.match(/^([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*)(.*?)([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*)$/);
    const prefix = match ? match[1] : '';
    const core = match ? match[2] : raw;
    const suffix = match ? match[3] : '';
    const cleaned = cleanWord(core);
    const eligible = cleaned.length >= 3 && !/^\d+$/.test(cleaned);
    const isBlank = eligible && (idx + seed) % step === 1;
    return { id: idx, prefix, core, suffix, cleaned, isBlank };
  });
}

function drawCertificate(canvas, name, score, references) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = 1200;
  const h = 800;
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = '#05070B';
  ctx.fillRect(0, 0, w, h);

  const cyanGlow = ctx.createRadialGradient(130, 110, 20, 130, 110, 580);
  cyanGlow.addColorStop(0, 'rgba(34, 211, 238, 0.25)');
  cyanGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = cyanGlow;
  ctx.fillRect(0, 0, w, h);

  const coralGlow = ctx.createRadialGradient(w - 130, h - 110, 20, w - 130, h - 110, 580);
  coralGlow.addColorStop(0, 'rgba(255, 93, 108, 0.25)');
  coralGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = coralGlow;
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#22D3EE');
  grad.addColorStop(1, '#FF5D6C');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, w - 72, h - 72);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(54, 54, w - 108, h - 108);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#22D3EE';
  ctx.font = '800 44px system-ui, -apple-system, sans-serif';
  ctx.fillText('DESAFÍO 119:9', w / 2, 134);

  ctx.fillStyle = '#FF5D6C';
  ctx.font = '700 22px system-ui, -apple-system, sans-serif';
  ctx.fillText('GRAN FINAL · 19 DE DICIEMBRE · RECONOCIMIENTO', w / 2, 178);

  ctx.fillStyle = 'rgba(248, 250, 252, 0.72)';
  ctx.font = '500 22px system-ui, -apple-system, sans-serif';
  ctx.fillText('Se otorga este reconocimiento a', w / 2, 265);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 54px Georgia, serif';
  ctx.fillText(name.trim() || 'Joven Desafío 119:9', w / 2, 340);

  ctx.fillStyle = grad;
  ctx.fillRect(w / 2 - 220, 368, 440, 3);

  ctx.fillStyle = 'rgba(226, 232, 240, 0.92)';
  ctx.font = '400 24px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `Por haber demostrado lo guardado en su corazón con ${score}% de precisión.`,
    w / 2,
    432
  );

  ctx.fillStyle = '#22D3EE';
  ctx.font = '600 21px ui-monospace, SFMono-Regular, monospace';
  ctx.fillText(references.join('   ·   '), w / 2, 508);

  ctx.fillStyle = 'rgba(248, 250, 252, 0.86)';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('“¡Es hora de demostrar lo que has guardado en tu corazón!”', w / 2, 610);

  ctx.fillStyle = '#FF5D6C';
  ctx.font = '700 18px system-ui, -apple-system, sans-serif';
  ctx.fillText('— SALMOS 119:9 —', w / 2, 650);
}

export default function GrandFinaleModal({
  mode = 'grace',
  verses = [],
  playerName = '',
  onChangePlayerName,
  onClose,
  onComplete,
}) {
  const [step, setStep] = useState(0);
  const [seed, setSeed] = useState(1);
  const [answersByStep, setAnswersByStep] = useState({});
  const [checkedCurrent, setCheckedCurrent] = useState(false);
  const [scoresByStep, setScoresByStep] = useState({});
  const [finished, setFinished] = useState(false);
  const [certName, setCertName] = useState(playerName || '');
  const canvasRef = useRef(null);

  const currentVerse = verses[step];
  const tokens = useMemo(
    () => (currentVerse ? buildBlanksForVerse(currentVerse.texto, mode, seed + step) : []),
    [currentVerse, mode, seed, step]
  );

  const currentAnswers = answersByStep[step] || {};

  const computeCurrentScore = () => {
    const blanks = tokens.filter((t) => t.isBlank);
    if (blanks.length === 0) return 100;
    let hits = 0;
    for (const t of blanks) {
      if (cleanWord(currentAnswers[t.id] || '') === t.cleaned) hits += 1;
    }
    return Math.round((hits / blanks.length) * 100);
  };

  const averageScore = useMemo(() => {
    const vals = Object.values(scoresByStep);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [scoresByStep]);

  const passedFinale = mode === 'finale' && averageScore >= 70;

  useEffect(() => {
    if (!finished || !passedFinale || !canvasRef.current) return;
    drawCertificate(
      canvasRef.current,
      certName,
      averageScore,
      verses.map((v) => v.referencia)
    );
  }, [finished, passedFinale, certName, averageScore, verses]);

  const handleAction = () => {
    const score = computeCurrentScore();
    const nextScores = { ...scoresByStep, [step]: score };
    setScoresByStep(nextScores);

    if (!checkedCurrent) {
      if (score >= 70) soundFX.playCorrect(step + 1);
      else soundFX.playWrong();
      setCheckedCurrent(true);
      return;
    }

    if (step < verses.length - 1) {
      setStep((s) => s + 1);
      setCheckedCurrent(false);
    } else {
      const avg = Math.round(
        Object.values(nextScores).reduce((a, b) => a + b, 0) / Math.max(1, verses.length)
      );
      setFinished(true);
      if (avg >= 70) soundFX.playWin();
      onComplete?.(avg, mode === 'finale');
    }
  };

  const handleRestart = () => {
    setStep(0);
    setSeed((s) => s + 1);
    setAnswersByStep({});
    setCheckedCurrent(false);
    setScoresByStep({});
    setFinished(false);
  };

  const handleDownloadCert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reconocimiento-desafio-119-9.png';
    a.click();
    soundFX.playWin();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl rounded-3xl bg-[#090C13] border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-white/10 bg-zinc-950/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  mode === 'finale'
                    ? 'bg-coral-400/15 border-coral-400/40 text-coral-400'
                    : 'bg-cyan-400/15 border-cyan-400/40 text-cyan-400'
                }`}
              >
                {mode === 'finale' ? <Award className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  {mode === 'finale' ? '19 DE DICIEMBRE' : 'SEMANA 5 · SEMANA DE GRACIA'}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {mode === 'finale'
                    ? 'Gran Final · Demuestra lo aprendido'
                    : '¡Prepárate para el Gran Final!'}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-coral-400/20 text-zinc-300 hover:text-coral-300 border border-white/10 transition"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
            {finished ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-cyan-400/30 bg-zinc-950/80 p-5 text-center space-y-3">
                  <div className="text-4xl font-display font-extrabold bg-gradient-to-r from-cyan-400 to-coral-400 bg-clip-text text-transparent">
                    {averageScore}%
                  </div>
                  <p className="text-sm text-zinc-200 max-w-md mx-auto">
                    {mode === 'finale'
                      ? passedFinale
                        ? '¡Felicidades! Demostraste lo que guardaste en tu corazón y desbloqueaste tu reconocimiento oficial.'
                        : 'Necesitas al menos 70% para desbloquear tu diploma oficial. ¡Repasa un poco más e inténtalo de nuevo!'
                      : '¡Completaste el repaso combinado de la Semana de Gracia! Ya estás listo para el 19 de diciembre.'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
                    {verses.map((v, idx) => (
                      <div
                        key={v.id}
                        className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs"
                      >
                        <p className="font-bold text-white truncate">{v.referencia}</p>
                        <p className="font-mono text-cyan-400">{scoresByStep[idx] ?? 0}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                {passedFinale && (
                  <div className="space-y-3 rounded-2xl border border-coral-400/30 bg-zinc-900/60 p-4">
                    <label htmlFor="finale-cert-name" className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Nombre para tu reconocimiento oficial
                    </label>
                    <input
                      id="finale-cert-name"
                      type="text"
                      value={certName}
                      onChange={(e) => {
                        setCertName(e.target.value);
                        onChangePlayerName?.(e.target.value);
                      }}
                      placeholder="Escribe tu nombre completo..."
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/15 text-white font-bold focus:outline-none focus:border-cyan-400"
                    />
                    <canvas
                      ref={canvasRef}
                      className="w-full rounded-xl border border-white/15 shadow-2xl"
                    />
                    <button
                      onClick={handleDownloadCert}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-coral-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Reconocimiento PNG
                    </button>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-zinc-200 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Repetir
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 text-zinc-950 text-xs font-mono font-extrabold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Listo
                  </button>
                </div>
              </div>
            ) : currentVerse ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">
                    SEMANA {currentVerse.nivel} · {currentVerse.referencia}
                  </span>
                  <span className="text-zinc-400">
                    Versículo {step + 1} / {verses.length}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-zinc-950 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-coral-400 transition-all duration-300"
                    style={{ width: `${((step + (checkedCurrent ? 1 : 0.35)) / verses.length) * 100}%` }}
                  />
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/90 border border-white/10 text-lg sm:text-xl leading-loose text-zinc-100">
                  {tokens.map((t) =>
                    t.isBlank ? (
                      <span key={t.id} className="inline-flex items-baseline mx-1">
                        {t.prefix}
                        <input
                          type="text"
                          disabled={checkedCurrent}
                          value={currentAnswers[t.id] || ''}
                          onChange={(e) =>
                            setAnswersByStep((prev) => ({
                              ...prev,
                              [step]: { ...(prev[step] || {}), [t.id]: e.target.value },
                            }))
                          }
                          style={{ width: `${Math.max(t.cleaned.length + 2, 6)}ch` }}
                          className={`rounded-lg border px-2 py-0.5 text-center font-mono text-sm outline-none transition ${
                            !checkedCurrent
                              ? 'bg-zinc-900 border-cyan-400/50 text-white focus:border-cyan-400'
                              : cleanWord(currentAnswers[t.id] || '') === t.cleaned
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-coral-400/20 border-coral-400 text-coral-300'
                          }`}
                          aria-label={`Palabra ${t.id + 1}`}
                        />
                        {t.suffix}
                      </span>
                    ) : (
                      <span key={t.id} className="mr-1.5 inline-block">
                        {t.prefix}
                        {t.core}
                        {t.suffix}
                      </span>
                    )
                  )}
                </div>

                {checkedCurrent && (
                  <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/10 p-3.5 text-xs text-zinc-200 space-y-1">
                    <p className="font-mono font-bold text-cyan-300">
                      Precisión en {currentVerse.referencia}: {scoresByStep[step] ?? 0}%
                    </p>
                    {mode === 'grace' && <p className="text-zinc-300">“{currentVerse.texto}”</p>}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleAction}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-coral-400 text-zinc-950 font-extrabold text-xs sm:text-sm"
                  >
                    {!checkedCurrent
                      ? 'Comprobar pasaje'
                      : step < verses.length - 1
                        ? 'Siguiente versículo →'
                        : 'Finalizar y ver nota'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
