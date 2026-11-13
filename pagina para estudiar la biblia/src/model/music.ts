/**
 * Modelo puro de teoría musical, diapasón de guitarra, acordes y cancionero.
 * Regla arquitectónica: sin React, DOM ni APIs del navegador.
 */

export const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const CHROMATIC_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;
export const CHROMATIC_LATIN_SHARP = [
  'Do',
  'Do#',
  'Re',
  'Re#',
  'Mi',
  'Fa',
  'Fa#',
  'Sol',
  'Sol#',
  'La',
  'La#',
  'Si',
] as const;

export type PitchIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type NoteNaming = 'american' | 'latin' | 'both';

export interface FretNote {
  readonly stringNumber: 1 | 2 | 3 | 4 | 5 | 6;
  readonly fret: number;
  readonly midi: number;
  readonly pitchIndex: PitchIndex;
  readonly american: string;
  readonly latin: string;
  readonly octave: number;
  readonly frequency: number;
  readonly isNatural: boolean;
}

/** Afinación estándar de guitarra: 1ª cuerda (aguda E4) hasta 6ª cuerda (grave E2). */
export const STANDARD_TUNING_MIDI: readonly [number, number, number, number, number, number] = [
  64, // 1: E4
  59, // 2: B3
  55, // 3: G3
  50, // 4: D3
  45, // 5: A2
  40, // 6: E2
];

