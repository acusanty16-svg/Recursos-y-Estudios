/**
 * Estado local de sincronización que no vive en React:
 * borrados pendientes y aviso de cambios para subir a Drive.
 */

import { STORAGE_KEYS } from '../model/constants';
import { createEmptyTombstones, SYNC_KINDS } from '../model/sync';
import type { SyncEntityKind, Tombstones } from '../model/sync';

let cachedTombstones: Tombstones | null = null;
let localChangeHandler: (() => void) | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readTombstones(): Tombstones {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.syncTombstones);
    if (!raw) return createEmptyTombstones();

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return createEmptyTombstones();

    const tombstones = createEmptyTombstones();
    for (const kind of SYNC_KINDS) {
      const entries = parsed[kind];
      if (!isRecord(entries)) continue;
      for (const [id, at] of Object.entries(entries)) {
        if (typeof at === 'number' && Number.isFinite(at)) tombstones[kind][id] = at;
      }
    }
    return tombstones;
  } catch {
    return createEmptyTombstones();
  }
}

export function loadTombstones(): Tombstones {
  if (!cachedTombstones) cachedTombstones = readTombstones();
  return cachedTombstones;
}

function persistTombstones(tombstones: Tombstones): void {
  try {
    localStorage.setItem(STORAGE_KEYS.syncTombstones, JSON.stringify(tombstones));
  } catch {
    // Sin almacenamiento local, la sincronización seguirá funcionando en memoria.
  }
}

/** Guarda un borrado para que no resucite al sincronizar con otro dispositivo. */
export function recordDeletion(kind: SyncEntityKind, id: string, at = Date.now()): void {
  const tombstones = loadTombstones();
  tombstones[kind][id] = at;
  cachedTombstones = tombstones;
  persistTombstones(tombstones);
  notifyLocalChange();
}

export function clearTombstones(): void {
  cachedTombstones = createEmptyTombstones();
  try {
    localStorage.removeItem(STORAGE_KEYS.syncTombstones);
  } catch {
    // Ignorado.
  }
}

/** Guarda los borrados fusionados después de una sincronización. */
export function saveTombstones(tombstones: Tombstones): void {
  cachedTombstones = tombstones;
  persistTombstones(tombstones);
}

export function setLocalChangeHandler(handler: (() => void) | null): void {
  localChangeHandler = handler;
}

/** Lo llaman los controladores de notas para programar una subida. */
export function notifyLocalChange(): void {
  localChangeHandler?.();
}
