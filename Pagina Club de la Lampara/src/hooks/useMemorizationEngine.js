import { useState, useMemo, useCallback } from 'react';

// Limpia signos de puntuación alrededor de una palabra conservando tildes
function cleanWord(raw) {
  return raw.replace(/[.,;:¡!¿?"'«»()]/g, '').trim();
}

// Módulo Profundo (codebase-design): Motor de Memorización por Etapas compartido por Infantil y General
// Etapas:
// 1 = Comprensión / Lectura guiada (0% oculto, palabras clave resaltadas)
// 2 = Pistas interactivas (~40% oculto: palabras clave convertidas en huecos)
// 3 = Desafío Maestro (~75% oculto o modo iniciales)
export function useMemorizationEngine(verse) {
  const [step, setStep] = useState(1);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [wrongAttemptWord, setWrongAttemptWord] = useState(null);

  // Tokeniza el texto del versículo en palabras con metadatos
  const tokens = useMemo(() => {
    if (!verse?.texto) return [];
    const keywordsLower = new Set(
      (verse.palabrasClave || []).map((w) => cleanWord(w).toLowerCase())
    );

    const rawParts = verse.texto.split(/\s+/);
    return rawParts.map((raw, idx) => {
      const cleaned = cleanWord(raw);
      const lower = cleaned.toLowerCase();
      const isKeyword = keywordsLower.has(lower);
      const isLongEnough = cleaned.length >= 4;

      // Extraer prefijo/sufijo de puntuación para mostrarlo limpio
      const match = raw.match(/^([¡¿"'«(]*)(.*?)([.,;:!?"'»)]*)$/);
      const prefix = match ? match[1] : '';
      const coreWord = match ? match[2] : raw;
      const suffix = match ? match[3] : '';

      return {
        index: idx,
        raw,
        coreWord,
        prefix,
        suffix,
        cleaned,
        initial: coreWord ? `${coreWord[0]}${'_'.repeat(Math.max(2, coreWord.length - 1))}` : '',
        isKeyword,
        isCandidateForStep2: isKeyword || ( idx % 3 === 1 && isLongEnough ),
        isCandidateForStep3: isKeyword || isLongEnough || idx % 2 === 0,
      };
    });
  }, [verse]);

  // Determina qué índices están ocultos según la etapa activa (1, 2 o 3)
  const targetIndices = useMemo(() => {
    if (step === 1) return [];
    if (step === 2) {
      const keywordMatches = tokens.filter((t) => t.isKeyword).map((t) => t.index);
      if (keywordMatches.length >= 2) return keywordMatches;
      return tokens.filter((t) => t.isCandidateForStep2).map((t) => t.index);
    }
    // Step 3: desafío maestro
    return tokens.filter((t) => t.isCandidateForStep3).map((t) => t.index);
  }, [step, tokens]);

  const revealedSet = useMemo(() => new Set(revealedIndices), [revealedIndices]);

  // Índices que aún faltan por descubrir en la etapa actual
  const pendingIndices = useMemo(() => {
    return targetIndices.filter((idx) => !revealedSet.has(idx));
  }, [targetIndices, revealedSet]);

  // Siguiente hueco activo que el niño o adulto debe completar en orden
  const currentTargetIndex = pendingIndices.length > 0 ? pendingIndices[0] : null;

  // Banco de palabras desordenado de forma determinista para el Modo Infantil
  const wordBankOptions = useMemo(() => {
    if (step === 1) return [];
    const options = targetIndices.map((idx) => ({
      tokenIndex: idx,
      word: tokens[idx]?.coreWord || '',
      isUsed: revealedSet.has(idx),
    }));
    // Orden pseudo-aleatorio estable basado en el texto y el índice
    return [...options].sort((a, b) => {
      const hashA = (a.word.charCodeAt(0) || 0) * 7 + (a.tokenIndex % 5);
      const hashB = (b.word.charCodeAt(0) || 0) * 7 + (b.tokenIndex % 5);
      return hashA - hashB;
    });
  }, [step, targetIndices, tokens, revealedSet]);

  const changeStep = useCallback((newStep) => {
    setStep(newStep);
    setRevealedIndices([]);
    setWrongAttemptWord(null);
  }, []);

  const revealSingleToken = useCallback((tokenIndex) => {
    setRevealedIndices((prev) =>
      prev.includes(tokenIndex) ? prev : [...prev, tokenIndex]
    );
  }, []);

  const revealNextPending = useCallback(() => {
    if (currentTargetIndex !== null) {
      revealSingleToken(currentTargetIndex);
    }
  }, [currentTargetIndex, revealSingleToken]);

  const revealAll = useCallback(() => {
    setRevealedIndices(targetIndices);
  }, [targetIndices]);

  const resetCurrentStep = useCallback(() => {
    setRevealedIndices([]);
    setWrongAttemptWord(null);
  }, []);

  // Para el juego infantil: valida si la palabra tocada corresponde al siguiente hueco (o tiene el mismo texto)
  const selectWordFromBank = useCallback(
    (option) => {
      if (currentTargetIndex === null) return false;
      const expectedToken = tokens[currentTargetIndex];
      const isMatch =
        option.tokenIndex === currentTargetIndex ||
        option.word.toLowerCase() === expectedToken.coreWord.toLowerCase();

      if (isMatch) {
        // Si tenía el mismo texto pero distinto índice, marcamos el índice pendiente o el suyo
        const indexToReveal =
          option.tokenIndex === currentTargetIndex
            ? currentTargetIndex
            : !revealedSet.has(option.tokenIndex)
            ? option.tokenIndex
            : currentTargetIndex;

        revealSingleToken(indexToReveal);
        setWrongAttemptWord(null);
        return true;
      } else {
        setWrongAttemptWord(option.tokenIndex);
        setTimeout(() => setWrongAttemptWord(null), 650);
        return false;
      }
    },
    [currentTargetIndex, tokens, revealedSet, revealSingleToken]
  );

  const isStepCompleted = step > 1 && targetIndices.length > 0 && pendingIndices.length === 0;
  const stepProgressPercentage =
    targetIndices.length > 0
      ? Math.round((revealedIndices.length / targetIndices.length) * 100)
      : 100;

  return {
    step,
    tokens,
    targetIndices,
    revealedSet,
    pendingIndices,
    currentTargetIndex,
    wordBankOptions,
    wrongAttemptWord,
    isStepCompleted,
    stepProgressPercentage,
    changeStep,
    revealSingleToken,
    revealNextPending,
    revealAll,
    resetCurrentStep,
    selectWordFromBank,
  };
}
