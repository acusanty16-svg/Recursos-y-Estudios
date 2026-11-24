import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import type { Note } from '@model/types';
import { useI18n } from '@ui/hooks/useI18n';
import { BookIcon, CloseIcon, NoteIcon } from '@ui/components/icons';
import { TabHighlightPill } from '@ui/components/MotionPrimitives';
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
 * Usa física spring interrumpible y permite deslizar a la derecha para cerrar en táctil.
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-navy-950/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.34 }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0 }}
        dragElastic={{ left: 0.04, right: 0.35 }}
        onDragEnd={(_event, info) => {
          if (info.offset.x > 110 || info.velocity.x > 450) {
            onClose();
          }
        }}
        className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-navy-900/10 bg-parchment-50 shadow-2xl dark:border-parchment-100/10 dark:bg-navy-900"
      >
        <header className="border-b border-navy-900/10 bg-parchment-50/90 px-5 pb-3 pt-5 backdrop-blur-md dark:border-parchment-100/10 dark:bg-navy-900/90">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                id="notes-drawer-title"
                className="flex items-center gap-2 font-serif text-xl text-navy-900 dark:text-parchment-50"
              >
                {activeTab === 'commentary' ? (
                  <BookIcon size={18} className="text-ember-600 dark:text-ember-300" aria-hidden="true" />
                ) : (
                  <NoteIcon size={18} className="text-ember-600 dark:text-ember-300" aria-hidden="true" />
                )}
                {activeTab === 'commentary' ? t('commentary.title') : t('reader.chapterNotes')}
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-lg text-navy-500 hover:bg-navy-900/5 dark:text-parchment-300 dark:hover:bg-parchment-100/10"
              onClick={onClose}
              aria-label={t('common.close')}
            >
              <CloseIcon size={18} aria-hidden="true" />
            </button>
          </div>

          <div
            className="mt-3 inline-flex gap-1 rounded-xl border border-navy-900/10 bg-parchment-200/55 p-1 dark:border-parchment-100/10 dark:bg-navy-950/50"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
              className={[
                'relative z-10 inline-flex min-h-9 touch-manipulation items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                activeTab === 'notes'
                  ? 'text-white dark:text-navy-950'
                  : 'text-navy-600 hover:text-navy-900 dark:text-parchment-200',
              ].join(' ')}
            >
              {activeTab === 'notes' ? (
                <TabHighlightPill
                  layoutId="drawer-tab-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-ember-600 shadow-xs dark:bg-ember-400"
                />
              ) : null}
              <NoteIcon size={13} aria-hidden="true" />
              <span className="tabular-nums">
                {t('commentary.tabNotes')} ({notes.length})
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'commentary'}
              onClick={() => setActiveTab('commentary')}
              className={[
                'relative z-10 inline-flex min-h-9 touch-manipulation items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                activeTab === 'commentary'
                  ? 'text-white dark:text-navy-950'
                  : 'text-navy-600 hover:text-navy-900 dark:text-parchment-200',
              ].join(' ')}
            >
              {activeTab === 'commentary' ? (
                <TabHighlightPill
                  layoutId="drawer-tab-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-ember-600 shadow-xs dark:bg-ember-400"
                />
              ) : null}
              <BookIcon size={13} aria-hidden="true" />
              {t('commentary.tabHenry')}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sv-scroll">
          {activeTab === 'notes' ? (
            <NotesPanel notes={notes} onEdit={onEdit} onDelete={onDelete} onOpenVerse={onOpenVerse} />
          ) : (
            <CommentaryPanel bookNumber={bookNumber} chapter={chapter} focusVerse={focusVerse} />
          )}
        </div>
      </motion.aside>
    </div>,
    document.body,
  );
}
