import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { useAppStore } from '@controller/store';
import { updatePreferences } from '@controller/preferences.controller';
import { useI18n } from '@ui/hooks/useI18n';
import { useReaderScrollChrome } from '@ui/hooks/useReaderScrollChrome';
import { CommandPalette } from '@ui/components/CommandPalette';
import { FocusIcon } from '@ui/components/icons';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';

export function AppShell({ children }: { readonly children: ReactNode }) {
  const { preferences } = useAppStore();
  const { t } = useI18n();
  const location = useLocation();
  const isReader = location.pathname === ROUTES.reader && !preferences.focusMode;
  const { scrolled, showGlobalHeader } = useReaderScrollChrome(isReader);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-parchment-50"
      >
        {t('app.skipToContent')}
      </a>

      <TopHeader
        isReader={isReader}
        visible={showGlobalHeader}
        scrolled={scrolled}
        onOpenSearch={() => setPaletteOpen(true)}
      />

      <main
        id="main"
        className={[
          'mx-auto w-full max-w-6xl flex-1 px-4 pb-28 sm:px-6 lg:px-10 lg:pb-14',
          isReader ? 'pt-20' : 'pt-6 lg:pt-8',
        ].join(' ')}
      >
        {children}
      </main>

      <MobileNav />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
