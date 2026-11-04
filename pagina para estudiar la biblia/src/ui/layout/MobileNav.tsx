import { NavLink } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { useI18n } from '@ui/hooks/useI18n';
import { BookIcon, HomeIcon, NoteIcon, SettingsIcon, UploadIcon } from '@ui/components/icons';

const MOBILE_ITEMS = [
  { to: ROUTES.dashboard, key: 'nav.home', Icon: HomeIcon },
  { to: ROUTES.reader, key: 'nav.reader', Icon: BookIcon },
  { to: ROUTES.notes, key: 'nav.notes', Icon: NoteIcon },
  { to: ROUTES.import, key: 'nav.import', Icon: UploadIcon },
  { to: ROUTES.settings, key: 'nav.settings', Icon: SettingsIcon },
] as const;

export function MobileNav() {
  const { t } = useI18n();

  return (
    <nav
      aria-label={t('nav.primary')}
      className="sv-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/10 bg-parchment-50/95 backdrop-blur lg:hidden dark:border-parchment-100/10 dark:bg-navy-950/95"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {MOBILE_ITEMS.map(({ to, key, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === ROUTES.dashboard}
              className={({ isActive }) =>
                [
                  'flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium transition-colors',
                  isActive
                    ? 'text-ember-600 dark:text-ember-400'
                    : 'text-navy-500 hover:text-navy-800 dark:text-parchment-300/70 dark:hover:text-parchment-100',
                ].join(' ')
              }
            >
              <Icon size={20} />
              <span>{t(key)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
