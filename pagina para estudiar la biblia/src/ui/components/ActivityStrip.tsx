import type { DailyActivity } from '@seguimiento/stats';
import { formatRelativeDay, useI18n } from '@ui/hooks/useI18n';

export function ActivityStrip({ days }: { readonly days: readonly DailyActivity[] }) {
  const { locale, t } = useI18n();
  const max = Math.max(1, ...days.map((day) => day.count));

  return (
    <section className="sv-card" aria-labelledby="activity-title">
      <h2 id="activity-title" className="sv-label">
        {t('dashboard.recentActivity')}
      </h2>
      <ol className="mt-4 flex items-end justify-between gap-2">
        {days.map((day) => {
          const height = day.count === 0 ? 6 : Math.round(10 + (day.count / max) * 38);
          return (
            <li key={day.day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`w-full max-w-8 rounded-t-md transition-colors ${
                  day.count > 0
                    ? 'bg-ember-500/80 dark:bg-ember-400/80'
                    : 'bg-navy-900/10 dark:bg-parchment-100/15'
                }`}
                style={{ height }}
                title={`${day.day}: ${day.count}`}
              >
                <span className="sr-only">
                  {day.day}: {day.count}
                </span>
              </div>
              <span className="text-[10px] text-navy-400 dark:text-parchment-300/60">
                {formatRelativeDay(day.day, locale)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
