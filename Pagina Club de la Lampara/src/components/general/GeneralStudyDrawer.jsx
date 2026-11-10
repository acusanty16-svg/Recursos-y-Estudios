import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Volume2,
  RotateCcw,
  Eye,
  CheckCircle2,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useMemorizationEngine } from '../../hooks/useMemorizationEngine.js';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import { speakText, stopSpeaking } from '../../utils/motionConfig.js';

export default function GeneralStudyDrawer({ verse, onClose }) {
  const { isVerseLearned, toggleLearnedVerse } = useClubLamp();
  const {
    step,
    tokens,
    revealedSet,
    currentTargetIndex,
    stepProgressPercentage,
    changeStep,
    revealSingleToken,
    revealNextPending,
    revealAll,
    resetCurrentStep,
  } = useMemorizationEngine(verse);

  // Modo exclusivo para adultos/jóvenes: mostrar iniciales de las palabras ocultas
  const [showInitialsHint, setShowInitialsHint] = useState(false);

  if (!verse) return null;

  const learned = isVerseLearned(verse.id);

  const handleClose = () => {
    stopSpeaking();
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-parchment-50 rounded-3xl border border-stone-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Cabecera Editorial */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-1">
                <span>Nivel {verse.nivel}</span>
                <span>•</span>
                <span>Versículo #{String(verse.orden).padStart(2, '0')}</span>
                <span>•</span>
                <span>{verse.categoria}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                {verse.titulo} — <span className="text-amber-300">{verse.referencia}</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              aria-label="Cerrar panel de estudio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido de Estudio y Laboratorio */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Contexto Bíblico y Teológico */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  Contexto y Enseñanza Bíblica
                </span>
                <button
                  type="button"
                  onClick={() => speakText(`${verse.referencia}. ${verse.texto}`, 0.95)}
                  className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Escuchar lectura</span>
                </button>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                {verse.contexto}
              </p>
            </div>

            {/* Selector de Grado de Retención Activa */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Laboratorio de Retención Activa</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Selecciona un grado de ocultación y haz clic sobre cada término para verificar tu memoria.
                  </p>
                </div>

                {/* Conmutador de Técnica de Iniciales */}
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowInitialsHint((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                      showInitialsHint
                        ? 'bg-amber-100 border-amber-400 text-amber-950'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{showInitialsHint ? 'Iniciales activas' : 'Mostrar iniciales'}</span>
                  </button>
                )}
              </div>

              {/* Pestañas de nivel de ocultación */}
              <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-stone-100 border border-stone-200">
                {[
                  { id: 1, label: '1. Lectura Analítica' },
                  { id: 2, label: '2. Ocultación Clave (40%)' },
                  { id: 3, label: '3. Retención Total (75%)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => changeStep(tab.id)}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      step === tab.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Lienzo Tipográfico del Versículo */}
              <div className="p-6 sm:p-8 rounded-2xl bg-parchment-50 border border-stone-200/90 min-h-[150px] flex flex-col justify-center">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 font-serif text-xl sm:text-2xl text-slate-900 leading-relaxed">
                  {tokens.map((t) => {
                    const isHiddenInStep =
                      step > 1 &&
                      ((step === 2 && t.isKeyword) ||
                        (step === 2 && !verse.palabrasClave?.length && t.isCandidateForStep2) ||
                        (step === 3 && t.isCandidateForStep3));

                    const isCurrentlyHidden = isHiddenInStep && !revealedSet.has(t.index);
                    const isNext = currentTargetIndex === t.index;

                    if (!isCurrentlyHidden) {
                      return (
                        <span
                          key={t.index}
                          className={`inline-block rounded px-1 transition-colors ${
                            t.isKeyword
                              ? 'bg-amber-200/60 text-slate-950 font-medium'
                              : 'text-slate-800'
                          }`}
                        >
                          {t.raw}
                        </span>
                      );
                    }

                    return (
                      <button
                        key={t.index}
                        type="button"
                        onClick={() => revealSingleToken(t.index)}
                        title="Haz clic para revelar esta palabra"
                        className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg border-b-2 font-sans text-sm sm:text-base font-medium min-w-[68px] transition-all ${
                          isNext
                            ? 'bg-amber-100/90 border-amber-600 text-amber-950'
                            : 'bg-white border-stone-300 text-stone-500 hover:border-amber-500'
                        }`}
                      >
                        {showInitialsHint ? t.initial : '•••••'}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-5 text-right font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-800">
                  — {verse.referencia}
                </p>
              </div>

              {/* Barra de herramientas de autoevaluación */}
              {step > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs font-medium text-stone-500">
                    Progreso de revelación: <strong>{stepProgressPercentage}%</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={revealNextPending}
                      disabled={currentTargetIndex === null}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-semibold transition-colors"
                    >
                      Revelar siguiente palabra
                    </button>
                    <button
                      type="button"
                      onClick={revealAll}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Mostrar todo</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetCurrentStep}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reiniciar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pie del modal general */}
          <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => toggleLearnedVerse(verse.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-colors ${
                learned
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-100 border-stone-300 text-slate-800 hover:bg-stone-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {learned ? 'Marcado como versículo dominado' : 'Marcar como versículo dominado'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
