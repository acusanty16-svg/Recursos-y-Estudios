import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, LayoutGrid } from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';

export default function ModeSwitcherPill({ variant = 'general' }) {
  const { activeMode, switchMode } = useClubLamp();
  const isKids = variant === 'kids';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl border transition-colors ${
        isKids
          ? 'bg-amber-100/90 border-amber-300/80 shadow-inner'
          : 'bg-stone-200/75 border-stone-300/80'
      }`}
      role="group"
      aria-label="Cambiar experiencia del Club de la Lámpara"
    >
      <button
        type="button"
        onClick={() => switchMode('kids')}
        className={`relative px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
          activeMode === 'kids'
            ? 'text-amber-950'
            : isKids
            ? 'text-amber-800 hover:text-amber-950'
            : 'text-stone-600 hover:text-slate-900'
        }`}
      >
        {activeMode === 'kids' && (
          <motion.span
            layoutId="mode-switcher-active"
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className="absolute inset-0 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-xl shadow-sm"
          />
        )}
        <Sparkles className="w-3.5 h-3.5 relative z-10 text-amber-700" />
        <span className="relative z-10 font-kids">Infantil</span>
      </button>

      <button
        type="button"
        onClick={() => switchMode('general')}
        className={`relative px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
          activeMode === 'general'
            ? 'text-slate-900'
            : isKids
            ? 'text-amber-900/75 hover:text-amber-950'
            : 'text-stone-600 hover:text-slate-900'
        }`}
      >
        {activeMode === 'general' && (
          <motion.span
            layoutId="mode-switcher-active"
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className="absolute inset-0 bg-white rounded-xl shadow-sm"
          />
        )}
        <BookOpen className="w-3.5 h-3.5 relative z-10 text-amber-700" />
        <span className="relative z-10">General</span>
      </button>

      <button
        type="button"
        onClick={() => switchMode(null)}
        title="Volver a la pantalla de bienvenida"
        className={`ml-0.5 px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors ${
          isKids
            ? 'text-amber-900/70 hover:bg-amber-200/70 hover:text-amber-950'
            : 'text-stone-600 hover:bg-stone-300/60 hover:text-slate-900'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Portal</span>
      </button>
    </div>
  );
}
