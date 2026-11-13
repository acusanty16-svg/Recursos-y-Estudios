import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { getBookByNumber } from '@model/canon';
import { formatChapterLabel, formatReference, toDayKey } from '@model/reference';
import { computeStats, lastSevenDays } from '@seguimiento/stats';
import { hasGraceAvailable } from '@seguimiento/streak';
import { TOTAL_LAMP_VERSES } from '@rsc/club-lampara';
import { VERSICULOS_MOCK } from '@rsc';
import { goToChapter } from '@controller/app.controller';
import { getEffectiveSongs } from '@controller/music.controller';
import { useAppStore } from '@controller/store';
import { useI18n, formatLongDate, formatRelativeDay } from '@ui/hooks/useI18n';
import { PageHeader } from '@ui/components/PageHeader';
import { InteractiveSurface, StaggerGroup, StaggerItem } from '@ui/components/MotionPrimitives';
import { VerseShareDialog } from '@ui/components/VerseShareDialog';
import {
  BookIcon,
  ChevronRightIcon,
  FlameIcon,
  MemorizeIcon,
  MicIcon,
  MusicIcon,
  PlusIcon,
  ShareIcon,
} from '@ui/components/icons';

function hashDay(day: string): number {
  let hash = 0;
  for (let index = 0; index < day.length; index += 1) {
    hash = (hash * 31 + day.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function pickVerseOfDay(day: string) {
  const { verses } = VERSICULOS_MOCK;
  if (verses.length === 0) return null;
  const index = hashDay(day) % verses.length;
  return verses[index] ?? null;
}

export function DashboardPage() {
  const state = useAppStore();
  const { t, language, locale } = useI18n();
  const today = toDayKey();
  const [shareOpen, setShareOpen] = useState(false);

  const stats = useMemo(
    () =>
      computeStats({
        events: state.events,
        notes: state.notes,
        highlights: state.highlights,
        currentStreak: state.streak.current,
        longestStreak: state.streak.longest,
        today,
      }),
    [state.events, state.notes, state.highlights, state.streak.current, state.streak.longest, today],
  );

  const activity = useMemo(() => lastSevenDays(state.events, today), [state.events, today]);
  const verse = useMemo(() => pickVerseOfDay(today), [today]);
  const effectiveSongs = useMemo(() => getEffectiveSongs(state.songs), [state.songs]);

  const verseText = verse
    ? (verse.translations[state.preferences.activeTranslation] ??
        verse.translations.RV1960 ??
        verse.translations.NTV ??
        verse.translations.NLT ??
        '')
    : '';

  const verseCitation = verse
    ? formatReference({ bookNumber: verse.bookNumber, chapter: verse.chapter, verse: verse.verse }, language)
    : '';

  const book = getBookByNumber(state.location.bookNumber);
  const locationLabel = book ? formatChapterLabel(book.number, state.location.chapter, language) : '';

  const lampCount = state.lampClub.length;
  const lampPercent = Math.min(100, Math.round((lampCount / TOTAL_LAMP_VERSES) * 100));
  const sermonStudyNotes = useMemo(
    () =>
      state.notes
        .filter((n) => n.category === 'sermon' || n.category === 'study' || n.category === 'seminar')
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [state.notes],
  );
  const latestNote = sermonStudyNotes[0] ?? state.notes[0] ?? null;
  const featuredSong = effectiveSongs[hashDay(today) % Math.max(1, effectiveSongs.length)] ?? null;
  const graceAvailable = hasGraceAvailable(state.streak);

  return (
    <StaggerGroup className="space-y-8">
      <StaggerItem>
        <PageHeader
          eyebrow={formatLongDate(new Date(), locale)}
          title={t('dashboard.title')}
          subtitle={t('dashboard.subtitle')}
        />
      </StaggerItem>

      {/* 1. Versículo del día: protagonista editorial sin ruido decorativo */}
      <StaggerItem>
        <section className="sv-card-hero" aria-labelledby="votd-title">
          <div className="border-l-2 border-ember-600 pl-5 sm:pl-6 dark:border-ember-400">
            <p id="votd-title" className="sv-label text-ember-700 dark:text-ember-400">
              {t('dashboard.verseOfDay')}
            </p>
            {verse ? (
              <>
                <blockquote className="mt-3 max-w-3xl font-serif text-xl leading-[1.68] text-navy-900 sm:text-2xl dark:text-parchment-50">
                  “{verseText}”
                </blockquote>
                <p className="mt-4 font-mono text-xs font-semibold tracking-wide text-ember-700 uppercase dark:text-ember-400">
                  {verseCitation} · {state.preferences.activeTranslation}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-navy-500 dark:text-navy-300">{t('dashboard.noActivity')}</p>
            )}
          </div>

          {verse ? (
            <div className="mt-6 flex flex-wrap items-center gap-2.5 pl-5 sm:pl-6">
              <Link
                to={ROUTES.reader}
                state={{ verse: verse.verse }}
                onClick={() => void goToChapter(verse.bookNumber, verse.chapter)}
                className="sv-btn sv-btn-primary text-xs"
              >
                <BookIcon size={15} />
                {t('notes.openInReader')}
                <ChevronRightIcon size={14} />
              </Link>
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="sv-btn sv-btn-ghost border border-navy-900/12 text-xs dark:border-parchment-100/12"
              >
                <ShareIcon size={14} />
                {t('share.button')}
              </button>
            </div>
          ) : null}
        </section>
      </StaggerItem>

      {/* 2. Franja de lectura actual + racha compacta */}
      <StaggerItem>
        <section
          aria-labelledby="continue-title"
          className="sv-card flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
        >
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p id="continue-title" className="sv-label mb-1">
                {t('dashboard.continueReading')}
              </p>
              <p className="font-serif text-2xl font-medium text-navy-900 dark:text-parchment-50">
                {locationLabel}
              </p>
              <p className="mt-0.5 text-xs text-navy-400 dark:text-navy-300">
                {t('dashboard.lastRead')}:{' '}
                {state.streak.lastReadDay ? state.streak.lastReadDay : t('dashboard.never')}
              </p>
            </div>

            <div className="hidden h-10 w-px bg-navy-900/10 sm:block dark:bg-parchment-100/10" />

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex size-10 items-center justify-center rounded-lg border ${
                  state.streak.current > 0
                    ? 'border-ember-500/25 bg-ember-500/10 text-ember-700 dark:border-ember-400/25 dark:text-ember-400'
                    : 'border-navy-900/10 bg-parchment-100 text-navy-400 dark:border-parchment-100/10 dark:bg-navy-800 dark:text-navy-300'
                }`}
              >
                <FlameIcon size={19} />
              </span>
              <div>
                <p className="font-mono text-sm font-semibold tabular-nums text-navy-900 dark:text-parchment-50">
                  {state.streak.current} {state.streak.current === 1 ? t('dashboard.day') : t('dashboard.days')}
                </p>
                <p className="text-xs text-navy-400 dark:text-navy-300">
                  {t('dashboard.bestStreak')}: {state.streak.longest}
                  {graceAvailable ? ' · 1 gracia' : ''}
                </p>
              </div>
            </div>
          </div>

          <Link to={ROUTES.reader} className="sv-btn sv-btn-primary shrink-0 self-start sm:self-auto">
            <BookIcon size={16} />
            {t('dashboard.startReading')}
          </Link>
        </section>
      </StaggerItem>

      {/* 3. Tres pilares personales: Club de la Lámpara, Notas y Música */}
      <StaggerItem>
        <div className="grid gap-4 md:grid-cols-3">
          <InteractiveSurface>
            <section className="sv-card-interactive flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <MemorizeIcon size={18} className="text-ember-700 dark:text-ember-400" />
                  <span className="font-mono text-xs font-semibold tabular-nums text-ember-700 dark:text-ember-400">
                    {lampCount} / {TOTAL_LAMP_VERSES}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-lg font-medium text-navy-900 dark:text-parchment-50">
                  {t('lamp.title')}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-navy-500 dark:text-navy-300">
                  {t('lamp.subtitle')}
                </p>
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-navy-900/10 dark:bg-parchment-100/10">
                  <div
                    className="h-full rounded-full bg-ember-600 transition-all duration-500 dark:bg-ember-400"
                    style={{ width: `${lampPercent}%` }}
                  />
                </div>
              </div>
              <Link
                to={ROUTES.notes}
                state={{ tab: 'memorize' }}
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-ember-700 hover:underline dark:text-ember-400"
              >
                {t('lamp.practice')}
                <ChevronRightIcon size={14} />
              </Link>
            </section>
          </InteractiveSurface>

          <InteractiveSurface>
            <section className="sv-card-interactive flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <MicIcon size={18} className="text-ember-700 dark:text-ember-400" />
                  <span className="font-mono text-xs font-semibold tabular-nums text-navy-500 dark:text-navy-300">
                    {state.notes.length}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-lg font-medium text-navy-900 dark:text-parchment-50">
                  {t('nav.notes')}
                </h2>
                <p className="mt-1 truncate text-xs leading-relaxed text-navy-500 dark:text-navy-300">
                  {latestNote
                    ? latestNote.title || latestNote.body.slice(0, 60)
                    : language === 'es'
                      ? 'Prédicas, estudios y apuntes por pasaje.'
                      : 'Sermons, studies and verse notes.'}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between gap-2">
                <Link
                  to={ROUTES.notes}
                  state={{ createNew: true, category: 'sermon' }}
                  className="inline-flex items-center gap-1 rounded-md border border-navy-900/12 px-2.5 py-1 text-xs font-medium text-navy-800 transition hover:border-ember-600/40 dark:border-parchment-100/12 dark:text-parchment-100"
                >
                  <PlusIcon size={13} />
                  {t('notes.newNote')}
                </Link>
                <Link
                  to={ROUTES.notes}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ember-700 hover:underline dark:text-ember-400"
                >
                  {t('common.all')}
                  <ChevronRightIcon size={14} />
                </Link>
              </div>
            </section>
          </InteractiveSurface>

          <InteractiveSurface>
            <section className="sv-card-interactive flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <MusicIcon size={18} className="text-ember-700 dark:text-ember-400" />
                  <span className="font-mono text-xs font-semibold tabular-nums text-navy-500 dark:text-navy-300">
                    {effectiveSongs.length}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-lg font-medium text-navy-900 dark:text-parchment-50">
                  {t('music.title')}
                </h2>
                <p className="mt-1 truncate text-xs leading-relaxed text-navy-500 dark:text-navy-300">
                  {featuredSong ? `${featuredSong.title} · ${featuredSong.originalKey}` : t('music.subtitle')}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <Link
                  to={ROUTES.music}
                  state={featuredSong ? { tab: 'songs', songId: featuredSong.id } : { tab: 'songs' }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ember-700 hover:underline dark:text-ember-400"
                >
                  {t('music.tabSongs')}
                  <ChevronRightIcon size={14} />
                </Link>
                <div className="flex items-center gap-3 text-xs text-navy-400 dark:text-navy-300">
                  <Link to={ROUTES.music} state={{ tab: 'fretboard' }} className="hover:text-navy-900 dark:hover:text-parchment-100">
                    {t('music.tabFretboard')}
                  </Link>
                  <Link to={ROUTES.music} state={{ tab: 'metronome' }} className="hover:text-navy-900 dark:hover:text-parchment-100">
                    {t('music.tabMetronome')}
                  </Link>
                </div>
              </div>
            </section>
          </InteractiveSurface>
        </div>
      </StaggerItem>

      {/* 4. Pulso semanal discreto (sin trofeos con emojis ni ruido) */}
      <StaggerItem>
        <section className="flex flex-wrap items-center justify-between gap-4 border-t border-navy-900/10 pt-5 text-xs text-navy-500 dark:border-parchment-100/10 dark:text-navy-300">
          <div className="flex flex-wrap items-center gap-5 font-mono tabular-nums">
            <span>
              {t('dashboard.totalDays')}: <strong className="text-navy-900 dark:text-parchment-100">{stats.totalDays}</strong>
            </span>
            <span>
              {t('dashboard.chapters')}: <strong className="text-navy-900 dark:text-parchment-100">{stats.uniqueChapters}</strong>
            </span>
            <span>
              {t('dashboard.notes')}: <strong className="text-navy-900 dark:text-parchment-100">{stats.notesCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2" aria-label={t('dashboard.recentActivity')}>
            {activity.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-1" title={`${day.day}: ${day.count}`}>
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    day.count > 0
                      ? 'bg-ember-600 dark:bg-ember-400'
                      : 'bg-navy-900/12 dark:bg-parchment-100/15'
                  }`}
                />
                <span className="text-[10px] text-navy-400 dark:text-navy-400">
                  {formatRelativeDay(day.day, locale).slice(0, 2)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </StaggerItem>

      {shareOpen && verse ? (
        <VerseShareDialog text={verseText} citation={verseCitation} onClose={() => setShareOpen(false)} />
      ) : null}
    </StaggerGroup>
  );
}
