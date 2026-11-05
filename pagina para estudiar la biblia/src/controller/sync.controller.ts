/**
 * Orquestador de la cuenta de Google y la sincronización con Drive.
 *
 * Estrategia sin backend:
 * - Se descarga la copia remota, se fusiona con la local y se sube el resultado.
 * - Nunca se sobrescribe Drive con una copia local vacía: primero se fusiona.
 * - Los borrados viajan como "tombstones" para no resucitar en otro dispositivo.
 */

import { translate } from '../i18n';
import { buildSnapshot, mergeSnapshots, pruneTombstones } from '../model/sync';
import type { LocalSyncData, SyncSnapshot } from '../model/sync';
import {
  DriveAuthError,
  downloadSyncSnapshot,
  uploadMarkdownToDrive,
  uploadSyncSnapshot,
} from './drive.service';
import {
  GOOGLE_AUTH_REQUIRED,
  getLastAccount,
  getValidSession,
  isGoogleConfigured,
  reconnectGoogle,
  setGoogleClientId,
  signInWithGoogle,
  signOutGoogle,
} from './google-auth.service';
import { replaceSyncedData } from './idb';
import { buildMarkdownExport } from './notes.controller';
import { loadTombstones, saveTombstones, setLocalChangeHandler } from './sync-events';
import { INITIAL_ACCOUNT, appStore, showToast } from './store';
import type { AccountState } from './store';

interface SyncOptions {
  readonly interactive?: boolean;
  readonly silent?: boolean;
  readonly notify?: boolean;
}

let syncInFlight: Promise<void> | null = null;
let syncQueued = false;
let autoSyncTimer: number | null = null;
let initialized = false;

function t(key: Parameters<typeof translate>[1]): string {
  return translate(appStore.getState().preferences.uiLanguage, key);
}

function updateAccount(patch: Partial<AccountState>): void {
  appStore.setState((state) => ({ ...state, account: { ...state.account, ...patch } }));
}

function errorMessage(cause: unknown): string {
  if (cause instanceof Error && cause.message) return cause.message;
  return t('common.error');
}

function isAuthProblem(cause: unknown): boolean {
  return cause instanceof DriveAuthError || (cause instanceof Error && cause.message === GOOGLE_AUTH_REQUIRED);
}

function collectLocalData(): LocalSyncData {
  const { notes, highlights, bookmarks, memorizedVerses } = appStore.getState();
  return { notes, highlights, bookmarks, memorizedVerses };
}

function buildLocalSnapshot(): SyncSnapshot {
  return buildSnapshot(collectLocalData(), loadTombstones());
}

async function applySnapshot(snapshot: SyncSnapshot): Promise<void> {
  saveTombstones(pruneTombstones(snapshot.tombstones));

  appStore.setState((state) => ({
    ...state,
    notes: snapshot.notes,
    highlights: snapshot.highlights,
    bookmarks: snapshot.bookmarks,
    memorizedVerses: snapshot.memorizedVerses,
  }));

  try {
    await replaceSyncedData(snapshot);
  } catch {
    // El estado en memoria ya quedó actualizado; IndexedDB lo reintentará en la próxima escritura.
  }
}

async function performSync(options: SyncOptions): Promise<void> {
  if (!isGoogleConfigured()) return;

  let token: string | null = null;
  const current = getValidSession();
  if (current) {
    token = current.accessToken;
  } else if (options.interactive) {
    try {
      const renewed = await reconnectGoogle();
      updateAccount({
        status: 'signed-in',
        email: renewed.email,
        name: renewed.name,
        picture: renewed.picture,
        error: null,
      });
      token = renewed.accessToken;
    } catch (cause) {
      updateAccount({ status: 'signed-out', syncStatus: 'needs-auth', error: errorMessage(cause) });
      if (!options.silent) showToast(t('settings.syncNeedsAuth'), 'error');
      return;
    }
  } else {
    updateAccount({ syncStatus: 'needs-auth' });
    return;
  }

  updateAccount({ syncStatus: 'syncing', error: null });

  try {
    const remote = await downloadSyncSnapshot(token);
    const local = buildLocalSnapshot();
    const merged = remote ? mergeSnapshots(local, remote) : { ...local, updatedAt: Date.now() };

    await applySnapshot(merged);
    await uploadSyncSnapshot(token, merged);

    updateAccount({ syncStatus: 'synced', lastSyncedAt: Date.now(), error: null });
    if (options.notify) showToast(t('settings.syncSuccess'), 'success');
  } catch (cause) {
    if (isAuthProblem(cause)) {
      updateAccount({ syncStatus: 'needs-auth', error: t('settings.syncNeedsAuth') });
      if (!options.silent) showToast(t('settings.syncNeedsAuth'), 'error');
      return;
    }
    const message = errorMessage(cause);
    updateAccount({ syncStatus: 'error', error: message });
    if (!options.silent) showToast(message, 'error');
  }
}

/** Sincroniza a mano o en segundo plano. Las llamadas simultáneas se agrupan. */
export function syncNow(options: SyncOptions = {}): Promise<void> {
  if (syncInFlight) {
    syncQueued = true;
    return syncInFlight;
  }

  syncInFlight = performSync(options).finally(() => {
    syncInFlight = null;
    if (syncQueued) {
      syncQueued = false;
      void syncNow({ silent: true });
    }
  });

  return syncInFlight;
}

