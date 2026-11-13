import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ROUTES } from '@model/constants';
import { formatCitation, formatReference } from '@model/reference';
import { NOTE_CATEGORIES, type Note, type NoteCategory, type VerseReference } from '@model/types';
import { goToChapter } from '@controller/app.controller';
import {
  createNote,
  exportMarkdown,
  removeMemorizedVerse,
  removeNote,
  sanitizeTags,
  updateNote,
} from '@controller/notes.controller';
import { useAppStore } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { PageHeader } from '@ui/components/PageHeader';
import { EmptyState } from '@ui/components/EmptyState';
import { EditorialFade } from '@ui/components/MotionPrimitives';
import { LinkedScriptureText, NoteCategoryBadge } from '@ui/components/NoteCategoryBadge';
import { CATEGORY_STYLES } from '@ui/components/note-category-styles';
import { LampClubPanel } from '@ui/notes/LampClubPanel';
import { NoteEditor, type NoteEditorPayload } from '@ui/reader/NoteEditor';
import {
  BookIcon,
  BookmarkIcon,
  CalendarIcon,
  ChevronLeftIcon,
  DownloadIcon,
  HighlighterIcon,
  MemorizeIcon,
  NoteIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '@ui/components/icons';

type Tab = 'notes' | 'highlights' | 'bookmarks' | 'memorize';
type CategoryFilter = 'all' | NoteCategory;

export function NotesPage() {
  const state = useAppStore();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState<Tab>('notes');
  const [memorizeView, setMemorizeView] = useState<'lamp' | 'personal'>('lamp');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [editing, setEditing] = useState<Note | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const navState = location.state as { tab?: Tab; createNew?: boolean; category?: CategoryFilter } | null;
    if (!navState) return;
    if (navState.tab) setTab(navState.tab);
    if (navState.category) setCategoryFilter(navState.category);
    if (navState.createNew) {
      setTab('notes');
      setCreating(true);
    }
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const note of state.notes) for (const tag of note.tags) tags.add(tag);
    return [...tags].sort();
  }, [state.notes]);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      all: state.notes.length,
      verse: 0,
      sermon: 0,
      study: 0,
      seminar: 0,
      devotional: 0,
    };
    for (const note of state.notes) {
      const cat = note.category ?? 'verse';
      counts[cat] += 1;
    }
    return counts;
  }, [state.notes]);

  const filteredNotes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...state.notes]
      .filter((note) => {
        const cat = note.category ?? 'verse';
        if (categoryFilter !== 'all' && cat !== categoryFilter) return false;
        if (tagFilter && !note.tags.includes(tagFilter)) return false;
        if (!needle) return true;
        const reference = note.reference ? formatReference(note.reference, language).toLowerCase() : '';
        return (
          note.body.toLowerCase().includes(needle) ||
          (note.title?.toLowerCase().includes(needle) ?? false) ||
          (note.speaker?.toLowerCase().includes(needle) ?? false) ||
          reference.includes(needle) ||
          note.tags.some((tag) => tag.includes(needle))
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [state.notes, categoryFilter, query, tagFilter, language]);

  const sortedMemorized = useMemo(
    () =>
      [...state.memorizedVerses].sort((a, b) => {
        if (a.reference.bookNumber !== b.reference.bookNumber) return a.reference.bookNumber - b.reference.bookNumber;
        if (a.reference.chapter !== b.reference.chapter) return a.reference.chapter - b.reference.chapter;
        return a.reference.verse - b.reference.verse;
      }),
    [state.memorizedVerses],
  );

  const openReference = (reference: VerseReference): void => {
    void goToChapter(reference.bookNumber, reference.chapter);
    navigate(ROUTES.reader, { state: { verse: reference.verse } });
  };

  const handleDelete = (id: string): void => {
    if (window.confirm(t('notes.deleteConfirm'))) void removeNote(id);
  };

  const handleSaveEdit = (payload: NoteEditorPayload): void => {
    if (!editing) return;
    void updateNote(editing.id, {
      category: payload.category,
      title: payload.title,
      speaker: payload.speaker,
      eventDate: payload.eventDate,
      reference: payload.reference,
      body: payload.body,
      tags: sanitizeTags(payload.tags.join(',')),
    });
    setEditing(null);
  };

  const handleCreateNew = (payload: NoteEditorPayload): void => {
    void createNote({
      category: payload.category,
      ...(payload.title ? { title: payload.title } : {}),
      ...(payload.speaker ? { speaker: payload.speaker } : {}),
      ...(payload.eventDate ? { eventDate: payload.eventDate } : {}),
      ...(payload.reference ? { reference: payload.reference } : {}),
      translationId: state.preferences.activeTranslation,
      body: payload.body,
      tags: sanitizeTags(payload.tags.join(',')),
    });
    setCreating(false);
  };

  const tabs: readonly { readonly id: Tab; readonly label: string; readonly count: number }[] = [
    { id: 'notes', label: t('notes.tabNotes'), count: state.notes.length },
    { id: 'highlights', label: t('notes.tabHighlights'), count: state.highlights.length },
    { id: 'bookmarks', label: t('notes.tabBookmarks'), count: state.bookmarks.length },
    { id: 'memorize', label: t('notes.tabMemorize'), count: state.lampClub.length + state.memorizedVerses.length },
  ];

  if (editing || creating) {
    const isEditing = editing !== null;
    const subtitle =
      editing?.reference ? formatCitation(editing.reference, editing.translationId, language) : undefined;

    return (
      <EditorialFade>
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-navy-900/10 pb-4 dark:border-parchment-100/10">
            <div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                }}
                className="sv-btn sv-btn-ghost -ml-2 mb-1 min-h-9 px-2 text-xs font-medium text-navy-600 dark:text-parchment-200/80"
              >
                <ChevronLeftIcon size={16} />
                {t('notes.backToList')}
              </button>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-navy-900 dark:text-parchment-50 sm:text-3xl">
                {isEditing ? t('notes.edit') : t('notes.newNote')}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-navy-500 dark:text-parchment-300/75">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <div className="sv-card p-6 sm:p-8">
            <NoteEditor
              key={editing ? `edit-${editing.id}` : 'create-note'}
              expanded
              initialCategory={editing?.category ?? 'sermon'}
              initialTitle={editing?.title ?? ''}
              initialSpeaker={editing?.speaker ?? ''}
              initialBody={editing?.body ?? ''}
              initialTags={editing?.tags ?? []}
              allowReferenceInput
              {...(editing?.eventDate ? { initialDate: editing.eventDate } : {})}
              {...(editing?.reference ? { initialReference: editing.reference } : {})}
              onSave={isEditing ? handleSaveEdit : handleCreateNew}
              onCancel={() => {
                setEditing(null);
                setCreating(false);
              }}
            />
          </div>
        </div>
      </EditorialFade>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('notes.title')}
        subtitle={t('notes.subtitle')}
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="sv-btn sv-btn-primary"
              onClick={() => {
                setTab('notes');
                setCreating(true);
              }}
            >
              <PlusIcon size={18} />
              {t('notes.newNote')}
            </button>
            <button
              type="button"
              className="sv-btn sv-btn-ghost border border-navy-900/15 dark:border-parchment-100/15"
              onClick={exportMarkdown}
            >
              <DownloadIcon size={18} />
              {t('notes.exportMarkdown')}
            </button>
          </div>
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
              'relative -mb-px inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium transition-colors',
              tab === item.id
                ? 'text-navy-900 dark:text-parchment-50'
                : 'text-navy-500 hover:text-navy-800 dark:text-parchment-300/70 dark:hover:text-parchment-100',
            ].join(' ')}
          >
            {item.label}
            <span className="rounded-full bg-navy-900/5 px-1.5 py-0.5 font-mono text-[10px] dark:bg-parchment-100/10">
              {item.count}
            </span>
            {tab === item.id ? (
              <motion.span
                layoutId="notes-tab-underline"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-ember-600 dark:bg-ember-400"
              />
            ) : null}
          </button>
        ))}
      </div>

      {tab === 'notes' ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={[
                'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors',
                categoryFilter === 'all'
                  ? 'border-ember-500 bg-ember-500/15 text-navy-900 dark:text-parchment-50'
                  : 'border-navy-900/10 text-navy-600 hover:bg-navy-900/5 dark:border-parchment-100/10 dark:text-parchment-200/80',
              ].join(' ')}
            >
              {t('notes.allCategories')} ({categoryCounts.all})
            </button>
            {NOTE_CATEGORIES.map((cat) => {
              const style = CATEGORY_STYLES[cat];
              const Icon = style.Icon;
              const selected = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={[
                    'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors',
                    selected
                      ? `${style.badge} ring-1 ring-ember-500/30`
                      : 'border-navy-900/10 text-navy-600 hover:bg-navy-900/5 dark:border-parchment-100/10 dark:text-parchment-200/80',
                  ].join(' ')}
                >
                  <Icon size={13} />
                  {t(`notes.category.${cat}`)} ({categoryCounts[cat]})
                </button>
              );
            })}
          </div>

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
                <div className="flex flex-wrap justify-center gap-2">
                  <button type="button" className="sv-btn sv-btn-primary" onClick={() => setCreating(true)}>
                    <PlusIcon size={16} />
                    {t('notes.newNote')}
                  </button>
                  <button
                    type="button"
                    className="sv-btn sv-btn-ghost border border-navy-900/15 dark:border-parchment-100/15"
                    onClick={() => navigate(ROUTES.reader)}
                  >
                    {t('dashboard.startReading')}
                  </button>
                </div>
              }
            />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {filteredNotes.map((note) => {
                const cat = note.category ?? 'verse';
                const catStyle = CATEGORY_STYLES[cat];
                return (
                  <li key={note.id} className={`sv-card-interactive flex flex-col border-l-4 p-4 ${catStyle.border}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <NoteCategoryBadge category={cat} />
                        {note.reference ? (
                          <button
                            type="button"
                            className="text-left text-xs font-semibold text-ember-700 hover:underline dark:text-ember-300"
                            onClick={() => {
                              if (note.reference) openReference(note.reference);
                            }}
                          >
                            {formatCitation(note.reference, note.translationId, language)}
                          </button>
                        ) : null}
                      </div>

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

                    {note.title ? (
                      <h3 className="mt-2 font-serif text-lg font-medium text-navy-900 dark:text-parchment-50">
                        {note.title}
                      </h3>
                    ) : null}

                    {note.speaker || note.eventDate ? (
                      <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-navy-500 dark:text-parchment-300/70">
                        {note.speaker ? <span>{note.speaker}</span> : null}
                        {note.eventDate ? (
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {note.eventDate}
                          </span>
                        ) : null}
                      </p>
                    ) : null}

                    <LinkedScriptureText
                      text={note.body}
                      className="mt-2.5 flex-1 text-sm leading-relaxed text-navy-800 dark:text-parchment-100"
                    />

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
                );
              })}
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
                  onClick={() => openReference(highlight.reference)}
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
                  onClick={() => openReference(bookmark.reference)}
                >
                  {formatCitation(bookmark.reference, bookmark.translationId, language)}
                </button>
                <BookmarkIcon size={16} className="shrink-0 text-ember-500" fill="currentColor" />
              </li>
            ))}
          </ul>
        )
      ) : null}

      {tab === 'memorize' ? (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMemorizeView('lamp')}
              className={`sv-btn border text-xs ${
                memorizeView === 'lamp'
                  ? 'border-ember-500 bg-ember-500/15 text-navy-900 dark:text-parchment-50'
                  : 'border-navy-900/15 text-navy-600 dark:border-parchment-100/15 dark:text-parchment-200'
              }`}
            >
              <MemorizeIcon size={15} />
              {t('lamp.title')} ({state.lampClub.length}/48)
            </button>
            <button
              type="button"
              onClick={() => setMemorizeView('personal')}
              className={`sv-btn border text-xs ${
                memorizeView === 'personal'
                  ? 'border-ember-500 bg-ember-500/15 text-navy-900 dark:text-parchment-50'
                  : 'border-navy-900/15 text-navy-600 dark:border-parchment-100/15 dark:text-parchment-200'
              }`}
            >
              <BookIcon size={15} />
              {t('lamp.myVerses')} ({state.memorizedVerses.length})
            </button>
          </div>

          {memorizeView === 'lamp' ? (
            <LampClubPanel />
          ) : sortedMemorized.length === 0 ? (
            <EmptyState
              icon={<MemorizeIcon size={30} />}
              title={t('notes.noMemorized')}
              body={t('notes.memorizeHint')}
              action={
                <button type="button" className="sv-btn sv-btn-primary" onClick={() => navigate(ROUTES.reader)}>
                  {t('dashboard.startReading')}
                </button>
              }
            />
          ) : (
            <ul className="grid items-stretch gap-4 lg:grid-cols-2">
              {sortedMemorized.map((item) => (
                <li key={item.id} className="sv-card flex flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        type="button"
                        className="text-left text-sm font-semibold text-ember-700 hover:underline dark:text-ember-300"
                        onClick={() => openReference(item.reference)}
                      >
                        {formatCitation(item.reference, item.translationId, language)}
                      </button>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-400 dark:text-parchment-300/60">
                        {item.translationId}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="sv-btn sv-btn-ghost min-h-9 shrink-0 px-2 text-rose-500"
                      aria-label={t('reader.unmemorize')}
                      title={t('reader.unmemorize')}
                      onClick={() => void removeMemorizedVerse(item.id)}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>

                  <p className="sv-scripture mt-3 flex-1 text-navy-900 dark:text-parchment-50">{item.text}</p>

                  <button
                    type="button"
                    className="sv-btn sv-btn-ghost mt-3 min-h-9 self-start px-2 text-xs"
                    onClick={() => openReference(item.reference)}
                  >
                    <BookIcon size={14} />
                    {t('notes.openInReader')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
