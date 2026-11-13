import type { Note } from '@model/types';
import { formatReference } from '@model/reference';
import { useI18n } from '@ui/hooks/useI18n';
import { NoteIcon, TrashIcon } from '@ui/components/icons';
import { EmptyState } from '@ui/components/EmptyState';
import { LinkedScriptureText, NoteCategoryBadge } from '@ui/components/NoteCategoryBadge';

interface NotesPanelProps {
  readonly notes: readonly Note[];
  readonly onEdit: (note: Note) => void;
  readonly onDelete: (id: string) => void;
  readonly onOpenVerse: (note: Note) => void;
}

export function NotesPanel({ notes, onEdit, onDelete, onOpenVerse }: NotesPanelProps) {
  const { t, language } = useI18n();
  const sorted = [...notes].sort((a, b) => (a.reference?.verse ?? 0) - (b.reference?.verse ?? 0));

  return (
    <div>
      {sorted.length === 0 ? (
        <div className="mt-3">
          <EmptyState icon={<NoteIcon size={26} />} title={t('reader.noNotes')} />
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {sorted.map((note) => (
            <li key={note.id} className="rounded-xl border border-navy-900/10 bg-white/60 p-3 dark:border-parchment-100/10 dark:bg-navy-800/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {note.reference ? (
                  <button
                    type="button"
                    className="text-left text-xs font-semibold text-ember-700 hover:underline dark:text-ember-300"
                    onClick={() => onOpenVerse(note)}
                  >
                    {formatReference(note.reference, language)} · {note.translationId}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-navy-500 dark:text-parchment-300/70">
                    {t('notes.generalNote')}
                  </span>
                )}
                <NoteCategoryBadge category={note.category} />
              </div>
              {note.title ? (
                <p className="mt-1.5 font-serif text-sm font-semibold text-navy-900 dark:text-parchment-50">
                  {note.title}
                </p>
              ) : null}
              <LinkedScriptureText
                text={note.body}
                className="mt-2 text-sm leading-relaxed text-navy-800 dark:text-parchment-100"
              />
              {note.tags.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-navy-900/5 px-2 py-0.5 text-[10px] text-navy-500 dark:bg-parchment-100/10 dark:text-parchment-200/70"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-2 flex gap-1">
                <button type="button" className="sv-btn sv-btn-ghost min-h-9 px-2 text-xs" onClick={() => onEdit(note)}>
                  {t('notes.edit')}
                </button>
                <button
                  type="button"
                  className="sv-btn sv-btn-ghost min-h-9 px-2 text-xs text-rose-500"
                  onClick={() => onDelete(note.id)}
                  aria-label={t('common.delete')}
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