export const NATURAL_PITCHES = new Set<number>([0, 2, 4, 5, 7, 9, 11]);
export const FLAT_KEY_ROOTS = new Set<string>(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm']);

const NOTE_NAME_TO_PITCH: Record<string, PitchIndex> = {
  C: 0,
  'B#': 0,
  DO: 0,
  'C#': 1,
  DB: 1,
  'DO#': 1,
  REB: 1,
  D: 2,
  RE: 2,
  'D#': 3,
  EB: 3,
  'RE#': 3,
  MIB: 3,
  E: 4,
  FB: 4,
  MI: 4,
  F: 5,
  'E#': 5,
  FA: 5,
  'F#': 6,
  GB: 6,
  'FA#': 6,
  SOLB: 6,
  G: 7,
  SOL: 7,
  'G#': 8,
  AB: 8,
  'SOL#': 8,
  LAB: 8,
  A: 9,
  LA: 9,
  'A#': 10,
  BB: 10,
  'LA#': 10,
  SIB: 10,
  B: 11,
  CB: 11,
  SI: 11,
};

export function toPitchIndex(value: number): PitchIndex {
  return (((value % 12) + 12) % 12) as PitchIndex;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function parsePitchIndex(noteName: string): PitchIndex | null {
  const key = noteName.trim().toUpperCase();
  return NOTE_NAME_TO_PITCH[key] ?? null;
}

export function formatPitchName(pitchIndex: PitchIndex, naming: NoteNaming, preferFlats = false): string {
  const american = preferFlats ? CHROMATIC_FLAT[pitchIndex] : CHROMATIC_SHARP[pitchIndex];
  const latin = CHROMATIC_LATIN_SHARP[pitchIndex];
  if (naming === 'american') return american;
  if (naming === 'latin') return latin;
  return `${american} · ${latin}`;
}

export function getFretNote(stringNumber: 1 | 2 | 3 | 4 | 5 | 6, fret: number): FretNote {
  const openMidi = STANDARD_TUNING_MIDI[stringNumber - 1] ?? 40;
  const midi = openMidi + fret;
  const pitchIndex = toPitchIndex(midi);
  const octave = Math.floor(midi / 12) - 1;
  return {
    stringNumber,
    fret,
    midi,
    pitchIndex,
    american: CHROMATIC_SHARP[pitchIndex],
    latin: CHROMATIC_LATIN_SHARP[pitchIndex],
    octave,
    frequency: midiToFrequency(midi),
    isNatural: NATURAL_PITCHES.has(pitchIndex),
  };
}

/* ------------------------------- Escalas -------------------------------- */

export type ScaleId =
  | 'all'
  | 'major'
  | 'minor'
  | 'major-pentatonic'
  | 'minor-pentatonic'
  | 'dorian'
  | 'mixolydian';

export interface ScaleDefinition {
  readonly id: ScaleId;
  readonly nameEs: string;
  readonly nameEn: string;
  readonly intervals: readonly number[];
}

export const SCALES: readonly ScaleDefinition[] = [
  { id: 'all', nameEs: 'Todas las notas', nameEn: 'All notes', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { id: 'major', nameEs: 'Escala Mayor', nameEn: 'Major Scale', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'minor', nameEs: 'Menor Natural', nameEn: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'major-pentatonic', nameEs: 'Pentatónica Mayor', nameEn: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9] },
  { id: 'minor-pentatonic', nameEs: 'Pentatónica Menor', nameEn: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10] },
  { id: 'dorian', nameEs: 'Modo Dórico', nameEn: 'Dorian Mode', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'mixolydian', nameEs: 'Modo Mixolidio', nameEn: 'Mixolydian Mode', intervals: [0, 2, 4, 5, 7, 9, 10] },
];

export function getScalePitches(rootPitch: PitchIndex, scaleId: ScaleId): readonly PitchIndex[] {
  const def = SCALES.find((item) => item.id === scaleId) ?? SCALES[0]!;
  return def.intervals.map((interval) => toPitchIndex(rootPitch + interval));
}

export type ScaleDegreeRole = 'root' | 'chord-tone' | 'scale-tone' | 'none';

export function getScaleRole(pitchIndex: PitchIndex, rootPitch: PitchIndex, scaleId: ScaleId): ScaleDegreeRole {
  if (scaleId === 'all') return pitchIndex === rootPitch ? 'root' : 'scale-tone';
  const def = SCALES.find((item) => item.id === scaleId);
  if (!def) return 'none';
  const interval = toPitchIndex(pitchIndex - rootPitch);
  if (!def.intervals.includes(interval)) return 'none';
  if (interval === 0) return 'root';
  if (interval === 3 || interval === 4 || interval === 7) return 'chord-tone';
  return 'scale-tone';
}

/* ------------------------- Círculo Armónico / Iglesia ------------------- */

export interface DiatonicChord {
  readonly degree: string;
  readonly symbol: string;
  readonly roleEs: string;
  readonly roleEn: string;
  readonly worshipVariants: readonly string[];
}

export function getDiatonicChordsForKey(rootName: string, mode: 'major' | 'minor' = 'major'): readonly DiatonicChord[] {
  const rootPitch = parsePitchIndex(rootName) ?? 0;
  const preferFlats = FLAT_KEY_ROOTS.has(rootName);
  const note = (offset: number): string => {
    const p = toPitchIndex(rootPitch + offset);
    return preferFlats ? CHROMATIC_FLAT[p] : CHROMATIC_SHARP[p];
  };

  if (mode === 'minor') {
    const i = `${note(0)}m`;
    const ii = `${note(2)}dim`;
    const III = note(3);
    const iv = `${note(5)}m`;
    const v = `${note(7)}m`;
    const V = note(7);
    const VI = note(8);
    const VII = note(10);
    return [
      { degree: 'i', symbol: i, roleEs: 'Tónica', roleEn: 'Tonic', worshipVariants: [`${i}7`, `${i}9`] },
      { degree: 'ii°', symbol: ii, roleEs: 'Supertónica', roleEn: 'Supertonic', worshipVariants: [`${note(2)}m7b5`] },
      { degree: 'III', symbol: III, roleEs: 'Relativo Mayor', roleEn: 'Relative Major', worshipVariants: [`${III}maj7`, `${III}add9`] },
      { degree: 'iv', symbol: iv, roleEs: 'Subdominante', roleEn: 'Subdominant', worshipVariants: [`${iv}7`] },
      { degree: 'v / V', symbol: v, roleEs: 'Dominante', roleEn: 'Dominant', worshipVariants: [V, `${V}7`] },
      { degree: 'VI', symbol: VI, roleEs: 'Submediante', roleEn: 'Submediant', worshipVariants: [`${VI}maj7`, `${VI}add9`] },
      { degree: 'VII', symbol: VII, roleEs: 'Subtónica', roleEn: 'Subtonic', worshipVariants: [`${VII}sus4`, `${VII}/${note(2)}`] },
    ];
  }

  const I = note(0);
  const ii = `${note(2)}m`;
  const iii = `${note(4)}m`;
  const IV = note(5);
  const V = note(7);
  const vi = `${note(9)}m`;

  return [
    { degree: 'I', symbol: I, roleEs: 'Tónica (Reposo)', roleEn: 'Tonic (Home)', worshipVariants: [`${I}sus2`, `${I}add9`, `${I}maj7`] },
    { degree: 'ii', symbol: ii, roleEs: 'Supertónica', roleEn: 'Supertonic', worshipVariants: [`${ii}7`] },
    { degree: 'iii', symbol: iii, roleEs: 'Mediante', roleEn: 'Mediant', worshipVariants: [`${I}/${note(4)}`, `${iii}7`] },
    { degree: 'IV', symbol: IV, roleEs: 'Subdominante', roleEn: 'Subdominant', worshipVariants: [`${IV}maj7`, `${IV}add9`, `${IV}2`] },
    { degree: 'V', symbol: V, roleEs: 'Dominante (Tensión)', roleEn: 'Dominant (Tension)', worshipVariants: [`${V}sus4`, `${V}/${note(11)}`, `${V}7`] },
    { degree: 'vi', symbol: vi, roleEs: 'Relativo Menor', roleEn: 'Relative Minor', worshipVariants: [`${vi}7`, `${vi}11`] },
  ];
}

/* ----------------------------- Diagramas de Acordes --------------------- */

export interface ChordVoicing {
  readonly id: string;
  readonly label: string;
  readonly baseFret: number;
  /** 6 cuerdas desde la 6ª (grave E) hasta la 1ª (aguda E). -1 = muteada (X), 0 = al aire (O). */
  readonly frets: readonly [number, number, number, number, number, number];
  /** Dedo sugerido por cuerda (0 = ninguno/aire). */
  readonly fingers: readonly [number, number, number, number, number, number];
  readonly barre?: { readonly fret: number; readonly fromString: 1 | 2 | 3 | 4 | 5 | 6; readonly toString: 1 | 2 | 3 | 4 | 5 | 6 };
}

const OPEN_CHORD_SHAPES: Record<string, readonly ChordVoicing[]> = {
  C: [
    { id: 'c-open', label: 'Abierto', baseFret: 1, frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
    { id: 'c-barre-3', label: 'Cejilla Traste 3 (A)', baseFret: 3, frets: [-1, 3, 5, 5, 5, 3], fingers: [0, 1, 2, 3, 4, 1], barre: { fret: 3, fromString: 1, toString: 5 } },
  ],
  Cmaj7: [{ id: 'cmaj7-open', label: 'Abierto', baseFret: 1, frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0] }],
  Cadd9: [{ id: 'cadd9-open', label: 'Worship', baseFret: 1, frets: [-1, 3, 2, 0, 3, 3], fingers: [0, 2, 1, 0, 3, 4] }],
  'C/E': [{ id: 'c-e-open', label: 'Bajo en Mi', baseFret: 1, frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] }],
  'C/G': [{ id: 'c-g-open', label: 'Bajo en Sol', baseFret: 1, frets: [3, 3, 2, 0, 1, 0], fingers: [3, 4, 2, 0, 1, 0] }],
  Cm: [{ id: 'cm-barre', label: 'Cejilla Traste 3', baseFret: 3, frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], barre: { fret: 3, fromString: 1, toString: 5 } }],
  Cm7: [{ id: 'cm7-barre', label: 'Cejilla Traste 3', baseFret: 3, frets: [-1, 3, 5, 3, 4, 3], fingers: [0, 1, 3, 1, 2, 1], barre: { fret: 3, fromString: 1, toString: 5 } }],

  D: [
    { id: 'd-open', label: 'Abierto', baseFret: 1, frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    { id: 'd-barre-5', label: 'Cejilla Traste 5 (A)', baseFret: 5, frets: [-1, 5, 7, 7, 7, 5], fingers: [0, 1, 2, 3, 4, 1], barre: { fret: 5, fromString: 1, toString: 5 } },
  ],
  Dsus4: [{ id: 'dsus4-open', label: 'Abierto', baseFret: 1, frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 3, 4] }],
  Dsus2: [{ id: 'dsus2-open', label: 'Abierto', baseFret: 1, frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 3, 0] }],
  D7: [{ id: 'd7-open', label: 'Abierto', baseFret: 1, frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] }],
  Dmaj7: [{ id: 'dmaj7-open', label: 'Abierto', baseFret: 1, frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 2, 3] }],
  'D/F#': [{ id: 'd-fs-open', label: 'Bajo en Fa#', baseFret: 1, frets: [2, 0, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3] }],
  Dm: [{ id: 'dm-open', label: 'Abierto', baseFret: 1, frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] }],
  Dm7: [{ id: 'dm7-open', label: 'Abierto', baseFret: 1, frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], barre: { fret: 1, fromString: 1, toString: 2 } }],

  E: [
    { id: 'e-open', label: 'Abierto', baseFret: 1, frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    { id: 'e-barre-7', label: 'Cejilla Traste 7 (A)', baseFret: 7, frets: [-1, 7, 9, 9, 9, 7], fingers: [0, 1, 2, 3, 4, 1], barre: { fret: 7, fromString: 1, toString: 5 } },
  ],
  E7: [{ id: 'e7-open', label: 'Abierto', baseFret: 1, frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] }],
  Esus4: [{ id: 'esus4-open', label: 'Abierto', baseFret: 1, frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0] }],
  'E/G#': [{ id: 'e-gs', label: 'Bajo en Sol#', baseFret: 1, frets: [4, 2, 2, 1, 0, 0], fingers: [4, 2, 3, 1, 0, 0] }],
  Em: [{ id: 'em-open', label: 'Abierto', baseFret: 1, frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] }],
  Em7: [
    { id: 'em7-open', label: 'Worship', baseFret: 1, frets: [0, 2, 2, 0, 3, 3], fingers: [0, 1, 2, 0, 3, 4] },
    { id: 'em7-simple', label: 'Clásico', baseFret: 1, frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0] },
  ],

  F: [
    { id: 'f-barre', label: 'Cejilla Traste 1', baseFret: 1, frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barre: { fret: 1, fromString: 1, toString: 6 } },
    { id: 'f-easy', label: 'Fácil (4 cuerdas)', baseFret: 1, frets: [-1, -1, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1] },
  ],
  Fmaj7: [{ id: 'fmaj7-open', label: 'Abierto', baseFret: 1, frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0] }],
  Fm: [{ id: 'fm-barre', label: 'Cejilla Traste 1', baseFret: 1, frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barre: { fret: 1, fromString: 1, toString: 6 } }],

  G: [
    { id: 'g-open', label: 'Clásico', baseFret: 1, frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
    { id: 'g-worship', label: 'Worship (4 dedos)', baseFret: 1, frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4] },
    { id: 'g-barre-3', label: 'Cejilla Traste 3 (E)', baseFret: 3, frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], barre: { fret: 3, fromString: 1, toString: 6 } },
  ],
  Gsus4: [{ id: 'gsus4-open', label: 'Abierto', baseFret: 1, frets: [3, 2, 0, 0, 1, 3], fingers: [3, 2, 0, 0, 1, 4] }],
  G7: [{ id: 'g7-open', label: 'Abierto', baseFret: 1, frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] }],
  'G/B': [{ id: 'g-b-open', label: 'Bajo en Si', baseFret: 1, frets: [-1, 2, 0, 0, 3, 3], fingers: [0, 1, 0, 0, 3, 4] }],
  'G/F#': [{ id: 'g-fs-open', label: 'Bajo en Fa#', baseFret: 1, frets: [2, 2, 0, 0, 3, 3], fingers: [1, 2, 0, 0, 3, 4] }],
  Gm: [{ id: 'gm-barre', label: 'Cejilla Traste 3', baseFret: 3, frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barre: { fret: 3, fromString: 1, toString: 6 } }],

  A: [
    { id: 'a-open', label: 'Abierto', baseFret: 1, frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
    { id: 'a-barre-5', label: 'Cejilla Traste 5 (E)', baseFret: 5, frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], barre: { fret: 5, fromString: 1, toString: 6 } },
  ],
  Asus2: [{ id: 'asus2-open', label: 'Abierto', baseFret: 1, frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] }],
  Asus4: [{ id: 'asus4-open', label: 'Abierto', baseFret: 1, frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0] }],
  A7sus4: [{ id: 'a7sus4-open', label: 'Abierto', baseFret: 1, frets: [-1, 0, 2, 0, 3, 0], fingers: [0, 0, 2, 0, 3, 0] }],
  A7: [{ id: 'a7-open', label: 'Abierto', baseFret: 1, frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0] }],
  Amaj7: [{ id: 'amaj7-open', label: 'Abierto', baseFret: 1, frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0] }],
  'A/C#': [{ id: 'a-cs-open', label: 'Bajo en Do#', baseFret: 1, frets: [-1, 4, 2, 2, 2, 0], fingers: [0, 4, 1, 1, 1, 0] }],
  Am: [{ id: 'am-open', label: 'Abierto', baseFret: 1, frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] }],
  Am7: [{ id: 'am7-open', label: 'Abierto', baseFret: 1, frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] }],

  B: [{ id: 'b-barre', label: 'Cejilla Traste 2', baseFret: 2, frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barre: { fret: 2, fromString: 1, toString: 5 } }],
  B7: [{ id: 'b7-open', label: 'Abierto', baseFret: 1, frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4] }],
  Bm: [{ id: 'bm-barre', label: 'Cejilla Traste 2', baseFret: 2, frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], barre: { fret: 2, fromString: 1, toString: 5 } }],
  Bm7: [
    { id: 'bm7-barre', label: 'Cejilla Traste 2', baseFret: 2, frets: [-1, 2, 4, 2, 3, 2], fingers: [0, 1, 3, 1, 2, 1], barre: { fret: 2, fromString: 1, toString: 5 } },
    { id: 'bm7-easy', label: 'Abierto (Bm11)', baseFret: 1, frets: [-1, 2, 0, 2, 3, 0], fingers: [0, 1, 0, 2, 3, 0] },
  ],
};

