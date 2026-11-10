import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Layers,
  Compass,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import LampBrandIcon from '../shared/LampBrandIcon.jsx';
import ModeSwitcherPill from '../shared/ModeSwitcherPill.jsx';
import GeneralHeroVerse from './GeneralHeroVerse.jsx';
import GeneralFilterBar from './GeneralFilterBar.jsx';
import GeneralVerseCard from './GeneralVerseCard.jsx';
import GeneralStudyDrawer from './GeneralStudyDrawer.jsx';
import { getStaggerContainer, getGeneralCardVariants } from '../../utils/motionConfig.js';

export default function GeneralLayout() {
  const {
    levels,
    activeLevel,
    selectLevel,
    filteredVerses,
    learnedCount,
    totalCount,
    globalPercentage,
    activeVerseModal,
    setActiveVerseModal,
  } = useClubLamp();

  const [viewMode, setViewMode] = useState('grid');
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-parchment-50 text-slate-900 pb-20">
      {/* Cabecera Editorial Superior */}
      <header className="sticky top-0 z-30 bg-parchment-50/90 backdrop-blur-md border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LampBrandIcon variant="general" size="sm" glowing={false} />
            <div>
              <span className="font-serif font-semibold text-lg sm:text-xl text-slate-900 block leading-none">
                Club de la Lámpara
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Modo General · Estudio y Memorización Bíblica
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-slate-700">
              <Award className="w-4 h-4 text-amber-600" />
              <span>
                Dominio Global: {learnedCount}/{totalCount} ({globalPercentage}%)
              </span>
            </div>

            <ModeSwitcherPill variant="general" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Versículo Destacado en Estudio */}
        <GeneralHeroVerse />

        {/* Estructura de 2 Columnas en Escritorio: Índice de 6 Niveles + Área de Estudio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Barra lateral izquierda: Los 6 Niveles del Currículo */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 bg-white rounded-2xl border border-stone-200/90 p-4 shadow-general-card space-y-3">
            <div className="flex items-center justify-between px-1 pb-2 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-700" />
                Currículo (6 Niveles)
              </span>
              <button
                type="button"
                onClick={() => selectLevel(activeLevel === 'all' ? 1 : 'all')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{activeLevel === 'all' ? 'Por nivel' : 'Ver 60'}</span>
              </button>
            </div>

            {/* Lista de los 6 niveles */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 no-scrollbar">
              {levels.map((lvl) => {
                const isSelected = Number(activeLevel) === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => selectLevel(lvl.id)}
                    className={`w-56 lg:w-full shrink-0 text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-stone-50/70 hover:bg-stone-100/80 text-slate-800 border-stone-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isSelected ? 'text-amber-400' : 'text-amber-800'
                        }`}
                      >
                        Nivel {lvl.id}
                      </span>
                      <span
                        className={`text-xs font-medium flex items-center gap-1 ${
                          lvl.isCompleted
                            ? 'text-emerald-400'
                            : isSelected
                            ? 'text-slate-300'
                            : 'text-stone-500'
                        }`}
                      >
                        {lvl.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {lvl.completedCount}/{lvl.totalVersiculos}
                      </span>
                    </div>

                    <p className="font-serif font-semibold text-sm truncate mb-2">
                      {lvl.insignia}
                    </p>

                    <div className="w-full h-1.5 rounded-full bg-stone-200/40 overflow-hidden">
                      <div
                        style={{ width: `${lvl.percentage}%` }}
                        className={`h-full rounded-full transition-all ${
                          isSelected ? 'bg-amber-400' : 'bg-amber-600'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Columna Derecha Principal: Barra de filtros + Tarjetas de Versículos */}
          <div className="lg:col-span-9 space-y-6">
            <GeneralFilterBar viewMode={viewMode} setViewMode={setViewMode} />

            {filteredVerses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-semibold text-slate-900 mb-1">
                  Sin resultados para los filtros seleccionados
                </h3>
                <p className="text-stone-500 text-sm">
                  Intenta limpiar el término de búsqueda o cambiar de categoría temática.
                </p>
              </div>
            ) : (
              <motion.div
                key={`${activeLevel}-${viewMode}-${filteredVerses.length}`}
                variants={getStaggerContainer(0.04, shouldReduceMotion)}
                initial="hidden"
                animate="show"
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                    : 'space-y-3'
                }
              >
                {filteredVerses.map((verse) => (
                  <GeneralVerseCard
                    key={verse.id}
                    verse={verse}
                    compact={viewMode === 'list'}
                    variants={getGeneralCardVariants(shouldReduceMotion)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Laboratorio de Estudio y Retención Activa */}
      {activeVerseModal && (
        <GeneralStudyDrawer
          verse={activeVerseModal}
          onClose={() => setActiveVerseModal(null)}
        />
      )}
    </div>
  );
}
