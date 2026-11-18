import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Note } from '@model/types';
import { useI18n } from '@ui/hooks/useI18n';
import { BookIcon, CloseIcon, NoteIcon } from '@ui/components/icons';
import { CommentaryPanel } from './CommentaryPanel';
import { NotesPanel } from './NotesPanel';

interface NotesDrawerProps {
  readonly notes: readonly Note[];
  readonly bookNumber: number;
  readonly chapter: number;
  readonly initialTab?: 'notes' | 'commentary' | undefined;
  readonly focusVerse?: number | null | undefined;
  readonly onEdit: (note: Note) => void;
  readonly onDelete: (id: string) => void;
  readonly onOpenVerse: (note: Note) => void;
  readonly onClose: () => void;
}

/**
 * Panel lateral de estudio bajo demanda: Notas del capítulo + Comentario Bíblico de Matthew Henry.
 */
export function NotesDrawer({
  notes,
  bookNumber,
  chapter,
  initialTab = 'notes',
  focusVerse,
  onEdit,
  onDelete,
  onOpenVerse,
  onClose,
}: NotesDrawerProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'notes' | 'commentary'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-drawer-title"
    >
      <div
        className="sv-backdrop absolute inset-0 bg-navy-950/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="sv-drawer-panel absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-navy-900/10 bg-parchment-50 shadow-2xl dark:border-parchment-100/10 dark:bg-navy-900">
        <header className="border-b border-navy-900/10 px-5 pb-3 pt-5 dark:border-parchment-100/10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                id="notes-drawer-title"
                className="flex items-center gap-2 font-serif text-xl text-navy-900 dark:text-parchment-50"
              >
                {activeTab === 'commentary' ? (
                  <BookIcon size={18} className="text-ember-600 dark:text-ember-300" />
                ) : (
                  <NoteIcon size={18} className="text-ember-600 dark:text-ember-300" />
                )}
                {activeTab === 'commentary' ? t('commentary.title') : t('reader.chapterNotes')}
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-900/5 dark:text-parchment-300 dark:hover:bg-parchment-100/10"
              onClick={onClose}
              aria-label={t('common.close')}
              autoFocus
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="mt-3 flex gap-1.5" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
              className={[
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                activeTab === 'notes'
                  ? 'bg-ember-600 text-white dark:bg-ember-400 dark:text-navy-950'
                  : 'bg-navy-900/5 text-navy-600 hover:text-navy-900 dark:bg-parchment-100/10 dark:text-parchment-200',
              ].join(' ')}
            >
              <NoteIcon size={13} />
              {t('commentary.tabNotes')} ({notes.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'commentary'}
              onClick={() => setActiveTab('commentary')}
              className={[
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                activeTab === 'commentary'
                  ? 'bg-ember-600 text-white dark:bg-ember-400 dark:text-navy-950'
                  : 'bg-navy-900/5 text-navy-600 hover:text-navy-900 dark:bg-parchment-100/10 dark:text-parchment-200',
              ].join(' ')}
            >
              <BookIcon size={13} />
              {t('commentary.tabHenry')}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sv-scroll">
          {activeTab === 'notes' ? (
            <NotesPanel notes={notes} onEdit={onEdit} onDelete={onDelete} onOpenVerse={onOpenVerse} />
          ) : (
            <CommentaryPanel bookNumber={bookNumber} chapter={chapter} focusVerse={focusVerse} />
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}
