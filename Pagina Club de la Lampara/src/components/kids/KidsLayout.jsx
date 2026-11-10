import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Star,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  Compass,
  Lock,
  X,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import LampBrandIcon from '../shared/LampBrandIcon.jsx';
import ModeSwitcherPill from '../shared/ModeSwitcherPill.jsx';
import KidsCategoryIslands from './KidsCategoryIslands.jsx';
import KidsVerseCard from './KidsVerseCard.jsx';
import KidsPracticeModal from './KidsPracticeModal.jsx';
import KidsIllustrations from './KidsIllustrations.jsx';
import { getStaggerContainer, getKidsCardVariants } from '../../utils/motionConfig.js';

function getKidsGuardianRank(learnedCount) {
  if (learnedCount >= 40) return 'Guardián Maestro del Faro';
  if (learnedCount >= 32) return 'Capitán de la Linterna';
  if (learnedCount >= 24) return 'Portador de la Antorcha';
  if (learnedCount >= 16) return 'Explorador de la Lámpara';
  if (learnedCount >= 8) return 'Amigo de la Llamita';
  return 'Aprendiz de la Chispa';
}

export default function KidsLayout() {
  const {
    filteredVerses,
    learnedCount,
    totalCount,
    globalPercentage,
    nextRecommendedVerse,
    activeVerseModal,
    setActiveVerseModal,
    activeLevel,
    lockedLevelModal,
    closeLockedLevelModal,
    selectLevel,
  } = useClubLamp();

  const shouldReduceMotion = useReducedMotion();
  const guardianRank = getKidsGuardianRank(learnedCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-sky-50 text-slate-900 pb-20 overflow-x-hidden">
      {/* Barra superior infantil responsive */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-amber-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-0 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <LampBrandIcon variant="kids" size="sm" />
            <div className="min-w-0">
              <span className="font-kids font-bold text-sm sm:text-xl text-slate-900 block leading-tight truncate">
                Club de la Lámpara
              </span>
              <span className="font-kids font-semibold text-[11px] sm:text-xs text-amber-700 block truncate">
                Modo Infantil · Guardianes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Contador de Estrellas de Luz */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-100 border-2 border-amber-300 font-kids font-bold text-sm text-amber-950">
              <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
              <span>
                {learnedCount} / {totalCount} Estrellas
              </span>
            </div>

            <ModeSwitcherPill variant="kids" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* HERO BANNER INFANTIL: Estado de la Lámpara y Siguiente Misión */}
        <section className="relative rounded-[2.25rem] p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-violet-900 to-slate-900 text-white shadow-xl overflow-hidden border-4 border-amber-300/80">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 font-kids font-bold text-xs sm:text-sm">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Rango actual: {guardianRank}</span>
              </div>

              <h1 className="font-kids text-2xl sm:text-4xl font-bold leading-tight">
                ¡Hola, Guardián! Cada versículo que aprendes ilumina el camino.
              </h1>

              {/* Barra de energía lumínica */}
              <div className="pt-1 max-w-xl">
                <div className="flex items-center justify-between text-xs sm:text-sm font-kids font-bold text-amber-200 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Nivel de Luz de tu Lámpara
                  </span>
                  <span>
                    {learnedCount} de {totalCount} versículos ({globalPercentage}%)
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-950/70 p-0.5 border border-amber-400/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(4, globalPercentage)}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Tarjeta de Siguiente Misión Recomendada */}
            {nextRecommendedVerse && (
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-white/20 flex flex-col justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 p-1.5 shrink-0">
                    <KidsIllustrations
                      scene={nextRecommendedVerse.escenaIlustracion}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-kids font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Siguiente Misión Sugerida
                    </span>
                    <h2 className="font-kids font-bold text-base sm:text-lg text-white truncate">
                      #{nextRecommendedVerse.orden} · {nextRecommendedVerse.titulo}
                    </h2>
                    <p className="font-kids text-xs sm:text-sm text-amber-200">
                      {nextRecommendedVerse.referencia} (Nivel {nextRecommendedVerse.nivel})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVerseModal(nextRecommendedVerse)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-kids font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>¡Comenzar esta Misión ahora!</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Selector de los 6 Niveles (Islas) y Categorías */}
        <KidsCategoryIslands />

        {/* Cuadrícula de Tarjetas de Versículos del Nivel */}
        <section>
          {filteredVerses.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border-2 border-amber-200">
              <Compass className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="font-kids text-xl font-bold text-slate-900 mb-1">
                No encontramos versículos con esa búsqueda
              </h3>
              <p className="text-slate-600 text-sm">
                Prueba eligiendo otra categoría o borrando el texto del buscador.
              </p>
            </div>
          ) : (
            <motion.div
              key={`${activeLevel}-${filteredVerses.length}`}
              variants={getStaggerContainer(0.05, shouldReduceMotion)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {filteredVerses.map((verse) => (
                <KidsVerseCard
                  key={verse.id}
                  verse={verse}
                  variants={getKidsCardVariants(shouldReduceMotion)}
                />
              ))}
            </motion.div>
          )}
        </section>
      </main>

      {/* Modal interactivo de Historia y Juego en 3 Pasos */}
      {activeVerseModal && (
        <KidsPracticeModal
          verse={activeVerseModal}
          onClose={() => setActiveVerseModal(null)}
        />
      )}

      {/* VENTANA EMERGENTE INFANTIL CUANDO TOCAN UNA ISLA CON CANDADO */}
      <AnimatePresence>
        {lockedLevelModal && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLockedLevelModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-[2.25rem] border-4 border-amber-400 shadow-2xl overflow-hidden text-center"
            >
              {/* Cabecera festiva infantil */}
              <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-6 py-5 relative">
                <button
                  type="button"
                  onClick={closeLockedLevelModal}
                  className="absolute right-4 top-4 w-9 h-9 rounded-2xl bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-sm"
                  aria-label="Cerrar aviso"
                >
                  <X className="w-5 h-5" />
                </button>

                <motion.div
                  animate={{ rotate: [0, -8, 8, -5, 5, 0], y: [0, -4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="w-16 h-16 mx-auto mb-2 rounded-3xl bg-white p-2 shadow-lg flex items-center justify-center"
                >
                  <Lock className="w-9 h-9 text-amber-600" />
                </motion.div>

                <span className="inline-block px-3 py-0.5 rounded-full bg-slate-950 text-amber-300 font-kids font-bold text-xs mb-1">
                  🔒 Esta Isla contine un candado
                </span>
                <h3 className="font-kids text-2xl font-bold text-slate-950">
                  ¡Alto ahí, Guardián!
                </h3>
              </div>

              {/* Cuerpo del modal infantil */}
              <div className="p-6 space-y-5">
                <p className="font-kids text-base sm:text-lg text-slate-700 leading-relaxed">
                  Para abrir el cofre de la{' '}
                  <strong className="text-indigo-700">
                    Isla del Nivel {lockedLevelModal.targetLevel?.id}
                  </strong>
                  , primero tienes que encender todas las estrellas del{' '}
                  <strong className="text-amber-700">
                    Nivel {lockedLevelModal.requiredLevel?.id}
                  </strong>
                  .
                </p>

                {lockedLevelModal.requiredLevel && (
                  <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between font-kids font-bold text-xs sm:text-sm text-amber-950">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
                        Estrellas en Nivel {lockedLevelModal.requiredLevel.id}:
                      </span>
                      <span>
                        {lockedLevelModal.requiredLevel.completedCount} de{' '}
                        {lockedLevelModal.requiredLevel.totalVersiculos} ⭐
                      </span>
                    </div>

                    <div className="w-full h-3.5 rounded-full bg-amber-200/70 p-0.5 overflow-hidden">
                      <div
                        style={{ width: `${lockedLevelModal.requiredLevel.percentage}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all"
                      />
                    </div>

                    <p className="font-kids text-xs sm:text-sm font-semibold text-amber-900">
                      ¡Solo te faltan{' '}
                      <strong>
                        {lockedLevelModal.requiredLevel.totalVersiculos -
                          lockedLevelModal.requiredLevel.completedCount}{' '}
                        estrellas
                      </strong>{' '}
                      para abrir el candado!
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (lockedLevelModal.requiredLevel) {
                      selectLevel(lockedLevelModal.requiredLevel.id);
                    }
                    closeLockedLevelModal();
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-kids font-bold text-sm sm:text-base border-b-4 border-indigo-900 flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>
                    ¡Ir a conseguir las estrellas del Nivel {lockedLevelModal.requiredLevel?.id}!
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
