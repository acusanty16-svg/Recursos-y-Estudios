import type { CanonBook, Testament } from './types';

/**
 * Canon protestante de 66 libros.
 * `number` es el índice 1..66 que consume bolls.life (/get-chapter/{v}/{book}/{chapter}/).
 * Los conteos de capítulos se usan para validar navegación antes de tocar la red.
 */
type BookSeed = readonly [
  number: number,
  id: string,
  nameEs: string,
  nameEn: string,
  abbrevEs: string,
  abbrevEn: string,
  testament: Testament,
  chapters: number,
];

const SEEDS: readonly BookSeed[] = [
  [1, 'genesis', 'Génesis', 'Genesis', 'Gn', 'Gen', 'old', 50],
  [2, 'exodo', 'Éxodo', 'Exodus', 'Éx', 'Exod', 'old', 40],
  [3, 'levitico', 'Levítico', 'Leviticus', 'Lv', 'Lev', 'old', 27],
  [4, 'numeros', 'Números', 'Numbers', 'Nm', 'Num', 'old', 36],
  [5, 'deuteronomio', 'Deuteronomio', 'Deuteronomy', 'Dt', 'Deut', 'old', 34],
  [6, 'josue', 'Josué', 'Joshua', 'Jos', 'Josh', 'old', 24],
  [7, 'jueces', 'Jueces', 'Judges', 'Jue', 'Judg', 'old', 21],
  [8, 'rut', 'Rut', 'Ruth', 'Rt', 'Ruth', 'old', 4],
  [9, '1-samuel', '1 Samuel', '1 Samuel', '1 S', '1 Sam', 'old', 31],
  [10, '2-samuel', '2 Samuel', '2 Samuel', '2 S', '2 Sam', 'old', 24],
  [11, '1-reyes', '1 Reyes', '1 Kings', '1 R', '1 Kgs', 'old', 22],
  [12, '2-reyes', '2 Reyes', '2 Kings', '2 R', '2 Kgs', 'old', 25],
  [13, '1-cronicas', '1 Crónicas', '1 Chronicles', '1 Cr', '1 Chr', 'old', 29],
  [14, '2-cronicas', '2 Crónicas', '2 Chronicles', '2 Cr', '2 Chr', 'old', 36],
  [15, 'esdras', 'Esdras', 'Ezra', 'Esd', 'Ezra', 'old', 10],
  [16, 'nehemias', 'Nehemías', 'Nehemiah', 'Neh', 'Neh', 'old', 13],
  [17, 'ester', 'Ester', 'Esther', 'Est', 'Esth', 'old', 10],
  [18, 'job', 'Job', 'Job', 'Job', 'Job', 'old', 42],
  [19, 'salmos', 'Salmos', 'Psalms', 'Sal', 'Ps', 'old', 150],
  [20, 'proverbios', 'Proverbios', 'Proverbs', 'Pr', 'Prov', 'old', 31],
  [21, 'eclesiastes', 'Eclesiastés', 'Ecclesiastes', 'Ec', 'Eccl', 'old', 12],
  [22, 'cantares', 'Cantares', 'Song of Songs', 'Cnt', 'Song', 'old', 8],
  [23, 'isaias', 'Isaías', 'Isaiah', 'Is', 'Isa', 'old', 66],
  [24, 'jeremias', 'Jeremías', 'Jeremiah', 'Jer', 'Jer', 'old', 52],
  [25, 'lamentaciones', 'Lamentaciones', 'Lamentations', 'Lm', 'Lam', 'old', 5],
  [26, 'ezequiel', 'Ezequiel', 'Ezekiel', 'Ez', 'Ezek', 'old', 48],
  [27, 'daniel', 'Daniel', 'Daniel', 'Dn', 'Dan', 'old', 12],
  [28, 'oseas', 'Oseas', 'Hosea', 'Os', 'Hos', 'old', 14],
  [29, 'joel', 'Joel', 'Joel', 'Jl', 'Joel', 'old', 3],
  [30, 'amos', 'Amós', 'Amos', 'Am', 'Amos', 'old', 9],
  [31, 'obadias', 'Obadías', 'Obadiah', 'Abd', 'Obad', 'old', 1],
  [32, 'jonas', 'Jonás', 'Jonah', 'Jon', 'Jonah', 'old', 4],
  [33, 'miqueas', 'Miqueas', 'Micah', 'Mi', 'Mic', 'old', 7],
  [34, 'nahum', 'Nahúm', 'Nahum', 'Nah', 'Nah', 'old', 3],
  [35, 'habacuc', 'Habacuc', 'Habakkuk', 'Hab', 'Hab', 'old', 3],
  [36, 'sofonias', 'Sofonías', 'Zephaniah', 'Sof', 'Zeph', 'old', 3],
  [37, 'hageo', 'Hageo', 'Haggai', 'Hag', 'Hag', 'old', 2],
  [38, 'zacarias', 'Zacarías', 'Zechariah', 'Zac', 'Zech', 'old', 14],
  [39, 'malaquias', 'Malaquías', 'Malachi', 'Mal', 'Mal', 'old', 4],
  [40, 'mateo', 'Mateo', 'Matthew', 'Mt', 'Matt', 'new', 28],
  [41, 'marcos', 'Marcos', 'Mark', 'Mr', 'Mark', 'new', 16],
  [42, 'lucas', 'Lucas', 'Luke', 'Lc', 'Luke', 'new', 24],
  [43, 'juan', 'Juan', 'John', 'Jn', 'John', 'new', 21],
  [44, 'hechos', 'Hechos', 'Acts', 'Hch', 'Acts', 'new', 28],
  [45, 'romanos', 'Romanos', 'Romans', 'Ro', 'Rom', 'new', 16],
  [46, '1-corintios', '1 Corintios', '1 Corinthians', '1 Co', '1 Cor', 'new', 16],
  [47, '2-corintios', '2 Corintios', '2 Corinthians', '2 Co', '2 Cor', 'new', 13],
  [48, 'galatas', 'Gálatas', 'Galatians', 'Gá', 'Gal', 'new', 6],
  [49, 'efesios', 'Efesios', 'Ephesians', 'Ef', 'Eph', 'new', 6],
  [50, 'filipenses', 'Filipenses', 'Philippians', 'Fil', 'Phil', 'new', 4],
  [51, 'colosenses', 'Colosenses', 'Colossians', 'Col', 'Col', 'new', 4],
  [52, '1-tesalonicenses', '1 Tesalonicenses', '1 Thessalonians', '1 Ts', '1 Thess', 'new', 5],
  [53, '2-tesalonicenses', '2 Tesalonicenses', '2 Thessalonians', '2 Ts', '2 Thess', 'new', 3],
  [54, '1-timoteo', '1 Timoteo', '1 Timothy', '1 Ti', '1 Tim', 'new', 6],
  [55, '2-timoteo', '2 Timoteo', '2 Timothy', '2 Ti', '2 Tim', 'new', 4],
  [56, 'tito', 'Tito', 'Titus', 'Tit', 'Titus', 'new', 3],
  [57, 'filemon', 'Filemón', 'Philemon', 'Flm', 'Phlm', 'new', 1],
  [58, 'hebreos', 'Hebreos', 'Hebrews', 'He', 'Heb', 'new', 13],
  [59, 'santiago', 'Santiago', 'James', 'Stg', 'Jas', 'new', 5],
  [60, '1-pedro', '1 Pedro', '1 Peter', '1 P', '1 Pet', 'new', 5],
  [61, '2-pedro', '2 Pedro', '2 Peter', '2 P', '2 Pet', 'new', 3],
  [62, '1-juan', '1 Juan', '1 John', '1 Jn', '1 John', 'new', 5],
  [63, '2-juan', '2 Juan', '2 John', '2 Jn', '2 John', 'new', 1],
  [64, '3-juan', '3 Juan', '3 John', '3 Jn', '3 John', 'new', 1],
  [65, 'judas', 'Judas', 'Jude', 'Jud', 'Jude', 'new', 1],
  [66, 'apocalipsis', 'Apocalipsis', 'Revelation', 'Ap', 'Rev', 'new', 22],
];

export const CANON: readonly CanonBook[] = SEEDS.map(
  ([number, id, nameEs, nameEn, abbrevEs, abbrevEn, testament, chapters]) => ({
    number,
    id,
    nameEs,
    nameEn,
    abbrevEs,
    abbrevEn,
    testament,
    chapters,
  }),
);

const BY_NUMBER = new Map<number, CanonBook>(CANON.map((book) => [book.number, book]));
const BY_ID = new Map<string, CanonBook>(CANON.map((book) => [book.id, book]));

export function getBookByNumber(number: number): CanonBook | undefined {
  return BY_NUMBER.get(number);
}

export function getBookById(id: string): CanonBook | undefined {
  return BY_ID.get(id);
}

export function getBooksByTestament(testament: Testament): readonly CanonBook[] {
  return CANON.filter((book) => book.testament === testament);
}

export function bookDisplayName(book: CanonBook, language: 'es' | 'en'): string {
  return language === 'es' ? book.nameEs : book.nameEn;
}

export function bookAbbreviation(book: CanonBook, language: 'es' | 'en'): string {
  return language === 'es' ? book.abbrevEs : book.abbrevEn;
}
