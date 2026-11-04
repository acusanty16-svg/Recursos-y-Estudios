/**
 * Modelo de dominio puro.
 * Regla arquitectónica: este archivo no importa React, DOM ni APIs del navegador.
 */

export const TRANSLATION_IDS = ['RV1960', 'NTV', 'NLT'] as const;
export type TranslationId = (typeof TRANSLATION_IDS)[number];

export type UiLanguage = 'es' | 'en';

export type Testament = 'old' | 'new';

export interface Translation {
  readonly id: TranslationId;
  readonly label: string;
  readonly shortLabel: string;
  readonly language: UiLanguage;
  readonly copyright: string;
}

export interface CanonBook {
  /** Número canónico 1..66. Coincide con el id numérico de bolls.life. */
  readonly number: number;
  /** Slug estable usado en URLs y almacenamiento. */
  readonly id: string;
  readonly nameEs: string;
  readonly nameEn: string;
  readonly abbrevEs: string;
  readonly abbrevEn: string;
  readonly testament: Testament;
  readonly chapters: number;
}

export interface Verse {
  readonly number: number;
  readonly text: string;
}

export interface Chapter {
  readonly translationId: TranslationId;
  readonly bookNumber: number;
  readonly chapter: number;
  readonly verses: readonly Verse[];
  /** Origen del dato: red o caché local. */
  readonly source: 'network' | 'cache';
  readonly fetchedAt: number;
}

/** Referencia bíblica normalizada, sin texto. */
export interface VerseReference {
  readonly bookNumber: number;
  readonly chapter: number;
  readonly verse: number;
}

export type NoteId = string;

export interface Note {
  readonly id: NoteId;
  readonly reference: VerseReference;
  readonly translationId: TranslationId;
  /** Texto libre escrito por el usuario. */
  readonly body: string;
  /** Etiquetas temáticas normalizadas (minúsculas, sin acentos). */
  readonly tags: readonly string[];
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface Highlight {
  readonly id: string;
  readonly reference: VerseReference;
  readonly translationId: TranslationId;
  readonly color: HighlightColor;
  readonly createdAt: number;
}

export const HIGHLIGHT_COLORS = ['gold', 'sage', 'sky', 'rose'] as const;
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];

export interface Bookmark {
  readonly id: string;
  readonly reference: VerseReference;
  readonly translationId: TranslationId;
  readonly createdAt: number;
}

export interface ReadingEvent {
  /** Clave determinista: día + libro + capítulo + traducción. Evita duplicados. */
  readonly id: string;
  /** Fecha local en formato YYYY-MM-DD. */
  readonly day: string;
  readonly bookNumber: number;
  readonly chapter: number;
  readonly translationId: TranslationId;
  readonly timestamp: number;
}

export interface StreakState {
  readonly current: number;
  readonly longest: number;
  /** Días de gracia usados en la semana ISO actual (0 o 1). */
  readonly graceUsedThisWeek: number;
  /** Lunes de la semana ISO de la última lectura, YYYY-MM-DD. */
  readonly weekKey: string;
  readonly lastReadDay: string | null;
  readonly totalDays: number;
}

export interface DailyVerse {
  readonly reference: VerseReference;
  readonly translationId: TranslationId;
}

export interface Preferences {
  readonly theme: 'dark' | 'light';
  readonly uiLanguage: UiLanguage;
  readonly fontScale: 1 | 1.125 | 1.25 | 1.5;
  readonly activeTranslation: TranslationId;
  readonly focusMode: boolean;
  readonly notificationsEnabled: boolean;
  readonly notificationTime: string;
}

export type ImportKind = 'versiculos' | 'plan-lectura' | 'recordatorios';

export interface ImportedFileMeta {
  readonly kind: ImportKind;
  readonly fileName: string;
  readonly importedAt: number;
  readonly itemCount: number;
}

export type LoadState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly chapter: Chapter }
  | { readonly status: 'error'; readonly message: string; readonly retryable: boolean };
