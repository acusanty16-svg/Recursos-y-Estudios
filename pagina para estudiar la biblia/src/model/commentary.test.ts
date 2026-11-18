import { describe, expect, it } from 'vitest';
import { resolveCommentaryTarget, type CommentarySection } from './commentary';

const SAMPLE_SECTIONS: readonly CommentarySection[] = [
  { verseNumber: 1, text: 'Verses 1-3 comment' },
  { verseNumber: 4, text: 'Verses 4-7 comment' },
  { verseNumber: 8, text: 'Verses 8-12 comment' },
  { verseNumber: 16, text: 'Verse 16 comment' },
];

describe('resolveCommentaryTarget', () => {
  it('encuentra la coincidencia exacta cuando el versículo existe en Matthew Henry', () => {
    expect(resolveCommentaryTarget(SAMPLE_SECTIONS, 16)).toEqual({
      index: 3,
      verseNumber: 16,
      isExact: true,
    });
  });

  it('elige el versículo más cercano cuando el versículo solicitado no tiene entrada propia', () => {
    expect(resolveCommentaryTarget(SAMPLE_SECTIONS, 2)).toEqual({
      index: 0,
      verseNumber: 1,
      isExact: false,
    });
    expect(resolveCommentaryTarget(SAMPLE_SECTIONS, 14)).toEqual({
      index: 3,
      verseNumber: 16,
      isExact: false,
    });
  });

  it('en caso de empate de distancia, prioriza la entrada anterior que suele agrupar el pasaje', () => {
    expect(resolveCommentaryTarget(SAMPLE_SECTIONS, 6)).toEqual({
      index: 1,
      verseNumber: 4,
      isExact: false,
    });
  });

  it('devuelve null si no hay versículo objetivo o secciones numeradas', () => {
    expect(resolveCommentaryTarget(SAMPLE_SECTIONS, null)).toBeNull();
    expect(resolveCommentaryTarget([{ verseNumber: null, text: 'Solo general' }], 3)).toBeNull();
  });
});
