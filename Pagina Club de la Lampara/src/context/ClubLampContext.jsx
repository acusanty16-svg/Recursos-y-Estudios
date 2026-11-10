import React, { createContext, useContext, useState, useTransition, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useVersesRepository } from '../hooks/useVersesRepository.js';
import { stopSpeaking } from '../utils/motionConfig.js';

const ClubLampContext = createContext(null);

export function ClubLampProvider({ children }) {
  // Persistimos el modo elegido ('kids' | 'general' | null), el nivel actual (1..6) y los IDs aprendidos
  const [activeMode, setActiveModeStorage] = useLocalStorage('mode', null);
  const [activeLevel, setActiveLevel] = useLocalStorage('active_level', 1);
  const [learnedIds, setLearnedIds] = useLocalStorage('learned_verses', []);

  // Filtros compartidos o reiniciables
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVerseModal, setActiveVerseModal] = useState(null);

  // Regla vercel-react-best-practices: rerender-transitions
  const [isPendingModeSwitch, startTransition] = useTransition();

  const repository = useVersesRepository({
    activeLevel,
    selectedCategory,
    searchQuery,
    learnedIds,
  });

  const switchMode = useCallback(
    (newMode) => {
      stopSpeaking();
      startTransition(() => {
        setActiveVerseModal(null);
        setActiveModeStorage(newMode);
      });
    },
    [setActiveModeStorage]
  );

  const selectLevel = useCallback(
    (levelId) => {
      setActiveLevel(levelId);
      setSelectedCategory('Todas');
    },
    [setActiveLevel]
  );

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
    isPendingModeSwitch,
    switchMode,
    activeLevel,
    selectLevel,
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
