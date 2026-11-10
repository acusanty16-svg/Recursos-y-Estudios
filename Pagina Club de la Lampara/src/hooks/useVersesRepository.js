import { useMemo } from 'react';
import rawData from '../data/versiculos.json';

// Módulo Profundo (codebase-design) + Indexación O(1) (vercel-react-best-practices: js-index-maps)
// Procesa una sola vez los datos estáticos del JSON a nivel de módulo
const SORTED_VERSES = [...(rawData.versiculos || [])].sort(
  (a, b) => (a.nivel - b.nivel) || (a.orden - b.orden)
);

const VERSE_BY_ID = new Map();
const VERSES_BY_LEVEL = new Map();
const CATEGORIES_SET = new Set();

for (const verse of SORTED_VERSES) {
  const levelNum = verse.nivel || 1;
  VERSE_BY_ID.set(verse.id, verse);
  CATEGORIES_SET.add(verse.categoria);

  if (!VERSES_BY_LEVEL.has(levelNum)) {
    VERSES_BY_LEVEL.set(levelNum, []);
  }
  VERSES_BY_LEVEL.get(levelNum).push(verse);
}

// Garantiza que si se agregan versículos de un nivel nuevo en el JSON, el nivel exista automáticamente
const ALL_LEVEL_NUMBERS = Array.from(VERSES_BY_LEVEL.keys()).sort((a, b) => a - b);
const CONFIGURED_LEVELS_MAP = new Map((rawData.niveles || []).map((lvl) => [lvl.id, lvl]));

const NORMALIZED_LEVELS = ALL_LEVEL_NUMBERS.map((lvlId) => {
  const configured = CONFIGURED_LEVELS_MAP.get(lvlId);
  const versesInLevel = VERSES_BY_LEVEL.get(lvlId) || [];
  return {
    id: lvlId,
    nombre: configured?.nombre || `Nivel ${lvlId}`,
    nombreCorto: configured?.nombreCorto || `Nivel ${lvlId}`,
    subtituloInfantil: configured?.subtituloInfantil || `Explora los versículos del Nivel ${lvlId}`,
    subtituloGeneral: configured?.subtituloGeneral || `Colección de estudio del Nivel ${lvlId}`,
    descripcionInfantil: configured?.descripcionInfantil || '',
    descripcionGeneral: configured?.descripcionGeneral || '',
    insignia: configured?.insignia || `Insignia Nivel ${lvlId}`,
    temaColor: configured?.temaColor || 'amber',
    icono: configured?.icono || 'lamp',
    totalVersiculos: versesInLevel.length,
  };
});

const ALL_CATEGORIES = ['Todas', ...Array.from(CATEGORIES_SET)];

export function useVersesRepository({ activeLevel, selectedCategory, searchQuery, learnedIds }) {
  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);

  // Estadísticas por cada uno de los 6 niveles
  const levelsWithProgress = useMemo(() => {
    return NORMALIZED_LEVELS.map((level) => {
      const verses = VERSES_BY_LEVEL.get(level.id) || [];
      let completedCount = 0;
      for (const v of verses) {
        if (learnedSet.has(v.id)) completedCount++;
      }
      const percentage = verses.length > 0 ? Math.round((completedCount / verses.length) * 100) : 0;
      return {
        ...level,
        completedCount,
        percentage,
        isCompleted: verses.length > 0 && completedCount === verses.length,
      };
    });
  }, [learnedSet]);

  // Versículos filtrados en el render sin useEffect redundante (rerender-derived-state-no-effect)
  const filteredVerses = useMemo(() => {
    const baseList =
      activeLevel === 'all'
        ? SORTED_VERSES
        : VERSES_BY_LEVEL.get(Number(activeLevel)) || [];

    const normalizedQuery = searchQuery.trim().toLowerCase();

    return baseList.filter((verse) => {
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === 'Todas' ||
        verse.categoria === selectedCategory;

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      return (
        verse.titulo.toLowerCase().includes(normalizedQuery) ||
        verse.referencia.toLowerCase().includes(normalizedQuery) ||
        verse.texto.toLowerCase().includes(normalizedQuery) ||
        verse.categoria.toLowerCase().includes(normalizedQuery) ||
        (verse.personajeBiblico && verse.personajeBiblico.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [activeLevel, selectedCategory, searchQuery]);

  // Siguiente versículo sugerido en el camino según el orden secuencial
  const nextRecommendedVerse = useMemo(() => {
    const levelVerses =
      activeLevel !== 'all' ? VERSES_BY_LEVEL.get(Number(activeLevel)) || [] : SORTED_VERSES;
    const unlearnedInLevel = levelVerses.find((v) => !learnedSet.has(v.id));
    if (unlearnedInLevel) return unlearnedInLevel;

    const firstUnlearnedGlobal = SORTED_VERSES.find((v) => !learnedSet.has(v.id));
    return firstUnlearnedGlobal || SORTED_VERSES[0] || null;
  }, [activeLevel, learnedSet]);

  const currentLevelMeta = useMemo(() => {
    if (activeLevel === 'all') {
      return {
        id: 'all',
        nombre: 'Todos los Niveles (1 al 6)',
        nombreCorto: 'Todos',
        subtituloInfantil: '¡Los 60 tesoros del Club de la Lámpara!',
        subtituloGeneral: 'Catálogo completo de los 6 niveles del Club de la Lámpara',
        descripcionInfantil: 'Explora todos los versículos de principio a fin.',
        descripcionGeneral: 'Vista integral de todos los versículos organizados secuencialmente.',
        insignia: 'Colección Completa',
        temaColor: 'amber',
        totalVersiculos: SORTED_VERSES.length,
        completedCount: learnedSet.size,
        percentage:
          SORTED_VERSES.length > 0
            ? Math.round((learnedSet.size / SORTED_VERSES.length) * 100)
            : 0,
      };
    }
    return (
      levelsWithProgress.find((l) => l.id === Number(activeLevel)) ||
      levelsWithProgress[0]
    );
  }, [activeLevel, levelsWithProgress, learnedSet.size]);

  return {
    allVerses: SORTED_VERSES,
    filteredVerses,
    levels: levelsWithProgress,
    currentLevelMeta,
    categories: ALL_CATEGORIES,
    nextRecommendedVerse,
    totalCount: SORTED_VERSES.length,
    learnedCount: learnedSet.size,
    globalPercentage:
      SORTED_VERSES.length > 0
        ? Math.round((learnedSet.size / SORTED_VERSES.length) * 100)
        : 0,
    isVerseLearned: (id) => learnedSet.has(id),
    getVerseById: (id) => VERSE_BY_ID.get(id),
  };
}