function buildMovableChordVoicing(chordSymbol: string): readonly ChordVoicing[] {
  const normalized = normalizeChordSymbol(chordSymbol);
  const match = /^([A-G][#b]?)(.*)$/.exec(normalized.split('/')[0] ?? '');
  if (!match) return [];
  const [, rawRoot, rawQuality = ''] = match;
  if (!rawRoot) return [];
  const rootPitch = parsePitchIndex(rawRoot);
  if (rootPitch === null) return [];

  const quality = rawQuality.toLowerCase();
  const isMinor = quality.startsWith('m') && !quality.startsWith('maj');
  const isSeventh = quality.includes('7') && !quality.includes('maj7');
  const isMaj7 = quality.includes('maj7');

  // Forma E (tónica en 6ª cuerda: E=4 -> traste = (pitch - 4 + 12) % 12)
  const eFret = ((rootPitch - 4 + 12) % 12) || 12;
  const eShape: ChordVoicing = isMinor
    ? {
        id: `${normalized}-e-barre`,
        label: `Cejilla Traste ${eFret} (E)`,
        baseFret: eFret,
        frets: isSeventh
          ? [eFret, eFret + 2, eFret, eFret, eFret, eFret]
          : [eFret, eFret + 2, eFret + 2, eFret, eFret, eFret],
        fingers: isSeventh ? [1, 3, 1, 1, 1, 1] : [1, 3, 4, 1, 1, 1],
        barre: { fret: eFret, fromString: 1, toString: 6 },
      }
    : {
        id: `${normalized}-e-barre`,
        label: `Cejilla Traste ${eFret} (E)`,
        baseFret: eFret,
        frets: isSeventh
          ? [eFret, eFret + 2, eFret, eFret + 1, eFret, eFret]
          : [eFret, eFret + 2, eFret + 2, eFret + 1, eFret, eFret],
        fingers: isSeventh ? [1, 3, 1, 2, 1, 1] : [1, 3, 4, 2, 1, 1],
        barre: { fret: eFret, fromString: 1, toString: 6 },
      };

  // Forma A (tónica en 5ª cuerda: A=9)
  const aFret = ((rootPitch - 9 + 12) % 12) || 12;
  const aShape: ChordVoicing = isMinor
    ? {
        id: `${normalized}-a-barre`,
        label: `Cejilla Traste ${aFret} (A)`,
        baseFret: aFret,
        frets: isSeventh
          ? [-1, aFret, aFret + 2, aFret, aFret + 1, aFret]
          : [-1, aFret, aFret + 2, aFret + 2, aFret + 1, aFret],
        fingers: isSeventh ? [0, 1, 3, 1, 2, 1] : [0, 1, 3, 4, 2, 1],
        barre: { fret: aFret, fromString: 1, toString: 5 },
      }
    : {
        id: `${normalized}-a-barre`,
        label: `Cejilla Traste ${aFret} (A)`,
        baseFret: aFret,
        frets: isMaj7
          ? [-1, aFret, aFret + 2, aFret + 1, aFret + 2, aFret]
          : isSeventh
            ? [-1, aFret, aFret + 2, aFret, aFret + 2, aFret]
            : [-1, aFret, aFret + 2, aFret + 2, aFret + 2, aFret],
        fingers: isMaj7 ? [0, 1, 3, 2, 4, 1] : isSeventh ? [0, 1, 3, 1, 4, 1] : [0, 1, 2, 3, 4, 1],
        barre: { fret: aFret, fromString: 1, toString: 5 },
      };

  return eFret <= aFret ? [eShape, aShape] : [aShape, eShape];
}

export function getChordVoicings(chordSymbol: string): readonly ChordVoicing[] {
  const normalized = normalizeChordSymbol(chordSymbol);
  const direct = OPEN_CHORD_SHAPES[normalized];
  if (direct) return direct;

  // Intenta quitar sufijos extendidos (ej. add9 -> base) si no existe directo, o usa cejilla móvil.
  const withoutBass = normalized.split('/')[0] ?? normalized;
  const fallbackDirect = OPEN_CHORD_SHAPES[withoutBass];
  if (fallbackDirect) return fallbackDirect;

  return buildMovableChordVoicing(normalized);
}

export function getVoicingMidiNotes(voicing: ChordVoicing): readonly number[] {
  const notes: number[] = [];
  // Iterar de 6ª cuerda (índice 0 en voicing.frets) a 1ª cuerda (índice 5) para rasgueo natural grave -> agudo.
  for (let i = 0; i < 6; i += 1) {
    const fret = voicing.frets[i] ?? -1;
    if (fret < 0) continue;
    const stringNumber = (6 - i) as 1 | 2 | 3 | 4 | 5 | 6;
    const openMidi = STANDARD_TUNING_MIDI[stringNumber - 1] ?? 40;
    notes.push(openMidi + fret);
  }
  return notes;
}

/* --------------------- Transposición y Normalización -------------------- */

const LATIN_ROOT_MAP: Record<string, string> = {
  DO: 'C',
  RE: 'D',
  MI: 'E',
  FA: 'F',
  SOL: 'G',
  LA: 'A',
  SI: 'B',
};

export function normalizeChordSymbol(raw: string): string {
  const trimmed = raw.trim();
  const slashParts = trimmed.split('/');
  const converted = slashParts.map((part, idx) => {
    const latinMatch = /^(Do|Re|Mi|Fa|Sol|La|Si)([#b]?)(.*)$/i.exec(part.trim());
    if (latinMatch) {
      const [, root = '', accidental = '', rest = ''] = latinMatch;
      const americanRoot = LATIN_ROOT_MAP[root.toUpperCase()] ?? root;
      return `${americanRoot}${accidental}${idx === 0 ? rest : ''}`;
    }
    return part.trim();
  });
  return converted.join('/');
}

function transposeRootToken(token: string, semitones: number, preferFlats: boolean): string {
  const match = /^([A-G][#b]?)(.*)$/.exec(token);
  if (!match) return token;
  const [, rawRoot = '', suffix = ''] = match;
  const pitch = parsePitchIndex(rawRoot);
  if (pitch === null) return token;
  const nextPitch = toPitchIndex(pitch + semitones);
  const nextRoot = preferFlats ? CHROMATIC_FLAT[nextPitch] : CHROMATIC_SHARP[nextPitch];
  return `${nextRoot}${suffix}`;
}

export function transposeChord(chordSymbol: string, semitones: number, preferFlats = false): string {
  const normalized = normalizeChordSymbol(chordSymbol);
  if (semitones === 0) return normalized;
  const parts = normalized.split('/');
  return parts
    .map((part, index) => (index === 0 ? transposeRootToken(part, semitones, preferFlats) : transposeRootToken(part, semitones, preferFlats)))
    .join('/');
}

export function transposeKeyName(keyName: string, semitones: number): string {
  const normalized = normalizeChordSymbol(keyName);
  const preferFlats = FLAT_KEY_ROOTS.has(transposeRootToken(normalized, semitones, true));
  return transposeRootToken(normalized, semitones, preferFlats);
}

export interface CapoSuggestion {
  readonly capoFret: number;
  readonly shapeKey: string;
  readonly easeLabelEs: string;
  readonly easeLabelEn: string;
}

const EASY_GUITAR_KEYS = new Set(['C', 'G', 'D', 'A', 'E', 'Am', 'Em', 'Dm']);

export function suggestCapoOptions(soundingKey: string): readonly CapoSuggestion[] {
  const normalized = normalizeChordSymbol(soundingKey);
  const isMinor = normalized.endsWith('m') && !normalized.endsWith('maj7');
  const rootOnly = normalized.replace(/m.*$/, '');
  const rootPitch = parsePitchIndex(rootOnly);
  if (rootPitch === null) return [];

  const suggestions: CapoSuggestion[] = [];
  for (let capo = 1; capo <= 7; capo += 1) {
    const shapePitch = toPitchIndex(rootPitch - capo);
    const shapeRoot = CHROMATIC_SHARP[shapePitch];
    const shapeKey = `${shapeRoot}${isMinor ? 'm' : ''}`;
    if (EASY_GUITAR_KEYS.has(shapeKey)) {
      suggestions.push({
        capoFret: capo,
        shapeKey,
        easeLabelEs: `Capo ${capo} → toca como ${shapeKey}`,
        easeLabelEn: `Capo ${capo} → play ${shapeKey} shapes`,
      });
    }
  }
  return suggestions.slice(0, 3);
}

/* --------------- Parser Dual: LaCuerda.net + ChordPro ------------------- */

export interface SongSegment {
  readonly chord?: string;
  readonly text: string;
}

export type ParsedSongLine =
  | { readonly kind: 'empty' }
  | { readonly kind: 'section'; readonly label: string }
  | { readonly kind: 'lyric'; readonly segments: readonly SongSegment[] };

const CHORD_TOKEN_RE =
  /^(?:Do|Re|Mi|Fa|Sol|La|Si|[A-G])(?:#|b)?(?:m|maj|min|dim|aug|sus|add)?\d*(?:sus\d|add\d|\(\d+\)|b\d|#\d)*(?:\/(?:Do|Re|Mi|Fa|Sol|La|Si|[A-G])(?:#|b)?)?$/;

const SECTION_LABEL_RE =
  /^(?:\[?\s*(?:INTRO|ESTROFA|VERSO|PRE-?CORO|CORO|PUENTE|FINAL|OUTRO|SOLO|INTERLUDIO|VERSE|CHORUS|BRIDGE|PRE-CHORUS|TAG|INSTRUMENTAL)(?:\s*\d+)?\s*:?\]?|\{(?:soc|eoc|sov|eov|c|comment):?([^}]*)\})$/i;

export function isChordOnlyLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.includes('[') && trimmed.includes(']')) return false;
  const tokens = trimmed.split(/\s+/);
  let chordCount = 0;
  for (const token of tokens) {
    const clean = token.replace(/^[|(]+|[|),.:]+$/g, '');
    if (!clean) continue;
    if (!CHORD_TOKEN_RE.test(clean)) return false;
    chordCount += 1;
  }
  return chordCount > 0;
}

function parseInlineChordProLine(line: string, semitones: number, preferFlats: boolean): readonly SongSegment[] {
  const segments: SongSegment[] = [];
  const regex = /\[([^\]]+)\]([^[]*)/g;
  const firstBracket = line.indexOf('[');
  if (firstBracket === -1) {
    return [{ text: line }];
  }
  if (firstBracket > 0) {
    segments.push({ text: line.slice(0, firstBracket) });
  }
  let match: RegExpExecArray | null = regex.exec(line);
  while (match !== null) {
    const rawChord = match[1]?.trim() ?? '';
    const text = match[2] ?? '';
    const chord = transposeChord(rawChord, semitones, preferFlats);
    segments.push({ chord, text });
    match = regex.exec(line);
  }
  return segments;
}

function pairChordAndLyricLines(
  chordLine: string,
  lyricLine: string,
  semitones: number,
  preferFlats: boolean,
): readonly SongSegment[] {
  const chordMatches: { readonly chord: string; readonly index: number }[] = [];
  const tokenRe = /\S+/g;
  let match: RegExpExecArray | null = tokenRe.exec(chordLine);
  while (match !== null) {
    chordMatches.push({
      chord: transposeChord(match[0], semitones, preferFlats),
      index: match.index,
    });
    match = tokenRe.exec(chordLine);
  }

  if (chordMatches.length === 0) return [{ text: lyricLine }];
  if (!lyricLine.trim()) {
    return chordMatches.map((item) => ({ chord: item.chord, text: '   ' }));
  }

  const segments: SongSegment[] = [];
  const firstPos = chordMatches[0]?.index ?? 0;
  if (firstPos > 0) {
    segments.push({ text: lyricLine.slice(0, Math.min(firstPos, lyricLine.length)) });
  }

  for (let i = 0; i < chordMatches.length; i += 1) {
    const current = chordMatches[i]!;
    const next = chordMatches[i + 1];
    const start = Math.min(current.index, lyricLine.length);
    const end = next ? Math.min(next.index, lyricLine.length) : lyricLine.length;
    const textSlice = lyricLine.slice(start, end);
    segments.push({
      chord: current.chord,
      text: textSlice.length > 0 ? textSlice : '   ',
    });
  }

  return segments;
}

export function parseSongContent(content: string, semitones = 0, targetKey = 'C'): readonly ParsedSongLine[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const preferFlats = FLAT_KEY_ROOTS.has(targetKey);
  const parsed: ParsedSongLine[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    if (!trimmed) {
      parsed.push({ kind: 'empty' });
      continue;
    }

    const sectionMatch = SECTION_LABEL_RE.exec(trimmed);
    if (sectionMatch) {
      const lower = trimmed.toLowerCase();
      if (lower === '{eoc}' || lower === '{eov}') continue;
      const label =
        lower === '{soc}'
          ? 'CORO'
          : lower === '{sov}'
            ? 'ESTROFA'
            : (sectionMatch[1] || trimmed).replace(/[[\]{}:]/g, '').trim().toUpperCase();
      parsed.push({ kind: 'section', label });
      continue;
    }

    // Formato LaCuerda: línea de acordes seguida de línea de letra.
    if (isChordOnlyLine(line)) {
      const nextLine = lines[i + 1];
      if (nextLine !== undefined && nextLine.trim() !== '' && !isChordOnlyLine(nextLine) && !SECTION_LABEL_RE.test(nextLine.trim())) {
        parsed.push({
          kind: 'lyric',
          segments: pairChordAndLyricLines(line, nextLine, semitones, preferFlats),
        });
        i += 1;
        continue;
      }
      parsed.push({
        kind: 'lyric',
        segments: pairChordAndLyricLines(line, '', semitones, preferFlats),
      });
      continue;
    }

    parsed.push({
      kind: 'lyric',
      segments: parseInlineChordProLine(line, semitones, preferFlats),
    });
  }

  return parsed;
}

export function extractUniqueChords(content: string, semitones = 0, targetKey = 'C'): readonly string[] {
  const lines = parseSongContent(content, semitones, targetKey);
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const line of lines) {
    if (line.kind !== 'lyric') continue;
    for (const seg of line.segments) {
      if (!seg.chord) continue;
      const clean = seg.chord.replace(/^[|(]+|[|),.:]+$/g, '');
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        ordered.push(clean);
      }
    }
  }
  return ordered;
}
