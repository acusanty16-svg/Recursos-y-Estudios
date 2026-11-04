import { NavLink } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { useI18n } from '@ui/hooks/useI18n';
import { Brand } from '@ui/components/Brand';
import { ThemeToggle } from '@ui/components/ThemeToggle';
import { LanguageToggle } from '@ui/components/LanguageToggle';
import { BookIcon, CodeIcon, HomeIcon, NoteIcon, SettingsIcon, UploadIcon } from '@ui/components/icons';

export const NAV_ITEMS = [
  { to: ROUTES.dashboard, key: 'nav.home', Icon: HomeIcon },
  { to: ROUTES.reader, key: 'nav.reader', Icon: BookIcon },
  { to: ROUTES.notes, key: 'nav.notes', Icon: NoteIcon },
  { to: ROUTES.import, key: 'nav.import', Icon: UploadIcon },
  { to: ROUTES.api, key: 'nav.api', Icon: CodeIcon },
  { to: ROUTES.settings, key: 'nav.settings', Icon: SettingsIcon },
] as const;

export function Sidebar() {
  const { t } = useI18n();

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r border-navy-900/10 bg-parchment-50/80 px-5 py-6 backdrop-blur lg:flex dark:border-parchment-100/10 dark:bg-navy-900/40">
      <div className="px-1">
        <Brand />
      </div>

      <nav aria-label={t('nav.primary')} className="mt-8 flex-1">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, key, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === ROUTES.dashboard}
                className={({ isActive }) =>
                  [
                    'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-navy-900 text-parchment-50 dark:bg-ember-500/15 dark:text-ember-200 dark:ring-1 dark:ring-inset dark:ring-ember-500/30'
                      : 'text-navy-600 hover:bg-navy-900/5 hover:text-navy-900 dark:text-parchment-200/80 dark:hover:bg-parchment-100/10 dark:hover:text-parchment-50',
                  ].join(' ')
                }
              >
                <Icon size={18} />
                <span>{t(key)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 border-t border-navy-900/10 pt-4 dark:border-parchment-100/10">
        <div className="flex items-center gap-1">
          <ThemeToggle compact />
          <LanguageToggle compact />
        </div>
        <p className="mt-3 px-1 text-[11px] leading-relaxed text-navy-400 dark:text-parchment-300/50">
          v1.0.0 · {t('reader.copyright')}
        </p>
      </div>
    </aside>
  );
}
