import { describe, expect, it } from 'vitest';
import type { LampVerseEntry } from '../rsc';
import { formatLampReference, resolveLampTranslation } from './lamp-club.controller';
import { setUiLanguage } from './preferences.controller';
import { appStore } from './store';

const SAMPLE_ENTRY: LampVerseEntry = {
  id: 'lamp-1-2',
  level: 1,
  bookNumber: 43,
  chapter: 3,
  verseStart: 16,
  verseEnd: 16,
  referenceLabel: 'San Juan 3:16',
};

describe('Club de la Lámpara — idioma ES/EN de versículos', () => {
  it('resuelve traducción española (RV1960/NTV) cuando la UI está en español y NLT cuando está en inglés', () => {
    expect(resolveLampTranslation('es', 'NLT')).toBe('RV1960');
    expect(resolveLampTranslation('es', 'RV1960')).toBe('RV1960');
    expect(resolveLampTranslation('es', 'NTV')).toBe('NTV');
    expect(resolveLampTranslation('en', 'RV1960')).toBe('NLT');
    expect(resolveLampTranslation('en', 'NTV')).toBe('NLT');
  });

  it('localiza la cita del versículo entre español e inglés', () => {
    expect(formatLampReference(SAMPLE_ENTRY, 'es')).toBe('San Juan 3:16');
    expect(formatLampReference(SAMPLE_ENTRY, 'en')).toBe('John 3:16');
    expect(
      formatLampReference({ ...SAMPLE_ENTRY, verseStart: 1, verseEnd: 3 }, 'en'),
    ).toBe('John 3:1-3');
  });

  it('al cambiar idioma de la página con setUiLanguage alinea la traducción bíblica entre ES y EN', () => {
    setUiLanguage('en');
    expect(appStore.getState().preferences.uiLanguage).toBe('en');
    expect(appStore.getState().preferences.activeTranslation).toBe('NLT');

    setUiLanguage('es');
    expect(appStore.getState().preferences.uiLanguage).toBe('es');
    expect(appStore.getState().preferences.activeTranslation).toBe('RV1960');
  });
});
