import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Flame,
  Heart,
  Sun,
  Compass,
  CheckCircle2,
  Search,
  X,
  Layers,
  Lock,
} from 'lucide-react';
import { useClubLamp } from '../../context/ClubLampContext.jsx';

const LEVEL_STYLES = {
  1: {
    bg: 'from-amber-400 to-orange-400',
    lightBg: 'bg-amber-50 border-amber-300 text-amber-950',
    badge: 'bg-amber-500 text-white',
    icon: Sparkles,
  },
  2: {
    bg: 'from-sky-400 to-blue-500',
    lightBg: 'bg-sky-50 border-sky-300 text-sky-950',
    badge: 'bg-sky-500 text-white',
    icon: Shield,
  },
  3: {
    bg: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50 border-violet-300 text-violet-950',
    badge: 'bg-violet-600 text-white',
    icon: Flame,
  },
  4: {
    bg: 'from-rose-400 to-pink-500',
    lightBg: 'bg-rose-50 border-rose-300 text-rose-950',
    badge: 'bg-rose-500 text-white',
    icon: Heart,
  },
  5: {
    bg: 'from-emerald-400 to-teal-500',
    lightBg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    badge: 'bg-emerald-500 text-white',
    icon: Sun,
  },
  6: {
    bg: 'from-indigo-500 to-blue-700',
    lightBg: 'bg-indigo-50 border-indigo-300 text-indigo-950',
    badge: 'bg-indigo-600 text-white',
    icon: Compass,
  },
};

export default function KidsCategoryIslands() {
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
    currentLevelMeta,
    totalCount,
  } = useClubLamp();

  const allIslandsUnlocked = isLevelUnlocked('all');

  return (
    <section className="space-y-6">
      {/* Mapa de las 6 Islas de Nivel con Candados */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="font-kids text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-500" />
            <span>Mapa de las 6 Islas de Luz</span>
          </h2>

          {allIslandsUnlocked && (
            <button
              type="button"
              onClick={() => selectLevel(activeLevel === 'all' ? 1 : 'all')}
              className={`px-3.5 py-1.5 rounded-2xl font-kids font-bold text-xs sm:text-sm border-2 transition-all flex items-center gap-1.5 ${
                activeLevel === 'all'
                  ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>
                {activeLevel === 'all'
                  ? `Viendo los ${totalCount} versículos`
                  : `Ver los ${totalCount} juntos`}
              </span>
            </button>
          )}
        </div>

        {/* Cuadrícula de Islas de Nivel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {levels.map((lvl) => {
            const style = LEVEL_STYLES[lvl.id] || LEVEL_STYLES[1];
            const IconComponent = style.icon;
            const isSelected = Number(activeLevel) === lvl.id;
            const isUnlocked = isLevelUnlocked(lvl.id);

            return (
              <motion.button
                key={lvl.id}
                type="button"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ y: 2, scale: 0.98 }}
                onClick={() => selectLevel(lvl.id)}
                className={`relative text-left p-3.5 rounded-3xl border-2 border-b-4 transition-all flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? `bg-gradient-to-br ${style.bg} text-white border-slate-900/25 shadow-lg`
                    : !isUnlocked
                    ? 'bg-stone-100/90 border-stone-300 text-slate-500 opacity-90 hover:bg-stone-200/70'
                    : `${style.lightBg} hover:bg-white`
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm ${
                      !isUnlocked
                        ? 'bg-stone-300 text-slate-600'
                        : isSelected
                        ? 'bg-white/25 text-white'
                        : style.badge
                    }`}
                  >
                    {!isUnlocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </span>

                  {lvl.isCompleted ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-kids font-bold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      ¡Listo!
                    </span>
                  ) : !isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[11px] font-kids font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Candado
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-kids font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-black/20 text-white' : 'bg-white/80 text-slate-700'
                      }`}
                    >
                      {lvl.completedCount}/{lvl.totalVersiculos}
                    </span>
                  )}
                </div>

                <div>
                  <p
                    className={`text-xs font-kids font-bold uppercase tracking-wider ${
                      isSelected ? 'text-white/90' : 'opacity-75'
                    }`}
                  >
                    Isla · Nivel {lvl.id}
                  </p>
                  <p className="font-kids font-bold text-sm sm:text-base leading-tight line-clamp-1">
                    {lvl.insignia}
                  </p>
                </div>

                {/* Barra de luz del nivel */}
                <div className="mt-3 w-full h-2 rounded-full bg-black/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lvl.percentage}%` }}
                    className={`h-full rounded-full ${
                      isSelected ? 'bg-yellow-200' : 'bg-amber-500'
                    }`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Banner descriptivo del Nivel Activo */}
      {currentLevelMeta && (
        <motion.div
          key={currentLevelMeta.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-kids-card flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 font-kids font-bold text-xs">
                {currentLevelMeta.insignia}
              </span>
              <h3 className="font-kids text-lg sm:text-xl font-bold text-slate-900">
                {currentLevelMeta.nombre}
              </h3>
            </div>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              {currentLevelMeta.subtituloInfantil} — {currentLevelMeta.descripcionInfantil}
            </p>
          </div>

          {/* Buscador infantil amigable */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar héroe, palabra o cita..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-sm font-medium text-slate-900 placeholder:text-amber-800/50 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Píldoras de Categorías Bíblicas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-4 py-2 rounded-2xl font-kids font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-2 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm scale-105'
                  : 'bg-white text-slate-700 border-amber-100 hover:border-amber-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </section>
  );
}
