import { z } from 'zod';
import { BIBLE_API_BASE, BIBLE_API_CHAPTER_PATH } from '../model/constants';
import { getBookByNumber } from '../model/canon';
import { appError, ok, toAppError, type AppError, type Result } from '../model/errors';
import type { Chapter, TranslationId, Verse } from '../model/types';
import { getCachedChapter, putCachedChapter } from './idb';

/** Esquema del proveedor público. Se valida antes de confiar en la red. */
const providerVerseSchema = z
  .object({
    pk: z.number().optional(),
    verse: z.number().int().min(1),
    text: z.string(),
  })
  .loose();

const providerChapterSchema = z.array(providerVerseSchema).min(1);

const HTML_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  '#39': "'",
};

/**
 * La API entrega `<br>` y entidades HTML. Se limpian antes de guardar para
 * que el texto sagrado se renderice como texto plano y no como markup.
 */
export function normalizeVerseText(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(nbsp|amp|quot|apos|lt|gt|#39);/gi, (_match, entity: string) => HTML_ENTITIES[entity.toLowerCase()] ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

const inFlight = new Map<string, AbortController>();

export function buildChapterUrl(
  translationId: TranslationId,
  bookNumber: number,
  chapter: number,
): string {
  return `${BIBLE_API_BASE}${BIBLE_API_CHAPTER_PATH}/${translationId}/${bookNumber}/${chapter}/`;
}

export interface LoadChapterOptions {
  readonly forceNetwork?: boolean;
  readonly signal?: AbortSignal;
}

/**
 * Estrategia de datos: caché por capítulo.
 * 1. IndexedDB (instantáneo, offline).
 * 2. Red con validación Zod.
 * 3. Persistencia del capítulo validado.
 */
export async function loadChapter(
  translationId: TranslationId,
  bookNumber: number,
  chapterNumber: number,
  options: LoadChapterOptions = {},
): Promise<Result<Chapter, AppError>> {
  const book = getBookByNumber(bookNumber);
  if (!book) {
    return { ok: false, error: appError('VALIDATION', `Libro fuera del canon: ${bookNumber}`, { retryable: false }) };
  }
  if (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > book.chapters) {
    return {
      ok: false,
      error: appError('VALIDATION', `Capítulo inválido para ${book.nameEs}: ${chapterNumber}`, { retryable: false }),
    };
  }

  if (!options.forceNetwork) {
    try {
      const cached = await getCachedChapter(translationId, bookNumber, chapterNumber);
      if (cached && cached.verses.length > 0) {
        return ok({ ...cached, source: 'cache' });
      }
    } catch {
      // IndexedDB puede fallar en modo privado: se degrada a red sin romper la lectura.
    }
  }

  const key = `${translationId}:${bookNumber}:${chapterNumber}`;
  inFlight.get(key)?.abort();
  const controller = new AbortController();
  inFlight.set(key, controller);

  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    else options.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(buildChapterUrl(translationId, bookNumber, chapterNumber), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return {
        ok: false,
        error: appError('HTTP', `El servidor respondió ${response.status}. Inténtalo de nuevo.`),
      };
    }

    const json: unknown = await response.json();
    const parsed = providerChapterSchema.safeParse(json);
    if (!parsed.success) {
      return {
        ok: false,
        error: appError('PARSE', 'La respuesta de la API no tiene el formato esperado.'),
      };
    }

    const verses: Verse[] = parsed.data.map((item) => ({
      number: item.verse,
      text: normalizeVerseText(item.text),
    }));

    const chapter: Chapter = {
      translationId,
      bookNumber,
      chapter: chapterNumber,
      verses,
      source: 'network',
      fetchedAt: Date.now(),
    };

    try {
      await putCachedChapter(chapter);
    } catch {
      // Sin caché seguimos mostrando el texto: la lectura no debe fallar por IndexedDB.
    }

    return ok(chapter);
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      return { ok: false, error: appError('ABORTED', 'Carga cancelada.', { cause, retryable: false }) };
    }
    return { ok: false, error: toAppError(cause, 'No se pudo cargar el capítulo') };
  } finally {
    if (inFlight.get(key) === controller) inFlight.delete(key);
  }
}

export function abortAllChapterLoads(): void {
  for (const controller of inFlight.values()) controller.abort();
  inFlight.clear();
}
