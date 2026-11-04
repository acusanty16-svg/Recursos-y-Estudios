import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { getBookByNumber } from '@model/canon';
import { formatChapterLabel, formatReference, toDayKey } from '@model/reference';
import { computeAchievements } from '@seguimiento/achievements';
import { computeStats, lastSevenDays } from '@seguimiento/stats';
import { VERSICULOS_MOCK } from '@rsc';
import { useAppStore } from '@controller/store';
import { useI18n, formatLongDate } from '@ui/hooks/useI18n';
import { PageHeader } from '@ui/components/PageHeader';
import { StreakCard } from '@ui/components/StreakCard';
import { StatCard } from '@ui/components/StatCard';
import { ActivityStrip } from '@ui/components/ActivityStrip';
import { AchievementGrid } from '@ui/components/AchievementGrid';
import { BookIcon, ChevronRightIcon, NoteIcon, SparklesIcon } from '@ui/components/icons';
import { hasGraceAvailable } from '@seguimiento/streak';

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

  const achievements = useMemo(() => computeAchievements(stats), [stats]);
  const activity = useMemo(() => lastSevenDays(state.events, today), [state.events, today]);
  const verse = useMemo(() => pickVerseOfDay(today), [today]);

  const verseText = verse
    ? (verse.translations[state.preferences.activeTranslation] ??
        verse.translations.RV1960 ??
        verse.translations.NTV ??
        verse.translations.NLT ??
        '')
    : '';

  const book = getBookByNumber(state.location.bookNumber);
  const locationLabel = book ? formatChapterLabel(book.number, state.location.chapter, language) : '';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={formatLongDate(new Date(), locale)}
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />

      <div className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
        <StreakCard
          current={state.streak.current}
          longest={state.streak.longest}
          graceAvailable={hasGraceAvailable(state.streak)}
        />

        <section className="sv-card flex flex-col justify-between" aria-labelledby="votd-title">
          <div>
            <p id="votd-title" className="sv-label">
              {t('dashboard.verseOfDay')}
            </p>
            {verse ? (
              <>
                <blockquote className="mt-2 font-serif text-lg leading-relaxed text-navy-800 dark:text-parchment-100">
                  “{verseText}”
                </blockquote>
                <p className="mt-3 text-sm font-medium text-ember-700 dark:text-ember-300">
                  {formatReference(
                    { bookNumber: verse.bookNumber, chapter: verse.chapter, verse: verse.verse },
                    language,
                  )}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-navy-500 dark:text-parchment-200/70">{t('dashboard.noActivity')}</p>
            )}
          </div>
          {verse ? (
            <Link
              to={ROUTES.reader}
              className="sv-btn sv-btn-ghost mt-4 self-start px-0 text-ember-700 dark:text-ember-300"
            >
              {t('notes.openInReader')}
              <ChevronRightIcon size={16} />
            </Link>
          ) : null}
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={t('dashboard.totalDays')} value={stats.totalDays} icon={<SparklesIcon size={18} />} />
        <StatCard label={t('dashboard.chapters')} value={stats.uniqueChapters} icon={<BookIcon size={18} />} />
        <StatCard label={t('dashboard.notes')} value={stats.notesCount} icon={<NoteIcon size={18} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityStrip days={activity} />

        <section className="sv-card flex flex-col justify-between" aria-labelledby="continue-title">
          <div>
            <p id="continue-title" className="sv-label">
              {t('dashboard.continueReading')}
            </p>
            <p className="mt-2 font-serif text-2xl text-navy-900 dark:text-parchment-50">{locationLabel}</p>
            <p className="mt-1 text-sm text-navy-500 dark:text-parchment-200/70">
              {t('dashboard.lastRead')}:{' '}
              {state.streak.lastReadDay ? state.streak.lastReadDay : t('dashboard.never')}
            </p>
          </div>
          <Link to={ROUTES.reader} className="sv-btn sv-btn-primary mt-5 self-start">
            <BookIcon size={18} />
            {t('dashboard.startReading')}
          </Link>
        </section>
      </div>

      <AchievementGrid achievements={achievements} />
    </div>
  );
}
