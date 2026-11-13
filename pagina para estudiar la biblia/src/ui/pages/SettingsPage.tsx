import { useState } from 'react';
import { useAppStore, showToast } from '@controller/store';
import { updatePreferences } from '@controller/preferences.controller';
import { clearAllUserData, clearChapterCache } from '@controller/idb';
import { requestNotificationPermission } from '@controller/notifications.controller';
import { isFileSystemAccessSupported } from '@controller/fs-access.service';
import { getGoogleClientId } from '@controller/google-auth.service';
import { getEffectiveSongs } from '@controller/music.controller';
import { TOTAL_LAMP_VERSES } from '@rsc/club-lampara';
import {
  configureGoogleClientId,
  connectGoogleAccount,
  disconnectGoogleAccount,
  exportNotesToDrive,
  reconnectGoogleAccount,
  syncNow,
} from '@controller/sync.controller';
import { useI18n } from '@ui/hooks/useI18n';
import { useInstallPrompt } from '@ui/hooks/useInstallPrompt';
import { PageHeader } from '@ui/components/PageHeader';
import { GoogleLogo } from '@ui/components/GoogleLogo';
import { CheckIcon, DownloadIcon, RefreshIcon, TrashIcon } from '@ui/components/icons';

const FONT_OPTIONS: readonly { readonly value: 1 | 1.125 | 1.25 | 1.5; readonly label: string }[] = [
  { value: 1, label: 'A' },
  { value: 1.125, label: 'A' },
  { value: 1.25, label: 'A' },
  { value: 1.5, label: 'A' },
];

