import { describe, expect, it } from 'vitest';
import {
  extractUniqueChords,
  formatPitchName,
  getChordVoicings,
  getDiatonicChordsForKey,
  getFretNote,
  getScalePitches,
  getScaleRole,
  isChordOnlyLine,
  parseSongContent,
  suggestCapoOptions,
  transposeChord,
  transposeKeyName,
} from './music';

describe('music.ts — diapasón y teoría', () => {
  it('calcula correctamente las notas al aire y en el traste 12', () => {
    const openSixth = getFretNote(6, 0);
    expect(openSixth.american).toBe('E');
    expect(openSixth.latin).toBe('Mi');
    expect(openSixth.midi).toBe(40);

    const fret12Sixth = getFretNote(6, 12);
    expect(fret12Sixth.american).toBe('E');
    expect(fret12Sixth.midi).toBe(52);

    const cThirdString = getFretNote(3, 5);
    expect(cThirdString.american).toBe('C');
    expect(cThirdString.latin).toBe('Do');
    expect(formatPitchName(cThirdString.pitchIndex, 'both')).toBe('C · Do');
  });

  it('calcula escalas y roles de grado', () => {
    const cMajor = getScalePitches(0, 'major');
    expect(cMajor).toEqual([0, 2, 4, 5, 7, 9, 11]);
    expect(getScaleRole(0, 0, 'major')).toBe('root');
    expect(getScaleRole(4, 0, 'major')).toBe('chord-tone');
    expect(getScaleRole(2, 0, 'major')).toBe('scale-tone');
    expect(getScaleRole(1, 0, 'major')).toBe('none');
  });

  it('devuelve acordes diatónicos I–vi con variantes worship y diagramas', () => {
    const gDiatonic = getDiatonicChordsForKey('G', 'major');
    expect(gDiatonic.map((d) => d.symbol)).toEqual(['G', 'Am', 'Bm', 'C', 'D', 'Em']);
    expect(getChordVoicings('D/F#').length).toBeGreaterThan(0);
    expect(getChordVoicings('F#m7').length).toBeGreaterThan(0);
  });
});

describe('music.ts — transposición, capo y parser LaCuerda.net', () => {
  it('transpone acordes latinos/americanos, bajos invertidos y tonalidades', () => {
    expect(transposeChord('G', 2)).toBe('A');
    expect(transposeChord('D/F#', 2)).toBe('E/G#');
    expect(transposeChord('Solm7', 2)).toBe('Am7');
    expect(transposeKeyName('G', -2)).toBe('F');
  });

  it('sugiere opciones prácticas de capo en tonalidades con sostenidos o bemoles', () => {
    const options = suggestCapoOptions('Bb');
    expect(options.length).toBeGreaterThan(0);
    expect(options[0]?.capoFret).toBe(1);
    expect(options[0]?.shapeKey).toBe('A');
  });

  it('detecta y empareja acordes encima de la letra estilo LaCuerda.net', () => {
    const sheet = [
      '[VERSO]',
      'G              D/F#',
      'Cuan grande es Dios',
      '',
      '[CORO]',
      '[Em7]Cántale que [C]grande es [G]Dios',
    ].join('\n');

    expect(isChordOnlyLine('G              D/F#')).toBe(true);
    expect(isChordOnlyLine('Cuan grande es Dios')).toBe(false);

    const parsed = parseSongContent(sheet, 2, 'A');
    expect(parsed[0]).toEqual({ kind: 'section', label: 'VERSO' });
    const lyric1 = parsed[1];
    expect(lyric1?.kind).toBe('lyric');
    if (lyric1?.kind === 'lyric') {
      expect(lyric1.segments.some((s) => s.chord === 'A' && s.text.includes('Cuan grande'))).toBe(true);
      expect(lyric1.segments.some((s) => s.chord === 'E/G#' && s.text.includes('Dios'))).toBe(true);
    }

    const unique = extractUniqueChords(sheet, 0, 'G');
    expect(unique).toEqual(['G', 'D/F#', 'Em7', 'C']);
  });
});
