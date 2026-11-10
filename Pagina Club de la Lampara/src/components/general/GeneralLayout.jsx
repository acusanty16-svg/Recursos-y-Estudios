import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Award,
  Calendar,
  AlertTriangle,
  Lock,
  X,
  ArrowRight,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import LampBrandIcon from '../shared/LampBrandIcon.jsx';
import ModeSwitcherPill from '../shared/ModeSwitcherPill.jsx';
import GeneralHeroVerse from './GeneralHeroVerse.jsx';
import GeneralFilterBar from './GeneralFilterBar.jsx';
import GeneralVerseCard from './GeneralVerseCard.jsx';

export default function GeneralLayout() {
  const {
    filteredVerses,
    learnedCount,
    totalCount,
    globalPercentage,
    activeLevel,
    isVerseLearned,
    lockedLevelModal,
    closeLockedLevelModal,
    selectLevel,
  } = useClubLamp();

  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showFloatingWarning, setShowFloatingWarning] = useState(false);
  const heroSectionRef = useRef(null);

  // Calcula cuál es el "Versículo Asignado de la Semana" (el primer versículo pendiente de entregar del nivel actual)
  const assignedVerseOfTheWeek = useMemo(() => {
    if (filteredVerses.length === 0) return null;
    const firstPending = filteredVerses.find((v) => !isVerseLearned(v.id));
    return firstPending || filteredVerses[0];
  }, [filteredVerses, isVerseLearned]);

  // Al entrar o cambiar de nivel, el Hero muestra de inmediato el Versículo Asignado de la Semana
  useEffect(() => {
    if (assignedVerseOfTheWeek) {
      setSelectedVerse(assignedVerseOfTheWeek);
    } else if (filteredVerses.length > 0) {
      setSelectedVerse(filteredVerses[0]);
    } else {
      setSelectedVerse(null);
    }
  }, [activeLevel, assignedVerseOfTheWeek, filteredVerses]);

  // Header estático + Warning flotante que aparece titilando al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowFloatingWarning(window.scrollY > 170);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectVerseFromSchedule = (verse) => {
    setSelectedVerse(verse);
    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-parchment-50 text-slate-900 pb-20 overflow-x-hidden">
      {/* WARNING FLOTANTE QUE APARECE TITILANDO AL HACER SCROLL */}
      <AnimatePresence>
        {showFloatingWarning && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 inset-x-0 z-40 bg-amber-950/95 backdrop-blur-md border-b-2 border-amber-400 text-amber-50 px-3 sm:px-6 py-2 shadow-xl"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <motion.span
                  animate={{ opacity: [1, 0.2, 1], scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0"
                >
                  <AlertTriangle className="w-4 h-4" />
                </motion.span>
                <p className="text-[11px] sm:text-xs font-semibold text-amber-100 truncate">
                  <strong className="text-amber-300 uppercase mr-1">Aviso Semanal:</strong>
                  Envía tu versículo al encargado cada semana para avanzar; si no, el nivel quedará suspenso y deberá repetirse.
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold shrink-0"
              >
                Subir al Versículo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabecera Institucional ESTÁTICA y 100% Responsive */}
      <header className="relative bg-slate-900 text-white border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <LampBrandIcon variant="general" size="sm" glowing={false} />
            <div className="min-w-0">
              <span className="font-serif font-semibold text-sm sm:text-xl text-white block leading-tight truncate">
                Club de la Lámpara
              </span>
              <span className="text-[11px] sm:text-xs text-amber-300/90 font-medium block truncate">
                Modo General · Programa de Estudio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
              <Award className="w-4 h-4 text-amber-400" />
              <span>
                Entregas Totales: {learnedCount}/{totalCount} ({globalPercentage}%)
              </span>
            </div>

            <ModeSwitcherPill variant="general" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-7 space-y-6">
        {/* 1. HERO EN PRIMER PLANO: Versículo Asignado de la Semana + Warning + Sello Nivel Superado */}
        <div ref={heroSectionRef} className="scroll-mt-14">
          <GeneralHeroVerse
            selectedVerse={selectedVerse}
            assignedVerseId={assignedVerseOfTheWeek?.id}
            onSelectVerse={setSelectedVerse}
            versesList={filteredVerses}
          />
        </div>

        {/* 2. Selector de los 6 Niveles con Candados Estrictos + Buscador */}
        <GeneralFilterBar />

        {/* 3. Cronograma de las 8 Semanas del Nivel */}
        {filteredVerses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-semibold text-slate-900 mb-1">
              Sin resultados para los filtros seleccionados
            </h3>
            <p className="text-stone-500 text-sm">
              Intenta limpiar el término de búsqueda o seleccionar otra categoría.
            </p>
          </div>
        ) : (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-600 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>
                  Plan Semanal del Nivel ({filteredVerses.length} Semanas)
                </span>
              </h2>
              <span className="text-xs text-stone-500">
                Toca cualquier semana para cargarla arriba en el Hero principal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVerses.map((verse) => (
                <GeneralVerseCard
                  key={verse.id}
                  verse={verse}
                  isSelected={selectedVerse?.id === verse.id}
                  isAssignedThisWeek={assignedVerseOfTheWeek?.id === verse.id}
                  onSelect={handleSelectVerseFromSchedule}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* VENTANA EMERGENTE FORMAL DE NIVEL BLOQUEADO (MODO GENERAL) */}
      <AnimatePresence>
        {lockedLevelModal && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLockedLevelModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 text-white rounded-3xl border-2 border-amber-400/90 shadow-2xl overflow-hidden"
            >
              <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Lock className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                      Acceso Restringido
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-white">
                      Nivel {lockedLevelModal.targetLevel?.id} Bloqueado
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeLockedLevelModal}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                  aria-label="Cerrar aviso"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-200 leading-relaxed">
                  No puedes continuar ni visualizar los versículos del{' '}
                  <strong className="text-amber-300">
                    Nivel {lockedLevelModal.targetLevel?.id}
                  </strong>{' '}
                  a menos que hayas completado y entregado todos los versículos del{' '}
                  <strong className="text-white">
                    Nivel {lockedLevelModal.requiredLevel?.id}
                  </strong>
                  .
                </p>

                {/* Barra de estado del nivel requerido */}
                {lockedLevelModal.requiredLevel && (
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">
                        Progreso actual en Nivel {lockedLevelModal.requiredLevel.id}:
                      </span>
                      <span className="text-amber-400 font-bold">
                        {lockedLevelModal.requiredLevel.completedCount} de{' '}
                        {lockedLevelModal.requiredLevel.totalVersiculos} semanas entregadas
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${lockedLevelModal.requiredLevel.percentage}%` }}
                        className="h-full rounded-full bg-amber-400 transition-all"
                      />
                    </div>

                    <p className="text-xs text-slate-400">
                      Te faltan{' '}
                      <strong className="text-amber-300">
                        {lockedLevelModal.requiredLevel.totalVersiculos -
                          lockedLevelModal.requiredLevel.completedCount}{' '}
                        versículos
                      </strong>{' '}
                      por entregar al encargado para desbloquear el siguiente nivel.
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
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>
                    Ir a completar el Nivel {lockedLevelModal.requiredLevel?.id}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
