import type { Achievement } from '@seguimiento/achievements';
import { useI18n } from '@ui/hooks/useI18n';

export function AchievementGrid({ achievements }: { readonly achievements: readonly Achievement[] }) {
  const { language, t } = useI18n();
  const unlocked = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <section className="sv-card" aria-labelledby="achievements-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="achievements-title" className="sv-label mb-0">
          {t('dashboard.achievements')}
        </h2>
        <span className="text-xs text-navy-400 dark:text-parchment-300/60">
          {unlocked}/{achievements.length}
        </span>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {achievements.map((achievement) => {
          const title = language === 'es' ? achievement.titleEs : achievement.titleEn;
          const description = language === 'es' ? achievement.descriptionEs : achievement.descriptionEn;
          return (
            <li
              key={achievement.id}
              className={`rounded-xl border p-3 ${
                achievement.unlocked
                  ? 'border-ember-500/40 bg-ember-400/10'
                  : 'border-navy-900/10 opacity-70 dark:border-parchment-100/10'
              }`}
              title={description}
            >
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="text-lg">
                  {achievement.icon}
                </span>
                <p className="truncate text-xs font-semibold text-navy-800 dark:text-parchment-100">{title}</p>
              </div>
              <div
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-navy-900/10 dark:bg-parchment-100/15"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={achievement.target}
                aria-valuenow={achievement.progress}
                aria-label={title}
              >
                <div
                  className="h-full rounded-full bg-ember-500 dark:bg-ember-400"
                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-navy-400 dark:text-parchment-300/60">
                {achievement.progress}/{achievement.target}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
