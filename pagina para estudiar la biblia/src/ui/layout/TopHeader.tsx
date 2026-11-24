import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { APP_NAME, ROUTES } from '@model/constants';
import { useI18n } from '@ui/hooks/useI18n';
import { BrandMark } from '@ui/components/Brand';
import { ThemeToggle } from '@ui/components/ThemeToggle';
import { LanguageToggle } from '@ui/components/LanguageToggle';
import {
  BookIcon,
  CalendarIcon,
  HomeIcon,
  MusicIcon,
  NoteIcon,
  SearchIcon,
  SettingsIcon,
} from '@ui/components/icons';

export const HEADER_NAV_ITEMS = [
  { to: ROUTES.dashboard, key: 'nav.home', Icon: HomeIcon },
  { to: ROUTES.reader, key: 'nav.reader', Icon: BookIcon },
  { to: ROUTES.plan, key: 'nav.plan', Icon: CalendarIcon },
  { to: ROUTES.notes, key: 'nav.notes', Icon: NoteIcon },
  { to: ROUTES.music, key: 'nav.music', Icon: MusicIcon },
] as const;

interface TopHeaderProps {
  readonly isReader: boolean;
  readonly visible: boolean;
  readonly scrolled: boolean;
  readonly onOpenSearch: () => void;
}

/**
 * Cabecera superior translúcida con indicador spring deslizante, cápsula flotante
 * de navegación, brillo direccional bajo el puntero y ocultación inteligente al leer.
 */
export function TopHeader({ isReader, visible, scrolled, onOpenSearch }: TopHeaderProps) {
  const { t } = useI18n();
  const [hoveredTo, setHoveredTo] = useState<string | null>(null);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : '-105%',
      }}
      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
      aria-hidden={!visible}
      inert={!visible}
      className={[
        isReader ? 'fixed inset-x-0 top-0 z-40' : 'sticky top-0 z-30',
        visible ? 'pointer-events-auto' : 'pointer-events-none',
        'border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300',
        scrolled
          ? 'border-navy-900/12 bg-parchment-50/88 shadow-[0_8px_28px_-18px_rgb(0_0_0_/_0.22)] backdrop-blur-2xl backdrop-saturate-150 dark:border-ember-400/15 dark:bg-navy-950/88 dark:shadow-[0_12px_32px_-20px_rgb(0_0_0_/_0.85)]'
          : 'border-navy-900/8 bg-parchment-50/78 backdrop-blur-xl dark:border-parchment-100/8 dark:bg-navy-950/78',
      ].join(' ')}
    >
      {/* Brillo sutil superior tipo cristal esmerilado */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember-500/35 to-transparent"
      />

      <div
        className={[
          'mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 transition-[height] duration-300 sm:px-6 lg:px-10',
          scrolled ? 'h-14' : 'h-16',
        ].join(' ')}
      >
        {/* Izquierda: Marca con micro-interacción */}
        <Link
          to={ROUTES.dashboard}
          tabIndex={visible ? undefined : -1}
          className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl py-1 pr-2 transition-opacity hover:opacity-95"
        >
          <motion.span
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="inline-flex shrink-0"
          >
            <BrandMark size={34} />
          </motion.span>
          <span className="min-w-0">
            <span className="block truncate font-serif text-base font-medium leading-none text-navy-900 dark:text-parchment-50 sm:text-lg">
              {APP_NAME}
            </span>
            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-navy-400 xl:block dark:text-parchment-300/55">
              RV1960 · NTV · NLT
            </span>
          </span>
        </Link>

        {/* Centro: Cápsula de navegación animada (escritorio lg+) */}
        <nav
          aria-label={t('nav.primary')}
          onMouseLeave={() => setHoveredTo(null)}
          className="hidden items-center gap-0.5 rounded-full border border-navy-900/10 bg-parchment-200/55 p-1 backdrop-blur-md lg:flex dark:border-parchment-100/10 dark:bg-navy-900/80"
        >
          {HEADER_NAV_ITEMS.map(({ to, key, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.dashboard}
              tabIndex={visible ? undefined : -1}
              onMouseEnter={() => setHoveredTo(to)}
              className={({ isActive }) =>
                [
                  'relative z-10 inline-flex min-h-9 touch-manipulation items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150',
                  isActive
                    ? 'text-parchment-50 dark:text-navy-950'
                    : 'text-navy-600 hover:text-navy-900 dark:text-parchment-200/80 dark:hover:text-parchment-50',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {hoveredTo === to && !isActive ? (
                    <motion.span
                      layoutId="top-header-hover-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                      aria-hidden="true"
                      className="absolute inset-0 -z-20 rounded-full bg-navy-900/[0.06] dark:bg-parchment-100/[0.08]"
                    />
                  ) : null}
                  {isActive ? (
                    <motion.span
                      layoutId="top-header-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-navy-900 shadow-xs dark:bg-ember-400"
                    />
                  ) : null}
                  <Icon size={14} aria-hidden="true" />
                  <span className="whitespace-nowrap">{t(key)}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Derecha: Buscador Ctrl K + Tema + Idioma + Ajustes */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            tabIndex={visible ? undefined : -1}
            onClick={onOpenSearch}
            aria-label={t('nav.quickSearch')}
            title={t('nav.quickSearch')}
            className="inline-flex h-10 touch-manipulation items-center gap-2 rounded-full border border-navy-900/10 bg-white/60 px-2.5 text-xs text-navy-600 transition-[background-color,border-color,color,transform] duration-150 hover:border-ember-500/40 hover:bg-white hover:text-navy-900 active:scale-[0.97] sm:px-3 dark:border-parchment-100/10 dark:bg-navy-900/70 dark:text-parchment-200 dark:hover:border-ember-400/35 dark:hover:bg-navy-800"
          >
            <SearchIcon size={15} aria-hidden="true" />
            <kbd className="hidden rounded border border-navy-900/10 bg-parchment-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-navy-500 xl:inline-block dark:border-parchment-100/10 dark:bg-navy-950 dark:text-parchment-300/70">
              Ctrl K
            </kbd>
          </button>

          <LanguageToggle compact />
          <ThemeToggle compact />

          <NavLink
            to={ROUTES.settings}
            tabIndex={visible ? undefined : -1}
            aria-label={t('nav.settings')}
            title={t('nav.settings')}
            className={({ isActive }) =>
              [
                'group inline-flex size-10 touch-manipulation items-center justify-center rounded-full transition-[background-color,color,transform] duration-150 active:scale-[0.96]',
                isActive
                  ? 'bg-ember-500/15 text-ember-700 ring-1 ring-ember-500/30 dark:bg-ember-400/15 dark:text-ember-300'
                  : 'text-navy-600 hover:bg-navy-900/5 hover:text-navy-900 dark:text-parchment-200 dark:hover:bg-parchment-100/10',
              ].join(' ')
            }
          >
            <SettingsIcon
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </NavLink>
        </div>
      </div>
    </motion.header>
  );
}
