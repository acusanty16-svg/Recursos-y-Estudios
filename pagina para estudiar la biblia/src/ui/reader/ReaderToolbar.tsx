import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import type { TranslationId } from '@model/types';
import { useI18n } from '@ui/hooks/useI18n';
import { BrandMark } from '@ui/components/Brand';
import {
  BookIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FocusIcon,
  NoteIcon,
} from '@ui/components/icons';
import { TranslationTabs } from './TranslationTabs';

interface ReaderToolbarProps {
  readonly chapterLabel: string;
  readonly active: TranslationId;
  readonly compare: TranslationId | null;
  readonly currentVerse: number;
  readonly verseCount: number;
  readonly progress: number;
  readonly notesCount: number;
  readonly onOpenReference: () => void;
  readonly onOpenNotes: () => void;
  readonly onSelectTranslation: (translationId: TranslationId) => void;
  readonly onCompare: (translationId: TranslationId | null) => void;
  readonly onJumpToVerse: (verse: number) => void;
  readonly onPrevChapter: () => void;
  readonly onNextChapter: () => void;
  readonly onFocus: () => void;
}

export function ReaderToolbar({
  chapterLabel,
  active,
  compare,
  currentVerse,
  verseCount,
  progress,
  notesCount,
  onOpenReference,
  onOpenNotes,
  onSelectTranslation,
  onCompare,
  onJumpToVerse,
  onPrevChapter,
  onNextChapter,
  onFocus,
}: ReaderToolbarProps) {
  const { t } = useI18n();
  const [verseOpen, setVerseOpen] = useState(false);
  const verseMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!verseOpen) return;

    const handlePointer = (event: MouseEvent): void => {
      if (event.target instanceof Node && !verseMenuRef.current?.contains(event.target)) {
        setVerseOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setVerseOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [verseOpen]);

  return (
    <div className="sv-reader-toolbar sticky top-0 z-30 -mx-4 px-4 pb-2 pt-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="flex items-center gap-2">
        <Link to={ROUTES.dashboard} className="shrink-0 lg:hidden" aria-label={t('app.name')}>
          <BrandMark size={30} />
        </Link>

        <button
          type="button"
          onClick={onOpenReference}
          className="inline-flex min-h-11 min-w-0 items-center gap-2 rounded-lg px-2 text-left transition-colors hover:bg-navy-900/5 dark:hover:bg-parchment-100/10"
          aria-label={t('reader.openReference')}
        >
          <BookIcon size={16} className="shrink-0 text-ember-600 dark:text-ember-300" />
          <span className="truncate font-serif text-base font-medium text-navy-900 dark:text-parchment-50">
            {chapterLabel}
          </span>
          <ChevronDownIcon size={14} className="shrink-0 text-navy-400 dark:text-parchment-300/60" />
        </button>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="hidden size-11 items-center justify-center rounded-lg text-navy-500 transition-colors hover:bg-navy-900/5 hover:text-navy-900 sm:inline-flex dark:text-parchment-300/80 dark:hover:bg-parchment-100/10 dark:hover:text-parchment-50"
            onClick={onPrevChapter}
            aria-label={t('reader.prev')}
            title={t('reader.prev')}
          >
            <ChevronLeftIcon size={18} />
          </button>

          <div className="relative shrink-0" ref={verseMenuRef}>
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-navy-900/10 bg-white/50 px-2.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-white dark:border-parchment-100/10 dark:bg-navy-900/60 dark:text-parchment-200 dark:hover:bg-navy-800"
              onClick={() => setVerseOpen((open) => !open)}
              aria-expanded={verseOpen}
              aria-haspopup="true"
              aria-label={`${t('reader.verse')} ${currentVerse}`}
            >
              <span className="text-ember-600 dark:text-ember-300">v.</span>
              {currentVerse}
              <ChevronDownIcon size={12} className="opacity-60" />
            </button>

            {verseOpen ? (
              <div className="sv-popover absolute left-1/2 top-full z-40 mt-2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-navy-900/10 bg-parchment-50 p-3 shadow-2xl sm:left-0 sm:translate-x-0 dark:border-parchment-100/15 dark:bg-navy-900">
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-500 dark:text-parchment-300/70">
                    {t('reader.versePicker')}
                  </p>
                  <p className="text-[11px] text-navy-400 dark:text-parchment-300/50">
                    {currentVerse} {t('reader.chapterOf')} {verseCount}
                  </p>
                </div>
                <div className="grid max-h-60 grid-cols-6 gap-1 overflow-y-auto pr-1 sv-scroll sm:grid-cols-8">
                  {Array.from({ length: verseCount }, (_, index) => index + 1).map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => {
                        setVerseOpen(false);
                        onJumpToVerse(number);
                      }}
                      aria-current={number === currentVerse ? 'true' : undefined}
                      className={[
                        'inline-flex size-9 items-center justify-center rounded-md text-xs font-medium transition-colors',
                        number === currentVerse
                          ? 'bg-ember-600 text-white dark:bg-ember-500'
                          : 'text-navy-700 hover:bg-navy-900/5 dark:text-parchment-200 dark:hover:bg-parchment-100/10',
                      ].join(' ')}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="hidden size-11 items-center justify-center rounded-lg text-navy-500 transition-colors hover:bg-navy-900/5 hover:text-navy-900 sm:inline-flex dark:text-parchment-300/80 dark:hover:bg-parchment-100/10 dark:hover:text-parchment-50"
            onClick={onNextChapter}
            aria-label={t('reader.next')}
            title={t('reader.next')}
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="relative inline-flex min-h-11 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-navy-600 transition-colors hover:bg-navy-900/5 hover:text-navy-900 dark:text-parchment-200/80 dark:hover:bg-parchment-100/10 dark:hover:text-parchment-50"
            onClick={onOpenNotes}
            aria-label={t('reader.openNotes')}
            title={t('reader.openNotes')}
          >
            <NoteIcon size={18} />
            <span className="hidden md:inline">{t('reader.openNotes')}</span>
            {notesCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-ember-600 px-1.5 py-0.5 text-[10px] font-semibold text-white dark:bg-ember-500">
                {notesCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-navy-500 transition-colors hover:bg-navy-900/5 hover:text-navy-900 dark:text-parchment-300/80 dark:hover:bg-parchment-100/10 dark:hover:text-parchment-50"
            onClick={onFocus}
            aria-label={t('reader.focus')}
            title={t('reader.focus')}
          >
            <FocusIcon size={18} />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-0.5 sv-scroll">
        <button
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-navy-500 transition-colors hover:bg-navy-900/5 sm:hidden dark:text-parchment-300/80 dark:hover:bg-parchment-100/10"
          onClick={onPrevChapter}
          aria-label={t('reader.prev')}
        >
          <ChevronLeftIcon size={18} />
        </button>

        <TranslationTabs
          active={active}
          compare={compare}
          onSelect={onSelectTranslation}
          onCompare={onCompare}
        />

        <button
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-navy-500 transition-colors hover:bg-navy-900/5 sm:hidden dark:text-parchment-300/80 dark:hover:bg-parchment-100/10"
          onClick={onNextChapter}
          aria-label={t('reader.next')}
        >
          <ChevronRightIcon size={18} />
        </button>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-navy-900/5 dark:bg-parchment-100/10"
        aria-hidden="true"
      >
        <div
          className="sv-progress h-full w-full bg-ember-500 dark:bg-ember-400"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
