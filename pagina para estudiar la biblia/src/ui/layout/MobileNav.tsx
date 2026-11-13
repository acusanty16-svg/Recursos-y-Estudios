import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ROUTES } from '@model/constants';
import { useI18n } from '@ui/hooks/useI18n';
import { BookIcon, HomeIcon, MusicIcon, NoteIcon, SettingsIcon } from '@ui/components/icons';

const MOBILE_ITEMS = [
  { to: ROUTES.dashboard, key: 'nav.home', Icon: HomeIcon },
  { to: ROUTES.reader, key: 'nav.reader', Icon: BookIcon },
  { to: ROUTES.notes, key: 'nav.notes', Icon: NoteIcon },
  { to: ROUTES.music, key: 'nav.music', Icon: MusicIcon },
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
          <li key={to} className="relative flex-1">
            <NavLink
              to={to}
              end={to === ROUTES.dashboard}
              className={({ isActive }) =>
                [
                  'relative flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium transition-colors',
                  isActive
                    ? 'text-ember-700 dark:text-ember-400'
                    : 'text-navy-400 hover:text-navy-800 dark:text-navy-300 dark:hover:text-parchment-100',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute top-0 h-0.5 w-8 rounded-full bg-ember-600 dark:bg-ember-400"
                    />
                  ) : null}
                  <Icon size={20} />
                  <span>{t(key)}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
