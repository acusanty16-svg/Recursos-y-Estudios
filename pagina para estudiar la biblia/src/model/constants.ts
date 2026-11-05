import type { Preferences, Translation, TranslationId } from './types';

export const APP_NAME = "Santi's Versicles";
export const APP_SHORT_NAME = 'SV';
export const APP_TAGLINE_ES = 'Lectura profunda, un día a la vez.';
export const APP_TAGLINE_EN = 'Deep reading, one day at a time.';

export const TRANSLATIONS: readonly Translation[] = [
  {
    id: 'RV1960',
    label: 'Reina-Valera 1960',
    shortLabel: 'RV1960',
    language: 'es',
    copyright: 'Reina-Valera 1960 © Sociedades Bíblicas Unidas. Uso personal.',
  },
  {
    id: 'NTV',
    label: 'Nueva Traducción Viviente',
    shortLabel: 'NTV',
    language: 'es',
    copyright: 'Nueva Traducción Viviente © Tyndale House Foundation. Uso personal.',
  },
  {
    id: 'NLT',
    label: 'New Living Translation',
    shortLabel: 'NLT',
    language: 'en',
    copyright: 'New Living Translation © Tyndale House Foundation. Personal use only.',
  },
];

const TRANSLATION_MAP = new Map<TranslationId, Translation>(
  TRANSLATIONS.map((translation) => [translation.id, translation]),
);

export function getTranslation(id: TranslationId): Translation {
  const translation = TRANSLATION_MAP.get(id);
  if (!translation) {
    throw new Error(`Traducción desconocida: ${id}`);
  }
  return translation;
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'dark',
  uiLanguage: 'es',
  fontScale: 1.125,
  activeTranslation: 'RV1960',
  focusMode: false,
  notificationsEnabled: false,
  notificationTime: '07:00',
};

/** Claves de localStorage (preferencias ligeras). Los datos pesados viven en IndexedDB. */
export const STORAGE_KEYS = {
  preferences: 'sv.preferences.v1',
  streak: 'sv.streak.v1',
  onboarding: 'sv.onboarding.v1',
  syncTombstones: 'sv.sync.tombstones.v1',
} as const;

/** Nombre y versión de la base IndexedDB. */
export const DB_NAME = 'santis-versicles';
export const DB_VERSION = 2;

/** Límites de dominio. */
export const MAX_NOTE_LENGTH = 5000;
export const MAX_TAGS_PER_NOTE = 8;
export const MAX_TAG_LENGTH = 24;
export const MAX_IMPORT_BYTES = 25 * 1024 * 1024;
export const CHAPTER_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 365;

/** Endpoint público sin API key. Se aísla aquí para poder sustituirlo sin tocar el controlador. */
export const BIBLE_API_BASE = 'https://bolls.life';
export const BIBLE_API_CHAPTER_PATH = '/get-chapter';

/** Rutas de la aplicación. */
export const ROUTES = {
  dashboard: '/',
  reader: '/leer',
  notes: '/notas',
  import: '/importar',
  api: '/api',
  settings: '/ajustes',
} as const;

/** Etiquetas temáticas sugeridas (el usuario puede crear otras). */
export const SUGGESTED_TAGS = [
  'fe',
  'esperanza',
  'amor',
  'ansiedad',
  'gratitud',
  'oracion',
  'sabiduria',
  'perdon',
  'fortaleza',
  'proposito',
] as const;
