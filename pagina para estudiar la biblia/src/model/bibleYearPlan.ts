import { CANON, bookDisplayName, getBookByNumber } from './canon';
import { toDayKey } from './reference';

export interface ChapterReadingRef {
  readonly bookNumber: number;
  readonly chapter: number;
  readonly section: 'ot' | 'wisdom' | 'nt';
}

export interface YearPlanDay {
  readonly day: number; // 1..365
  readonly month: number; // 1..12
  readonly readings: readonly ChapterReadingRef[];
}

export const YEAR_PLAN_DAYS_COUNT = 365;

function collectChapters(
  predicate: (bookNumber: number) => boolean,
  section: ChapterReadingRef['section'],
): readonly ChapterReadingRef[] {
  const list: ChapterReadingRef[] = [];
  for (const book of CANON) {
    if (!predicate(book.number)) continue;
    for (let ch = 1; ch <= book.chapters; ch += 1) {
      list.push({ bookNumber: book.number, chapter: ch, section });
    }
  }
  return list;
}

function sliceForDay(items: readonly ChapterReadingRef[], dayIndex0: number): readonly ChapterReadingRef[] {
  const start = Math.ceil((dayIndex0 * items.length) / YEAR_PLAN_DAYS_COUNT);
  const end = Math.ceil(((dayIndex0 + 1) * items.length) / YEAR_PLAN_DAYS_COUNT);
  return items.slice(start, end);
}

/**
 * Construye el plan mixto oficial «Biblia en un año» (365 días):
 * cada día combina Antiguo Testamento, Salmos/Proverbios (aprox. cada 2 días)
 * y Nuevo Testamento hasta cubrir los 1.189 capítulos exactos de la Biblia.
 */
function buildMixedYearPlan(): readonly YearPlanDay[] {
  const otNarrativeAndProphets = collectChapters(
    (num) => num <= 39 && num !== 19 && num !== 20,
    'ot',
  );
  const psalmsAndProverbs = collectChapters((num) => num === 19 || num === 20, 'wisdom');
  const newTestament = collectChapters((num) => num >= 40, 'nt');

  const days: YearPlanDay[] = [];
  for (let i = 0; i < YEAR_PLAN_DAYS_COUNT; i += 1) {
    const readings: ChapterReadingRef[] = [
      ...sliceForDay(otNarrativeAndProphets, i),
      ...sliceForDay(psalmsAndProverbs, i),
      ...sliceForDay(newTestament, i),
    ];
    const month = Math.min(12, Math.floor((i * 12) / YEAR_PLAN_DAYS_COUNT) + 1);
    days.push({
      day: i + 1,
      month,
      readings,
    });
  }
  return days;
}

export const BIBLE_YEAR_PLAN: readonly YearPlanDay[] = buildMixedYearPlan();

export function getYearPlanDay(day: number): YearPlanDay {
  const clamped = Math.max(1, Math.min(YEAR_PLAN_DAYS_COUNT, Math.floor(day)));
  return BIBLE_YEAR_PLAN[clamped - 1] ?? BIBLE_YEAR_PLAN[0]!;
}

function parseIsoDayUtc(dayKey: string): number {
  const parts = dayKey.split('-').map(Number);
  return Date.UTC(parts[0] || 2026, (parts[1] || 1) - 1, parts[2] || 1);
}

/** Calcula qué día del plan (1..365) corresponde hoy según la fecha de inicio. */
export function getSuggestedPlanDay(startDateKey: string, todayKey = toDayKey()): number {
  const diffDays = Math.floor((parseIsoDayUtc(todayKey) - parseIsoDayUtc(startDateKey)) / 86_400_000);
  if (diffDays < 0) return 1;
  return (diffDays % YEAR_PLAN_DAYS_COUNT) + 1;
}

export interface GroupedBookReading {
  readonly bookNumber: number;
  readonly startChapter: number;
  readonly endChapter: number;
  readonly section: ChapterReadingRef['section'];
}

/** Agrupa capítulos contiguos del mismo libro (ej.: "Génesis 1–2" en lugar de "Génesis 1, Génesis 2"). */
export function groupDayReadings(readings: readonly ChapterReadingRef[]): readonly GroupedBookReading[] {
  const groups: GroupedBookReading[] = [];
  for (const item of readings) {
    const prev = groups[groups.length - 1];
    if (prev && prev.bookNumber === item.bookNumber && prev.endChapter + 1 === item.chapter) {
      groups[groups.length - 1] = {
        ...prev,
        endChapter: item.chapter,
      };
    } else {
      groups.push({
        bookNumber: item.bookNumber,
        startChapter: item.chapter,
        endChapter: item.chapter,
        section: item.section,
      });
    }
  }
  return groups;
}

export function formatGroupedReading(group: GroupedBookReading, language: 'es' | 'en'): string {
  const book = getBookByNumber(group.bookNumber);
  const name = book ? bookDisplayName(book, language) : `Libro ${group.bookNumber}`;
  if (group.startChapter === group.endChapter) {
    return `${name} ${group.startChapter}`;
  }
  return `${name} ${group.startChapter}–${group.endChapter}`;
}

export function formatYearPlanDaySummary(dayEntry: YearPlanDay, language: 'es' | 'en'): string {
  return groupDayReadings(dayEntry.readings)
    .map((g) => formatGroupedReading(g, language))
    .join(' · ');
}
