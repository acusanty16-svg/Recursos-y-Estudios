import type { Reminder, Weekday } from '../rsc';
import { WEEKDAYS } from '../rsc';
import { toDayKey } from '../model/reference';
import { appStore } from './store';

const FIRED_KEY = 'sv.reminders.fired.v1';

function weekdayKey(date: Date): Weekday {
  // getDay(): 0 domingo … 6 sábado. WEEKDAYS empieza en lunes.
  const index = (date.getDay() + 6) % 7;
  return WEEKDAYS[index] ?? 'mon';
}

function readFired(): Record<string, string> {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function markFired(reminderId: string, day: string): void {
  const fired = readFired();
  fired[reminderId] = day;
  try {
    localStorage.setItem(FIRED_KEY, JSON.stringify(fired));
  } catch {
    // Sin persistencia, el peor caso es una notificación duplicada en la sesión.
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    appStore.setState((state) => ({ ...state, notificationPermission: 'unsupported' }));
    return 'unsupported';
  }
  const permission = await Notification.requestPermission();
  appStore.setState((state) => ({ ...state, notificationPermission: permission }));
  return permission;
}

export function refreshNotificationPermission(): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    appStore.setState((state) => ({ ...state, notificationPermission: 'unsupported' }));
    return;
  }
  appStore.setState((state) => ({ ...state, notificationPermission: Notification.permission }));
}

function showReminder(reminder: Reminder, language: 'es' | 'en'): void {
  const title = language === 'es' ? reminder.titleEs : reminder.titleEn;
  const body = language === 'es' ? reminder.messageEs : reminder.messageEn;
  const notification = new Notification(title, {
    body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: `sv-${reminder.id}`,
  });
  notification.onclick = () => {
    window.focus();
    window.location.assign('/leer');
  };
}

/**
 * Scheduler ligero mientras la app está abierta.
 * Limitación honesta: sin backend ni Push API no hay notificaciones con la app cerrada.
 */
export function startReminderScheduler(reminders: readonly Reminder[]): () => void {
  let disposed = false;

  const tick = (): void => {
    if (disposed) return;
    const { preferences, notificationPermission } = appStore.getState();
    if (!preferences.notificationsEnabled) return;
    if (notificationPermission !== 'granted') return;
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = toDayKey(now);
    const weekday = weekdayKey(now);
    const fired = readFired();

    for (const reminder of reminders) {
      if (!reminder.enabled) continue;
      if (!reminder.days.includes(weekday)) continue;
      if (reminder.time !== currentTime) continue;
      if (fired[reminder.id] === today) continue;
      showReminder(reminder, preferences.uiLanguage);
      markFired(reminder.id, today);
    }
  };

  const interval = window.setInterval(tick, 30_000);
  tick();

  return () => {
    disposed = true;
    window.clearInterval(interval);
  };
}
