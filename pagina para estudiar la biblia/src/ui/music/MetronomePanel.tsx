import { motion } from 'motion/react';
import {
  setMetronomeBpm,
  setMetronomeSignature,
  tapMetronomeTempo,
  toggleMetronome,
  toggleMetronomeAccent,
  useMetronomeState,
  type TimeSignatureOption,
} from '@controller/metronome.service';
import { useI18n } from '@ui/hooks/useI18n';
import { PauseIcon, PlayIcon } from '@ui/components/icons';

const SIGNATURES: readonly TimeSignatureOption[] = ['2/4', '3/4', '4/4', '6/8'];

const PRESETS: readonly { readonly bpm: number; readonly labelKey: 'music.presetSlow' | 'music.presetBallad' | 'music.presetMid' | 'music.presetFast' }[] = [
  { bpm: 65, labelKey: 'music.presetSlow' },
  { bpm: 76, labelKey: 'music.presetBallad' },
  { bpm: 92, labelKey: 'music.presetMid' },
  { bpm: 126, labelKey: 'music.presetFast' },
];

/**
 * Metrónomo de estudio basado en Web Audio API (lookahead scheduler):
 * - Marcador visual animado por tiempo con física spring.
 * - Compases 2/4, 3/4, 4/4, 6/8, acento en el primer tiempo y Tap Tempo.
 */
export function MetronomePanel() {
  const { t, language } = useI18n();
  const metro = useMetronomeState();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="sv-card space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <h2 className="font-serif text-2xl font-medium text-[var(--ink)]">{t('music.metronomeTitle')}</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">{t('music.metronomeSubtitle')}</p>
          </div>
          <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-xs">
            {SIGNATURES.map((sig) => (
              <button
                key={sig}
                type="button"
                onClick={() => setMetronomeSignature(sig)}
                className={[
                  'rounded-md px-3 py-1.5 font-mono font-semibold transition',
                  metro.timeSignature === sig
                    ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]',
                ].join(' ')}
              >
                {sig}
              </button>
            ))}
          </div>
        </div>

        {/* Visualizador de tiempos animado */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="flex items-center gap-3.5 sm:gap-5">
            {Array.from({ length: metro.beatsPerBar }, (_, idx) => {
              const isActive = metro.running && metro.currentBeat === idx;
              const isAccent = idx === 0 && metro.accentFirstBeat;
              return (
                <motion.div
                  key={idx}
                  animate={
                    isActive
                      ? { scale: isAccent ? 1.32 : 1.18, opacity: 1 }
                      : { scale: 1, opacity: 0.42 }
                  }
                  transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs font-bold transition-colors sm:h-12 sm:w-12',
                    isActive
                      ? isAccent
                        ? 'border-ember-400 bg-ember-400 text-navy-950 shadow-[0_0_24px_-4px_rgb(224_180_90_/_0.55)]'
                        : 'border-ember-400/60 bg-ember-400/20 text-[var(--ink)]'
                      : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]',
                  ].join(' ')}
                >
                  {idx + 1}
                </motion.div>
              );
            })}
          </div>

          {/* Lectura grande del BPM */}
          <div className="mt-8 flex items-baseline gap-2">
            <span className="font-mono text-6xl font-bold tracking-tight tabular-nums text-[var(--ink)]">
              {metro.bpm}
            </span>
            <span className="font-mono text-xs font-semibold tracking-widest text-[var(--muted)] uppercase">
              BPM
            </span>
          </div>

          {/* Controles finos + slider */}
          <div className="mt-5 flex w-full max-w-md items-center gap-2">
            <button
              type="button"
              onClick={() => setMetronomeBpm(metro.bpm - 5)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 font-mono text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => setMetronomeBpm(metro.bpm - 1)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 font-mono text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
            >
              -1
            </button>
            <input
              type="range"
              min={40}
              max={220}
              value={metro.bpm}
              onChange={(e) => setMetronomeBpm(Number(e.target.value))}
              aria-label="BPM"
              className="mx-2 flex-1 accent-[var(--accent)]"
            />
            <button
              type="button"
              onClick={() => setMetronomeBpm(metro.bpm + 1)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 font-mono text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => setMetronomeBpm(metro.bpm + 5)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 font-mono text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
            >
              +5
            </button>
          </div>
        </div>

        {/* Botones principales: Iniciar/Detener, Tap Tempo, Acento */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-[var(--border)] pt-5">
          <button
            type="button"
            onClick={toggleMetronome}
            className="sv-btn sv-btn-primary min-w-36"
          >
            {metro.running ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            {metro.running
              ? language === 'es'
                ? 'Detener'
                : 'Stop'
              : language === 'es'
                ? 'Iniciar'
                : 'Start'}
          </button>

          <button
            type="button"
            onClick={() => tapMetronomeTempo()}
            className="sv-btn sv-btn-ghost border border-[var(--border)] font-mono text-xs font-semibold"
          >
            {t('music.tapTempo')}
          </button>

          <button
            type="button"
            onClick={toggleMetronomeAccent}
            className={[
              'rounded-lg border px-3 py-2 text-xs font-medium transition',
              metro.accentFirstBeat
                ? 'border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--muted)]',
            ].join(' ')}
          >
            {t('music.accentFirst')}
          </button>
        </div>

        {/* Presets rápidos de estudio / adoración */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.bpm}
              type="button"
              onClick={() => setMetronomeBpm(preset.bpm)}
              className={[
                'rounded-full border px-3 py-1 font-mono text-[11px] font-medium transition',
                metro.bpm === preset.bpm
                  ? 'border-[var(--accent)] bg-[var(--accent)]/12 text-[var(--accent)]'
                  : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]',
              ].join(' ')}
            >
              {t(preset.labelKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
