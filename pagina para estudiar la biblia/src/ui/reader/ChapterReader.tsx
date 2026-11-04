import { memo, useMemo } from 'react';
import type { Bookmark, Chapter, Highlight, Note, TranslationId } from '@model/types';
import { getBookByNumber } from '@model/canon';
import { useI18n } from '@ui/hooks/useI18n';
import { VerseRow } from './VerseRow';

interface ChapterReaderProps {
  readonly chapter: Chapter;
  readonly comparison: Chapter | null;
  readonly comparisonTranslation: TranslationId | null;
  readonly activeVerse: number;
  readonly notes: readonly Note[];
  readonly highlights: readonly Highlight[];
  readonly bookmarks: readonly Bookmark[];
  readonly onCopy: (reference: { bookNumber: number; chapter: number; verse: number }, text: string) => void;
  readonly onToggleBookmark: (reference: { bookNumber: number; chapter: number; verse: number }) => void;
  readonly onHighlight: (
    reference: { bookNumber: number; chapter: number; verse: number },
    color: 'gold' | 'sage' | 'sky' | 'rose',
  ) => void;
  readonly onAddNote: (reference: { bookNumber: number; chapter: number; verse: number }) => void;
  readonly onEditNote: (note: Note) => void;
}

export const ChapterReader = memo(function ChapterReader({
  chapter,
  comparison,
  comparisonTranslation,
  activeVerse,
  notes,
  highlights,
  bookmarks,
  onCopy,
  onToggleBookmark,
  onHighlight,
  onAddNote,
  onEditNote,
}: ChapterReaderProps) {
  const { t, language } = useI18n();
  const book = getBookByNumber(chapter.bookNumber);
  const bookName = book ? (language === 'es' ? book.nameEs : book.nameEn) : `Libro ${chapter.bookNumber}`;

  const comparisonByVerse = useMemo(
    () => new Map<number, string>((comparison?.verses ?? []).map((verse) => [verse.number, verse.text])),
    [comparison],
  );

  const noteByVerse = useMemo(() => {
    const map = new Map<number, Note>();
    for (const note of notes) {
      if (
        note.reference.bookNumber === chapter.bookNumber &&
        note.reference.chapter === chapter.chapter &&
        note.translationId === chapter.translationId
      ) {
        map.set(note.reference.verse, note);
      }
    }
    return map;
  }, [notes, chapter.bookNumber, chapter.chapter, chapter.translationId]);

  const highlightByVerse = useMemo(() => {
    const map = new Map<number, Highlight>();
    for (const highlight of highlights) {
      if (
        highlight.reference.bookNumber === chapter.bookNumber &&
        highlight.reference.chapter === chapter.chapter
      ) {
        map.set(highlight.reference.verse, highlight);
      }
    }
    return map;
  }, [highlights, chapter.bookNumber, chapter.chapter]);

  const bookmarkByVerse = useMemo(() => {
    const map = new Map<number, Bookmark>();
    for (const bookmark of bookmarks) {
      if (
        bookmark.reference.bookNumber === chapter.bookNumber &&
        bookmark.reference.chapter === chapter.chapter
      ) {
        map.set(bookmark.reference.verse, bookmark);
      }
    }
    return map;
  }, [bookmarks, chapter.bookNumber, chapter.chapter]);

  return (
    <article aria-labelledby="chapter-title">
      <header className="mb-6 border-b border-navy-900/10 pb-5 dark:border-parchment-100/10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ember-700 dark:text-ember-300">
              {chapter.translationId}
              {chapter.source === 'cache' ? ` · ${t('common.offline')}` : ''}
            </p>
            <h2
              id="chapter-title"
              className="mt-1 font-serif text-3xl leading-tight text-navy-900 dark:text-parchment-50 sm:text-4xl"
            >
              {bookName} {chapter.chapter}
            </h2>
          </div>
          <p className="pb-1 text-xs text-navy-400 dark:text-parchment-300/60">
            {chapter.verses.length}{' '}
            {chapter.verses.length === 1 ? t('reader.verse').toLowerCase() : t('reader.verses')}
          </p>
        </div>
      </header>

      {comparisonTranslation ? (
        <div className="mb-2 hidden items-center gap-6 md:grid md:grid-cols-2">
          <span className="sv-column-label pl-8">{chapter.translationId}</span>
          <span className="sv-column-label pl-4 text-sky-700 dark:text-sky-300">
            {comparisonTranslation}
          </span>
        </div>
      ) : null}

      <ol className="space-y-1">
        {chapter.verses.map((verse) => {
          const reference = {
            bookNumber: chapter.bookNumber,
            chapter: chapter.chapter,
            verse: verse.number,
          };
          return (
            <VerseRow
              key={verse.number}
              verse={verse}
              reference={reference}
              translationId={chapter.translationId}
              active={verse.number === activeVerse}
              note={noteByVerse.get(verse.number)}
              highlight={highlightByVerse.get(verse.number)}
              bookmark={bookmarkByVerse.get(verse.number)}
              comparisonText={comparisonByVerse.get(verse.number)}
              comparisonTranslation={comparisonTranslation}
              onCopy={() => onCopy(reference, verse.text)}
              onToggleBookmark={() => onToggleBookmark(reference)}
              onHighlight={(color) => onHighlight(reference, color)}
              onAddNote={() => onAddNote(reference)}
              onEditNote={onEditNote}
            />
          );
        })}
      </ol>

      <footer className="mt-8 rounded-xl bg-navy-900/5 px-4 py-3 text-xs leading-relaxed text-navy-500 dark:bg-parchment-100/5 dark:text-parchment-300/60">
        {t('reader.copyright')}
      </footer>
    </article>
  );
});
