import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatChapterLabel } from '@model/reference';
import type { Chapter, HighlightColor, Note, TranslationId, VerseReference } from '@model/types';
import {
  goToChapter,
  loadCurrentChapter,
  nextChapter,
  previousChapter,
  setCompareTranslation,
  setTranslation,
} from '@controller/app.controller';
import { loadChapter } from '@controller/bible.service';
import { updatePreferences } from '@controller/preferences.controller';
import { useAppStore } from '@controller/store';
import {
  copyVerse,
  createNote,
  removeNote,
  sanitizeTags,
  toggleBookmark,
  toggleHighlight,
  updateNote,
} from '@controller/notes.controller';
import { useI18n } from '@ui/hooks/useI18n';
import { useReadingPosition } from '@ui/hooks/useReadingPosition';
import { RefreshIcon } from '@ui/components/icons';
import { ChapterReader } from '@ui/reader/ChapterReader';
import { NoteDialog } from '@ui/reader/NoteDialog';
import { NoteEditor } from '@ui/reader/NoteEditor';
import { NotesDrawer } from '@ui/reader/NotesDrawer';
import { ReaderSkeleton } from '@ui/reader/ReaderSkeleton';
import { ReaderToolbar } from '@ui/reader/ReaderToolbar';
import { ReferenceDialog } from '@ui/reader/ReferenceDialog';

interface DialogState {
  readonly mode: 'create' | 'edit';
  readonly reference: VerseReference;
  readonly note?: Note;
}

