import { describe, expect, it } from 'vitest';
import {
  buildSnapshot,
  createEmptySnapshot,
  createEmptyTombstones,
  mergeSnapshots,
  mergeTombstones,
  parseSnapshot,
  parseSnapshotJson,
  pruneTombstones,
} from './sync';
import type { SyncSnapshot } from './sync';
import type { MemorizedVerse, Note } from './types';

const REFERENCE = { bookNumber: 43, chapter: 3, verse: 16 };

function note(id: string, body: string, updatedAt: number): Note {
  return {
    id,
    reference: REFERENCE,
    translationId: 'RV1960',
    body,
    tags: [],
    createdAt: updatedAt - 1000,
    updatedAt,
  };
}

function memorized(id: string, createdAt: number): MemorizedVerse {
  return {
    id,
    reference: REFERENCE,
    translationId: 'RV1960',
    text: 'Porque de tal manera amó Dios al mundo…',
    createdAt,
  };
}

function snapshot(patch: Partial<SyncSnapshot> = {}): SyncSnapshot {
  return { ...createEmptySnapshot(1000), ...patch };
}

describe('mergeSnapshots', () => {
  it('no pierde las notas locales cuando Drive todavía no tiene nada', () => {
    const local = snapshot({ notes: [note('a', 'Nota local', 2000)] });
    const merged = mergeSnapshots(local, createEmptySnapshot(0));

    expect(merged.notes).toHaveLength(1);
    expect(merged.notes[0]?.body).toBe('Nota local');
  });

  it('une notas de dos dispositivos sin sobrescribirlas', () => {
    const local = snapshot({ notes: [note('a', 'Desde el móvil', 2000)] });
    const remote = snapshot({ notes: [note('b', 'Desde el ordenador', 3000)] });
    const merged = mergeSnapshots(local, remote);

    expect(merged.notes.map((item) => item.id).sort()).toEqual(['a', 'b']);
  });

  it('se queda con la edición más reciente de una misma nota', () => {
    const local = snapshot({ notes: [note('a', 'Versión antigua', 2000)] });
    const remote = snapshot({ notes: [note('a', 'Versión nueva', 5000)] });
    const merged = mergeSnapshots(local, remote);

    expect(merged.notes).toHaveLength(1);
    expect(merged.notes[0]?.body).toBe('Versión nueva');
  });

  it('propaga un borrado hecho en otro dispositivo', () => {
    const local = snapshot({ notes: [note('a', 'Nota que debe desaparecer', 2000)] });
    const tombstones = createEmptyTombstones();
    tombstones.notes.a = 3000;
    const remote = snapshot({ tombstones });

    const merged = mergeSnapshots(local, remote);
    expect(merged.notes).toHaveLength(0);
  });

  it('no borra una nota recreada después del borrado', () => {
    const local = snapshot({ notes: [note('a', 'Nota nueva', 5000)] });
    const tombstones = createEmptyTombstones();
    tombstones.notes.a = 3000;
    const remote = snapshot({ tombstones });

    const merged = mergeSnapshots(local, remote);
    expect(merged.notes).toHaveLength(1);
  });

  it('también fusiona versículos para memorizar', () => {
    const local = snapshot({ memorizedVerses: [memorized('m1', 2000)] });
    const remote = snapshot({ memorizedVerses: [memorized('m2', 3000)] });
    const merged = mergeSnapshots(local, remote);

    expect(merged.memorizedVerses).toHaveLength(2);
  });
});

describe('mergeTombstones', () => {
  it('conserva el borrado más reciente de cada entidad', () => {
    const a = createEmptyTombstones();
    a.notes.x = 1000;
    const b = createEmptyTombstones();
    b.notes.x = 2000;
    b.notes.y = 1500;

    const merged = mergeTombstones(a, b);
    expect(merged.notes.x).toBe(2000);
    expect(merged.notes.y).toBe(1500);
  });

  it('descarta borrados de más de 180 días', () => {
    const tombstones = createEmptyTombstones();
    const now = Date.UTC(2026, 10, 5);
    tombstones.notes.old = now - 1000 * 60 * 60 * 24 * 181;
    tombstones.notes.recent = now - 1000 * 60 * 60 * 24 * 10;

    const pruned = pruneTombstones(tombstones, now);
    expect(pruned.notes.old).toBeUndefined();
    expect(pruned.notes.recent).toBe(now - 1000 * 60 * 60 * 24 * 10);
  });
});

describe('parseSnapshot', () => {
  it('hace ida y vuelta con buildSnapshot', () => {
    const original = buildSnapshot(
      {
        notes: [note('a', 'Hola', 2000)],
        highlights: [],
        bookmarks: [],
        memorizedVerses: [],
      },
      createEmptyTombstones(),
      3000,
    );

    const parsed = parseSnapshotJson(JSON.stringify(original));
    expect(parsed?.notes[0]?.body).toBe('Hola');
    expect(parsed?.updatedAt).toBe(3000);
  });

  it('rechaza versiones desconocidas', () => {
    expect(parseSnapshot({ version: 2, updatedAt: 1 })).toBeNull();
  });

  it('descarta solo las entidades inválidas, no todo el archivo', () => {
    const parsed = parseSnapshot({
      version: 1,
      updatedAt: 1000,
      notes: [
        note('good', 'Válida', 2000),
        { id: 'bad', body: 42 },
      ],
      highlights: [],
      bookmarks: [],
      memorizedVerses: [],
      tombstones: createEmptyTombstones(),
    });

    expect(parsed?.notes).toHaveLength(1);
    expect(parsed?.notes[0]?.id).toBe('good');
  });
});
