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

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function aliasKey(value: string): string {
  let key = stripAccents(value)
    .toLowerCase()
    .replace(/[.ª°]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Normaliza ordinales, romanos, "de" y prefijos compactos ("1jn", "1ra de juan", "II Co", "S. Juan").
  key = key
    .replace(/^(?:primera)\s+(?:de\s+)?/, '1 ')
    .replace(/^(?:segunda)\s+(?:de\s+)?/, '2 ')
    .replace(/^(?:tercera)\s+(?:de\s+)?/, '3 ')
    .replace(/^(iii)\s+/, '3 ')
    .replace(/^(ii)\s+/, '2 ')
    .replace(/^(i)\s+/, '1 ')
    .replace(/^([123])(?:ra|era|da|a)?\s*(?:de\s+)?/, '$1 ')
    .replace(/^([123])([a-z])/, '$1 $2')
    .replace(/^(?:sn|s)\s+(mateo|marcos|lucas|juan)$/, 'san $1')
    .replace(/\s+/g, ' ')
    .trim();

  return key;
}

for (const book of CANON) {
  for (const alias of [book.id, book.nameEs, book.nameEn, book.abbrevEs, book.abbrevEn]) {
    BOOK_ALIASES.set(aliasKey(alias), book.number);
  }
  BOOK_ALIASES.set(aliasKey(book.id.replace(/-/g, ' ')), book.number);
}

// Abreviaturas, ortografías alternativas y variantes devocionales (ES + EN).
const EXTRA_BOOK_ALIASES: readonly [string, number][] = [
  ['ge', 1],
  ['ex', 2],
  ['exo', 2],
  ['le', 3],
  ['nu', 4],
  ['de', 5],
  ['deu', 5],
  ['js', 6],
  ['juec', 7],
  ['jc', 7],
  ['jdg', 7],
  ['ru', 8],
  ['rth', 8],
  ['1 sa', 9],
  ['1 sm', 9],
  ['2 sa', 10],
  ['2 sm', 10],
  ['1 re', 11],
  ['1 rey', 11],
  ['1 ry', 11],
  ['1 ki', 11],
  ['1 kg', 11],
  ['2 re', 12],
  ['2 rey', 12],
  ['2 ry', 12],
  ['2 ki', 12],
  ['2 kg', 12],
  ['1 cro', 13],
  ['1 cron', 13],
  ['1 ch', 13],
  ['2 cro', 14],
  ['2 cron', 14],
  ['2 ch', 14],
  ['esdr', 15],
  ['ezr', 15],
  ['ne', 16],
  ['jb', 18],
  ['salmo', 19],
  ['salm', 19],
  ['sals', 19],
  ['sl', 19],
  ['psa', 19],
  ['psalm', 19],
  ['pro', 20],
  ['prv', 20],
  ['ecl', 21],
  ['ecles', 21],
  ['ecc', 21],
  ['qoh', 21],
  ['cantar', 22],
  ['cant', 22],
  ['ct', 22],
  ['sos', 22],
  ['cantar de los cantares', 22],
  ['song of solomon', 22],
  ['jr', 24],
  ['je', 24],
  ['lament', 25],
  ['eze', 26],
  ['ezeq', 26],
  ['ezk', 26],
  ['da', 27],
  ['ose', 28],
  ['joe', 29],
  ['abdias', 31],
  ['abdi', 31],
  ['ob', 31],
  ['jnh', 32],
  ['miq', 33],
  ['na', 34],
  ['nam', 34],
  ['ha', 35],
  ['habac', 35],
  ['so', 36],
  ['zep', 36],
  ['hg', 37],
  ['ageo', 37],
  ['zc', 38],
  ['zec', 38],
  ['ml', 39],
  ['mat', 40],
  ['san mateo', 40],
  ['mc', 41],
  ['mar', 41],
  ['marc', 41],
  ['mk', 41],
  ['san marcos', 41],
  ['luc', 42],
  ['lu', 42],
  ['lk', 42],
  ['san lucas', 42],
  ['jua', 43],
  ['jhn', 43],
  ['san juan', 43],
  ['hech', 44],
  ['hec', 44],
  ['hc', 44],
  ['act', 44],
  ['hechos de los apostoles', 44],
  ['rm', 45],
  ['roman', 45],
  ['1 corintio', 46],
  ['2 corintio', 47],
  ['efe', 49],
  ['efes', 49],
  ['flp', 50],
  ['fp', 50],
  ['filp', 50],
  ['php', 50],
  ['philip', 50],
  ['1 tes', 52],
  ['1 th', 52],
  ['1 thes', 52],
  ['2 tes', 53],
  ['2 th', 53],
  ['2 thes', 53],
  ['1 tm', 54],
  ['2 tm', 55],
  ['ti', 56],
  ['filem', 57],
  ['phm', 57],
  ['philem', 57],
  ['hebr', 58],
  ['hb', 58],
  ['stgo', 59],
  ['snt', 59],
  ['sant', 59],
  ['sg', 59],
  ['1 pe', 60],
  ['1 ped', 60],
  ['1 pt', 60],
  ['2 pe', 61],
  ['2 ped', 61],
  ['2 pt', 61],
  ['1 jua', 62],
  ['1 jh', 62],
  ['2 jua', 63],
  ['2 jh', 63],
  ['3 jua', 64],
  ['3 jh', 64],
  ['jds', 65],
  ['apoc', 66],
  ['apo', 66],
  ['apc', 66],
  ['rv', 66],
  ['revelations', 66],
];

for (const [alias, number] of EXTRA_BOOK_ALIASES) {
  BOOK_ALIASES.set(alias, number);
}

const MAX_VERSES_IN_CHAPTER = 176;

function resolveVerseForBook(
  bookNumber: number,
  chapterNum: number,
  verseNum: number | null,
): VerseReference | null {
  const book = getBookByNumber(bookNumber);
  if (!book || !Number.isInteger(chapterNum) || chapterNum < 1) return null;

  if (verseNum === null) {
    // En libros de 1 capítulo ("Judas 24", "Filemón 6", "3 Juan 4"), el número suele ser el versículo.
    if (book.chapters === 1 && chapterNum <= MAX_VERSES_IN_CHAPTER) {
      return { bookNumber: book.number, chapter: 1, verse: chapterNum };
    }
    if (chapterNum <= book.chapters) {
      return { bookNumber: book.number, chapter: chapterNum, verse: 1 };
    }
    return null;
  }

  if (!Number.isInteger(verseNum) || verseNum < 1 || verseNum > MAX_VERSES_IN_CHAPTER) return null;
  if (chapterNum > book.chapters) return null;
  return { bookNumber: book.number, chapter: chapterNum, verse: verseNum };
}

/**
 * Parser tolerante de referencias: "Jn 3:16", "Jn. 3.16", "1Jn 4:8",
 * "1ra Juan 4,8", "Salmos 23", "Judas 24", "Flp 4:13" o "1 Co 13:4-7".
 */
export function parseReferenceInput(input: string): VerseReference | null {
  const cleaned = input.trim().replace(/\s+/g, ' ');
  if (!cleaned) return null;

  const fullMatch =
    /^(.+?)\s*(?:cap\.?|cap[ií]tulo)?\s*(\d{1,3})(?:\s*[:.,]\s*|\s+(?:vv?\.?|vers\.?|vers[ií]culos?)\s*|\s+)(\d{1,3})[aAbB]?(?:\s*[-–—]\s*\d{1,3}[aAbB]?|\s*,\s*\d{1,3}[aAbB]?(?:\s*[-–—]\s*\d{1,3}[aAbB]?)?)*$/.exec(
      cleaned,
    );
  if (fullMatch) {
    const [, bookPart, chapterPart, versePart] = fullMatch;
    if (bookPart && chapterPart && versePart) {
      const bookNumber = BOOK_ALIASES.get(aliasKey(bookPart));
      if (bookNumber !== undefined) {
        return resolveVerseForBook(bookNumber, Number(chapterPart), Number(versePart));
      }
    }
  }

  const chapterOnlyMatch =
    /^(.+?)\s*(?:cap\.?|cap[ií]tulo)?\s+(\d{1,3})(?:\s*[-–—]\s*\d{1,3})?$/.exec(cleaned);
  if (chapterOnlyMatch) {
    const [, bookPart, chapterPart] = chapterOnlyMatch;
    if (bookPart && chapterPart) {
      const bookNumber = BOOK_ALIASES.get(aliasKey(bookPart));
      if (bookNumber !== undefined) {
        return resolveVerseForBook(bookNumber, Number(chapterPart), null);
      }
    }
  }

  return null;
}

export interface DetectedReference {
  readonly raw: string;
  readonly start: number;
  readonly end: number;
  readonly reference: VerseReference;
}

const BOOK_WORD = '[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]';
const ORDINAL_PREFIX =
  '(?:(?:[Pp]rimera|[Ss]egunda|[Tt]ercera)\\s+(?:de\\s+)?|(?:III|II|I)\\s+|[123](?:ra|era|da|a|ª|°)?\\s*(?:de\\s+)?)';
const BOOK_CANDIDATE = `(?:${ORDINAL_PREFIX}${BOOK_WORD}{1,18}\\.?|(?:[Ss]an|[Ss]n\\.?|[Ss]\\.)\\s*${BOOK_WORD}{2,14}\\.?|Cantar\\s+de\\s+los\\s+Cantares|Hechos\\s+de\\s+los\\s+Ap[oó]stoles|${BOOK_WORD}{2,18}\\.?)`;
const NUMBERED_BOOK_AHEAD =
  `(?:[123](?![aAbB](?!${BOOK_WORD}))(?:ra|era|da|ª|°)?\\s*(?:de\\s+)?${BOOK_WORD})`;

// Escáner tolerante: captura prefijo delimitador (grupo 1), libro (grupo 2),
// etiqueta cap. opcional (grupo 3), capítulo (grupo 4), separador explícito opcional (grupo 5) y versículo (grupo 6).
const REFERENCE_SCAN_RE = new RegExp(
  `(^|[\\s(\\[{"'«*_\\-–—:;,.!/¡¿>])(${BOOK_CANDIDATE})(?:\\s+(cap\\.?|cap[ií]tulo))?(?:\\s*(\\d{1,3})(?:(\\s*[:.]\\s*|,|\\s+(?:vv?\\.?|vers\\.?|vers[ií]culos?)\\s*)(\\d{1,3})[aAbB]?(?:\\s*[-–—]\\s*\\d{1,3}[aAbB]?|\\s*,\\s*(?!${NUMBERED_BOOK_AHEAD})\\d{1,3}[aAbB]?(?:\\s*[-–—]\\s*\\d{1,3}[aAbB]?)?)*|\\s+(\\d{1,3})[aAbB]?(?:\\s*[-–—]\\s*\\d{1,3}[aAbB]?)?|(?:\\s*[-–—]\\s*\\d{1,3})?))(?![A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9%°])`,
  'g',
);

const PROSE_UNIT_FOLLOW_RE =
  /^\s+(?:d[ií]as?|a[ñn]os?|mes(?:es)?|semanas?|horas?|minutos?|segundos?|veces|vez|puntos?|pasos?|cosas?|personas?|hermanos?|hermanas?|euros?|d[oó]lares?|km|kg|cm)\b/i;

function shouldAcceptChapterOnly(rawBook: string, normalizedKey: string): boolean {
  // Evita falsos positivos con palabras cortas en minúsculas ("mi 2", "he 3", "ti 1", "da 2", "is 5").
  if (rawBook.includes('.')) return true;
  if (/^[123]/.test(normalizedKey)) return true;
  if (normalizedKey.length >= 3) return true;
  return /^[A-ZÁÉÍÓÚÑ]/.test(rawBook.trim());
}

/**
 * Detecta citas bíblicas dentro de apuntes de prédicas, estudios o seminarios
 * sin importar cómo se escriban, para resaltarlas y volverlas enlaces al lector.
 */
export function extractBibleReferences(text: string): readonly DetectedReference[] {
  const results: DetectedReference[] = [];
  const matcher = new RegExp(REFERENCE_SCAN_RE.source, 'g');
  let match: RegExpExecArray | null = matcher.exec(text);

  while (match !== null) {
    const [full, leading = '', rawBook = '', capLabel, chStr, explicitSep, vExplicit, vSpaced] = match;
    const raw = full.slice(leading.length);
    const start = match.index + leading.length;
    const end = match.index + full.length;
    const hasSpaceBetweenBookAndCh = /^\s/.test(full.slice(leading.length + rawBook.length));
    const verseStr = vExplicit ?? vSpaced;
    const hasExplicitVerseSep = Boolean(explicitSep);

    // Sin espacio tras libro solo se acepta si lleva separador explícito (ej.: "Jn3:16").
    const spacingValid = hasSpaceBetweenBookAndCh || Boolean(capLabel) || hasExplicitVerseSep;
    const key = aliasKey(rawBook);
    const bookNumber = BOOK_ALIASES.get(key);

    let accepted = false;
    if (spacingValid && bookNumber !== undefined && chStr) {
      const trailingText = text.slice(end);
      const isChapterOnly = !verseStr;
      const followedByUnit =
        (!hasExplicitVerseSep && PROSE_UNIT_FOLLOW_RE.test(trailingText)) ||
        (!hasExplicitVerseSep && /^\s*:/.test(trailingText));
      const allowed =
        !followedByUnit &&
        (hasExplicitVerseSep || Boolean(capLabel) || !isChapterOnly || shouldAcceptChapterOnly(rawBook, key));

      if (allowed) {
        const parsed = resolveVerseForBook(
          bookNumber,
          Number(chStr),
          verseStr ? Number(verseStr) : null,
        );
        if (parsed) {
          results.push({ raw, start, end, reference: parsed });
          accepted = true;
        }
      }
    }

    if (!accepted) {
      // Si el candidato no era válido (p. ej., "ver 1 Juan 4:8" o "San Pablo 2 Co 5:17"),
      // retrocede justo tras `rawBook` para no comerse el prefijo numérico de la cita siguiente.
      matcher.lastIndex = Math.max(match.index + 1, start + rawBook.length);
    }

    match = matcher.exec(text);
  }

  return results;
}
