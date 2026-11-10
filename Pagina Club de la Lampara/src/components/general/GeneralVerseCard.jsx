import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  BookOpen,
  Volume2,
  ArrowUpRight,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import { speakText } from '../../utils/motionConfig.js';

export default function GeneralVerseCard({ verse, variants, compact = false }) {
  const { isVerseLearned, toggleLearnedVerse, setActiveVerseModal } = useClubLamp();
  const learned = isVerseLearned(verse.id);

  const handleAudio = (e) => {
    e.stopPropagation();
    speakText(`${verse.referencia}. ${verse.texto}`, 0.95);
  };

  const handleToggleMastery = (e) => {
    e.stopPropagation();
    toggleLearnedVerse(verse.id);
  };

  if (compact) {
    return (
      <motion.article
        variants={variants}
        onClick={() => setActiveVerseModal(verse)}
        className={`verse-card-auto cursor-pointer group rounded-2xl p-4 sm:px-6 bg-white border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          learned
            ? 'border-emerald-300/90 bg-emerald-50/15'
            : 'border-stone-200/90 hover:border-amber-500/60 shadow-general-card'
        }`}
      >
        <div className="space-y-1 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-semibold text-stone-400">
              #{String(verse.orden).padStart(2, '0')}
            </span>
            <span className="font-semibold text-amber-800">{verse.referencia}</span>
            <span className="text-stone-300">•</span>
            <span className="font-medium text-slate-800">{verse.titulo}</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
              Nivel {verse.nivel} · {verse.categoria}
            </span>
          </div>
          <p className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed">
            «{verse.texto}»
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleToggleMastery}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              learned
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{learned ? 'Dominado' : 'Marcar'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveVerseModal(verse)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium flex items-center gap-1"
          >
            <span>Estudiar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -4 }}
      onClick={() => setActiveVerseModal(verse)}
      className={`verse-card-auto cursor-pointer group rounded-2xl p-6 bg-white border transition-all flex flex-col justify-between ${
        learned
          ? 'border-emerald-400/80 shadow-general-card'
          : 'border-stone-200/90 hover:border-amber-500/70 shadow-general-card hover:shadow-xl'
      }`}
    >
      <div>
        {/* Meta cabecera */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600">
              #{String(verse.orden).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60">
              Nivel {verse.nivel}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
              {verse.categoria}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleMastery}
            title={learned ? 'Versículo dominado' : 'Marcar como dominado'}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
              learned
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-emerald-700 hover:border-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>

        {/* Título y Referencia Bíblica */}
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-0.5">
            {verse.referencia}
          </p>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
            {verse.titulo}
          </h3>
        </div>

        {/* Cita Bíblica con tipografía Serif Editorial */}
        <blockquote className="font-serif text-lg sm:text-xl text-slate-800 leading-relaxed mb-4 pb-4 border-b border-stone-100">
          «{verse.texto}»
        </blockquote>

        {/* Nota de Contexto Bíblico */}
        {verse.contexto && (
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5 line-clamp-3">
            {verse.contexto}
          </p>
        )}
      </div>

      {/* Pie de acciones */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={handleAudio}
          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Escuchar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveVerseModal(verse)}
          className="px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-amber-600 text-white group-hover:text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Laboratorio de Estudio</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.article>
  );
}
