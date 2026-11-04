import { useMemo } from 'react';
import { createTranslator, intlLocale, type TranslationKey } from '@i18n';
import { useAppStore } from '@controller/store';

export interface I18n {
  readonly t: (key: TranslationKey) => string;
  readonly language: 'es' | 'en';
  readonly locale: string;
}

export function useI18n(): I18n {
  const { preferences } = useAppStore();
  const language = preferences.uiLanguage;
  const t = useMemo(() => createTranslator(language), [language]);
  const locale = useMemo(() => intlLocale(language), [language]);
  return { t, language, locale };
}

export function formatLongDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date);
}

export function formatShortDate(timestamp: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(timestamp));
}

export function formatRelativeDay(day: string, locale: string): string {
  const parsed = new Date(`${day}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return day;
  return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric' }).format(parsed);
}
