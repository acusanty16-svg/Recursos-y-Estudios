import React from 'react';
import { Sparkles, BookOpen, LayoutGrid } from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';

export default function ModeSwitcherPill({ variant = 'general' }) {
  const { activeMode, switchMode, isRefreshingMode } = useClubLamp();
  const isKids = variant === 'kids';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl sm:rounded-2xl border shrink-0 transition-colors ${
        isKids
          ? 'bg-amber-100/90 border-amber-300/90 shadow-inner'
          : 'bg-slate-800/90 border-slate-700 text-slate-200'
      }`}
      role="group"
      aria-label="Cambiar experiencia del Club de la Lámpara"
    >
      <button
        type="button"
        disabled={isRefreshingMode}
        onClick={() => switchMode('kids')}
        className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
          activeMode === 'kids'
            ? 'bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-950 shadow-sm'
            : isKids
            ? 'text-amber-800 hover:text-amber-950'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
        <span className="font-kids">Infantil</span>
      </button>

      <button
        type="button"
        disabled={isRefreshingMode}
        onClick={() => switchMode('general')}
        className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
          activeMode === 'general'
            ? 'bg-amber-500 text-slate-950 shadow-sm'
            : isKids
            ? 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-200/60'
            : 'text-slate-300 hover:text-white'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5 shrink-0" />
        <span>General</span>
      </button>

      <button
        type="button"
        disabled={isRefreshingMode}
        onClick={() => switchMode(null)}
        title="Volver a la pantalla de inicio"
        className={`ml-0.5 px-2 sm:px-2.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-medium flex items-center gap-1 transition-colors ${
          isKids
            ? 'text-amber-900/75 hover:bg-amber-200/70 hover:text-amber-950'
            : 'text-slate-400 hover:bg-slate-700/70 hover:text-white'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden md:inline">Inicio</span>
      </button>
    </div>
  );
}
