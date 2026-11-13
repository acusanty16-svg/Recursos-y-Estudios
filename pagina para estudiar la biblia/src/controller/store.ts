import { useSyncExternalStore } from 'react';
import { DEFAULT_PREFERENCES } from '../model/constants';
import type {
  Bookmark,
  Chapter,
  Highlight,
  ImportedFileMeta,
  LampClubProgress,
  MemorizedVerse,
  Note,
  Preferences,
  ReadingEvent,
  Song,
  StreakState,
  TranslationId,
} from '../model/types';

export type ToastTone = 'info' | 'success' | 'error';

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly tone: ToastTone;
}

export type NotificationPermissionState = NotificationPermission | 'unsupported';

export type AccountSyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'needs-auth';

export interface AccountState {
  readonly configured: boolean;
  readonly status: 'signed-out' | 'connecting' | 'signed-in';
  readonly email: string | null;
  readonly name: string | null;
  readonly picture: string | null;
  readonly syncStatus: AccountSyncStatus;
  readonly lastSyncedAt: number | null;
  readonly error: string | null;
}

export const INITIAL_ACCOUNT: AccountState = {
  configured: false,
  status: 'signed-out',
  email: null,
  name: null,
  picture: null,
  syncStatus: 'idle',
  lastSyncedAt: null,
  error: null,
};

export interface AppState {
  readonly bootStatus: 'loading' | 'ready';
  readonly preferences: Preferences;
  readonly location: { readonly bookNumber: number; readonly chapter: number };
  readonly chapter: Chapter | null;
  readonly chapterStatus: 'idle' | 'loading' | 'ready' | 'error';
  readonly chapterError: string | null;
  readonly compareTranslation: TranslationId | null;
  readonly notes: readonly Note[];
  readonly highlights: readonly Highlight[];
  readonly bookmarks: readonly Bookmark[];
  readonly memorizedVerses: readonly MemorizedVerse[];
  readonly songs: readonly Song[];
  readonly lampClub: readonly LampClubProgress[];
  readonly events: readonly ReadingEvent[];
  readonly importedMeta: readonly ImportedFileMeta[];
  readonly streak: StreakState;
  readonly notificationPermission: NotificationPermissionState;
  readonly fileSystemSupported: boolean;
  readonly account: AccountState;
  readonly toast: Toast | null;
}

export const INITIAL_STREAK: StreakState = {
  current: 0,
  longest: 0,
  graceUsedThisWeek: 0,
  weekKey: '',
  lastReadDay: null,
  totalDays: 0,
};

const INITIAL_STATE: AppState = {
  bootStatus: 'loading',
  preferences: DEFAULT_PREFERENCES,
  location: { bookNumber: 43, chapter: 1 },
  chapter: null,
  chapterStatus: 'idle',
  chapterError: null,
  compareTranslation: null,
  notes: [],
  highlights: [],
  bookmarks: [],
  memorizedVerses: [],
  songs: [],
  lampClub: [],
  events: [],
  importedMeta: [],
  streak: INITIAL_STREAK,
  notificationPermission: 'default',
  fileSystemSupported: false,
  account: INITIAL_ACCOUNT,
  toast: null,
};

type Listener = () => void;

/**
 * Store mínimo con `useSyncExternalStore`.
 * Decisión: sin librería externa de estado; el dominio es pequeño y así
 * evitamos dependencias y renders innecesarios por contexto global.
 */
class AppStore {
  private state: AppState = INITIAL_STATE;
  private readonly listeners = new Set<Listener>();

  getState = (): AppState => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  setState = (updater: (previous: AppState) => AppState): void => {
    const next = updater(this.state);
    if (next === this.state) return;
    this.state = next;
    for (const listener of this.listeners) listener();
  };

  reset = (): void => {
    this.state = INITIAL_STATE;
    for (const listener of this.listeners) listener();
  };
}

export const appStore = new AppStore();

/** Suscripción tipada al estado completo. Los componentes se mantienen pequeños. */
export function useAppStore(): AppState {
  return useSyncExternalStore(appStore.subscribe, appStore.getState, appStore.getState);
}

let toastCounter = 0;

export function showToast(message: string, tone: ToastTone = 'info'): void {
  toastCounter += 1;
  const toast: Toast = { id: toastCounter, message, tone };
  appStore.setState((state) => ({ ...state, toast }));
  const id = toast.id;
  window.setTimeout(() => {
    appStore.setState((state) => (state.toast?.id === id ? { ...state, toast: null } : state));
  }, 4200);
}

export function dismissToast(): void {
  appStore.setState((state) => ({ ...state, toast: null }));
}
