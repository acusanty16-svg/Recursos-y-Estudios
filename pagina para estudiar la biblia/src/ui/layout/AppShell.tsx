import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { useAppStore } from '@controller/store';
import { updatePreferences } from '@controller/preferences.controller';
import { useI18n } from '@ui/hooks/useI18n';
import { Brand } from '@ui/components/Brand';
import { ThemeToggle } from '@ui/components/ThemeToggle';
import { LanguageToggle } from '@ui/components/LanguageToggle';
import { FocusIcon } from '@ui/components/icons';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function AppShell({ children }: { readonly children: ReactNode }) {
  const { preferences } = useAppStore();
  const { t } = useI18n();
  const location = useLocation();
  const isReader = location.pathname === ROUTES.reader;

  if (preferences.focusMode) {
    return (
      <div className="min-h-dvh bg-parchment-50 dark:bg-navy-950">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-parchment-50"
        >
          {t('app.skipToContent')}
        </a>
        <main
          id="main"
          className="mx-auto min-h-dvh w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10"
        >
          {children}
        </main>
        <button
          type="button"
          onClick={() => updatePreferences({ focusMode: false })}
          className="fixed bottom-6 right-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-navy-900/15 bg-white/90 px-4 text-sm font-medium text-navy-800 shadow-lg backdrop-blur dark:border-parchment-100/20 dark:bg-navy-900/90 dark:text-parchment-100"
        >
          <FocusIcon size={16} />
          {t('reader.exitFocus')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-parchment-50"
      >
        {t('app.skipToContent')}
      </a>

      <Sidebar />

      <div className="flex min-h-dvh flex-col">
        {isReader ? null : (
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-navy-900/10 bg-parchment-50/90 px-4 py-3 backdrop-blur lg:hidden dark:border-parchment-100/10 dark:bg-navy-950/90">
            <Link to={ROUTES.dashboard} className="min-w-0">
              <Brand compact />
            </Link>
            <div className="flex items-center gap-1">
              <LanguageToggle compact />
              <ThemeToggle compact />
            </div>
          </header>
        )}

        <main
          id="main"
          className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10"
        >
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
