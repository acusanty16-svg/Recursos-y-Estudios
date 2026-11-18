import { z } from 'zod';

/**
 * Códigos USFM estándar 1..66 usados por bible.helloao.org para el
 * Comentario Bíblico de Matthew Henry (Dominio Público, sin API key).
 */
const CANON_TO_USFM: Record<number, string> = {
  1: 'GEN', 2: 'EXO', 3: 'LEV', 4: 'NUM', 5: 'DEU', 6: 'JOS', 7: 'JDG', 8: 'RUT',
  9: '1SA', 10: '2SA', 11: '1KI', 12: '2KI', 13: '1CH', 14: '2CH', 15: 'EZR', 16: 'NEH',
  17: 'EST', 18: 'JOB', 19: 'PSA', 20: 'PRO', 21: 'ECC', 22: 'SNG', 23: 'ISA', 24: 'JER',
  25: 'LAM', 26: 'EZK', 27: 'DAN', 28: 'HOS', 29: 'JOL', 30: 'AMO', 31: 'OBA', 32: 'JON',
  33: 'MIC', 34: 'NAM', 35: 'HAB', 36: 'ZEP', 37: 'HAG', 38: 'ZEC', 39: 'MAL',
  40: 'MAT', 41: 'MRK', 42: 'LUK', 43: 'JHN', 44: 'ACT', 45: 'ROM', 46: '1CO', 47: '2CO',
  48: 'GAL', 49: 'EPH', 50: 'PHP', 51: 'COL', 52: '1TH', 53: '2TH', 54: '1TI', 55: '2TI',
  56: 'TIT', 57: 'PHM', 58: 'HEB', 59: 'JAS', 60: '1PE', 61: '2PE', 62: '1JN', 63: '2JN',
  64: '3JN', 65: 'JUD', 66: 'REV',
};

export interface CommentarySection {
  readonly verseNumber: number | null;
  readonly text: string;
}

export interface ChapterCommentary {
  readonly sourceId: 'matthew-henry';
  readonly bookNumber: number;
  readonly chapter: number;
  readonly bookName: string;
  readonly bookIntroduction: string | null;
  readonly chapterIntroduction: string | null;
  readonly sections: readonly CommentarySection[];
}

export const MATTHEW_HENRY_API_BASE = 'https://bible.helloao.org/api/c/matthew-henry';

/** La edición pública de Matthew Henry en bible.helloao.org incluye 65 libros (omite Cantares / SNG). */
export function hasMatthewHenryBook(bookNumber: number): boolean {
  return bookNumber !== 22 && CANON_TO_USFM[bookNumber] !== undefined;
}

export function getMatthewHenryUrl(bookNumber: number, chapter: number): string | null {
  if (!hasMatthewHenryBook(bookNumber)) return null;
  const usfm = CANON_TO_USFM[bookNumber];
  if (!usfm) return null;
  return `${MATTHEW_HENRY_API_BASE}/${usfm}/${chapter}.json`;
}

const contentPartSchema = z.union([
  z.string(),
  z.object({ text: z.string().optional() }).passthrough(),
]);

const helloAoChapterSchema = z.object({
  book: z
    .object({
      name: z.string().optional(),
      commonName: z.string().optional(),
      introduction: z.string().nullable().optional(),
    })
    .passthrough(),
  chapter: z
    .object({
      number: z.number().optional(),
      introduction: z.string().nullable().optional(),
      content: z
        .array(
          z
            .object({
              type: z.string(),
              number: z.number().optional(),
              content: z.array(contentPartSchema).optional(),
            })
            .passthrough(),
        )
        .optional(),
    })
    .passthrough(),
});

function flattenContent(parts: readonly z.infer<typeof contentPartSchema>[] | undefined): string {
  if (!parts || parts.length === 0) return '';
  return parts
    .map((part) => (typeof part === 'string' ? part : (part.text ?? '')))
    .join('\n')
    .trim();
}

export interface ResolvedCommentaryTarget {
  readonly index: number;
  readonly verseNumber: number;
  readonly isExact: boolean;
}

/**
 * Busca la sección exacta para `targetVerse` o, si Matthew Henry omite ese
 * versículo concreto, devuelve la sección numerada más cercana posible.
 */
export function resolveCommentaryTarget(
  sections: readonly CommentarySection[],
  targetVerse: number | null | undefined,
): ResolvedCommentaryTarget | null {
  if (!targetVerse || targetVerse < 1) return null;

  const exactIndex = sections.findIndex((sec) => sec.verseNumber === targetVerse);
  if (exactIndex !== -1) {
    return { index: exactIndex, verseNumber: targetVerse, isExact: true };
  }

  let bestIndex = -1;
  let bestVerse = -1;
  let bestDist = Number.POSITIVE_INFINITY;

  sections.forEach((sec, idx) => {
    if (sec.verseNumber === null) return;
    const dist = Math.abs(sec.verseNumber - targetVerse);
    const isCloser = dist < bestDist;
    const isTiePreferEarlier =
      dist === bestDist && sec.verseNumber <= targetVerse && bestVerse > targetVerse;
    if (isCloser || isTiePreferEarlier) {
      bestDist = dist;
      bestIndex = idx;
      bestVerse = sec.verseNumber;
    }
  });

  if (bestIndex === -1) return null;
  return { index: bestIndex, verseNumber: bestVerse, isExact: false };
}

export function parseMatthewHenryResponse(
  raw: unknown,
  bookNumber: number,
  chapter: number,
): ChapterCommentary | null {
  const parsed = helloAoChapterSchema.safeParse(raw);
  if (!parsed.success) return null;

  const { book, chapter: ch } = parsed.data;
  const sections: CommentarySection[] = [];

  for (const item of ch.content ?? []) {
    const text = flattenContent(item.content);
    if (!text) continue;
    sections.push({
      verseNumber: typeof item.number === 'number' ? item.number : null,
      text,
    });
  }

  return {
    sourceId: 'matthew-henry',
    bookNumber,
    chapter,
    bookName: book.commonName ?? book.name ?? '',
    bookIntroduction: book.introduction?.trim() || null,
    chapterIntroduction: ch.introduction?.trim() || null,
    sections,
  };
}
