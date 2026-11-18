import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { getBookByNumber, bookDisplayName } from '@model/canon';
import {
  BIBLE_YEAR_PLAN,
  YEAR_PLAN_DAYS_COUNT,
  formatGroupedReading,
  getSuggestedPlanDay,
  getYearPlanDay,
  groupDayReadings,
} from '@model/bibleYearPlan';
import { goToChapter } from '@controller/app.controller';
import { setYearPlanStartDate, toggleYearPlanDay } from '@controller/year-plan.controller';
import { useAppStore } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { PageHeader } from '@ui/components/PageHeader';
import { StaggerGroup, StaggerItem } from '@ui/components/MotionPrimitives';
import { BookIcon, CalendarIcon, CheckIcon, SearchIcon } from '@ui/components/icons';

type PlanFilter = 'all' | 'pending' | 'done';

export function YearPlanPage() {
  const state = useAppStore();
  const { t, language } = useI18n();
  const navigate = useNavigate();

  const suggestedDay = useMemo(() => getSuggestedPlanDay(state.yearPlanStart), [state.yearPlanStart]);
  const initialMonth = getYearPlanDay(suggestedDay).month;

  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
  const [filter, setFilter] = useState<PlanFilter>('all');
  const [query, setQuery] = useState('');

  const completedSet = useMemo(() => new Set(state.yearPlan.map((e) => e.day)), [state.yearPlan]);
  const completedCount = completedSet.size;
  const percent = Math.round((completedCount / YEAR_PLAN_DAYS_COUNT) * 100);

  const todayPlanEntry = getYearPlanDay(suggestedDay);
  const todayCompleted = completedSet.has(todayPlanEntry.day);

  const filteredDays = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return BIBLE_YEAR_PLAN.filter((entry) => {
      if (!needle && entry.month !== selectedMonth) return false;
      const done = completedSet.has(entry.day);
      if (filter === 'pending' && done) return false;
      if (filter === 'done' && !done) return false;
      if (!needle) return true;
      return entry.readings.some((r) => {
        const b = getBookByNumber(r.bookNumber);
        if (!b) return false;
        const label = `${bookDisplayName(b, language)} ${r.chapter}`.toLowerCase();
        return label.includes(needle);
      });
    });
  }, [selectedMonth, filter, query, completedSet, language]);

  const openChapter = (bookNumber: number, chapter: number): void => {
    void goToChapter(bookNumber, chapter);
    navigate(ROUTES.reader);
  };

  return (
    <StaggerGroup className="space-y-6">
      <StaggerItem>
        <PageHeader
          eyebrow={`${t('plan.dayLabel')} ${suggestedDay} ${t('plan.ofDays')}`}
          title={t('plan.title')}
          subtitle={t('plan.subtitle')}
          actions={
            <div className="flex items-center gap-2">
              <label htmlFor="plan-start-date" className="text-xs text-navy-500 dark:text-parchment-300/75">
                {t('plan.startDateLabel')}:
              </label>
              <input
                id="plan-start-date"
                type="date"
                value={state.yearPlanStart}
                onChange={(e) => setYearPlanStartDate(e.target.value)}
                className="sv-input min-h-9 w-auto py-1 text-xs"
              />
            </div>
          }
        />
      </StaggerItem>

      {/* Progreso general + Lectura de hoy */}
      <StaggerItem>
        <section className="sv-card-hero space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="sv-label mb-1 flex items-center gap-1.5 text-ember-700 dark:text-ember-400">
                <CalendarIcon size={14} />
                {t('plan.todayReading')} · {t('plan.dayLabel')} {todayPlanEntry.day}
              </p>
              <h2 className="font-serif text-xl font-medium text-navy-900 sm:text-2xl dark:text-parchment-50">
                {completedCount} / {YEAR_PLAN_DAYS_COUNT} {t('plan.daysDone')} ({percent}%)
              </h2>
            </div>

            <button
              type="button"
              onClick={() => void toggleYearPlanDay(todayPlanEntry.day)}
              className={`sv-btn text-xs ${
                todayCompleted
                  ? 'border border-sage-500/40 bg-sage-500/15 text-sage-500 dark:text-sage-300'
                  : 'sv-btn-primary'
              }`}
            >
              <CheckIcon size={15} />
              {todayCompleted ? t('plan.completed') : t('plan.markCompleted')}
            </button>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-navy-900/10 dark:bg-parchment-100/10">
            <div
              className="h-full rounded-full bg-ember-600 transition-all duration-500 dark:bg-ember-400"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {groupDayReadings(todayPlanEntry.readings).map((group) => (
              <button
                key={`${group.bookNumber}-${group.startChapter}`}
                type="button"
                onClick={() => openChapter(group.bookNumber, group.startChapter)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy-900/12 bg-parchment-100/80 px-3 py-1.5 text-xs font-medium text-navy-800 transition hover:border-ember-500/45 hover:text-ember-700 dark:border-parchment-100/12 dark:bg-navy-800/70 dark:text-parchment-100 dark:hover:text-ember-300"
              >
                <BookIcon size={13} className="text-ember-600 dark:text-ember-400" />
                {formatGroupedReading(group, language)}
              </button>
            ))}
          </div>
        </section>
      </StaggerItem>

      {/* Selector de Mes 1–12 y filtros */}
      <StaggerItem>
        <div className="sv-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 12 }, (_, idx) => idx + 1).map((month) => {
                const active = selectedMonth === month && !query.trim();
                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSelectedMonth(month);
                    }}
                    className={[
                      'rounded-lg px-2.5 py-1.5 font-mono text-xs font-medium transition',
                      active
                        ? 'bg-ember-600 text-white dark:bg-ember-400 dark:text-navy-950 dark:font-semibold'
                        : 'bg-navy-900/5 text-navy-600 hover:bg-navy-900/10 dark:bg-parchment-100/10 dark:text-parchment-200',
                    ].join(' ')}
                  >
                    {t('plan.monthLabel')} {month}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'pending', 'done'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-medium transition',
                    filter === key
                      ? 'border-ember-500 bg-ember-500/15 text-navy-900 dark:text-parchment-50'
                      : 'border-navy-900/10 text-navy-500 dark:border-parchment-100/10 dark:text-parchment-300/75',
                  ].join(' ')}
                >
                  {key === 'all' ? t('plan.filterAll') : key === 'pending' ? t('plan.filterPending') : t('plan.filterDone')}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <SearchIcon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('plan.searchPlaceholder')}
              className="sv-input pl-9 text-sm"
            />
          </div>
        </div>
      </StaggerItem>

      {/* Lista de días */}
      <StaggerItem>
        {filteredDays.length === 0 ? (
          <div className="sv-card py-10 text-center text-sm text-navy-500 dark:text-parchment-300/70">
            {t('plan.emptyFilter')}
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDays.map((entry) => {
              const done = completedSet.has(entry.day);
              const isToday = entry.day === suggestedDay;
              const groups = groupDayReadings(entry.readings);

              return (
                <li
                  key={entry.day}
                  className={[
                    'sv-card flex flex-col justify-between gap-3 border transition-colors',
                    isToday ? 'border-ember-500/50 ring-1 ring-ember-500/25' : '',
                    done ? 'bg-sage-500/[0.04]' : '',
                  ].join(' ')}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ember-700 dark:text-ember-400">
                        {t('plan.dayLabel')} {entry.day}
                        {isToday ? ` · ${t('common.today')}` : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => void toggleYearPlanDay(entry.day)}
                        aria-pressed={done}
                        className={[
                          'inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition',
                          done
                            ? 'border-sage-500/40 bg-sage-500/15 text-sage-500 dark:text-sage-300'
                            : 'border-navy-900/15 text-navy-500 hover:border-ember-500/40 dark:border-parchment-100/15 dark:text-parchment-300/80',
                        ].join(' ')}
                      >
                        <CheckIcon size={12} />
                        {done ? t('plan.completed') : t('plan.markCompleted')}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {groups.map((group) => (
                        <button
                          key={`${entry.day}-${group.bookNumber}-${group.startChapter}`}
                          type="button"
                          onClick={() => openChapter(group.bookNumber, group.startChapter)}
                          className="rounded-md border border-navy-900/10 bg-parchment-100/70 px-2 py-1 text-xs font-medium text-navy-800 transition hover:border-ember-500/40 hover:text-ember-700 dark:border-parchment-100/10 dark:bg-navy-800/60 dark:text-parchment-100 dark:hover:text-ember-300"
                        >
                          {formatGroupedReading(group, language)}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </StaggerItem>
    </StaggerGroup>
  );
}
