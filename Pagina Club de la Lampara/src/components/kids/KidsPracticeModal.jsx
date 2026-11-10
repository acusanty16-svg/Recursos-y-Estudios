import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  Sparkles,
  Star,
  RotateCcw,
  Eye,
  Compass,
  BookOpen,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { useMemorizationEngine } from '../../hooks/useMemorizationEngine.js';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import KidsIllustrations from './KidsIllustrations.jsx';
import { speakText, stopSpeaking } from '../../utils/motionConfig.js';

export default function KidsPracticeModal({ verse, onClose }) {
  const { isVerseLearned, markVerseAsLearned, toggleLearnedVerse } = useClubLamp();
  const {
    step,
    tokens,
    revealedSet,
    currentTargetIndex,
    wordBankOptions,
    wrongAttemptWord,
    isStepCompleted,
    stepProgressPercentage,
    changeStep,
    revealSingleToken,
    revealAll,
    resetCurrentStep,
    selectWordFromBank,
  } = useMemorizationEngine(verse);

  if (!verse) return null;

  const learned = isVerseLearned(verse.id);

  const handleClose = () => {
    stopSpeaking();
    onClose();
  };

  const handleCompleteVictory = () => {
    markVerseAsLearned(verse.id);
    speakText('¡Excelente trabajo! Has encendido la estrella de este versículo.');
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-amber-50 rounded-t-[2.25rem] sm:rounded-[2.25rem] border-4 border-amber-300 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        >
          {/* Cabecera colorida del Modal Infantil */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 px-5 py-4 flex items-center justify-between gap-3 border-b-4 border-amber-500/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-sm shrink-0">
                <KidsIllustrations scene={verse.escenaIlustracion} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-kids font-bold text-xs">
                    Nivel {verse.nivel} · #{verse.orden}
                  </span>
                  <span className="font-kids font-bold text-xs sm:text-sm text-amber-950 truncate">
                    {verse.referencia}
                  </span>
                </div>
                <h2 className="font-kids text-lg sm:text-2xl font-bold text-slate-950 truncate">
                  {verse.titulo}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-sm shrink-0"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo desplazable */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            {/* SECCIÓN 1: Historia Bíblica y Misión del Día para Niños */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="md:col-span-2 bg-white rounded-3xl p-4 border-2 border-sky-200 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 font-kids font-bold text-xs sm:text-sm text-sky-800">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    Historia: {verse.personajeBiblico || verse.titulo}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakText(verse.historiaInfantil)}
                    className="px-2.5 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-kids font-bold text-xs flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Oír historia</span>
                  </button>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {verse.historiaInfantil}
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-4 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 font-kids font-bold text-xs sm:text-sm text-emerald-900 mb-1.5">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    Tu Misión de Luz Hoy
                  </span>
                  <p className="text-emerald-950/90 text-xs sm:text-sm font-medium leading-relaxed">
                    {verse.misionInfantil || 'Comparte este versículo con alegría en tu casa.'}
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Metodología Infantil en 3 Pasos */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-kids font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Metodología en 3 Pasos: ¡Aprende jugando!</span>
                </span>

                <button
                  type="button"
                  onClick={() => speakText(`${verse.referencia}. ${verse.texto}`, 0.88)}
                  className="px-3.5 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-kids font-bold text-xs sm:text-sm flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>Escuchar Versículo</span>
                </button>
              </div>

              {/* Botones de los 3 pasos */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 1, title: '1. Lee y Escucha', subtitle: 'Palabras brillantes' },
                  { id: 2, title: '2. Atrapa Palabras', subtitle: 'Completa huecos' },
                  { id: 3, title: '3. Súper Guardián', subtitle: 'Gran desafío' },
                ].map((s) => {
                  const active = step === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => changeStep(s.id)}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 border-b-4 text-left transition-all ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-800 shadow-sm'
                          : 'bg-stone-50 text-slate-700 border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <p className="font-kids font-bold text-xs sm:text-sm">{s.title}</p>
                      <p
                        className={`text-[11px] hidden sm:block ${
                          active ? 'text-indigo-200' : 'text-slate-500'
                        }`}
                      >
                        {s.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Tablero del Versículo Interactivo */}
              <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-amber-50/80 to-orange-50/40 border-2 border-amber-200/80 min-h-[130px] flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5 text-lg sm:text-2xl font-kids leading-relaxed">
                  {tokens.map((t) => {
                    const isHiddenInStep =
                      step > 1 &&
                      ((step === 2 && t.isKeyword) ||
                        (step === 2 && !verse.palabrasClave?.length && t.isCandidateForStep2) ||
                        (step === 3 && t.isCandidateForStep3));

                    const isCurrentlyHidden = isHiddenInStep && !revealedSet.has(t.index);
                    const isNextSlot = currentTargetIndex === t.index;

                    if (!isCurrentlyHidden) {
                      return (
                        <motion.span
                          key={t.index}
                          layout
                          onClick={() => speakText(t.coreWord, 0.95)}
                          className={`inline-block cursor-pointer rounded-xl px-1.5 py-0.5 transition-colors ${
                            t.isKeyword
                              ? 'bg-amber-300/80 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-800 hover:bg-amber-200/50'
                          }`}
                          title="Toca para escuchar esta palabra"
                        >
                          {t.raw}
                        </motion.span>
                      );
                    }

                    return (
                      <motion.button
                        key={t.index}
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => revealSingleToken(t.index)}
                        title="Toca la burbuja de abajo o toca aquí para una pista"
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-2xl border-2 border-dashed font-kids font-bold text-sm sm:text-lg min-w-[76px] transition-all ${
                          isNextSlot
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-900 ring-4 ring-indigo-300/50 animate-pulse'
                            : 'bg-white/90 border-amber-400 text-amber-700'
                        }`}
                      >
                        {isNextSlot ? '¿Cuál va aquí?' : '•••'}
                      </motion.button>
                    );
                  })}
                </div>

                <p className="mt-4 font-kids font-bold text-right text-sm sm:text-base text-indigo-700">
                  — {verse.referencia}
                </p>
              </div>

              {/* Controles y Banco de Burbujas para Pasos 2 y 3 */}
              {step === 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600">
                    💡 <strong>Paso 1:</strong> Lee el versículo en voz alta fijándote en las palabras doradas. ¡Cuando estés listo, pasa al Paso 2!
                  </p>
                  <button
                    type="button"
                    onClick={() => changeStep(2)}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-kids font-bold text-sm shadow-sm"
                  >
                    ¡Pasar al Juego (Paso 2)! →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!isStepCompleted ? (
                    <div>
                      <div className="flex items-center justify-between text-xs sm:text-sm font-kids font-bold text-slate-700 mb-2">
                        <span>
                          👇 Toca la palabra que va en el hueco iluminado ({stepProgressPercentage}% completado):
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={resetCurrentStep}
                            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reiniciar</span>
                          </button>
                          <button
                            type="button"
                            onClick={revealAll}
                            className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver todas</span>
                          </button>
                        </div>
                      </div>

                      {/* Burbujas de palabras para tocar */}
                      <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-100">
                        {wordBankOptions.map((option) => {
                          const isWrong = wrongAttemptWord === option.tokenIndex;
                          return (
                            <motion.button
                              key={option.tokenIndex}
                              type="button"
                              disabled={option.isUsed}
                              animate={
                                isWrong
                                  ? { x: [-6, 6, -5, 5, 0] }
                                  : { x: 0 }
                              }
                              whileHover={option.isUsed ? {} : { scale: 1.06, y: -2 }}
                              whileTap={option.isUsed ? {} : { scale: 0.94 }}
                              onClick={() => selectWordFromBank(option)}
                              className={`px-4 py-2 rounded-2xl font-kids font-bold text-sm sm:text-base border-b-4 transition-all ${
                                option.isUsed
                                  ? 'bg-stone-200/70 text-stone-400 border-stone-300 scale-95 cursor-default line-through'
                                  : isWrong
                                  ? 'bg-rose-500 text-white border-rose-700'
                                  : 'bg-white hover:bg-amber-300 text-slate-900 border-indigo-200 shadow-sm'
                              }`}
                            >
                              {option.word}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Celebración al completar todos los huecos del paso */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                          <Trophy className="w-7 h-7 text-yellow-300" />
                        </div>
                        <div>
                          <h4 className="font-kids font-bold text-lg">
                            ¡Increíble! Completaste el Paso {step}
                          </h4>
                          <p className="text-xs sm:text-sm text-emerald-50">
                            {step === 2
                              ? '¿Te atreves con el Paso 3 (Súper Guardián) o ya lo tienes memorizado?'
                              : '¡Lo lograste como un verdadero Guardián de la Lámpara!'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {step === 2 && (
                          <button
                            type="button"
                            onClick={() => changeStep(3)}
                            className="px-4 py-2.5 rounded-2xl bg-white text-emerald-900 font-kids font-bold text-xs sm:text-sm shadow-sm"
                          >
                            Ir al Paso 3 →
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleCompleteVictory}
                          className="px-4 py-2.5 rounded-2xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-kids font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
                        >
                          <Star className="w-4 h-4 fill-slate-950" />
                          <span>¡Ganar Estrella!</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pie del modal infantil */}
          <div className="px-5 py-3.5 bg-white border-t-2 border-amber-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => toggleLearnedVerse(verse.id)}
              className={`px-4 py-2.5 rounded-2xl font-kids font-bold text-xs sm:text-sm flex items-center gap-2 border-2 transition-all ${
                learned
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200'
              }`}
            >
              {learned ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>¡Ya ganaste esta Estrella de Luz!</span>
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 text-amber-600" />
                  <span>Marcar versículo como aprendido</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-kids font-bold text-xs sm:text-sm"
            >
              Listo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
