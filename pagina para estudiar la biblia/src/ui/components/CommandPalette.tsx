import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { formatReference, parseReferenceInput } from '@model/reference';
import { goToChapter } from '@controller/app.controller';
import { getEffectiveSongs } from '@controller/music.controller';
import { useAppStore } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { BookIcon, HomeIcon, MicIcon, MusicIcon, NoteIcon, SearchIcon, SettingsIcon, UploadIcon } from './icons';

interface CommandPaletteProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const state = useAppStore();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const parsedRef = useMemo(() => parseReferenceInput(query), [query]);
  const allSongs = useMemo(() => getEffectiveSongs(state.songs), [state.songs]);

  const needle = query.trim().toLowerCase();

  const matchingSongs = useMemo(() => {
    if (!needle) return allSongs.slice(0, 3);
    return allSongs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(needle) ||
          song.artist.toLowerCase().includes(needle) ||
          song.originalKey.toLowerCase() === needle,
      )
      .slice(0, 5);
  }, [allSongs, needle]);

  const matchingNotes = useMemo(() => {
    if (!needle) return state.notes.slice(0, 3);
    return state.notes
      .filter(
        (note) =>
          (note.title?.toLowerCase().includes(needle) ?? false) ||
          (note.speaker?.toLowerCase().includes(needle) ?? false) ||
          note.body.toLowerCase().includes(needle) ||
          (note.reference ? formatReference(note.reference, language).toLowerCase().includes(needle) : false),
      )
      .slice(0, 5);
  }, [state.notes, needle, language]);

  const pages = useMemo(
    () =>
      [
        { label: t('nav.home'), to: ROUTES.dashboard, Icon: HomeIcon },
        { label: t('nav.reader'), to: ROUTES.reader, Icon: BookIcon },
        { label: t('nav.notes'), to: ROUTES.notes, Icon: NoteIcon },
        { label: t('nav.music'), to: ROUTES.music, Icon: MusicIcon },
        { label: t('nav.import'), to: ROUTES.import, Icon: UploadIcon },
        { label: t('nav.settings'), to: ROUTES.settings, Icon: SettingsIcon },
      ].filter((item) => !needle || item.label.toLowerCase().includes(needle)),
    [t, needle],
  );

  if (!open) return null;

  const jumpToRef = (): void => {
    if (!parsedRef) return;
    void goToChapter(parsedRef.bookNumber, parsedRef.chapter);
    navigate(ROUTES.reader, { state: { verse: parsedRef.verse } });
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-navy-950/60 p-4 pt-16 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.quickSearch')}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sv-dialog-panel w-full max-w-xl overflow-hidden rounded-2xl border border-navy-900/15 bg-parchment-50 shadow-2xl dark:border-parchment-100/15 dark:bg-navy-900">
        <div className="flex items-center gap-3 border-b border-navy-900/10 px-4 py-3 dark:border-parchment-100/10">
          <SearchIcon size={18} className="shrink-0 text-ember-600 dark:text-ember-400" />
          <input
            ref={inputRef}
            className="w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-navy-400 dark:text-parchment-50 dark:placeholder:text-parchment-300/50"
            placeholder={t('cmd.placeholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && parsedRef) {
                event.preventDefault();
                jumpToRef();
              }
            }}
          />
          <kbd className="hidden rounded border border-navy-900/15 px-1.5 py-0.5 text-[10px] font-semibold text-navy-400 sm:inline dark:border-parchment-100/15 dark:text-parchment-300/60">
            ESC
          </kbd>
        </div>

        <div className="max-h-[65dvh] space-y-4 overflow-y-auto p-3 sv-scroll">
          {parsedRef ? (
            <div>
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-600 dark:text-ember-300">
                {t('cmd.jumpBible')}
              </p>
              <button
                type="button"
                onClick={jumpToRef}
                className="flex w-full items-center gap-3 rounded-xl bg-ember-500/10 px-3 py-2.5 text-left text-sm font-medium text-navy-900 transition-colors hover:bg-ember-500/20 dark:text-parchment-50"
              >
                <BookIcon size={16} className="text-ember-600 dark:text-ember-300" />
                <span>{formatReference(parsedRef, language)}</span>
              </button>
            </div>
          ) : null}

          <div>
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-400 dark:text-parchment-300/50">
              {t('cmd.actions')}
            </p>
            <button
              type="button"
              onClick={() => {
                navigate(ROUTES.notes, { state: { createNew: true } });
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-navy-700 transition-colors hover:bg-navy-900/5 dark:text-parchment-200 dark:hover:bg-parchment-100/10"
            >
              <MicIcon size={16} className="text-sky-600 dark:text-sky-300" />
              <span>{t('cmd.newSermonNote')}</span>
            </button>
          </div>

          {pages.length > 0 ? (
            <div>
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-400 dark:text-parchment-300/50">
                {t('cmd.pages')}
              </p>
              <div className="grid gap-1 sm:grid-cols-2">
                {pages.map(({ label, to, Icon }) => (
                  <button
                    key={to}
                    type="button"
                    onClick={() => {
                      navigate(to);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-navy-700 transition-colors hover:bg-navy-900/5 dark:text-parchment-200 dark:hover:bg-parchment-100/10"
                  >
                    <Icon size={15} className="opacity-75" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {matchingSongs.length > 0 ? (
            <div>
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-400 dark:text-parchment-300/50">
                {t('cmd.songs')}
              </p>
              <div className="space-y-1">
                {matchingSongs.map((song) => (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => {
                      navigate(ROUTES.music, { state: { songId: song.id } });
                      onClose();
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-navy-700 transition-colors hover:bg-navy-900/5 dark:text-parchment-200 dark:hover:bg-parchment-100/10"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <MusicIcon size={15} className="shrink-0 text-ember-500" />
                      <span className="truncate font-medium">{song.title}</span>
                      <span className="truncate text-xs opacity-60">· {song.artist}</span>
                    </span>
                    <span className="sv-chord-badge shrink-0">{song.originalKey}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {matchingNotes.length > 0 ? (
            <div>
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-400 dark:text-parchment-300/50">
                {t('cmd.notes')}
              </p>
              <div className="space-y-1">
                {matchingNotes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => {
                      navigate(ROUTES.notes);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-navy-700 transition-colors hover:bg-navy-900/5 dark:text-parchment-200 dark:hover:bg-parchment-100/10"
                  >
                    <span className="truncate">
                      {note.title ||
                        (note.reference ? formatReference(note.reference, language) : note.body.slice(0, 48))}
                    </span>
                    <span className="shrink-0 text-[10px] uppercase opacity-60">
                      {t(`notes.category.${note.category ?? 'verse'}`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {!parsedRef && pages.length === 0 && matchingSongs.length === 0 && matchingNotes.length === 0 ? (
            <p className="py-6 text-center text-sm text-navy-500 dark:text-parchment-300/60">{t('cmd.empty')}</p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
