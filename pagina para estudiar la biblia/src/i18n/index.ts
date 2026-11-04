import { es, type TranslationKey } from './es';
import { en } from './en';
import type { UiLanguage } from '../model/types';

export type { TranslationKey };

const DICTIONARIES = { es, en } as const;

export function translate(language: UiLanguage, key: TranslationKey): string {
  return DICTIONARIES[language][key];
}

export function createTranslator(language: UiLanguage): (key: TranslationKey) => string {
  const dictionary = DICTIONARIES[language];
  return (key) => dictionary[key];
}

/** Locale BCP-47 para Intl. */
export function intlLocale(language: UiLanguage): string {
  return language === 'es' ? 'es-ES' : 'en-US';
}

export { es, en };
