import { useMemo, useState } from 'react';
import { CANON, getBookByNumber } from '@model/canon';
import { formatChapterLabel, formatReference, parseReferenceInput } from '@model/reference';
import type { CanonBook } from '@model/types';
import { useI18n } from '@ui/hooks/useI18n';
import { Dialog } from '@ui/components/Dialog';
import { BookIcon, ChevronLeftIcon, SearchIcon } from '@ui/components/icons';

interface ReferenceDialogProps {
  readonly bookNumber: number;
  readonly chapter: number;
  readonly onSelect: (bookNumber: number, chapter: number, verse?: number) => void;
  readonly onClose: () => void;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Selector compacto de libro y capítulo.
 * Sustituye la tarjeta lateral: la referencia vive en la barra superior.
 */
export function ReferenceDialog({ bookNumber, chapter, onSelect, onClose }: ReferenceDialogProps) {
  const { t, language } = useI18n();
  const [step, setStep] = useState<'book' | 'chapter'>('book');
  const [selectedBook, setSelectedBook] = useState(bookNumber);
  const [query, setQuery] = useState('');

  const book = getBookByNumber(selectedBook);
  const parsedReference = parseReferenceInput(query);

  const filteredBooks = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return CANON;
    return CANON.filter((item) =>
      [item.nameEs, item.nameEn, item.abbrevEs, item.abbrevEn, item.id].some((value) =>
        normalize(value).includes(needle),
      ),
    );
  }, [query]);

  const oldTestament = filteredBooks.filter((item) => item.testament === 'old');
  const newTestament = filteredBooks.filter((item) => item.testament === 'new');

  const chooseBook = (nextBook: number): void => {
    setSelectedBook(nextBook);
    setStep('chapter');
  };

  const chooseReference = (): void => {
    if (!parsedReference) return;
    onSelect(parsedReference.bookNumber, parsedReference.chapter, parsedReference.verse);
  };

  return (
    <Dialog
      title={t('reader.reference')}
      subtitle={formatChapterLabel(bookNumber, chapter, language)}
      onClose={onClose}
      size="lg"
    >
      <label htmlFor="reference-search" className="sr-only">
        {t('reader.searchReference')}
      </label>
      <div className="relative">
        <SearchIcon
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 dark:text-parchment-300/50"
        />
        <input
          id="reference-search"
          className="sv-input pl-9"
          placeholder={t('reader.searchReference')}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setStep('book');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && parsedReference) {
              event.preventDefault();
              chooseReference();
            }
          }}
          autoFocus
        />
      </div>

      {parsedReference ? (
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-ember-500/25 bg-ember-400/10 px-3 py-2.5 text-left transition-colors hover:bg-ember-400/15"
          onClick={chooseReference}
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-700 dark:text-ember-300">
              {t('reader.quickJump')}
            </span>
            <span className="block truncate text-sm font-medium text-navy-900 dark:text-parchment-50">
              {formatReference(parsedReference, language)}
            </span>
          </span>
          <ChevronLeftIcon size={16} className="rotate-180 text-ember-600 dark:text-ember-300" />
        </button>
      ) : null}

      {step === 'book' ? (
        <div className="mt-5 space-y-5">
          <BookGroup
            label={t('reader.oldTestament')}
            books={oldTestament}
            language={language}
            onSelect={chooseBook}
          />
          <BookGroup
            label={t('reader.newTestament')}
            books={newTestament}
            language={language}
            onSelect={chooseBook}
          />
          {filteredBooks.length === 0 ? (
            <p className="py-6 text-center text-sm text-navy-500 dark:text-parchment-300/70">
              {t('reader.noBookResults')}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-4 flex items-center gap-2">
            <button
              type="button"
              className="sv-btn sv-btn-ghost min-h-9 px-2 text-xs"
              onClick={() => setStep('book')}
            >
              <ChevronLeftIcon size={16} />
              {t('reader.back')}
            </button>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg text-navy-900 dark:text-parchment-50">
                {book ? (language === 'es' ? book.nameEs : book.nameEn) : ''}
              </p>
              <p className="text-[11px] text-navy-400 dark:text-parchment-300/60">
                {book?.chapters ?? 0} {t('reader.chapters')}
              </p>
            </div>
          </div>

          {book ? (
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8 md:grid-cols-10">
              {Array.from({ length: book.chapters }, (_, index) => index + 1).map((number) => {
                const isCurrent = book.number === bookNumber && number === chapter;
                return (
                  <button
                    key={number}
                    type="button"
                    onClick={() => onSelect(book.number, number)}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={[
                      'inline-flex min-h-11 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                      isCurrent
                        ? 'bg-ember-600 text-white shadow-sm dark:bg-ember-500'
                        : 'text-navy-700 hover:bg-navy-900/5 dark:text-parchment-200 dark:hover:bg-parchment-100/10',
                    ].join(' ')}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      )}

      <p className="mt-5 flex items-center gap-2 border-t border-navy-900/10 pt-4 text-[11px] text-navy-400 dark:border-parchment-100/10 dark:text-parchment-300/60">
        <BookIcon size={14} />
        {t('reader.referenceHint')}
      </p>
    </Dialog>
  );
}

interface BookGroupProps {
  readonly label: string;
  readonly books: readonly CanonBook[];
  readonly language: 'es' | 'en';
  readonly onSelect: (bookNumber: number) => void;
}

function BookGroup({ label, books, language, onSelect }: BookGroupProps) {
  if (books.length === 0) return null;

  return (
    <section>
      <h3 className="sv-label">{label}</h3>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {books.map((book) => (
          <button
            key={book.number}
            type="button"
            onClick={() => onSelect(book.number)}
            className="group flex min-h-11 items-center justify-between gap-2 rounded-lg border border-transparent px-2.5 py-1.5 text-left transition-colors hover:border-navy-900/10 hover:bg-navy-900/5 dark:hover:border-parchment-100/10 dark:hover:bg-parchment-100/10"
          >
            <span className="truncate text-sm text-navy-800 group-hover:text-navy-950 dark:text-parchment-100">
              {language === 'es' ? book.nameEs : book.nameEn}
            </span>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-400 dark:text-parchment-300/50">
              {language === 'es' ? book.abbrevEs : book.abbrevEn}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
