import { FlameIcon, SparklesIcon } from './icons';
import { useI18n } from '@ui/hooks/useI18n';

interface StreakCardProps {
  readonly current: number;
  readonly longest: number;
  readonly graceAvailable: boolean;
}

export function StreakCard({ current, longest, graceAvailable }: StreakCardProps) {
  const { t } = useI18n();
  const isZero = current === 0;

  return (
    <section className="sv-card relative overflow-hidden" aria-labelledby="streak-title">
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-ember-400/20 blur-2xl dark:bg-ember-500/20"
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p id="streak-title" className="sv-label">
            {t('dashboard.streak')}
          </p>
          <div className="flex items-end gap-3">
            <span className="font-serif text-6xl leading-none text-navy-900 dark:text-ember-300">{current}</span>
            <span className="pb-1 text-sm text-navy-500 dark:text-parchment-200/70">
              {current === 1 ? t('dashboard.day') : t('dashboard.days')}
            </span>
          </div>
        </div>
        <span
          className={`inline-flex size-12 items-center justify-center rounded-full ${
            isZero
              ? 'bg-navy-900/5 text-navy-400 dark:bg-parchment-100/10 dark:text-parchment-300/60'
              : 'bg-ember-400/20 text-ember-600 dark:bg-ember-500/20 dark:text-ember-300'
          }`}
          aria-hidden="true"
        >
          <FlameIcon size={26} />
        </span>
      </div>

      <p className="mt-4 text-sm text-navy-600 dark:text-parchment-200/80">
        {t('dashboard.bestStreak')}: <strong className="font-semibold">{longest}</strong>
      </p>

      <p className="mt-3 inline-flex items-start gap-2 rounded-lg bg-navy-900/5 px-3 py-2 text-xs text-navy-600 dark:bg-parchment-100/10 dark:text-parchment-200/80">
        <SparklesIcon size={14} className="mt-0.5 shrink-0 text-ember-600 dark:text-ember-400" />
        {graceAvailable ? t('dashboard.graceAvailable') : t('dashboard.graceUsed')}
      </p>
    </section>
  );
}
