import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { formatCitation, formatReference } from '@model/reference';
import type { Note } from '@model/types';
import { goToChapter } from '@controller/app.controller';
import { exportMarkdown, removeNote, sanitizeTags, updateNote } from '@controller/notes.controller';
import { useAppStore } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { PageHeader } from '@ui/components/PageHeader';
import { EmptyState } from '@ui/components/EmptyState';
import { NoteDialog } from '@ui/reader/NoteDialog';
import { NoteEditor } from '@ui/reader/NoteEditor';
import { BookmarkIcon, DownloadIcon, HighlighterIcon, NoteIcon, SearchIcon, TrashIcon } from '@ui/components/icons';

type Tab = 'notes' | 'highlights' | 'bookmarks';

export function NotesPage() {
  const state = useAppStore();
  const { t, language } = useI18n();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('notes');
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [editing, setEditing] = useState<Note | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const note of state.notes) for (const tag of note.tags) tags.add(tag);
    return [...tags].sort();
  }, [state.notes]);

  const filteredNotes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...state.notes]
      .filter((note) => {
        if (tagFilter && !note.tags.includes(tagFilter)) return false;
        if (!needle) return true;
        const reference = formatReference(note.reference, language).toLowerCase();
        return (
          note.body.toLowerCase().includes(needle) ||
          reference.includes(needle) ||
          note.tags.some((tag) => tag.includes(needle))
        );
      })
      .sort((a, b) => {
        if (a.reference.bookNumber !== b.reference.bookNumber) return a.reference.bookNumber - b.reference.bookNumber;
        if (a.reference.chapter !== b.reference.chapter) return a.reference.chapter - b.reference.chapter;
        return a.reference.verse - b.reference.verse;
      });
  }, [state.notes, query, tagFilter, language]);

  const openVerse = (note: Note): void => {
    void goToChapter(note.reference.bookNumber, note.reference.chapter);
    navigate(ROUTES.reader);
  };

  const handleDelete = (id: string): void => {
    if (window.confirm(t('notes.deleteConfirm'))) void removeNote(id);
  };

  const handleSave = (body: string, tags: readonly string[]): void => {
    if (!editing) return;
    void updateNote(editing.id, { body, tags: sanitizeTags(tags.join(',')) });
    setEditing(null);
  };

  const tabs: readonly { readonly id: Tab; readonly label: string; readonly count: number }[] = [
    { id: 'notes', label: t('notes.tabNotes'), count: state.notes.length },
    { id: 'highlights', label: t('notes.tabHighlights'), count: state.highlights.length },
    { id: 'bookmarks', label: t('notes.tabBookmarks'), count: state.bookmarks.length },
  ];

  return (
    <div>
      <PageHeader
        title={t('notes.title')}
        subtitle={t('notes.subtitle')}
        actions={
          <button type="button" className="sv-btn sv-btn-primary" onClick={exportMarkdown}>
            <DownloadIcon size={18} />
            {t('notes.exportMarkdown')}
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-1 border-b border-navy-900/10 dark:border-parchment-100/10" role="tablist">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={[
              '-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-medium transition-colors',
              tab === item.id
                ? 'border-ember-500 text-navy-900 dark:border-ember-400 dark:text-parchment-50'
                : 'border-transparent text-navy-500 hover:text-navy-800 dark:text-parchment-300/70 dark:hover:text-parchment-100',
            ].join(' ')}
          >
            {item.label}
            <span className="rounded-full bg-navy-900/5 px-1.5 py-0.5 text-[10px] dark:bg-parchment-100/10">
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {tab === 'notes' ? (
        <>
          <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="relative">
              <label htmlFor="notes-search" className="sr-only">
                {t('notes.searchPlaceholder')}
              </label>
              <SearchIcon
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 dark:text-parchment-300/50"
              />
              <input
                id="notes-search"
                className="sv-input pl-9"
                placeholder={t('notes.searchPlaceholder')}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="tag-filter" className="sr-only">
                {t('notes.filterByTag')}
              </label>
              <select
                id="tag-filter"
                className="sv-input"
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
              >
                <option value="">{t('notes.allTags')}</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <EmptyState
              icon={<NoteIcon size={30} />}
              title={t('notes.empty')}
              action={
                <button type="button" className="sv-btn sv-btn-primary" onClick={() => navigate(ROUTES.reader)}>
                  {t('dashboard.startReading')}
                </button>
              }
            />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {filteredNotes.map((note) => (
                <li key={note.id} className="sv-card flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      className="text-left text-sm font-semibold text-ember-700 hover:underline dark:text-ember-300"
                      onClick={() => openVerse(note)}
                    >
                      {formatCitation(note.reference, note.translationId, language)}
                    </button>
                    <div className="flex shrink-0">
                      <button
                        type="button"
                        className="sv-btn sv-btn-ghost min-h-9 px-2 text-xs"
                        onClick={() => setEditing(note)}
                      >
                        {t('notes.edit')}
                      </button>
                      <button
                        type="button"
                        className="sv-btn sv-btn-ghost min-h-9 px-2 text-rose-500"
                        aria-label={t('common.delete')}
                        onClick={() => handleDelete(note.id)}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-navy-800 dark:text-parchment-100">
                    {note.body}
                  </p>
                  {note.tags.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
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
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}

      {tab === 'highlights' ? (
        state.highlights.length === 0 ? (
          <EmptyState icon={<HighlighterIcon size={30} />} title={t('notes.noHighlights')} />
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {state.highlights.map((highlight) => (
              <li key={highlight.id} className="sv-card flex items-center justify-between gap-3 p-3">
                <button
                  type="button"
                  className="text-left text-sm font-medium text-navy-800 hover:underline dark:text-parchment-100"
                  onClick={() => {
                    void goToChapter(highlight.reference.bookNumber, highlight.reference.chapter);
                    navigate(ROUTES.reader);
                  }}
                >
                  {formatReference(highlight.reference, language)}
                </button>
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(--color-${highlight.color}-300)` }}
                  aria-label={highlight.color}
                />
              </li>
            ))}
          </ul>
        )
      ) : null}

      {tab === 'bookmarks' ? (
        state.bookmarks.length === 0 ? (
          <EmptyState icon={<BookmarkIcon size={30} />} title={t('notes.noBookmarks')} />
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {state.bookmarks.map((bookmark) => (
              <li key={bookmark.id} className="sv-card flex items-center justify-between gap-3 p-3">
                <button
                  type="button"
                  className="text-left text-sm font-medium text-navy-800 hover:underline dark:text-parchment-100"
                  onClick={() => {
                    void goToChapter(bookmark.reference.bookNumber, bookmark.reference.chapter);
                    navigate(ROUTES.reader);
                  }}
                >
                  {formatCitation(bookmark.reference, bookmark.translationId, language)}
                </button>
                <BookmarkIcon size={16} className="shrink-0 text-ember-500" fill="currentColor" />
              </li>
            ))}
          </ul>
        )
      ) : null}

      {editing ? (
        <NoteDialog
          title={t('notes.edit')}
          subtitle={formatCitation(editing.reference, editing.translationId, language)}
          onClose={() => setEditing(null)}
        >
          <NoteEditor
            initialBody={editing.body}
            initialTags={editing.tags}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </NoteDialog>
      ) : null}
    </div>
  );
}
