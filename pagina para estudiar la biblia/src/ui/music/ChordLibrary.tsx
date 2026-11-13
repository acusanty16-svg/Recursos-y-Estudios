import { useMemo, useState } from 'react';
import {
  getChordVoicings,
  getDiatonicChordsForKey,
  getVoicingMidiNotes,
} from '@model/music';
import { strumGuitarChord } from '@controller/guitar-audio.service';
import { useI18n } from '@ui/hooks/useI18n';
import { ChordDiagram } from './ChordDiagram';
import { SearchIcon, VolumeIcon } from '@ui/components/icons';

const COMMON_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

/**
 * Diccionario de acordes y explorador de Círculo Armónico por tonalidad,
 * pensado para tocar cantos de adoración con variantes worship (sus2, add9, maj7, inversiones).
 */
export function ChordLibrary() {
  const { t, language } = useI18n();
  const [harmonicKey, setHarmonicKey] = useState<string>('G');
  const [mode, setMode] = useState<'major' | 'minor'>('major');
  const [query, setQuery] = useState('');
  const [selectedChord, setSelectedChord] = useState<string>('G');
  const [voicingIndex, setVoicingIndex] = useState(0);

  const diatonic = useMemo(() => getDiatonicChordsForKey(harmonicKey, mode), [harmonicKey, mode]);

  const activeChordSymbol = query.trim() || selectedChord;
  const voicings = useMemo(() => getChordVoicings(activeChordSymbol), [activeChordSymbol]);
  const activeVoicing = voicings[Math.min(voicingIndex, Math.max(0, voicings.length - 1))];

  const handleSelectChord = (symbol: string): void => {
    setQuery('');
    setSelectedChord(symbol);
    setVoicingIndex(0);
    const list = getChordVoicings(symbol);
    const first = list[0];
    if (first) strumGuitarChord(getVoicingMidiNotes(first));
  };

  return (
    <div className="space-y-6">
      {/* Buscador directo + Círculo armónico */}
      <div className="sv-card space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{t('music.harmonicKey')}</h3>
            <p className="text-xs text-[var(--muted)]">
              {language === 'es'
                ? 'Elige una tonalidad para ver sus grados I–vi y variantes comunes en guitarra.'
                : 'Pick a key to view its I–vi diatonic degrees and common worship voicings.'}
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode('major')}
              className={[
                'rounded-md px-3 py-1 font-medium transition',
                mode === 'major' ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]',
              ].join(' ')}
            >
              {t('music.majorMode')}
            </button>
            <button
              type="button"
              onClick={() => setMode('minor')}
              className={[
                'rounded-md px-3 py-1 font-medium transition',
                mode === 'minor' ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]',
              ].join(' ')}
            >
              {t('music.minorMode')}
            </button>
          </div>
        </div>

        {/* Botones de 12 tonalidades */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_KEYS.map((key) => {
            const active = harmonicKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setHarmonicKey(key);
                  handleSelectChord(mode === 'minor' ? `${key}m` : key);
                }}
                className={[
                  'min-w-[40px] rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition',
                  active
                    ? 'bg-[var(--accent)] text-[#FBF9F2] shadow-sm'
                    : 'border border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink)] hover:border-[var(--accent)]',
                ].join(' ')}
              >
                {key}
                {mode === 'minor' ? 'm' : ''}
              </button>
            );
          })}
        </div>

        {/* Acordes diatónicos de la tonalidad */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {diatonic.map((item) => (
            <div
              key={item.degree}
              className={[
                'rounded-xl border p-3 transition',
                activeChordSymbol === item.symbol
                  ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                  : 'border-[var(--border)] bg-[var(--surface-2)]/60',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectChord(item.symbol)}
                  className="flex items-baseline gap-2 text-left"
                >
                  <span className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--muted)]">
                    {item.degree}
                  </span>
                  <span className="font-mono text-base font-bold text-[var(--ink)] hover:text-[var(--accent)]">
                    {item.symbol}
                  </span>
                </button>
                <span className="text-[11px] text-[var(--muted)]">
                  {language === 'es' ? item.roleEs : item.roleEn}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.worshipVariants.map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => handleSelectChord(variant)}
                    className={[
                      'rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold transition',
                      activeChordSymbol === variant
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[#FBF9F2]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--ink)]',
                    ].join(' ')}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buscador libre + Visor del acorde elegido */}
      <div className="sv-card grid gap-6 p-5 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVoicingIndex(0);
              }}
              placeholder={t('music.searchChord')}
              className="sv-input w-full pl-9 font-mono text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h4 className="font-mono text-2xl font-bold text-[var(--ink)]">{activeChordSymbol}</h4>
            {activeVoicing && (
              <button
                type="button"
                onClick={() => strumGuitarChord(getVoicingMidiNotes(activeVoicing))}
                className="sv-btn sv-btn-primary text-xs"
              >
                <VolumeIcon className="h-3.5 w-3.5" />
                {t('music.strum')}
              </button>
            )}
          </div>

          {voicings.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--muted)]">
                {language === 'es' ? 'Posiciones disponibles:' : 'Available voicings:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {voicings.map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setVoicingIndex(idx);
                      strumGuitarChord(getVoicingMidiNotes(v));
                    }}
                    className={[
                      'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
                      idx === voicingIndex
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                        : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]',
                    ].join(' ')}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          {activeVoicing && <ChordDiagram symbol={activeChordSymbol} voicing={activeVoicing} />}
        </div>
      </div>
    </div>
  );
}
