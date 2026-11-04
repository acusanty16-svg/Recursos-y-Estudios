import { DEFAULT_PREFERENCES, STORAGE_KEYS } from '../model/constants';
import type { Preferences } from '../model/types';
import { appStore } from './store';

const FONT_SCALES: readonly Preferences['fontScale'][] = [1, 1.125, 1.25, 1.5];

/** Validación defensiva de preferencias persistidas (pueden venir de una versión anterior). */
export function parsePreferences(raw: string | null): Preferences {
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PREFERENCES;
    const candidate = parsed as Record<string, unknown>;

    const theme = candidate.theme === 'light' || candidate.theme === 'dark' ? candidate.theme : DEFAULT_PREFERENCES.theme;
    const uiLanguage = candidate.uiLanguage === 'en' || candidate.uiLanguage === 'es' ? candidate.uiLanguage : DEFAULT_PREFERENCES.uiLanguage;
    const fontScale =
      typeof candidate.fontScale === 'number' && FONT_SCALES.includes(candidate.fontScale as Preferences['fontScale'])
        ? (candidate.fontScale as Preferences['fontScale'])
        : DEFAULT_PREFERENCES.fontScale;
    const activeTranslation =
      candidate.activeTranslation === 'RV1960' || candidate.activeTranslation === 'NTV' || candidate.activeTranslation === 'NLT'
        ? candidate.activeTranslation
        : DEFAULT_PREFERENCES.activeTranslation;
    const focusMode = typeof candidate.focusMode === 'boolean' ? candidate.focusMode : DEFAULT_PREFERENCES.focusMode;
    const notificationsEnabled =
      typeof candidate.notificationsEnabled === 'boolean'
        ? candidate.notificationsEnabled
        : DEFAULT_PREFERENCES.notificationsEnabled;
    const notificationTime =
      typeof candidate.notificationTime === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(candidate.notificationTime)
        ? candidate.notificationTime
        : DEFAULT_PREFERENCES.notificationTime;

    return { theme, uiLanguage, fontScale, activeTranslation, focusMode, notificationsEnabled, notificationTime };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function loadPreferences(): Preferences {
  const preferences = parsePreferences(localStorage.getItem(STORAGE_KEYS.preferences));
  appStore.setState((state) => ({ ...state, preferences }));
  applyPreferences(preferences);
  return preferences;
}

export function savePreferences(preferences: Preferences): void {
  localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
  appStore.setState((state) => ({ ...state, preferences }));
  applyPreferences(preferences);
}

export function updatePreferences(patch: Partial<Preferences>): Preferences {
  const next: Preferences = { ...appStore.getState().preferences, ...patch };
  savePreferences(next);
  return next;
}

/** Sincroniza el DOM con las preferencias. Único punto que toca <html>. */
export function applyPreferences(preferences: Preferences): void {
  const root = document.documentElement;
  root.classList.toggle('dark', preferences.theme === 'dark');
  root.classList.toggle('light', preferences.theme === 'light');
  root.style.setProperty('--sv-font-scale', String(preferences.fontScale));
  root.lang = preferences.uiLanguage;
  root.style.colorScheme = preferences.theme;
}
