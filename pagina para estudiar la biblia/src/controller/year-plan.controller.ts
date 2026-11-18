import { STORAGE_KEYS } from '../model/constants';
import type { YearPlanEntry } from '../model/types';
import { YEAR_PLAN_DAYS_COUNT } from '../model/bibleYearPlan';
import { translate } from '../i18n';
import { deleteYearPlan, putYearPlan } from './idb';
import { appStore, showToast } from './store';
import { notifyLocalChange, recordDeletion } from './sync-events';

export function yearPlanEntryId(day: number): string {
  return `year-${day}`;
}

export function setYearPlanStartDate(dayKey: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return;
  try {
    localStorage.setItem(STORAGE_KEYS.yearPlanStart, dayKey);
  } catch {
    // Ignorado.
  }
  appStore.setState((state) => ({ ...state, yearPlanStart: dayKey }));
}

export async function toggleYearPlanDay(day: number): Promise<void> {
  if (day < 1 || day > YEAR_PLAN_DAYS_COUNT) return;
  const id = yearPlanEntryId(day);
  const { yearPlan, preferences } = appStore.getState();
  const exists = yearPlan.some((entry) => entry.id === id || entry.day === day);

  if (exists) {
    try {
      await deleteYearPlan(id);
    } catch {
      // Mantiene consistencia en memoria.
    }
    appStore.setState((state) => ({
      ...state,
      yearPlan: state.yearPlan.filter((entry) => entry.id !== id && entry.day !== day),
    }));
    recordDeletion('yearPlan', id);
    return;
  }

  const entry: YearPlanEntry = {
    id,
    day,
    completedAt: Date.now(),
  };

  try {
    await putYearPlan(entry);
  } catch {
    // Mantiene estado en memoria.
  }

  appStore.setState((state) => ({
    ...state,
    yearPlan: [...state.yearPlan.filter((item) => item.id !== id && item.day !== day), entry],
  }));

  showToast(translate(preferences.uiLanguage, 'plan.dayCompletedToast'), 'success');
  notifyLocalChange();
}
