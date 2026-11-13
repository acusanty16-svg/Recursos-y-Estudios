import { useCallback, useMemo, useState } from 'react';
import {
  CHROMATIC_SHARP,
  SCALES,
  formatPitchName,
  getFretNote,
  getScaleRole,
  type NoteNaming,
  type PitchIndex,
  type ScaleId,
} from '@model/music';
import { playGuitarMidi } from '@controller/guitar-audio.service';
import { useI18n } from '@ui/hooks/useI18n';
import { VolumeIcon } from '@ui/components/icons';

const FRETS = Array.from({ length: 16 }, (_, i) => i);
const STRINGS: readonly (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];
const FRET_INLAYS = new Set([3, 5, 7, 9, 12, 15]);

interface QuizTarget {
  readonly stringNumber: 1 | 2 | 3 | 4 | 5 | 6;
  readonly pitchIndex: PitchIndex;
}

function pickRandomQuizTarget(onlyNaturals: boolean): QuizTarget {
  const strings: readonly (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];
  const naturalPitches: readonly PitchIndex[] = [0, 2, 4, 5, 7, 9, 11];
  const allPitches: readonly PitchIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const pool = onlyNaturals ? naturalPitches : allPitches;
  const stringNumber = strings[Math.floor(Math.random() * strings.length)] ?? 1;
  const pitchIndex = pool[Math.floor(Math.random() * pool.length)] ?? 0;
  return { stringNumber, pitchIndex };
}

/**
 * Diapasón interactivo de guitarra (15 trastes) con cifrado americano/latino,
 * escalas, filtro de notas naturales, entrenamiento auditivo/visual y sonido Web Audio.
 */
