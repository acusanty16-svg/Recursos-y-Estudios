import { getBookByNumber } from '../model/canon';
import { daysBetween, parseDayKey, toDayKey } from '../model/reference';
import type { Highlight, Note, ReadingEvent } from '../model/types';

export interface DailyActivity {
  readonly day: string;
  readonly count: number;
}

export interface BookActivity {
  readonly bookNumber: number;
  readonly chapters: number;
  readonly name: string;
}

export interface ReadingStats {
  readonly totalDays: number;
  readonly totalEvents: number;
  readonly uniqueChapters: number;
  readonly booksTouched: number;
  readonly notesCount: number;
  readonly highlightsCount: number;
  readonly tagsCount: number;
  readonly last30Days: readonly DailyActivity[];
  readonly topBooks: readonly BookActivity[];
  readonly currentStreak: number;
  readonly longestStreak: number;
}

export interface StatsInput {
  readonly events: readonly ReadingEvent[];
  readonly notes: readonly Note[];
  readonly highlights: readonly Highlight[];
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly today?: string;
}

/** Estadísticas derivadas: función pura, sin efectos ni acceso a almacenamiento. */
export function computeStats(input: StatsInput): ReadingStats {
  const today = input.today ?? toDayKey();
  const chapterKeys = new Set<string>();
  const books = new Map<number, Set<number>>();
  const days = new Set<string>();
  const perDay = new Map<string, number>();

  for (const event of input.events) {
    chapterKeys.add(`${event.bookNumber}:${event.chapter}`);
    days.add(event.day);
    perDay.set(event.day, (perDay.get(event.day) ?? 0) + 1);

    const bookChapters = books.get(event.bookNumber) ?? new Set<number>();
    bookChapters.add(event.chapter);
    books.set(event.bookNumber, bookChapters);
  }

  const tags = new Set<string>();
  for (const note of input.notes) {
    for (const tag of note.tags) tags.add(tag);
  }

  const last30Days: DailyActivity[] = [];
  const todayDate = parseDayKey(today) ?? new Date();
  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - offset);
    const day = toDayKey(date);
    last30Days.push({ day, count: perDay.get(day) ?? 0 });
  }

  const topBooks: BookActivity[] = [...books.entries()]
    .map(([bookNumber, chapters]) => {
      const book = getBookByNumber(bookNumber);
      return {
        bookNumber,
        chapters: chapters.size,
        name: book?.nameEs ?? `Libro ${bookNumber}`,
      };
    })
    .sort((a, b) => b.chapters - a.chapters)
    .slice(0, 5);

  return {
    totalDays: days.size,
    totalEvents: input.events.length,
    uniqueChapters: chapterKeys.size,
    booksTouched: books.size,
    notesCount: input.notes.length,
    highlightsCount: input.highlights.length,
    tagsCount: tags.size,
    last30Days,
    topBooks,
    currentStreak: input.currentStreak,
    longestStreak: input.longestStreak,
  };
}

/** Actividad de los últimos 7 días, útil para el mini-calendario del dashboard. */
export function lastSevenDays(events: readonly ReadingEvent[], today: string = toDayKey()): readonly DailyActivity[] {
  const perDay = new Map<string, number>();
  for (const event of events) {
    perDay.set(event.day, (perDay.get(event.day) ?? 0) + 1);
  }

  const result: DailyActivity[] = [];
  const todayDate = parseDayKey(today) ?? new Date();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - offset);
    const day = toDayKey(date);
    result.push({ day, count: perDay.get(day) ?? 0 });
  }
  return result;
}

/** Días desde la última lectura (null si nunca leyó). */
export function daysSinceLastReading(events: readonly ReadingEvent[], today: string = toDayKey()): number | null {
  if (events.length === 0) return null;
  const days = events.map((event) => event.day).sort();
  const last = days[days.length - 1];
  if (!last) return null;
  return daysBetween(last, today);
}
