import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Note } from '@model/types';
import { useI18n } from '@ui/hooks/useI18n';
import { CloseIcon, NoteIcon } from '@ui/components/icons';
import { NotesPanel } from './NotesPanel';

interface NotesDrawerProps {
  readonly notes: readonly Note[];
  readonly onEdit: (note: Note) => void;
  readonly onDelete: (id: string) => void;
  readonly onOpenVerse: (note: Note) => void;
  readonly onClose: () => void;
}

/**
 * Panel de notas bajo demanda: no ocupa espacio de lectura hasta que se abre.
 */
export function NotesDrawer({ notes, onEdit, onDelete, onOpenVerse, onClose }: NotesDrawerProps) {
  const { t } = useI18n();

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
      <aside className="sv-drawer-panel absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-navy-900/10 bg-parchment-50 shadow-2xl dark:border-parchment-100/10 dark:bg-navy-900">
        <header className="flex items-start justify-between gap-3 border-b border-navy-900/10 p-5 dark:border-parchment-100/10">
          <div className="min-w-0">
            <h2
              id="notes-drawer-title"
              className="flex items-center gap-2 font-serif text-xl text-navy-900 dark:text-parchment-50"
            >
              <NoteIcon size={18} className="text-ember-600 dark:text-ember-300" />
              {t('reader.chapterNotes')}
            </h2>
            <p className="mt-1 text-xs text-navy-500 dark:text-parchment-300/70">
              {notes.length} {t('notes.tabNotes').toLowerCase()}
            </p>
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
        </header>

        <div className="flex-1 overflow-y-auto p-5 sv-scroll">
          <NotesPanel notes={notes} onEdit={onEdit} onDelete={onDelete} onOpenVerse={onOpenVerse} />
        </div>
      </aside>
    </div>,
    document.body,
  );
}
