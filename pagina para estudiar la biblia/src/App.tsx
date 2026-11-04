import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { REMINDERS_MOCK } from '@rsc';
import { bootstrapApp } from '@controller/app.controller';
import { startReminderScheduler } from '@controller/notifications.controller';
import { useAppStore } from '@controller/store';
import { AppShell } from '@ui/layout/AppShell';
import { Brand } from '@ui/components/Brand';
import { Spinner } from '@ui/components/Spinner';
import { Toast } from '@ui/components/Toast';
import { ErrorBoundary } from '@ui/components/ErrorBoundary';
import { DashboardPage } from '@ui/pages/DashboardPage';
import { ReaderPage } from '@ui/pages/ReaderPage';
import { NotesPage } from '@ui/pages/NotesPage';
import { ImportPage } from '@ui/pages/ImportPage';
import { SettingsPage } from '@ui/pages/SettingsPage';
import { NotFoundPage } from '@ui/pages/NotFoundPage';

// Swagger UI es pesado: solo se descarga al entrar en /api.
const ApiExplorerPage = lazy(() => import('@ui/pages/ApiExplorerPage'));

function Splash() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-parchment-100 dark:bg-navy-950">
      <Brand />
      <Spinner />
    </div>
  );
}

export function App() {
  const { bootStatus, preferences } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    void bootstrapApp();
  }, []);

  useEffect(() => {
    const stop = startReminderScheduler(REMINDERS_MOCK.reminders);
    return stop;
  }, []);

  if (bootStatus === 'loading') return <Splash />;

  return (
    <ErrorBoundary language={preferences.uiLanguage}>
      <AppShell>
        <div key={location.pathname} className="sv-page-enter">
          <Suspense fallback={<Spinner />}>
            <Routes location={location}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.reader} element={<ReaderPage />} />
              <Route path={ROUTES.notes} element={<NotesPage />} />
              <Route path={ROUTES.import} element={<ImportPage />} />
              <Route path={ROUTES.api} element={<ApiExplorerPage />} />
              <Route path={ROUTES.settings} element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </AppShell>
      <Toast />
    </ErrorBoundary>
  );
}
