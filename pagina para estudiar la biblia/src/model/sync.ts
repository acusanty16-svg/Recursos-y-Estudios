/**
 * Modelo puro de sincronización con Google Drive.
 * Regla arquitectónica: sin React, DOM ni APIs del navegador.
 */

import { HIGHLIGHT_COLORS, TRANSLATION_IDS } from './types';
import type {
  Bookmark,
  Highlight,
  HighlightColor,
  MemorizedVerse,
  Note,
  TranslationId,
  VerseReference,
} from './types';

export const SYNC_KINDS = ['notes', 'highlights', 'bookmarks', 'memorized'] as const;

export type SyncEntityKind = (typeof SYNC_KINDS)[number];

/** Borrados pendientes: id de entidad → instante del borrado. */
export type Tombstones = Record<SyncEntityKind, Record<string, number>>;

export interface LocalSyncData {
  readonly notes: readonly Note[];
  readonly highlights: readonly Highlight[];
  readonly bookmarks: readonly Bookmark[];
  readonly memorizedVerses: readonly MemorizedVerse[];
}

export interface SyncSnapshot extends LocalSyncData {
  readonly version: 1;
  readonly updatedAt: number;
  readonly tombstones: Tombstones;
}

type SyncEntity = Note | Highlight | Bookmark | MemorizedVerse;

const TOMBSTONE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180;

export function createEmptyTombstones(): Tombstones {
  return { notes: {}, highlights: {}, bookmarks: {}, memorized: {} };
}

/** Un borrado se conserva 180 días para que otros dispositivos lo reciban. */
export function pruneTombstones(tombstones: Tombstones, now = Date.now()): Tombstones {
  const result = createEmptyTombstones();
  for (const kind of SYNC_KINDS) {
    for (const [id, at] of Object.entries(tombstones[kind])) {
      if (now - at <= TOMBSTONE_MAX_AGE_MS) result[kind][id] = at;
    }
  }
  return result;
}

export function mergeTombstones(local: Tombstones, remote: Tombstones): Tombstones {
  const result = createEmptyTombstones();
  for (const kind of SYNC_KINDS) {
    const ids = new Set([...Object.keys(local[kind]), ...Object.keys(remote[kind])]);
    for (const id of ids) {
      const at = Math.max(local[kind][id] ?? 0, remote[kind][id] ?? 0);
      if (at > 0) result[kind][id] = at;
    }
  }
  return result;
}

/** Las notas usan `updatedAt`; el resto de entidades solo tiene `createdAt`. */
export function entityTimestamp(entity: SyncEntity): number {
  return 'updatedAt' in entity ? Math.max(entity.updatedAt, entity.createdAt) : entity.createdAt;
}

function mergeEntities<T extends SyncEntity>(
  local: readonly T[],
  remote: readonly T[],
  tombstones: Record<string, number>,
): T[] {
  const merged = new Map<string, T>();

  for (const entity of local) merged.set(entity.id, entity);
  for (const entity of remote) {
    const current = merged.get(entity.id);
    if (!current || entityTimestamp(entity) > entityTimestamp(current)) {
      merged.set(entity.id, entity);
    }
  }

  return [...merged.values()].filter((entity) => (tombstones[entity.id] ?? 0) < entityTimestamp(entity));
}

/**
 * Une dos copias sin perder datos:
 * 1. Cada entidad se queda con la versión más reciente.
 * 2. Un borrado solo elimina entidades anteriores a él.
 * 3. Los borrados se combinan para propagarse entre dispositivos.
 */
export function mergeSnapshots(
  local: SyncSnapshot,
  remote: SyncSnapshot,
  now = Date.now(),
): SyncSnapshot {
  const tombstones = mergeTombstones(local.tombstones, remote.tombstones);

  return {
    version: 1,
    updatedAt: now,
    notes: mergeEntities(local.notes, remote.notes, tombstones.notes),
    highlights: mergeEntities(local.highlights, remote.highlights, tombstones.highlights),
    bookmarks: mergeEntities(local.bookmarks, remote.bookmarks, tombstones.bookmarks),
    memorizedVerses: mergeEntities(
      local.memorizedVerses,
      remote.memorizedVerses,
      tombstones.memorized,
    ),
    tombstones,
  };
}

