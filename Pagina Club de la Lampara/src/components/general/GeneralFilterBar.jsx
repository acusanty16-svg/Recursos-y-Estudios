import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';

export default function GeneralFilterBar({ viewMode, setViewMode }) {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    currentLevelMeta,
    filteredVerses,
  } = useClubLamp();

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-general-card space-y-4">
      {/* Encabezado del Nivel activo y buscador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-slate-900">
              {currentLevelMeta?.nombre}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium">
              {filteredVerses.length} versículos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {currentLevelMeta?.descripcionGeneral}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Buscador editorial */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cita, tema o texto..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200/90 text-xs sm:text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
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

          {/* Conmutador Cuadrícula / Lista de Estudio */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Vista en tarjetas"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-stone-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="Vista de lectura compacta"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-stone-500 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtro de Categorías con transición layoutId */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 no-scrollbar border-t border-stone-100">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'text-white'
                  : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100/80'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="general-category-pill"
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="absolute inset-0 bg-slate-900 rounded-xl"
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
