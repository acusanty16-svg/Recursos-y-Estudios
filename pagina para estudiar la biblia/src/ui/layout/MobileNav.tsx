import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ROUTES } from '@model/constants';
import { useI18n } from '@ui/hooks/useI18n';
import { BookIcon, CalendarIcon, HomeIcon, MusicIcon, NoteIcon } from '@ui/components/icons';

const MOBILE_ITEMS = [
  { to: ROUTES.dashboard, key: 'nav.home', Icon: HomeIcon },
  { to: ROUTES.reader, key: 'nav.reader', Icon: BookIcon },
  { to: ROUTES.plan, key: 'nav.plan', Icon: CalendarIcon },
  { to: ROUTES.notes, key: 'nav.notes', Icon: NoteIcon },
  { to: ROUTES.music, key: 'nav.music', Icon: MusicIcon },
] as const;

export function MobileNav() {
  const { t, language } = useI18n();

  return (
    <nav
      aria-label={t('nav.primary')}
      className="sv-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/10 bg-parchment-50/90 backdrop-blur-xl backdrop-saturate-150 lg:hidden dark:border-parchment-100/10 dark:bg-navy-950/90"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {MOBILE_ITEMS.map(({ to, key, Icon }) => {
          const shortLabel =
            to === ROUTES.plan ? (language === 'es' ? 'Plan' : 'Plan') : t(key);
          return (
            <li key={to} className="relative flex-1">
              <NavLink
                to={to}
                end={to === ROUTES.dashboard}
                className={({ isActive }) =>
                  [
                    'relative flex min-h-14 touch-manipulation flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium transition-colors',
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
                        aria-hidden="true"
                        className="absolute top-0 h-0.5 w-8 rounded-full bg-ember-600 dark:bg-ember-400"
                      />
                    ) : null}
                    <Icon size={20} aria-hidden="true" />
                    <span className="truncate max-w-full">{shortLabel}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
