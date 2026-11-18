import { describe, expect, it } from 'vitest';
import { extractBibleReferences, parseReferenceInput } from './reference';

describe('parseReferenceInput & extractBibleReferences', () => {
  it('reconoce múltiples formatos de cita en apuntes de prédicas', () => {
    const note = [
      'Texto base: 1Jn 4:8 y Flp 4.13.',
      'También leer Mc 10:45, Stgo 1:5, 1 S 3:1 y 1 Co. 13:4-7.',
      'Versículos rápidos: juan 3,16, Salmo 23, Romanos 8:28b, II Corintios 5:17,',
      '1ra de Pedro 5:7, S. Mateo 5:3, Abdías 3, Judas 24 y Cantar de los Cantares 2:1.',
      'Además ver Juan 3 v.16 y Salmos 91:1–4.',
    ].join('\n');

    const refs = extractBibleReferences(note);
    const formatted = refs.map((r) => `${r.raw} => ${r.reference.bookNumber}:${r.reference.chapter}:${r.reference.verse}`);

    expect(formatted).toEqual([
      '1Jn 4:8 => 62:4:8',
      'Flp 4.13 => 50:4:13',
      'Mc 10:45 => 41:10:45',
      'Stgo 1:5 => 59:1:5',
      '1 S 3:1 => 9:3:1',
      '1 Co. 13:4-7 => 46:13:4',
      'juan 3,16 => 43:3:16',
      'Salmo 23 => 19:23:1',
      'Romanos 8:28b => 45:8:28',
      'II Corintios 5:17 => 47:5:17',
      '1ra de Pedro 5:7 => 60:5:7',
      'S. Mateo 5:3 => 40:5:3',
      'Abdías 3 => 31:1:3',
      'Judas 24 => 65:1:24',
      'Cantar de los Cantares 2:1 => 22:2:1',
      'Juan 3 v.16 => 43:3:16',
      'Salmos 91:1–4 => 19:91:1',
    ]);
  });

  it('no confunde listas numeradas ni palabras cotidianas con versículos', () => {
    const prose = [
      '1. Juan 3:16 es clave.',
      'Ver 1 Juan 4:8 y San Pablo 2 Corintios 5:17.',
      'He 3 veces pensado en mi 2 casa para ti 1 cosa y nos da 4 claves.',
      'Son Hechos 3 días después a las 10:30.',
    ].join('\n');

    const refs = extractBibleReferences(prose);
    const extracted = refs.map((r) => [r.raw, r.reference.bookNumber, r.reference.chapter, r.reference.verse]);

    expect(extracted).toEqual([
      ['Juan 3:16', 43, 3, 16],
      ['1 Juan 4:8', 62, 4, 8],
      ['2 Corintios 5:17', 47, 5, 17],
    ]);
  });

  it('parsea entradas individuales flexibles en Pasaje base / buscador', () => {
    expect(parseReferenceInput('Jn. 3.16')).toEqual({ bookNumber: 43, chapter: 3, verse: 16 });
    expect(parseReferenceInput('1jn 4,8')).toEqual({ bookNumber: 62, chapter: 4, verse: 8 });
    expect(parseReferenceInput('Salmos 23')).toEqual({ bookNumber: 19, chapter: 23, verse: 1 });
    expect(parseReferenceInput('Judas 24')).toEqual({ bookNumber: 65, chapter: 1, verse: 24 });
    expect(parseReferenceInput('Flp 4:13')).toEqual({ bookNumber: 50, chapter: 4, verse: 13 });
    expect(parseReferenceInput('Génesis 99:1')).toBeNull();
  });
});
