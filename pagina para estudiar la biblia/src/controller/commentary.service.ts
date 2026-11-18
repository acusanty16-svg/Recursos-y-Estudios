import {
  getMatthewHenryUrl,
  hasMatthewHenryBook,
  parseMatthewHenryResponse,
  type ChapterCommentary,
} from '../model/commentary';
import { appError, fail, ok, type AppError, type Result } from '../model/errors';
import { getDb } from './idb';

const memoryCache = new Map<string, ChapterCommentary>();
const inFlight = new Map<string, Promise<Result<ChapterCommentary, AppError>>>();
const translationCache = new Map<string, string>();

function cacheKey(bookNumber: number, chapter: number): string {
  return `commentary:mh:${bookNumber}:${chapter}`;
}

async function readStoredCommentary(key: string): Promise<ChapterCommentary | null> {
  try {
    const db = await getDb();
    const row = await db.get('meta', key);
    if (!row) return null;
    const parsed: unknown = JSON.parse(row.value);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const candidate = parsed as ChapterCommentary;
    if (candidate.sourceId !== 'matthew-henry' || !Array.isArray(candidate.sections)) return null;
    return candidate;
  } catch {
    return null;
  }
}

async function storeCommentary(key: string, value: ChapterCommentary): Promise<void> {
  try {
    const db = await getDb();
    await db.put('meta', { key, value: JSON.stringify(value) });
  } catch {
    // Mantiene caché en memoria aunque IndexedDB falle.
  }
}

/**
 * Obtiene el Comentario Bíblico de Matthew Henry desde bible.helloao.org
 * (Dominio Público, CORS abierto, sin API key) con caché persistente offline en IndexedDB.
 */
export async function loadMatthewHenryCommentary(
  bookNumber: number,
  chapter: number,
): Promise<Result<ChapterCommentary, AppError>> {
  if (!hasMatthewHenryBook(bookNumber)) {
    return fail(appError('UNSUPPORTED', 'Matthew Henry no está disponible para este libro en la edición pública.'));
  }

  const key = cacheKey(bookNumber, chapter);
  const mem = memoryCache.get(key);
  if (mem) return ok(mem);

  const existing = inFlight.get(key);
  if (existing) return existing;

  const task = (async (): Promise<Result<ChapterCommentary, AppError>> => {
    const stored = await readStoredCommentary(key);
    if (stored) {
      memoryCache.set(key, stored);
      return ok(stored);
    }

    const url = getMatthewHenryUrl(bookNumber, chapter);
    if (!url) {
      return fail(appError('UNSUPPORTED', 'Libro no soportado por el comentario público.'));
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return fail(appError('NETWORK', `No se pudo cargar el comentario (HTTP ${response.status}).`));
      }
      const raw: unknown = await response.json();
      const parsed = parseMatthewHenryResponse(raw, bookNumber, chapter);
      if (!parsed) {
        return fail(appError('VALIDATION', 'Formato inesperado en la respuesta de Matthew Henry.'));
      }
      memoryCache.set(key, parsed);
      void storeCommentary(key, parsed);
      return ok(parsed);
    } catch {
      return fail(appError('NETWORK', 'Sin conexión al cargar el comentario de Matthew Henry.'));
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, task);
  return task;
}

function splitIntoChunks(text: string, maxLen = 1200): string[] {
  if (text.length <= maxLen) return [text];
  const paragraphs = text.split(/\n+/);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if (current.length + para.length + 1 <= maxLen) {
      current = current ? `${current}\n${para}` : para;
      continue;
    }
    if (current) {
      chunks.push(current);
      current = '';
    }
    if (para.length <= maxLen) {
      current = para;
      continue;
    }
    // Frases si un párrafo individual es muy extenso
    const sentences = para.match(/[^.!?]+[.!?]+\s*/g) ?? [para];
    for (const s of sentences) {
      if (current.length + s.length <= maxLen) {
        current += s;
      } else {
        if (current) chunks.push(current);
        current = s;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

/** Traduce bajo demanda un fragmento de Matthew Henry (inglés → español) con caché en memoria. */
export async function translateCommentaryEnToEs(text: string): Promise<string | null> {
  const clean = text.trim();
  if (!clean) return '';
  const cached = translationCache.get(clean);
  if (cached) return cached;

  try {
    const chunks = splitIntoChunks(clean);
    const translatedParts: string[] = [];

    for (const chunk of chunks) {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data: unknown = await res.json();
      if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
      const joined = (data[0] as unknown[])
        .map((seg) => (Array.isArray(seg) && typeof seg[0] === 'string' ? seg[0] : ''))
        .join('');
      translatedParts.push(joined);
    }

    const result = translatedParts.join('\n').trim();
    if (result) {
      translationCache.set(clean, result);
      return result;
    }
    return null;
  } catch {
    return null;
  }
}
