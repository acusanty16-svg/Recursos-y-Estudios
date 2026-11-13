import { CANON, getBookByNumber } from './canon';
import { MAX_TAG_LENGTH } from './constants';
import type { TranslationId, VerseReference } from './types';

/** Formatea una referencia como "Juan 3:16". */
export function formatReference(
  reference: VerseReference,
  language: 'es' | 'en' = 'es',
): string {
  const book = getBookByNumber(reference.bookNumber);
  const name = book ? (language === 'es' ? book.nameEs : book.nameEn) : `Libro ${reference.bookNumber}`;
  return `${name} ${reference.chapter}:${reference.verse}`;
}

/** Formatea una cita lista para portapapeles: "Juan 3:16 (RV1960)". */
export function formatCitation(
  reference: VerseReference,
  translationId: TranslationId,
  language: 'es' | 'en' = 'es',
): string {
  return `${formatReference(reference, language)} (${translationId})`;
}

export function formatChapterLabel(
  bookNumber: number,
  chapter: number,
  language: 'es' | 'en' = 'es',
): string {
  const book = getBookByNumber(bookNumber);
  const name = book ? (language === 'es' ? book.nameEs : book.nameEn) : `Libro ${bookNumber}`;
  return `${name} ${chapter}`;
}

/** Texto para copiar: cita + cuerpo del versículo. */
export function buildClipboardText(
  reference: VerseReference,
  translationId: TranslationId,
  text: string,
  language: 'es' | 'en' = 'es',
): string {
  return `${text.trim()}\n\n— ${formatCitation(reference, translationId, language)}`;
}

/** Normaliza una etiqueta: minúsculas, sin acentos, sin espacios sobrantes. */
export function normalizeTag(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, MAX_TAG_LENGTH);
}

/** Fecha local YYYY-MM-DD (sin desfase UTC). */
export function toDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Lunes (ISO) de la semana que contiene `date`, como YYYY-MM-DD. */
export function toWeekKey(date: Date = new Date()): string {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = copy.getDay(); // 0 domingo .. 6 sábado
  const diffToMonday = weekday === 0 ? -6 : 1 - weekday;
  copy.setDate(copy.getDate() + diffToMonday);
  return toDayKey(copy);
}

export function parseDayKey(day: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) return null;
  const [, year, month, date] = match;
  if (!year || !month || !date) return null;
  const parsed = new Date(Number(year), Number(month) - 1, Number(date));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Diferencia en días calendario entre dos claves YYYY-MM-DD. */
export function daysBetween(fromDay: string, toDay: string): number {
  const from = parseDayKey(fromDay);
  const to = parseDayKey(toDay);
  if (!from || !to) return Number.NaN;
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

const BOOK_ALIASES = new Map<string, number>();

function aliasKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const book of CANON) {
  for (const alias of [book.id, book.nameEs, book.nameEn, book.abbrevEs, book.abbrevEn]) {
    BOOK_ALIASES.set(aliasKey(alias), book.number);
  }
  BOOK_ALIASES.set(aliasKey(book.id.replace(/-/g, ' ')), book.number);
}

// Variantes devocionales frecuentes (p. ej. "San Juan", "Salmo").
const EXTRA_BOOK_ALIASES: readonly [string, number][] = [
  ['salmo', 19],
  ['san mateo', 40],
  ['san marcos', 41],
  ['san lucas', 42],
  ['san juan', 43],
  ['hechos de los apostoles', 44],
  ['apoc', 66],
  ['rm', 45],
];

for (const [alias, number] of EXTRA_BOOK_ALIASES) {
  BOOK_ALIASES.set(alias, number);
}

/** Parser tolerante de referencias tipo "Jn 3:16", "Juan 3 16" o "1 Co 13:4-7". */
export function parseReferenceInput(input: string): VerseReference | null {
  const cleaned = input.trim().replace(/\s+/g, ' ');
  const match = /^(.+?)\s*(\d{1,3})\s*[:.]?\s*(\d{1,3})(?:\s*-\s*\d{1,3})?$/.exec(cleaned);
  if (!match) return null;
  const [, bookPart, chapterPart, versePart] = match;
  if (!bookPart || !chapterPart || !versePart) return null;

  const bookNumber = BOOK_ALIASES.get(aliasKey(bookPart));
  if (bookNumber === undefined) return null;

  const book = getBookByNumber(bookNumber);
  if (!book) return null;

  const chapter = Number(chapterPart);
  const verse = Number(versePart);
  if (!Number.isInteger(chapter) || !Number.isInteger(verse)) return null;
  if (chapter < 1 || chapter > book.chapters || verse < 1) return null;

  return { bookNumber: book.number, chapter, verse };
}

export interface DetectedReference {
  readonly raw: string;
  readonly start: number;
  readonly end: number;
  readonly reference: VerseReference;
}

const REFERENCE_SCAN_RE =
  /\b(?:(?:1|2|3)\s+|San\s+)?[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,16}(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,12})?\s+\d{1,3}:\s*\d{1,3}(?:\s*-\s*\d{1,3})?\b/g;

/**
 * Detecta citas bíblicas dentro de apuntes de prédicas, estudios o seminarios
 * para volverlas enlaces navegables al lector.
 */
export function extractBibleReferences(text: string): readonly DetectedReference[] {
  const results: DetectedReference[] = [];
  const matcher = new RegExp(REFERENCE_SCAN_RE.source, 'g');
  let match: RegExpExecArray | null = matcher.exec(text);

  while (match !== null) {
    const raw = match[0];
    const parsed = parseReferenceInput(raw);
    if (parsed) {
      results.push({
        raw,
        start: match.index,
        end: match.index + raw.length,
        reference: parsed,
      });
    }
    match = matcher.exec(text);
  }

  return results;
}
