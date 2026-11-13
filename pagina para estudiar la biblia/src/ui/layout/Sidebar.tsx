import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ROUTES } from '@model/constants';
import { useI18n } from '@ui/hooks/useI18n';
import { Brand } from '@ui/components/Brand';
import { ThemeToggle } from '@ui/components/ThemeToggle';
import { LanguageToggle } from '@ui/components/LanguageToggle';
import {
  BookIcon,
  CodeIcon,
  HomeIcon,
  MusicIcon,
  NoteIcon,
  SearchIcon,
  SettingsIcon,
  UploadIcon,
} from '@ui/components/icons';

export const PRIMARY_NAV_ITEMS = [
  { to: ROUTES.dashboard, key: 'nav.home', Icon: HomeIcon },
  { to: ROUTES.reader, key: 'nav.reader', Icon: BookIcon },
  { to: ROUTES.notes, key: 'nav.notes', Icon: NoteIcon },
  { to: ROUTES.music, key: 'nav.music', Icon: MusicIcon },
] as const;

export const UTILITY_NAV_ITEMS = [
  { to: ROUTES.import, key: 'nav.import', Icon: UploadIcon },
  { to: ROUTES.api, key: 'nav.api', Icon: CodeIcon },
  { to: ROUTES.settings, key: 'nav.settings', Icon: SettingsIcon },
] as const;

export const NAV_ITEMS = [...PRIMARY_NAV_ITEMS, ...UTILITY_NAV_ITEMS] as const;

export function Sidebar({ onOpenSearch }: { readonly onOpenSearch?: (() => void) | undefined }) {
  const { t } = useI18n();

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r border-navy-900/10 bg-parchment-50 px-5 py-6 lg:flex dark:border-parchment-100/10 dark:bg-navy-900/70">
      <div className="px-1">
        <Brand />
      </div>

      {onOpenSearch ? (
        <button
          type="button"
          onClick={onOpenSearch}
          className="mt-6 flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-navy-900/10 bg-parchment-100/70 px-3 text-xs text-navy-500 transition hover:border-ember-600/40 hover:text-navy-900 dark:border-parchment-100/10 dark:bg-navy-950/70 dark:text-navy-300 dark:hover:border-ember-400/35 dark:hover:text-parchment-100"
        >
          <span className="flex items-center gap-2 truncate">
            <SearchIcon size={14} />
            <span className="truncate">{t('nav.quickSearch')}</span>
          </span>
          <kbd className="rounded border border-navy-900/10 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium dark:border-parchment-100/10 dark:bg-navy-800">
            Ctrl K
          </kbd>
        </button>
      ) : null}

      <nav aria-label={t('nav.primary')} className="mt-6 flex-1">
        <ul className="space-y-1">
          {PRIMARY_NAV_ITEMS.map(({ to, key, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === ROUTES.dashboard}
                className={({ isActive }) =>
                  [
                    'relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-navy-900 dark:text-parchment-50'
                      : 'text-navy-500 hover:bg-navy-900/[0.04] hover:text-navy-900 dark:text-navy-300 dark:hover:bg-parchment-100/[0.05] dark:hover:text-parchment-100',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-lg border border-ember-600/20 bg-ember-500/10 dark:border-ember-400/20 dark:bg-ember-400/10"
                      />
                    ) : null}
                    <Icon
                      size={18}
                      className={isActive ? 'text-ember-700 dark:text-ember-400' : undefined}
                    />
                    <span>{t(key)}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Utilidades secundarias discretas */}
      <div className="mt-4 border-t border-navy-900/10 pt-4 dark:border-parchment-100/10">
        <ul className="mb-3 space-y-0.5">
          {UTILITY_NAV_ITEMS.map(({ to, key, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    'flex min-h-9 items-center gap-2.5 rounded-lg px-3 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-navy-900/5 text-ember-700 dark:bg-parchment-100/10 dark:text-ember-400'
                      : 'text-navy-400 hover:bg-navy-900/[0.04] hover:text-navy-800 dark:text-navy-300/80 dark:hover:bg-parchment-100/[0.05] dark:hover:text-parchment-100',
                  ].join(' ')
                }
              >
                <Icon size={15} />
                <span>{t(key)}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-1 border-t border-navy-900/10 pt-3 dark:border-parchment-100/10">
          <div className="flex items-center gap-1">
            <ThemeToggle compact />
            <LanguageToggle compact />
          </div>
          <span className="font-mono text-[10px] text-navy-400 dark:text-navy-400">v1.1</span>
        </div>
      </div>
    </aside>
  );
}