export function FretboardExplorer() {
  const { t, language } = useI18n();
  const [naming, setNaming] = useState<NoteNaming>('both');
  const [scaleId, setScaleId] = useState<ScaleId>('major');
  const [rootPitch, setRootPitch] = useState<PitchIndex>(0);
  const [onlyNatural, setOnlyNatural] = useState(false);
  const [highlightPitch, setHighlightPitch] = useState<PitchIndex | 'all'>('all');
  const [lastPlayedLabel, setLastPlayedLabel] = useState<string | null>(null);

  // Modo entrenamiento
  const [quizActive, setQuizActive] = useState(false);
  const [quizTarget, setQuizTarget] = useState<QuizTarget | null>(null);
  const [quizScore, setQuizScore] = useState({ hits: 0, attempts: 0 });
  const [quizFeedback, setQuizFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const toggleQuiz = useCallback(() => {
    if (quizActive) {
      setQuizActive(false);
      setQuizTarget(null);
      setQuizFeedback(null);
      return;
    }
    setQuizActive(true);
    setQuizScore({ hits: 0, attempts: 0 });
    setQuizFeedback(null);
    setQuizTarget(pickRandomQuizTarget(onlyNatural));
  }, [quizActive, onlyNatural]);

  const pitchOptions = useMemo(
    () =>
      CHROMATIC_SHARP.map((_, idx) => {
        const pitch = idx as PitchIndex;
        return {
          pitch,
          label: formatPitchName(pitch, naming),
        };
      }),
    [naming],
  );

  const handleFretClick = (stringNumber: 1 | 2 | 3 | 4 | 5 | 6, fret: number): void => {
    const note = getFretNote(stringNumber, fret);
    playGuitarMidi(note.midi);
    const label = `${note.american} (${note.latin}${note.octave}) · ${stringNumber}ª traste ${fret}`;
    setLastPlayedLabel(label);

    if (!quizActive || !quizTarget) return;

    const isMatch = note.stringNumber === quizTarget.stringNumber && note.pitchIndex === quizTarget.pitchIndex;
    setQuizScore((prev) => ({
      hits: prev.hits + (isMatch ? 1 : 0),
      attempts: prev.attempts + 1,
    }));

    if (isMatch) {
      setQuizFeedback({
        ok: true,
        text: `${t('music.quizCorrect')} ${formatPitchName(note.pitchIndex, naming)}`,
      });
      setQuizTarget(pickRandomQuizTarget(onlyNatural));
    } else {
      setQuizFeedback({
        ok: false,
        text: `${t('music.quizTryAgain')} ${formatPitchName(note.pitchIndex, naming)} (${note.stringNumber}ª)`,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Barra de controles */}
      <div className="sv-card grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Cifrado */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase">
            {t('music.notation')}
          </label>
          <div className="grid grid-cols-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-0.5 text-xs">
            {(
              [
                { id: 'american', label: 'C D E' },
                { id: 'latin', label: 'Do Re Mi' },
                { id: 'both', label: t('music.both') },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setNaming(opt.id)}
                className={[
                  'rounded-md px-2 py-1.5 font-medium transition',
                  naming === opt.id
                    ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tónica */}
        <div>
          <label
            htmlFor="fret-root-select"
            className="mb-1.5 block text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase"
          >
            {t('music.root')}
          </label>
          <select
            id="fret-root-select"
            value={rootPitch}
            onChange={(e) => setRootPitch(Number(e.target.value) as PitchIndex)}
            className="sv-input w-full text-sm"
          >
            {pitchOptions.map((opt) => (
              <option key={opt.pitch} value={opt.pitch}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Escala */}
        <div>
          <label
            htmlFor="fret-scale-select"
            className="mb-1.5 block text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase"
          >
            {t('music.scale')}
          </label>
          <select
            id="fret-scale-select"
            value={scaleId}
            onChange={(e) => setScaleId(e.target.value as ScaleId)}
            className="sv-input w-full text-sm"
          >
            {SCALES.map((scale) => (
              <option key={scale.id} value={scale.id}>
                {language === 'es' ? scale.nameEs : scale.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Resaltar nota / Naturales */}
        <div className="flex flex-col justify-between gap-2">
          <div>
            <label
              htmlFor="fret-highlight-select"
              className="mb-1.5 block text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase"
            >
              {t('music.highlightNote')}
            </label>
            <select
              id="fret-highlight-select"
              value={highlightPitch === 'all' ? 'all' : String(highlightPitch)}
              onChange={(e) =>
                setHighlightPitch(e.target.value === 'all' ? 'all' : (Number(e.target.value) as PitchIndex))
              }
              className="sv-input w-full text-sm"
            >
              <option value="all">{t('music.allNotes')}</option>
              {pitchOptions.map((opt) => (
                <option key={opt.pitch} value={opt.pitch}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fila secundaria: Naturales + Quiz + última nota tocada */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyNatural((prev) => !prev)}
            className={[
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
              onlyNatural
                ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]',
            ].join(' ')}
          >
            {t('music.onlyNatural')}
          </button>

          <button
            type="button"
            onClick={toggleQuiz}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              quizActive ? 'sv-btn sv-btn-primary' : 'sv-btn sv-btn-ghost border border-[var(--border)]',
            ].join(' ')}
          >
            {quizActive ? t('music.quizStop') : t('music.quizStart')}
          </button>
        </div>

        {/* Leyenda de colores */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
            {t('music.legendRoot')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
            {t('music.legendChord')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            {t('music.legendScale')}
          </span>
          {lastPlayedLabel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--ink)]">
              <VolumeIcon className="h-3 w-3 text-[var(--accent)]" />
              {lastPlayedLabel}
            </span>
          )}
        </div>
      </div>

      {/* Banner de Entrenamiento */}
      {quizActive && quizTarget && (
        <div className="sv-card flex flex-wrap items-center justify-between gap-3 border-[var(--accent)]/35 bg-[var(--accent)]/5 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-[var(--muted)]">{t('music.quizPrompt')}</span>
            <span className="rounded-lg bg-[var(--accent)] px-2.5 py-0.5 font-mono text-sm font-bold text-[#FBF9F2]">
              {formatPitchName(quizTarget.pitchIndex, naming)}
            </span>
            <span className="text-xs font-semibold text-[var(--ink)]">
              ({t('music.quizString')} {quizTarget.stringNumber}ª)
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {quizFeedback && (
              <span className={quizFeedback.ok ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-amber-600 dark:text-amber-400'}>
                {quizFeedback.text}
              </span>
            )}
            <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 font-mono font-semibold text-[var(--ink)]">
              {quizScore.hits}/{quizScore.attempts}
            </span>
          </div>
        </div>
      )}

      {/* Diapasón visual interactivo (scroll horizontal suave en móviles) */}
      <div className="sv-card overflow-x-auto p-4">
        <div className="min-w-[820px]">
          {/* Números de traste */}
          <div className="mb-1.5 grid grid-cols-[54px_repeat(15,minmax(0,1fr))] items-center text-center text-[11px] font-mono text-[var(--muted)]">
            <span className="font-semibold">0 (Al aire)</span>
            {FRETS.slice(1).map((fret) => (
              <span
                key={fret}
                className={FRET_INLAYS.has(fret) ? 'font-bold text-[var(--ink)]' : ''}
              >
                {fret === 12 ? '12 ••' : FRET_INLAYS.has(fret) ? `${fret} •` : fret}
              </span>
            ))}
          </div>

          {/* Cuerpo del mástil (ébano mate sobrio) */}
          <div className="relative rounded-xl border border-navy-700/60 bg-gradient-to-b from-[#17191f] to-[#101217] p-2.5 shadow-inner">
            <div className="space-y-1">
              {STRINGS.map((stringNumber) => {
                const stringThickness = 1 + (stringNumber - 1) * 0.32;
                return (
                  <div
                    key={stringNumber}
                    className="relative grid grid-cols-[54px_repeat(15,minmax(0,1fr))] items-center py-1.5"
                  >
                    {/* Línea física de la cuerda */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-2 left-12 bg-gradient-to-r from-[#d2c6ae]/70 via-[#e8e0cf]/75 to-[#b8ab92]/60"
                      style={{ height: `${stringThickness}px` }}
                    />

                    {FRETS.map((fret) => {
                      const note = getFretNote(stringNumber, fret);
                      const role = getScaleRole(note.pitchIndex, rootPitch, scaleId);
                      const passesNatural = !onlyNatural || note.isNatural;
                      const passesHighlight = highlightPitch === 'all' || note.pitchIndex === highlightPitch;
                      const showBadge =
                        !quizActive &&
                        passesNatural &&
                        passesHighlight &&
                        (scaleId === 'all' ? highlightPitch !== 'all' || note.isNatural || fret === 0 : role !== 'none');

                      const badgeColors =
                        role === 'root'
                          ? 'bg-ember-400 text-navy-950 ring-2 ring-parchment-50/35'
                          : role === 'chord-tone'
                            ? 'bg-parchment-100 text-navy-950'
                            : scaleId === 'all'
                              ? note.isNatural
                                ? 'bg-parchment-100/90 text-navy-950'
                                : 'bg-white/15 text-parchment-100'
                              : 'bg-sky-300/85 text-navy-950';

                      const displayNote =
                        naming === 'american'
                          ? note.american
                          : naming === 'latin'
                            ? note.latin
                            : `${note.american}/${note.latin}`;

                      return (
                        <button
                          key={fret}
                          type="button"
                          onClick={() => handleFretClick(stringNumber, fret)}
                          aria-label={`${stringNumber}ª cuerda traste ${fret}: ${note.american} ${note.latin}`}
                          className={[
                            'group relative z-10 flex h-8 items-center justify-center transition focus:outline-none',
                            fret === 0
                              ? 'border-r-4 border-[#e9e3d5] bg-[#0b0d11]/70'
                              : 'border-r border-[#8d929e]/30 hover:bg-white/[0.04]',
                          ].join(' ')}
                        >
                          {quizActive ? (
                            <span className="h-3 w-3 rounded-full bg-white/15 opacity-0 transition group-hover:bg-[var(--accent)] group-hover:opacity-100" />
                          ) : (
                            <span
                              className={[
                                'inline-flex items-center justify-center rounded-full font-mono font-bold shadow-sm transition-transform group-hover:scale-110',
                                naming === 'both' ? 'px-1.5 py-0.5 text-[9px]' : 'h-6 min-w-6 px-1 text-[10px]',
                                showBadge ? badgeColors : 'bg-white/10 text-white/40 opacity-35 group-hover:opacity-90',
                              ].join(' ')}
                            >
                              {displayNote}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
