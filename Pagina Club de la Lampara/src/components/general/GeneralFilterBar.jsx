import React from 'react';
import { Search, X, CheckCircle2, Layers, Lock, Unlock } from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';

export default function GeneralFilterBar() {
  const {
    levels,
    activeLevel,
    selectLevel,
    isLevelUnlocked,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalCount,
  } = useClubLamp();

  const allLevelsUnlocked = isLevelUnlocked('all');

  return (
    <div className="space-y-4">
      {/* Selector de los 6 Niveles con Bloqueo Estricto por Candado */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-3.5 sm:p-5 shadow-general-card">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Progresión Oficial de los 6 Niveles (Debes completar las 8 semanas para desbloquear el siguiente)
            </span>
          </div>

          {allLevelsUnlocked && (
            <button
              type="button"
              onClick={() => selectLevel(activeLevel === 'all' ? 1 : 'all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                activeLevel === 'all'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {activeLevel === 'all'
                  ? `Viendo los ${totalCount} versículos`
                  : `Ver los ${totalCount} versículos`}
              </span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {levels.map((lvl) => {
            const isSelected = Number(activeLevel) === lvl.id;
            const isUnlocked = isLevelUnlocked(lvl.id);

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => selectLevel(lvl.id)}
                className={`text-left p-3 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-amber-400 shadow-md'
                    : lvl.isCompleted
                    ? 'bg-emerald-50/60 hover:bg-emerald-50 text-slate-900 border-emerald-300'
                    : isUnlocked
                    ? 'bg-amber-50/40 hover:bg-amber-50/80 text-slate-900 border-amber-300/80'
                    : 'bg-stone-100/80 hover:bg-stone-200/60 text-stone-500 border-stone-200/90 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-xs font-extrabold uppercase tracking-wider ${
                      isSelected
                        ? 'text-amber-400'
                        : lvl.isCompleted
                        ? 'text-emerald-800'
                        : isUnlocked
                        ? 'text-amber-900'
                        : 'text-stone-500'
                    }`}
                  >
                    Nivel {lvl.id}
                  </span>

                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      lvl.isCompleted
                        ? isSelected
                          ? 'text-emerald-400'
                          : 'text-emerald-700'
                        : isSelected
                        ? 'text-slate-200'
                        : 'text-stone-500'
                    }`}
                  >
                    {lvl.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : !isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-stone-500" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {lvl.completedCount}/{lvl.totalVersiculos}
                  </span>
                </div>

                <p
                  className={`text-[11px] font-semibold truncate mb-2 ${
                    isSelected
                      ? 'text-slate-300'
                      : lvl.isCompleted
                      ? 'text-emerald-800'
                      : isUnlocked
                      ? 'text-amber-900/80'
                      : 'text-stone-500'
                  }`}
                >
                  {lvl.isCompleted
                    ? 'Nivel Aprobado'
                    : isUnlocked
                    ? 'Nivel en Curso'
                    : 'Bloqueado'}
                </p>

                <div className="w-full h-1.5 rounded-full bg-stone-300/50 overflow-hidden">
                  <div
                    style={{ width: `${lvl.percentage}%` }}
                    className={`h-full rounded-full transition-all ${
                      lvl.isCompleted
                        ? 'bg-emerald-500'
                        : isSelected
                        ? 'bg-amber-400'
                        : 'bg-amber-600'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de Búsqueda y Filtro por Categoría */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-3.5 sm:p-4 shadow-general-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-stone-100/80 text-stone-600 hover:text-slate-900 hover:bg-stone-200/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por cita o palabra..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-700"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
