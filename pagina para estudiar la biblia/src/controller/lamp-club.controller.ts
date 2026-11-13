import type { LampVerseEntry } from '../rsc';
import type { LampClubProgress, TranslationId } from '../model/types';
import { translate } from '../i18n';
import { loadChapter } from './bible.service';
import { deleteLampClub, putLampClub } from './idb';
import { appStore, showToast } from './store';
import { notifyLocalChange, recordDeletion } from './sync-events';

/** Obtiene el texto real (RV1960 / NTV / NLT) de un versículo o rango del Club de la Lámpara. */
export async function fetchLampVerseText(
  entry: LampVerseEntry,
  translationId: TranslationId,
): Promise<string | null> {
  const result = await loadChapter(translationId, entry.bookNumber, entry.chapter);
  if (!result.ok) return null;
  const matching = result.value.verses
    .filter((v) => v.number >= entry.verseStart && v.number <= entry.verseEnd)
    .map((v) => (entry.verseEnd > entry.verseStart ? `${v.number} ${v.text}` : v.text));
  if (matching.length === 0) return null;
  return matching.join(' ');
}

export async function markLampVerseMastered(
  entry: LampVerseEntry,
  score: number,
  translationId: TranslationId,
): Promise<void> {
  const { lampClub, preferences } = appStore.getState();
  const existing = lampClub.find((item) => item.id === entry.id);

  const progress: LampClubProgress = {
    id: entry.id,
    level: entry.level,
    referenceLabel: entry.referenceLabel,
    completedAt: Date.now(),
    bestScore: Math.max(score, existing?.bestScore ?? 0),
    translationId,
  };

  try {
    await putLampClub(progress);
  } catch {
    // Mantiene estado en memoria.
  }

  appStore.setState((state) => ({
    ...state,
    lampClub: [...state.lampClub.filter((item) => item.id !== entry.id), progress],
  }));

  showToast(translate(preferences.uiLanguage, 'lamp.verseMastered'), 'success');
  notifyLocalChange();
}

export async function unmarkLampVerseMastered(id: string): Promise<void> {
  try {
    await deleteLampClub(id);
  } catch {
    // Ignorado.
  }

  appStore.setState((state) => ({
    ...state,
    lampClub: state.lampClub.filter((item) => item.id !== id),
  }));

  recordDeletion('lampClub', id);
}