export function ReaderPage() {
  const state = useAppStore();
  const { t, language } = useI18n();

  const [comparisonChapter, setComparisonChapter] = useState<Chapter | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [pendingVerse, setPendingVerse] = useState<number | null>(null);

  const { bookNumber, chapter: chapterNumber } = state.location;
  const activeTranslation = state.preferences.activeTranslation;
  const compareTranslation = state.compareTranslation;

  useEffect(() => {
    if (!compareTranslation) {
      setComparisonChapter(null);
      setComparisonError(null);
      return;
    }

    let cancelled = false;
    setComparisonChapter(null);
    setComparisonError(null);

    void loadChapter(compareTranslation, bookNumber, chapterNumber).then((result) => {
      if (cancelled) return;
      if (result.ok) setComparisonChapter(result.value);
      else setComparisonError(result.error.message);
    });

    return () => {
      cancelled = true;
    };
  }, [compareTranslation, bookNumber, chapterNumber]);

  const chapterNotes = useMemo(
    () =>
      state.notes.filter(
        (note) => note.reference.bookNumber === bookNumber && note.reference.chapter === chapterNumber,
      ),
    [state.notes, bookNumber, chapterNumber],
  );

  const chapterMatches =
    state.chapter?.translationId === activeTranslation &&
    state.chapter.bookNumber === bookNumber &&
    state.chapter.chapter === chapterNumber;
  const chapter = chapterMatches ? state.chapter : null;
  const verseCount = chapter?.verses.length ?? 0;

  const readingPosition = useReadingPosition({
    chapterKey: `${bookNumber}:${chapterNumber}:${activeTranslation}`,
    verseCount,
  });

  const chapterLabel = formatChapterLabel(bookNumber, chapterNumber, language);

  const scrollToVerse = useCallback((verse: number): void => {
    const element = document.getElementById(`v${verse}`);
    if (!element) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    if (pendingVerse === null || !chapter) return;

    const timer = window.setTimeout(() => {
      scrollToVerse(pendingVerse);
      setPendingVerse(null);
    }, 140);

    return () => window.clearTimeout(timer);
  }, [pendingVerse, chapter, scrollToVerse]);

  const handleReferenceSelect = (nextBook: number, nextChapter: number, verse?: number): void => {
    setReferenceOpen(false);
    setPendingVerse(verse ?? null);
    void goToChapter(nextBook, nextChapter);
  };

  const handleSelectTranslation = (translationId: TranslationId): void => {
    setPendingVerse(null);
    setTranslation(translationId);
  };

  const handlePrevChapter = (): void => {
    setPendingVerse(null);
    previousChapter();
  };

  const handleNextChapter = (): void => {
    setPendingVerse(null);
    nextChapter();
  };

  const openCreate = useCallback((reference: VerseReference): void => {
    setDialog({ mode: 'create', reference });
  }, []);

  const openEdit = useCallback((note: Note): void => {
    setNotesOpen(false);
    setDialog({ mode: 'edit', reference: note.reference, note });
  }, []);

  const handleCopy = useCallback(
    (reference: VerseReference, text: string): void => {
      void copyVerse(reference, activeTranslation, text);
    },
    [activeTranslation],
  );

  const handleToggleBookmark = useCallback(
    (reference: VerseReference): void => {
      void toggleBookmark(reference, activeTranslation);
    },
    [activeTranslation],
  );

  const handleHighlight = useCallback(
    (reference: VerseReference, color: HighlightColor): void => {
      void toggleHighlight(reference, activeTranslation, color);
    },
    [activeTranslation],
  );

  const handleSave = (body: string, tags: readonly string[]): void => {
    if (!dialog) return;
    const sanitized = sanitizeTags(tags.join(','));
    if (dialog.mode === 'edit' && dialog.note) {
      void updateNote(dialog.note.id, { body, tags: sanitized });
    } else {
      void createNote({
        reference: dialog.reference,
        translationId: activeTranslation,
        body,
        tags: sanitized,
      });
    }
    setDialog(null);
  };

  const handleOpenVerse = (note: Note): void => {
    setNotesOpen(false);
    if (note.reference.bookNumber === bookNumber && note.reference.chapter === chapterNumber) {
      scrollToVerse(note.reference.verse);
      return;
    }
    setPendingVerse(note.reference.verse);
    void goToChapter(note.reference.bookNumber, note.reference.chapter);
  };

  const showComparison = compareTranslation !== null && comparisonError === null;
  const comparisonReady = comparisonChapter !== null;

  return (
    <div>
      <h1 className="sr-only">{t('reader.title')}</h1>

      <ReaderToolbar
        chapterLabel={chapterLabel}
        active={activeTranslation}
        compare={compareTranslation}
        currentVerse={readingPosition.activeVerse}
        verseCount={verseCount}
        progress={readingPosition.progress}
        notesCount={chapterNotes.length}
        onOpenReference={() => setReferenceOpen(true)}
        onOpenNotes={() => setNotesOpen(true)}
        onSelectTranslation={handleSelectTranslation}
        onCompare={setCompareTranslation}
        onJumpToVerse={scrollToVerse}
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        onFocus={() => updatePreferences({ focusMode: true })}
      />

      <div className={`mx-auto mt-5 ${showComparison ? 'max-w-5xl' : 'max-w-3xl'}`}>
        {compareTranslation && !comparisonReady && !comparisonError ? (
          <p className="mb-3 animate-pulse text-xs font-medium text-sky-700 dark:text-sky-300">
            {t('reader.loadingComparison')}
          </p>
        ) : null}

        {compareTranslation && comparisonError ? (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-rose-500/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
          >
            {comparisonError}
          </div>
        ) : null}

        {state.chapterStatus === 'loading' && !chapterMatches ? <ReaderSkeleton /> : null}

        {state.chapterStatus === 'error' ? (
          <div className="sv-card border-rose-500/30 text-center">
            <h2 className="font-serif text-xl text-navy-900 dark:text-parchment-50">
              {t('reader.errorTitle')}
            </h2>
            <p className="mt-2 text-sm text-navy-600 dark:text-parchment-200/80">{state.chapterError}</p>
            <p className="mt-1 text-xs text-navy-400 dark:text-parchment-300/60">{t('reader.offlineHint')}</p>
            <button
              type="button"
              className="sv-btn sv-btn-primary mt-4"
              onClick={() => void loadCurrentChapter(activeTranslation, true)}
            >
              <RefreshIcon size={16} />
              {t('common.retry')}
            </button>
          </div>
        ) : null}

        {chapter ? (
          <ChapterReader
            chapter={chapter}
            comparison={showComparison && comparisonReady ? comparisonChapter : null}
            comparisonTranslation={showComparison && comparisonReady ? compareTranslation : null}
            activeVerse={readingPosition.activeVerse}
            notes={state.notes}
            highlights={state.highlights}
            bookmarks={state.bookmarks}
            onCopy={handleCopy}
            onToggleBookmark={handleToggleBookmark}
            onHighlight={handleHighlight}
            onAddNote={openCreate}
            onEditNote={openEdit}
          />
        ) : null}
      </div>

      {referenceOpen ? (
        <ReferenceDialog
          bookNumber={bookNumber}
          chapter={chapterNumber}
          onSelect={handleReferenceSelect}
          onClose={() => setReferenceOpen(false)}
        />
      ) : null}

      {notesOpen ? (
        <NotesDrawer
          notes={chapterNotes}
          onEdit={openEdit}
          onDelete={(id) => void removeNote(id)}
          onOpenVerse={handleOpenVerse}
          onClose={() => setNotesOpen(false)}
        />
      ) : null}

      {dialog ? (
        <NoteDialog
          title={dialog.mode === 'edit' ? t('notes.edit') : t('reader.addNote')}
          subtitle={`${chapterLabel} · ${activeTranslation}`}
          onClose={() => setDialog(null)}
        >
          <NoteEditor
            initialBody={dialog.note?.body ?? ''}
            initialTags={dialog.note?.tags ?? []}
            onSave={handleSave}
            onCancel={() => setDialog(null)}
          />
        </NoteDialog>
      ) : null}
    </div>
  );
}
