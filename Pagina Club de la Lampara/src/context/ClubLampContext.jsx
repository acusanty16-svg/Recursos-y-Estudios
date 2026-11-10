import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useVersesRepository } from '../hooks/useVersesRepository.js';
import { stopSpeaking } from '../utils/motionConfig.js';

const ClubLampContext = createContext(null);

export function ClubLampProvider({ children }) {
  // Persistimos el modo elegido ('kids' | 'general' | null), el nivel actual (1..6) y los IDs completados
  const [activeMode, setActiveModeStorage] = useLocalStorage('mode', null);
  const [activeLevel, setActiveLevel] = useLocalStorage('active_level', 1);
  const [learnedIds, setLearnedIds] = useLocalStorage('learned_verses', []);

  // Estado de refresco asíncrono al cambiar de interfaz
  const [isRefreshingMode, setIsRefreshingMode] = useState(false);
  const [viewRefreshKey, setViewRefreshKey] = useState(0);

  // Filtros compartidos o reiniciables
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVerseModal, setActiveVerseModal] = useState(null);

  // Estado para la ventana emergente (modal) cuando intentan abrir un nivel bloqueado
  const [lockedLevelModal, setLockedLevelModal] = useState(null);

  const repository = useVersesRepository({
    activeLevel,
    selectedCategory,
    searchQuery,
    learnedIds,
  });

  const { levels } = repository;

  // Un nivel N está desbloqueado solo si TODOS los niveles anteriores (1 .. N-1) están completados (8/8)
  const isLevelUnlocked = useCallback(
    (levelId) => {
      if (levelId === 'all') {
        return levels.every((l) => l.isCompleted);
      }
      const numericId = Number(levelId);
      if (numericId <= 1) return true;
      for (let i = 1; i < numericId; i++) {
        const prevLvl = levels.find((l) => l.id === i);
        if (!prevLvl || !prevLvl.isCompleted) {
          return false;
        }
      }
      return true;
    },
    [levels]
  );

  // Si el usuario desmarca un versículo y el nivel en el que estaba queda bloqueado, regresa al primer nivel incompleto
  useEffect(() => {
    if (!isLevelUnlocked(activeLevel)) {
      const firstIncomplete = levels.find((l) => !l.isCompleted) || levels[0];
      if (firstIncomplete && Number(activeLevel) !== firstIncomplete.id) {
        setActiveLevel(firstIncomplete.id);
      }
    }
  }, [activeLevel, isLevelUnlocked, levels, setActiveLevel]);

  // Escucha el evento personalizado de refresco de interfaz para reiniciar scroll y modales
  useEffect(() => {
    const handleRefreshEvent = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('club-lampara:mode-refresh', handleRefreshEvent);
    return () => window.removeEventListener('club-lampara:mode-refresh', handleRefreshEvent);
  }, []);

  // Cambio asíncrono con await y refresco automático de la vista
  const switchMode = useCallback(
    async (newMode) => {
      if (newMode === activeMode && !isRefreshingMode) return;

      stopSpeaking();
      setActiveVerseModal(null);
      setLockedLevelModal(null);
      setIsRefreshingMode(true);

      await new Promise((resolve) => setTimeout(resolve, 140));

      setSelectedCategory('Todas');
      setSearchQuery('');
      setActiveModeStorage(newMode);
      setViewRefreshKey((prev) => prev + 1);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('club-lampara:mode-refresh', { detail: { mode: newMode } })
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 60));
      setIsRefreshingMode(false);
    },
    [activeMode, isRefreshingMode, setActiveModeStorage]
  );

  // Condicional de bloqueo de nivel: si no ha completado el nivel anterior, abre ventana emergente y bloquea el acceso
  const selectLevel = useCallback(
    (levelId) => {
      if (isLevelUnlocked(levelId)) {
        setActiveLevel(levelId);
        setSelectedCategory('Todas');
        setLockedLevelModal(null);
        return true;
      }

      // Buscar cuál es el primer nivel pendiente que debe completar antes
      const numericTarget = levelId === 'all' ? 6 : Number(levelId);
      let requiredLevel = levels.find((l) => l.id === numericTarget - 1);
      for (let i = 1; i < numericTarget; i++) {
        const candidate = levels.find((l) => l.id === i);
        if (candidate && !candidate.isCompleted) {
          requiredLevel = candidate;
          break;
        }
      }
      const targetLevel =
        levels.find((l) => l.id === numericTarget) || {
          id: numericTarget,
          nombre: `Nivel ${numericTarget}`,
          insignia: `Nivel ${numericTarget}`,
        };

      setLockedLevelModal({
        targetLevel,
        requiredLevel: requiredLevel || levels[0],
      });
      return false;
    },
    [isLevelUnlocked, levels, setActiveLevel]
  );

  const closeLockedLevelModal = useCallback(() => {
    setLockedLevelModal(null);
  }, []);

  const toggleLearnedVerse = useCallback(
    (verseId) => {
      setLearnedIds((prev) =>
        prev.includes(verseId)
          ? prev.filter((id) => id !== verseId)
          : [...prev, verseId]
      );
    },
    [setLearnedIds]
  );

  const markVerseAsLearned = useCallback(
    (verseId) => {
      setLearnedIds((prev) => (prev.includes(verseId) ? prev : [...prev, verseId]));
    },
    [setLearnedIds]
  );

  const value = {
    activeMode,
    isRefreshingMode,
    viewRefreshKey,
    switchMode,
    activeLevel,
    selectLevel,
    isLevelUnlocked,
    lockedLevelModal,
    closeLockedLevelModal,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeVerseModal,
    setActiveVerseModal,
    learnedIds,
    toggleLearnedVerse,
    markVerseAsLearned,
    ...repository,
  };

  return (
    <ClubLampContext.Provider value={value}>
      {children}
    </ClubLampContext.Provider>
  );
}

export function useClubLamp() {
  const context = useContext(ClubLampContext);
  if (!context) {
    throw new Error('useClubLamp debe utilizarse dentro de un ClubLampProvider');
  }
  return context;
}