export function SettingsPage() {
  const state = useAppStore();
  const { t, language } = useI18n();
  const { canInstall, install } = useInstallPrompt();
  const preferences = state.preferences;
  const account = state.account;
  const [clientId, setClientId] = useState(() => getGoogleClientId());

  const handleEnableNotifications = async (): Promise<void> => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      updatePreferences({ notificationsEnabled: true });
      showToast(t('settings.permissionGranted'), 'success');
    } else if (permission === 'denied') {
      showToast(t('settings.permissionDenied'), 'error');
    } else if (permission === 'unsupported') {
      showToast(t('settings.notSupported'), 'error');
    }
  };

  const handleClearCache = async (): Promise<void> => {
    await clearChapterCache();
    showToast(t('settings.cacheCleared'), 'success');
  };

  const handleClearData = async (): Promise<void> => {
    if (!window.confirm(t('settings.clearConfirm'))) return;
    if (account.status === 'signed-in' || account.email) await disconnectGoogleAccount();
    await clearAllUserData();
    showToast(t('settings.dataCleared'), 'success');
    window.setTimeout(() => window.location.reload(), 600);
  };

  const syncStatusLabel = ((): string => {
    switch (account.syncStatus) {
      case 'syncing':
        return t('settings.syncing');
      case 'synced':
        return t('settings.synced');
      case 'needs-auth':
        return t('settings.syncNeedsAuth');
      case 'error':
        return account.error ?? t('settings.syncError');
      default:
        return t('settings.never');
    }
  })();

  const lastSyncedText = account.lastSyncedAt
    ? new Date(account.lastSyncedAt).toLocaleString(language === 'es' ? 'es-ES' : 'en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : t('settings.never');

  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <section className="sv-card" aria-labelledby="settings-appearance">
        <h2 id="settings-appearance" className="font-serif text-xl text-navy-900 dark:text-parchment-50">
          {t('settings.appearance')}
        </h2>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className="sv-label">{t('settings.theme')}</legend>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  aria-pressed={preferences.theme === theme}
                  onClick={() => updatePreferences({ theme })}
                  className={[
                    'sv-btn border',
                    preferences.theme === theme
                      ? 'border-ember-500 bg-ember-400/20 text-navy-900 dark:text-parchment-50'
                      : 'border-navy-900/15 text-navy-600 dark:border-parchment-100/15 dark:text-parchment-200/80',
                  ].join(' ')}
                >
                  {theme === 'dark' ? t('settings.dark') : t('settings.light')}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="settings-language" className="sv-label">
              {t('settings.language')}
            </label>
            <select
              id="settings-language"
              className="sv-input"
              value={preferences.uiLanguage}
              onChange={(event) => updatePreferences({ uiLanguage: event.target.value === 'en' ? 'en' : 'es' })}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <fieldset className="sm:col-span-2">
            <legend className="sv-label">{t('settings.fontSize')}</legend>
            <div className="flex flex-wrap gap-2">
              {FONT_OPTIONS.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={preferences.fontScale === option.value}
                  onClick={() => updatePreferences({ fontScale: option.value })}
                  className={[
                    'inline-flex min-h-11 min-w-12 items-center justify-center rounded-lg border font-serif',
                    preferences.fontScale === option.value
                      ? 'border-ember-500 bg-ember-400/20 text-navy-900 dark:text-parchment-50'
                      : 'border-navy-900/15 text-navy-600 dark:border-parchment-100/15 dark:text-parchment-200/80',
                  ].join(' ')}
                  style={{ fontSize: `${1 + index * 0.18}rem` }}
                  title={`${Math.round(option.value * 100)}%`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="sv-card" aria-labelledby="settings-notifications">
        <h2 id="settings-notifications" className="font-serif text-xl text-navy-900 dark:text-parchment-50">
          {t('settings.notifications')}
        </h2>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm text-navy-700 dark:text-parchment-200">
            <input
              type="checkbox"
              className="size-5 accent-ember-500"
              checked={preferences.notificationsEnabled}
              onChange={(event) => {
                if (event.target.checked) {
                  void handleEnableNotifications();
                } else {
                  updatePreferences({ notificationsEnabled: false });
                }
              }}
            />
            {t('settings.enableNotifications')}
          </label>

          <div>
            <label htmlFor="notification-time" className="sv-label">
              {t('settings.notificationTime')}
            </label>
            <input
              id="notification-time"
              type="time"
              className="sv-input w-36"
              value={preferences.notificationTime}
              onChange={(event) => updatePreferences({ notificationTime: event.target.value })}
            />
          </div>

          <p className="text-xs text-navy-500 dark:text-parchment-300/70">
            {state.notificationPermission === 'granted'
              ? t('settings.permissionGranted')
              : state.notificationPermission === 'denied'
                ? t('settings.permissionDenied')
                : state.notificationPermission === 'unsupported'
                  ? t('settings.notSupported')
                  : t('common.optional')}
          </p>
        </div>
      </section>

      <section className="sv-card" aria-labelledby="settings-account">
        <h2 id="settings-account" className="font-serif text-xl text-navy-900 dark:text-parchment-50">
          {t('settings.account')}
        </h2>
        <p className="mt-1 text-sm text-navy-500 dark:text-parchment-300/70">
          {t('settings.accountSubtitle')}
        </p>

        <div className="mt-4">
          {!account.configured ? (
            <div className="rounded-xl border border-dashed border-navy-900/15 p-4 dark:border-parchment-100/15">
              <p className="text-sm leading-relaxed text-navy-600 dark:text-parchment-200/80">
                {t('settings.googleNotConfigured')}
              </p>
              <label htmlFor="google-client-id" className="sv-label mt-4">
                {t('settings.googleClientId')}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="google-client-id"
                  className="sv-input flex-1"
                  value={clientId}
                  onChange={(event) => setClientId(event.target.value)}
                  placeholder="1234567890-xxxx.apps.googleusercontent.com"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  className="sv-btn sv-btn-primary"
                  disabled={clientId.trim().length === 0}
                  onClick={() => configureGoogleClientId(clientId)}
                >
                  {t('settings.googleClientIdSave')}
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-navy-400 dark:text-parchment-300/60">
                {t('settings.googleClientIdHint')}
              </p>
            </div>
          ) : account.status === 'signed-in' ? (
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {account.picture ? (
                  <img
                    src={account.picture}
                    alt=""
                    className="size-11 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-ember-400/20 font-serif text-lg text-ember-700 dark:text-ember-300">
                    {(account.name || account.email || '?').charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy-900 dark:text-parchment-50">
                    {account.name || account.email}
                  </p>
                  <p className="truncate text-xs text-navy-500 dark:text-parchment-300/70">
                    {account.email}
                  </p>
                </div>
              </div>

              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
                {account.syncStatus === 'syncing' ? (
                  <RefreshIcon size={14} className="animate-spin text-sky-600 dark:text-sky-300" />
                ) : account.syncStatus === 'synced' ? (
                  <CheckIcon size={14} className="text-sage-500" />
                ) : null}
                <span
                  className={
                    account.syncStatus === 'error' || account.syncStatus === 'needs-auth'
                      ? 'text-rose-600 dark:text-rose-300'
                      : 'text-navy-600 dark:text-parchment-200/80'
                  }
                >
                  {syncStatusLabel}
                </span>
                {account.lastSyncedAt ? (
                  <span className="text-xs text-navy-400 dark:text-parchment-300/60">
                    · {t('settings.lastSynced')}: {lastSyncedText}
                  </span>
                ) : null}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {account.syncStatus === 'needs-auth' ? (
                  <button
                    type="button"
                    className="sv-btn sv-btn-primary"
                    onClick={() => void reconnectGoogleAccount()}
                  >
                    <GoogleLogo size={16} />
                    {t('settings.reconnect')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sv-btn sv-btn-primary"
                    disabled={account.syncStatus === 'syncing'}
                    onClick={() => void syncNow({ interactive: true, notify: true })}
                  >
                    <RefreshIcon size={16} />
                    {t('settings.syncNow')}
                  </button>
                )}
                <button
                  type="button"
                  className="sv-btn sv-btn-ghost border border-navy-900/15 dark:border-parchment-100/15"
                  onClick={() => void exportNotesToDrive()}
                >
                  <DownloadIcon size={16} />
                  {t('settings.exportDrive')}
                </button>
                <button
                  type="button"
                  className="sv-btn sv-btn-ghost border border-rose-500/30 text-rose-600 dark:text-rose-300"
                  onClick={() => void disconnectGoogleAccount()}
                >
                  {t('settings.disconnect')}
                </button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-navy-400 dark:text-parchment-300/60">
                {t('settings.syncExplanation')} {t('settings.syncPrivacy')}
              </p>
            </div>
          ) : (
            <div>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-lg border border-navy-900/15 bg-white px-4 text-sm font-medium text-navy-800 shadow-sm transition-colors hover:bg-navy-50 disabled:opacity-60 dark:border-parchment-100/20 dark:bg-parchment-50 dark:text-navy-900 dark:hover:bg-white"
                disabled={account.status === 'connecting'}
                onClick={() => void connectGoogleAccount()}
              >
                <GoogleLogo size={18} />
                {account.status === 'connecting'
                  ? t('settings.googleConnecting')
                  : t('settings.googleConnect')}
              </button>

              {account.email ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-navy-500 dark:text-parchment-300/70">
                  <span>{account.email}</span>
                  <button
                    type="button"
                    className="font-medium text-ember-700 underline-offset-2 hover:underline dark:text-ember-300"
                    onClick={() => void reconnectGoogleAccount()}
                  >
                    {t('settings.reconnect')}
                  </button>
                </div>
              ) : null}

              {account.error ? (
                <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-300">
                  {account.error}
                </p>
              ) : null}

              <p className="mt-3 text-xs leading-relaxed text-navy-400 dark:text-parchment-300/60">
                {t('settings.syncExplanation')} {t('settings.syncPrivacy')}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="sv-card" aria-labelledby="settings-data">
        <h2 id="settings-data" className="font-serif text-xl text-navy-900 dark:text-parchment-50">
          {t('settings.data')}
        </h2>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="sv-label mb-1">{t('notes.tabNotes')}</dt>
            <dd className="font-serif text-2xl text-navy-900 dark:text-parchment-50">{state.notes.length}</dd>
          </div>
          <div>
            <dt className="sv-label mb-1">{t('notes.tabHighlights')}</dt>
            <dd className="font-serif text-2xl text-navy-900 dark:text-parchment-50">{state.highlights.length}</dd>
          </div>
          <div>
            <dt className="sv-label mb-1">{t('notes.tabBookmarks')}</dt>
            <dd className="font-serif text-2xl text-navy-900 dark:text-parchment-50">{state.bookmarks.length}</dd>
          </div>
          <div>
            <dt className="sv-label mb-1">{t('notes.tabMemorize')}</dt>
            <dd className="font-serif text-2xl text-navy-900 dark:text-parchment-50">
              {state.memorizedVerses.length}
            </dd>
          </div>
          <div>
            <dt className="sv-label mb-1">{t('lamp.title')}</dt>
            <dd className="font-serif text-2xl text-navy-900 dark:text-parchment-50">
              {state.lampClub.length} / {TOTAL_LAMP_VERSES}
            </dd>
          </div>
          <div>
            <dt className="sv-label mb-1">{t('nav.music')}</dt>
            <dd className="font-serif text-2xl text-navy-900 dark:text-parchment-50">
              {getEffectiveSongs(state.songs).length}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="sv-btn sv-btn-ghost border border-navy-900/15 dark:border-parchment-100/15" onClick={() => void handleClearCache()}>
            <TrashIcon size={16} />
            {t('settings.clearCache')}
          </button>
          <button
            type="button"
            className="sv-btn border border-rose-500/40 text-rose-600 dark:text-rose-300"
            onClick={() => void handleClearData()}
          >
            <TrashIcon size={16} />
            {t('settings.clearData')}
          </button>
        </div>
      </section>

      <section className="sv-card" aria-labelledby="settings-about">
        <h2 id="settings-about" className="font-serif text-xl text-navy-900 dark:text-parchment-50">
          {t('settings.about')}
        </h2>

        <dl className="mt-4 space-y-2 text-sm text-navy-600 dark:text-parchment-200/80">
          <div className="flex items-center justify-between gap-4">
            <dt>{t('settings.version')}</dt>
            <dd className="font-mono text-xs">1.0.0</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt>{t('settings.fileSupport')}</dt>
            <dd className="inline-flex items-center gap-1.5">
              {isFileSystemAccessSupported() ? (
                <>
                  <CheckIcon size={14} className="text-sage-500" />
                  {t('settings.fileSupported')}
                </>
              ) : (
                <span className="text-rose-500">{t('settings.fileUnsupported')}</span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt>{t('settings.storage')}</dt>
            <dd>IndexedDB · localStorage</dd>
          </div>
        </dl>

        {canInstall ? (
          <button type="button" className="sv-btn sv-btn-primary mt-5" onClick={() => void install()}>
            <DownloadIcon size={16} />
            {t('settings.install')}
          </button>
        ) : null}

        <p className="mt-5 text-xs leading-relaxed text-navy-400 dark:text-parchment-300/50">
          RV1960 · NTV · NLT — {language === 'es' ? 'uso personal' : 'personal use'}. {t('reader.copyright')}
        </p>
      </section>
    </div>
  );
}
