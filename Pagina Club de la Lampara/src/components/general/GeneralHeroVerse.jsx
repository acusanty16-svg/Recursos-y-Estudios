import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import { speakText } from '../../utils/motionConfig.js';

export default function GeneralHeroVerse() {
  const {
    nextRecommendedVerse,
    currentLevelMeta,
    setActiveVerseModal,
    isVerseLearned,
    toggleLearnedVerse,
  } = useClubLamp();

  if (!nextRecommendedVerse) return null;

  const learned = isVerseLearned(nextRecommendedVerse.id);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden border border-slate-800"
    >
      {/* Luz ambiental sutil */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-amber-300/90">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30">
              Lectura Enfocada · Nivel {nextRecommendedVerse.nivel}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">{nextRecommendedVerse.categoria}</span>
            {currentLevelMeta && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 normal-case font-normal">
                  {currentLevelMeta.subtituloGeneral}
                </span>
              </>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-amber-400 mb-1">
              {nextRecommendedVerse.titulo} — {nextRecommendedVerse.referencia}
            </p>
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-parchment-50 leading-snug">
              «{nextRecommendedVerse.texto}»
            </blockquote>
          </div>

          {nextRecommendedVerse.contexto && (
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed border-l-2 border-amber-500/50 pl-4">
              {nextRecommendedVerse.contexto}
            </p>
          )}
        </div>

        {/* Acciones del versículo destacado */}
        <div className="flex flex-row lg:flex-col items-stretch gap-2.5 shrink-0 lg:w-56">
          <button
            type="button"
            onClick={() => setActiveVerseModal(nextRecommendedVerse)}
            className="flex-1 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practicar Retención</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                speakText(
                  `${nextRecommendedVerse.referencia}. ${nextRecommendedVerse.texto}`,
                  0.95
                )
              }
              title="Escuchar lectura"
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Audio</span>
            </button>

            <button
              type="button"
              onClick={() => toggleLearnedVerse(nextRecommendedVerse.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-colors ${
                learned
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{learned ? 'Dominado' : 'Marcar'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
