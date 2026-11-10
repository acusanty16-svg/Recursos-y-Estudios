import React from 'react';
import { CheckCircle2, Clock, Sparkles, ArrowUpRight } from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';

export default function GeneralVerseCard({
  verse,
  isSelected,
  isAssignedThisWeek,
  onSelect,
}) {
  const { isVerseLearned, toggleLearnedVerse } = useClubLamp();
  const delivered = isVerseLearned(verse.id);
  const weekNumber = verse.semana || ((verse.orden - 1) % 8) + 1;

  const handleToggleDelivery = (e) => {
    e.stopPropagation();
    toggleLearnedVerse(verse.id);
  };

  return (
    <article
      onClick={() => onSelect(verse)}
      className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between gap-3 ${
        isAssignedThisWeek
          ? 'bg-gradient-to-br from-amber-50 via-amber-50/60 to-white border-amber-400 shadow-md ring-2 ring-amber-300/40'
          : isSelected
          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
          : delivered
          ? 'bg-white border-emerald-300/90 hover:border-emerald-500 shadow-general-card'
          : 'bg-white border-stone-200/90 hover:border-slate-400 shadow-general-card'
      }`}
    >
      <div className="space-y-2">
        {/* Cabecera de la tarjeta: Semana, insignia de Versículo Asignado y Estado */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase tracking-wider ${
                isAssignedThisWeek
                  ? 'bg-amber-400 text-slate-950'
                  : isSelected
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              Semana {weekNumber}
            </span>

            {isAssignedThisWeek && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 text-amber-300 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Versículo de la Semana
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleDelivery}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              delivered
                ? isSelected && !isAssignedThisWeek
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : isSelected && !isAssignedThisWeek
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {delivered ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Entregado</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Pendiente</span>
              </>
            )}
          </button>
        </div>

        {/* Cita y Título */}
        <div>
          <p
            className={`text-xs font-extrabold uppercase tracking-wider ${
              isSelected && !isAssignedThisWeek ? 'text-amber-300' : 'text-amber-800'
            }`}
          >
            {verse.referencia} · Nivel {verse.nivel}
          </p>
          <h3
            className={`text-base font-bold leading-snug ${
              isSelected && !isAssignedThisWeek ? 'text-white' : 'text-slate-900'
            }`}
          >
            {verse.titulo}
          </h3>
        </div>

        {/* Texto del versículo */}
        <p
          className={`font-serif text-sm sm:text-base leading-relaxed ${
            isSelected && !isAssignedThisWeek ? 'text-slate-200' : 'text-slate-700'
          }`}
        >
          «{verse.texto}»
        </p>
      </div>

      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-semibold">
        <span
          className={
            isSelected && !isAssignedThisWeek ? 'text-slate-400' : 'text-stone-500'
          }
        >
          Tema: {verse.categoria}
        </span>

        <span
          className={`inline-flex items-center gap-1 ${
            isAssignedThisWeek
              ? 'text-amber-900 font-bold'
              : isSelected
              ? 'text-amber-400'
              : 'text-slate-700'
          }`}
        >
          <span>{isSelected ? 'Mostrando en el Hero' : 'Ver en el Hero'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
}
