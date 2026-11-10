import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Compass,
  Award,
  Flame,
  Shield,
  Gamepad2,
  GraduationCap,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';
import LampBrandIcon from './LampBrandIcon.jsx';
import { EASE_OUT_EXPO } from '../../utils/motionConfig.js';

export default function PortalSelector() {
  const { switchMode, totalCount, learnedCount, levels } = useClubLamp();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[40rem] h-72 bg-amber-400/10 rounded-full blur-3xl" />
      </div>

      {/* Cabecera del Club de la Lámpara */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 pt-8 pb-4 text-center">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="inline-flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide mb-4">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>MINISTERIO DE APRENDIZAJE Y MEMORIZACIÓN BÍBLICA</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <LampBrandIcon variant="kids" size="lg" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Club de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">Lámpara</span>
          </h1>

          <p className="font-serif italic text-amber-100/85 text-base sm:text-xl max-w-2xl mx-auto">
            «Lámpara es a mis pies tu palabra, y lumbrera a mi camino.» — Salmos 119:105
          </p>

          {/* Indicador del currículo compartido */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-300 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-2xl">
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <Compass className="w-4 h-4" />
              {levels.length} Niveles Progresivos
            </span>
            <span className="text-slate-600">•</span>
            <span>{totalCount} Versículos Bíblicos</span>
            {learnedCount > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Award className="w-4 h-4" />
                  {learnedCount} versículos iluminados en este dispositivo
                </span>
              </>
            )}
          </div>
        </motion.div>
      </header>

      {/* Selector Dual de Experiencias */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
          {/* TARJETA A: MODO INFANTIL */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE_OUT_EXPO }}
            whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
            onClick={() => switchMode('kids')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') switchMode('kids');
            }}
            className="group cursor-pointer relative rounded-[2rem] p-7 sm:p-9 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 text-slate-950 shadow-2xl shadow-amber-500/20 border-4 border-amber-200/80 overflow-hidden flex flex-col justify-between text-left focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            {/* Decoración lúdica flotante */}
            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: [0, 8, -8, 0], y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-8 -top-8 w-44 h-44 bg-yellow-300/35 rounded-full blur-md pointer-events-none"
            />

            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-amber-950 font-kids font-bold text-xs sm:text-sm shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  INTERFAZ A · MODO INFANTIL
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-orange-600" />
                </div>
              </div>

              <h2 className="font-kids text-3xl sm:text-4xl font-bold text-slate-950 mb-3 leading-tight">
                Guardianes de la Luz
              </h2>

              <p className="text-slate-900/90 font-medium text-base sm:text-lg mb-6 leading-relaxed">
                ¡Una aventura interactiva para niños! Explora las <strong>6 Islas de Luz</strong>, descubre historias bíblicas ilustradas, escucha los versículos y juega a atrapar las palabras luminosas.
              </p>

              {/* Píldoras de características infantiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                <div className="bg-white/85 backdrop-blur-sm rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-kids font-semibold text-slate-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Historias y Héroes Bíblicos</span>
                </div>
                <div className="bg-white/85 backdrop-blur-sm rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-kids font-semibold text-slate-900">
                  <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Juego de Palabras en 3 Pasos</span>
                </div>
                <div className="bg-white/85 backdrop-blur-sm rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-kids font-semibold text-slate-900">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>6 Insignias y Misiones del Día</span>
                </div>
                <div className="bg-white/85 backdrop-blur-sm rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-kids font-semibold text-slate-900">
                  <Flame className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Lectura en Voz Alta Integrada</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="w-full py-4 px-6 rounded-2xl bg-slate-950 text-amber-300 font-kids font-bold text-base sm:text-lg flex items-center justify-between shadow-lg group-hover:bg-slate-900 transition-colors">
                <span>¡Entrar a la Aventura Infantil!</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </div>
          </motion.div>

          {/* TARJETA B: MODO GENERAL */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: EASE_OUT_EXPO }}
            whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
            onClick={() => switchMode('general')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') switchMode('general');
            }}
            className="group cursor-pointer relative rounded-[2rem] p-7 sm:p-9 bg-parchment-50 text-slate-900 shadow-2xl border-2 border-stone-200/90 overflow-hidden flex flex-col justify-between text-left focus:outline-none focus:ring-4 focus:ring-amber-500"
          >
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-200 font-semibold text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  INTERFAZ B · MODO GENERAL
                </span>
                <div className="w-12 h-12 rounded-2xl bg-stone-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 text-slate-800" />
                </div>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 mb-3 leading-tight">
                Programa General de Estudio
              </h2>

              <p className="text-stone-600 text-base sm:text-lg mb-6 leading-relaxed">
                Plataforma formal de lectura, estudio doctrinal y seguimiento semanal para jóvenes y adultos del Club. Organizada en <strong>6 Niveles (8 semanas por nivel)</strong> con entrega semanal al encargado.
              </p>

              {/* Píldoras de características modo general */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                <div className="bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                  <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Plan Semanal por Niveles</span>
                </div>
                <div className="bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                  <Compass className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>Contexto Doctrinal y Pastoral</span>
                </div>
                <div className="bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                  <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Control de Entrega al Encargado</span>
                </div>
                <div className="bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                  <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Lectura Limpia y Audio Integrado</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="w-full py-4 px-6 rounded-2xl bg-slate-900 text-white font-semibold text-base sm:text-lg flex items-center justify-between shadow-md group-hover:bg-slate-800 transition-colors">
                <span>Entrar en Modo General</span>
                <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Pie informativo */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 py-5 text-center text-xs sm:text-sm text-slate-400">
        Ambas experiencias comparten en tiempo real el mismo currículo centralizado de versículos y tu progreso guardado.
      </footer>
    </div>
  );
}
