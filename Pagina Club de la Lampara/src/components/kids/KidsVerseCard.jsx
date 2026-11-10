import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Volume2,
  Gamepad2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import KidsIllustrations from './KidsIllustrations.jsx';
import { speakText } from '../../utils/motionConfig.js';
import { useClubLamp } from '../../context/ClubLampContext.jsx';

export default function KidsVerseCard({ verse, variants }) {
  const { isVerseLearned, toggleLearnedVerse, setActiveVerseModal } = useClubLamp();
  const learned = isVerseLearned(verse.id);

  const handleSpeak = (e) => {
    e.stopPropagation();
    speakText(`${verse.titulo}. ${verse.referencia}. ${verse.texto}`);
  };

  const handleToggleStar = (e) => {
    e.stopPropagation();
    toggleLearnedVerse(verse.id);
  };

  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -6 }}
      onClick={() => setActiveVerseModal(verse)}
      className={`verse-card-auto cursor-pointer group relative rounded-[2rem] p-5 sm:p-6 border-2 border-b-[6px] transition-all flex flex-col justify-between ${
        learned
          ? 'bg-gradient-to-b from-amber-50/90 to-white border-amber-400 shadow-kids-card'
          : 'bg-white border-amber-200/90 hover:border-amber-400 shadow-kids-card'
      }`}
    >
      <div>
        {/* Fila superior: Número de misión, Nivel, Categoría y Estrella de Luz */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 font-kids font-bold text-sm flex items-center justify-center shadow-sm">
              #{verse.orden}
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-kids font-bold text-xs">
              Nivel {verse.nivel}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-kids font-semibold text-xs">
              {verse.categoria}
            </span>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            onClick={handleToggleStar}
            title={learned ? '¡Versículo iluminado! Toca para desmarcar' : 'Marcar como aprendido'}
            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-colors ${
              learned
                ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md'
                : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-amber-500 hover:border-amber-300'
            }`}
          >
            <Star className={`w-5 h-5 ${learned ? 'fill-slate-950' : ''}`} />
          </motion.button>
        </div>

        {/* Cabecera ilustrada con el personaje bíblico */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 via-orange-50/70 to-sky-50 p-3.5 rounded-2xl border border-amber-200/60 mb-4">
          <KidsIllustrations scene={verse.escenaIlustracion} className="w-14 h-14 shrink-0" />
          <div className="min-w-0">
            {verse.personajeBiblico && (
              <p className="text-xs font-kids font-bold text-amber-800 flex items-center gap-1 truncate">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{verse.personajeBiblico}</span>
              </p>
            )}
            <h3 className="font-kids text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {verse.titulo}
            </h3>
            <p className="font-kids font-bold text-xs sm:text-sm text-indigo-600">
              {verse.referencia}
            </p>
          </div>
        </div>

        {/* Texto del versículo */}
        <blockquote className="font-kids text-base sm:text-lg font-medium text-slate-800 leading-relaxed mb-4 bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100">
          «{verse.texto}»
        </blockquote>

        {/* Avance de la historia bíblica infantil */}
        {verse.historiaInfantil && (
          <div className="mb-5 px-3.5 py-2.5 rounded-2xl bg-sky-50/80 border border-sky-200/70 text-xs sm:text-sm text-sky-950">
            <p className="font-kids font-bold text-sky-800 flex items-center gap-1.5 mb-0.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Historia Bíblica:</span>
            </p>
            <p className="line-clamp-2 text-slate-700 leading-relaxed">
              {verse.historiaInfantil}
            </p>
          </div>
        )}
      </div>

      {/* Botones de acción infantiles */}
      <div className="flex items-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleSpeak}
          title="Escuchar el versículo en voz alta"
          className="px-3.5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-kids font-bold text-xs sm:text-sm flex items-center gap-1.5 border-b-4 border-amber-300 active:translate-y-0.5 transition-all"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>Escuchar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveVerseModal(verse)}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-kids font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 border-indigo-800 active:translate-y-0.5 transition-all shadow-sm"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>¡Historia y Juego!</span>
        </button>
      </div>
    </motion.article>
  );
}