export function buildSnapshot(
  data: LocalSyncData,
  tombstones: Tombstones,
  updatedAt = Date.now(),
): SyncSnapshot {
  return {
    version: 1,
    updatedAt,
    notes: data.notes,
    highlights: data.highlights,
    bookmarks: data.bookmarks,
    memorizedVerses: data.memorizedVerses,
    tombstones: pruneTombstones(tombstones, updatedAt),
  };
}

export function createEmptySnapshot(now = Date.now()): SyncSnapshot {
  return buildSnapshot(
    { notes: [], highlights: [], bookmarks: [], memorizedVerses: [] },
    createEmptyTombstones(),
    now,
  );
}

/* ----------------------------- Validación ------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isTranslationId(value: unknown): value is TranslationId {
  return typeof value === 'string' && (TRANSLATION_IDS as readonly string[]).includes(value);
}

function isHighlightColor(value: unknown): value is HighlightColor {
  return typeof value === 'string' && (HIGHLIGHT_COLORS as readonly string[]).includes(value);
}

function isReference(value: unknown): value is VerseReference {
  if (!isRecord(value)) return false;
  return (
    isFiniteNumber(value.bookNumber) &&
    isFiniteNumber(value.chapter) &&
    isFiniteNumber(value.verse)
  );
}

function isTags(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((tag) => typeof tag === 'string');
}

function parseNote(value: unknown): Note | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    !isReference(value.reference) ||
    !isTranslationId(value.translationId) ||
    typeof value.body !== 'string' ||
    !isTags(value.tags) ||
    !isFiniteNumber(value.createdAt) ||
    !isFiniteNumber(value.updatedAt)
  ) {
    return null;
  }
  return {
    id: value.id,
    reference: value.reference,
    translationId: value.translationId,
    body: value.body,
    tags: value.tags,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function parseHighlight(value: unknown): Highlight | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    !isReference(value.reference) ||
    !isTranslationId(value.translationId) ||
    !isHighlightColor(value.color) ||
    !isFiniteNumber(value.createdAt)
  ) {
    return null;
  }
  return {
    id: value.id,
    reference: value.reference,
    translationId: value.translationId,
    color: value.color,
    createdAt: value.createdAt,
  };
}

function parseBookmark(value: unknown): Bookmark | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    !isReference(value.reference) ||
    !isTranslationId(value.translationId) ||
    !isFiniteNumber(value.createdAt)
  ) {
    return null;
  }
  return {
    id: value.id,
    reference: value.reference,
    translationId: value.translationId,
    createdAt: value.createdAt,
  };
}

function parseMemorized(value: unknown): MemorizedVerse | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== 'string' ||
    !isReference(value.reference) ||
    !isTranslationId(value.translationId) ||
    typeof value.text !== 'string' ||
    !isFiniteNumber(value.createdAt)
  ) {
    return null;
  }
  return {
    id: value.id,
    reference: value.reference,
    translationId: value.translationId,
    text: value.text,
    createdAt: value.createdAt,
  };
}

function parseList<T>(value: unknown, parser: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  const result: T[] = [];
  for (const item of value) {
    const parsed = parser(item);
    if (parsed) result.push(parsed);
  }
  return result;
}

function parseTombstones(value: unknown): Tombstones {
  const result = createEmptyTombstones();
  if (!isRecord(value)) return result;

  for (const kind of SYNC_KINDS) {
    const raw = value[kind];
    if (!isRecord(raw)) continue;
    for (const [id, at] of Object.entries(raw)) {
      if (isFiniteNumber(at)) result[kind][id] = at;
    }
  }
  return result;
}

/**
 * El archivo remoto puede venir de otra versión o estar corrupto.
 * Se valida y se descartan solo las entidades inválidas, nunca todo el archivo.
 */
export function parseSnapshot(value: unknown): SyncSnapshot | null {
  if (!isRecord(value)) return null;
  if (value.version !== 1) return null;
  if (!isFiniteNumber(value.updatedAt)) return null;

  return {
    version: 1,
    updatedAt: value.updatedAt,
    notes: parseList(value.notes, parseNote),
    highlights: parseList(value.highlights, parseHighlight),
    bookmarks: parseList(value.bookmarks, parseBookmark),
    memorizedVerses: parseList(value.memorizedVerses, parseMemorized),
    tombstones: parseTombstones(value.tombstones),
  };
}

export function parseSnapshotJson(raw: string): SyncSnapshot | null {
  try {
    return parseSnapshot(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}