function scheduleAutoSync(): void {
  if (!isGoogleConfigured()) return;
  if (appStore.getState().account.status !== 'signed-in') return;
  if (!getValidSession()) {
    updateAccount({ syncStatus: 'needs-auth' });
    return;
  }

  if (autoSyncTimer !== null) window.clearTimeout(autoSyncTimer);
  autoSyncTimer = window.setTimeout(() => {
    autoSyncTimer = null;
    void syncNow({ silent: true });
  }, 1400);
}

export async function connectGoogleAccount(): Promise<void> {
  if (!isGoogleConfigured()) {
    showToast(t('settings.googleNotConfigured'), 'error');
    return;
  }

  updateAccount({ status: 'connecting', error: null, syncStatus: 'idle' });

  try {
    const session = await signInWithGoogle();
    updateAccount({
      status: 'signed-in',
      email: session.email,
      name: session.name,
      picture: session.picture,
      error: null,
    });
    await syncNow({ silent: true });
    const { account } = appStore.getState();
    if (account.syncStatus === 'error' || account.syncStatus === 'needs-auth') {
      showToast(account.error ?? t('settings.syncError'), 'error');
    } else {
      showToast(t('settings.syncConnected'), 'success');
    }
  } catch (cause) {
    updateAccount({ status: 'signed-out', syncStatus: 'idle', error: errorMessage(cause) });
    showToast(errorMessage(cause), 'error');
  }
}

export async function reconnectGoogleAccount(): Promise<void> {
  updateAccount({ status: 'connecting', error: null });

  try {
    const session = await reconnectGoogle();
    updateAccount({
      status: 'signed-in',
      email: session.email,
      name: session.name,
      picture: session.picture,
      error: null,
    });
    await syncNow({ silent: false, notify: true });
  } catch (cause) {
    updateAccount({ status: 'signed-out', syncStatus: 'needs-auth', error: errorMessage(cause) });
    showToast(errorMessage(cause), 'error');
  }
}

export async function disconnectGoogleAccount(): Promise<void> {
  await signOutGoogle();
  updateAccount({ ...INITIAL_ACCOUNT, configured: isGoogleConfigured() });
  showToast(t('settings.syncDisconnected'), 'info');
}

/** Permite probar sin recompilar: el Client ID es público, no un secreto. */
export function configureGoogleClientId(clientId: string): void {
  setGoogleClientId(clientId);
  updateAccount({ configured: isGoogleConfigured(), error: null });
  if (isGoogleConfigured()) showToast(t('settings.googleConfigured'), 'success');
}

async function ensureInteractiveToken(): Promise<string | null> {
  const session = getValidSession();
  if (session) return session.accessToken;

  try {
    const renewed = await reconnectGoogle();
    updateAccount({
      status: 'signed-in',
      email: renewed.email,
      name: renewed.name,
      picture: renewed.picture,
      error: null,
    });
    return renewed.accessToken;
  } catch (cause) {
    updateAccount({ status: 'signed-out', syncStatus: 'needs-auth', error: errorMessage(cause) });
    showToast(t('settings.syncNeedsAuth'), 'error');
    return null;
  }
}

/** Exporta el Markdown visible a Drive (archivo aparte de la copia de sincronización). */
export async function exportNotesToDrive(): Promise<void> {
  if (!isGoogleConfigured()) {
    showToast(t('settings.googleNotConfigured'), 'error');
    return;
  }

  const token = await ensureInteractiveToken();
  if (!token) return;

  updateAccount({ syncStatus: 'syncing' });

  try {
    await uploadMarkdownToDrive(token, buildMarkdownExport());
    updateAccount({ syncStatus: 'synced', lastSyncedAt: Date.now(), error: null });
    showToast(t('settings.exportDriveSuccess'), 'success');
  } catch (cause) {
    if (isAuthProblem(cause)) {
      updateAccount({ syncStatus: 'needs-auth', error: t('settings.syncNeedsAuth') });
      showToast(t('settings.syncNeedsAuth'), 'error');
      return;
    }
    const message = errorMessage(cause);
    updateAccount({ syncStatus: 'error', error: message });
    showToast(message, 'error');
  }
}

/**
 * Arranque: restaura la identidad visible, activa la subida automática y
 * sincroniza si el token de esta sesión sigue vivo.
 */
export function initSync(): void {
  if (initialized) return;
  initialized = true;

  updateAccount({ configured: isGoogleConfigured() });

  const session = getValidSession();
  if (session) {
    updateAccount({
      status: 'signed-in',
      email: session.email,
      name: session.name,
      picture: session.picture,
    });
  } else {
    const last = getLastAccount();
    if (last) updateAccount({ email: last.email, name: last.name, picture: last.picture });
  }

  setLocalChangeHandler(scheduleAutoSync);

  const syncWhenVisible = (): void => {
    if (document.visibilityState !== 'visible') return;
    if (appStore.getState().account.status !== 'signed-in') return;
    if (!getValidSession()) {
      updateAccount({ syncStatus: 'needs-auth' });
      return;
    }
    void syncNow({ silent: true });
  };

  window.addEventListener('focus', syncWhenVisible);
  window.addEventListener('online', syncWhenVisible);
  document.addEventListener('visibilitychange', syncWhenVisible);
  window.setInterval(syncWhenVisible, 120_000);

  if (session) void syncNow({ silent: true });
}
