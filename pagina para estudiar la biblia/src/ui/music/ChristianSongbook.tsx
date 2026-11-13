import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { parseReferenceInput } from '@model/reference';
import { SONG_CATEGORIES, type Song, type SongCategory } from '@model/types';
import {
  extractUniqueChords,
  getChordVoicings,
  getVoicingMidiNotes,
  parseSongContent,
  suggestCapoOptions,
  transposeKeyName,
} from '@model/music';
import { deleteSong, getEffectiveSongs, saveSong } from '@controller/music.controller';
import { goToChapter } from '@controller/app.controller';
import { strumGuitarChord } from '@controller/guitar-audio.service';
import {
  startMetronome,
  stopMetronome,
  syncMetronomeToSong,
  useMetronomeState,
} from '@controller/metronome.service';
import { useAppStore } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { Dialog } from '@ui/components/Dialog';
import { ChordDiagram } from './ChordDiagram';
import {
  BookIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MusicIcon,
  NoteIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '@ui/components/icons';

const SETLIST_STORAGE_KEY = 'sv.songSetlist.v1';

function loadSetlistIds(): string[] {
  try {
    const raw = window.localStorage.getItem(SETLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function saveSetlistIds(ids: readonly string[]): void {
  try {
    window.localStorage.setItem(SETLIST_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignorar errores de cuota de almacenamiento
  }
}

interface SongFormState {
  readonly id?: string | undefined;
  readonly title: string;
  readonly artist: string;
  readonly originalKey: string;
  readonly category: SongCategory;
  readonly capo: string;
  readonly bpm: string;
  readonly timeSignature: string;
  readonly bibleReference: string;
  readonly content: string;
  readonly notes: string;
}

function emptyFormState(): SongFormState {
  return {
    title: '',
    artist: '',
    originalKey: 'G',
    category: 'adoracion',
    capo: '',
    bpm: '',
    timeSignature: '4/4',
    bibleReference: '',
    content: '',
    notes: '',
  };
}

function songToFormState(song: Song): SongFormState {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    originalKey: song.originalKey,
    category: song.category,
    capo: song.capo ? String(song.capo) : '',
    bpm: song.bpm ? String(song.bpm) : '',
    timeSignature: song.timeSignature ?? '4/4',
    bibleReference: song.bibleReference ?? '',
    content: song.content,
    notes: song.notes ?? '',
  };
}

interface ChristianSongbookProps {
  readonly initialSongId?: string | undefined;
}

/**
 * Almacén de Canciones Cristianas estilo LaCuerda.net:
 * - Acordes renderizados encima de la letra (soporta pegado LaCuerda.net y [Acorde]).
 * - Transporte en vivo de tono + sugerencias de Capo + diagramas interactivos + auto-scroll.
 * - Persistencia en IndexedDB y sincronización con Google Drive.
 */
export function ChristianSongbook({ initialSongId }: ChristianSongbookProps) {
  const { songs: userSongs } = useAppStore();
  const { t, language } = useI18n();
  const metro = useMetronomeState();
  const navigate = useNavigate();

  const songs = useMemo(() => getEffectiveSongs(userSongs), [userSongs]);

  const [selectedId, setSelectedId] = useState<string>(() => initialSongId ?? songs[0]?.id ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SongCategory | 'all'>('all');
  const [catalogView, setCatalogView] = useState<'all' | 'setlist'>('all');
  const [setlistIds, setSetlistIds] = useState<string[]>(() => loadSetlistIds());
  const [lecternMode, setLecternMode] = useState(false);
  const [semitones, setSemitones] = useState(0);
  const [inspectedChord, setInspectedChord] = useState<string | null>(null);
  const [showChordStrip, setShowChordStrip] = useState(true);

  // Auto-scroll
  const [scrolling, setScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Formularios y confirmación de borrado
  const [formState, setFormState] = useState<SongFormState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Song | null>(null);

  useEffect(() => {
    if (initialSongId && songs.some((s) => s.id === initialSongId)) {
      setSelectedId(initialSongId);
      setSemitones(0);
      setInspectedChord(null);
    }
  }, [initialSongId, songs]);

  const filteredSongs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return songs.filter((song) => {
      if (categoryFilter !== 'all' && song.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.originalKey.toLowerCase().includes(q) ||
        (song.bibleReference?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [songs, searchQuery, categoryFilter]);

  const songMap = useMemo(() => new Map(songs.map((s) => [s.id, s])), [songs]);

  const setlistSongs = useMemo(
    () => setlistIds.map((id) => songMap.get(id)).filter((s): s is Song => s !== undefined),
    [setlistIds, songMap],
  );

  const activeSong = useMemo(
    () => songs.find((s) => s.id === selectedId) ?? filteredSongs[0] ?? songs[0] ?? null,
    [songs, filteredSongs, selectedId],
  );

  const setlistIndex = activeSong ? setlistIds.indexOf(activeSong.id) : -1;
  const inSetlist = setlistIndex !== -1;
  const prevSetlistSong = setlistIndex > 0 ? (songMap.get(setlistIds[setlistIndex - 1] ?? '') ?? null) : null;
  const nextSetlistSong =
    setlistIndex >= 0 && setlistIndex < setlistIds.length - 1
      ? (songMap.get(setlistIds[setlistIndex + 1] ?? '') ?? null)
      : null;

  const updateSetlist = (nextIds: string[]): void => {
    setSetlistIds(nextIds);
    saveSetlistIds(nextIds);
  };

  const toggleSetlistSong = (id: string): void => {
    updateSetlist(setlistIds.includes(id) ? setlistIds.filter((item) => item !== id) : [...setlistIds, id]);
  };

  const moveSetlistSong = (id: string, delta: -1 | 1): void => {
    const idx = setlistIds.indexOf(id);
    const targetIdx = idx + delta;
    if (idx === -1 || targetIdx < 0 || targetIdx >= setlistIds.length) return;
    const copy = [...setlistIds];
    const current = copy[idx];
    const swapped = copy[targetIdx];
    if (!current || !swapped) return;
    copy[idx] = swapped;
    copy[targetIdx] = current;
    updateSetlist(copy);
  };

  useEffect(() => {
    if (!scrolling) return;
    const interval = window.setInterval(() => {
      if (sheetRef.current) {
        sheetRef.current.scrollBy({ top: scrollSpeed, behavior: 'auto' });
      }
      window.scrollBy({ top: scrollSpeed * 0.65, behavior: 'auto' });
    }, 60);
    return () => window.clearInterval(interval);
  }, [scrolling, scrollSpeed]);

  const currentKey = useMemo(
    () => (activeSong ? transposeKeyName(activeSong.originalKey, semitones) : 'C'),
    [activeSong, semitones],
  );

  const parsedLines = useMemo(
    () => (activeSong ? parseSongContent(activeSong.content, semitones, currentKey) : []),
    [activeSong, semitones, currentKey],
  );

  const uniqueChords = useMemo(
    () => (activeSong ? extractUniqueChords(activeSong.content, semitones, currentKey) : []),
    [activeSong, semitones, currentKey],
  );

  const capoOptions = useMemo(() => suggestCapoOptions(currentKey), [currentKey]);

  const handleSelectSong = (song: Song): void => {
    setSelectedId(song.id);
    setSemitones(0);
    setInspectedChord(null);
    setScrolling(false);
  };

  const handleChordClick = (chord: string): void => {
    const voicings = getChordVoicings(chord);
    const first = voicings[0];
    if (first) strumGuitarChord(getVoicingMidiNotes(first));
    setInspectedChord((prev) => (prev === chord ? null : chord));
  };

  const handleOpenBibleReference = (refText: string): void => {
    const ref = parseReferenceInput(refText);
    if (!ref) return;
    void goToChapter(ref.bookNumber, ref.chapter);
    navigate(ROUTES.reader, { state: { verse: ref.verse } });
  };

  const handleSaveForm = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!formState || !formState.title.trim() || !formState.content.trim()) return;
    const capoNum = Number(formState.capo);
    const bpmNum = Number(formState.bpm);
    const saved = await saveSong({
      ...(formState.id ? { id: formState.id } : {}),
      title: formState.title,
      artist: formState.artist,
      originalKey: formState.originalKey,
      category: formState.category,
      ...(Number.isFinite(capoNum) && capoNum > 0 ? { capo: capoNum } : {}),
      ...(Number.isFinite(bpmNum) && bpmNum > 0 ? { bpm: bpmNum } : {}),
      ...(formState.timeSignature.trim() ? { timeSignature: formState.timeSignature } : {}),
      ...(formState.bibleReference.trim() ? { bibleReference: formState.bibleReference } : {}),
      content: formState.content,
      ...(formState.notes.trim() ? { notes: formState.notes } : {}),
    });
    setSelectedId(saved.id);
    setSemitones(0);
    setFormState(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!confirmDelete) return;
    const deletedId = confirmDelete.id;
    await deleteSong(deletedId);
    if (setlistIds.includes(deletedId)) {
      updateSetlist(setlistIds.filter((id) => id !== deletedId));
    }
    setConfirmDelete(null);
    if (selectedId === deletedId) {
      const next = songs.find((item) => item.id !== deletedId);
      setSelectedId(next?.id ?? '');
    }
  };

  const inspectedVoicings = useMemo(
    () => (inspectedChord ? getChordVoicings(inspectedChord) : []),
    [inspectedChord],
  );

  return (
    <div className="space-y-4">
      <div className={lecternMode ? 'grid grid-cols-1 gap-5' : 'grid gap-5 lg:grid-cols-[300px_1fr]'}>
        {/* Columna izquierda: Catálogo y Setlist */}
        {!lecternMode && (
          <aside className="sv-card flex flex-col gap-3 p-4 lg:max-h-[calc(100vh-14rem)]">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-0.5">
                <button
                  type="button"
                  onClick={() => setCatalogView('all')}
                  className={[
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition',
                    catalogView === 'all'
                      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]',
                  ].join(' ')}
                >
                  {t('music.allSongs')} ({filteredSongs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogView('setlist')}
                  className={[
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition',
                    catalogView === 'setlist'
                      ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]',
                  ].join(' ')}
                >
                  {t('music.setlist')} ({setlistSongs.length})
                </button>
              </div>
              <button
                type="button"
                onClick={() => setFormState(emptyFormState())}
                className="sv-btn sv-btn-primary text-xs"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                {t('music.addSong')}
              </button>
            </div>

            {catalogView === 'all' ? (
              <>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('music.searchSongs')}
                    className="sv-input w-full py-2 pl-8 text-xs"
                  />
                </div>

                {/* Filtros de categoría */}
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={[
                      'rounded-full px-2.5 py-1 text-[11px] font-medium transition',
                      categoryFilter === 'all'
                        ? 'bg-[var(--accent)] text-[#FBF9F2]'
                        : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]',
                    ].join(' ')}
                  >
                    {t('notes.allCategories')}
                  </button>
                  {SONG_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={[
                        'rounded-full px-2.5 py-1 text-[11px] font-medium transition',
                        categoryFilter === cat
                          ? 'bg-[var(--accent)] text-[#FBF9F2]'
                          : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]',
                      ].join(' ')}
                    >
                      {t(`music.cat.${cat}`)}
                    </button>
                  ))}
                </div>

                {/* Lista de canciones */}
                <ul className="space-y-1.5 overflow-y-auto pr-1">
                  {filteredSongs.map((song) => {
                    const active = activeSong?.id === song.id;
                    return (
                      <li key={song.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectSong(song)}
                          className={[
                            'flex w-full items-start justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition',
                            active
                              ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                              : 'border-transparent bg-[var(--surface-2)]/65 hover:border-[var(--border)]',
                          ].join(' ')}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-[var(--ink)]">{song.title}</div>
                            <div className="truncate text-xs text-[var(--muted)]">{song.artist}</div>
                          </div>
                          <span className="shrink-0 rounded-md bg-[var(--surface)] px-2 py-0.5 font-mono text-xs font-bold text-[var(--accent)]">
                            {song.originalKey}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {filteredSongs.length === 0 && (
                    <li className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--muted)]">
                      {language === 'es' ? 'No hay canciones que coincidan.' : 'No matching songs.'}
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <ul className="space-y-1.5 overflow-y-auto pr-1">
                {setlistSongs.map((song, idx) => {
                  const active = activeSong?.id === song.id;
                  return (
                    <li
                      key={song.id}
                      className={[
                        'flex items-center gap-2 rounded-xl border px-2.5 py-2 transition',
                        active
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                          : 'border-transparent bg-[var(--surface-2)]/65 hover:border-[var(--border)]',
                      ].join(' ')}
                    >
                      <span className="w-4 shrink-0 text-center font-mono text-[11px] font-bold text-[var(--muted)]">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectSong(song)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="truncate text-sm font-semibold text-[var(--ink)]">{song.title}</div>
                        <div className="truncate text-[11px] text-[var(--muted)]">
                          {song.artist} · {song.originalKey}
                        </div>
                      </button>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveSetlistSong(song.id, -1)}
                          disabled={idx === 0}
                          aria-label="Subir"
                          className="rounded px-1.5 py-1 text-xs text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)] disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSetlistSong(song.id, 1)}
                          disabled={idx === setlistSongs.length - 1}
                          aria-label="Bajar"
                          className="rounded px-1.5 py-1 text-xs text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)] disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSetlistSong(song.id)}
                          aria-label={t('common.delete')}
                          className="rounded p-1 text-[var(--muted)] hover:bg-rose-500/10 hover:text-rose-500"
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
                {setlistSongs.length === 0 && (
                  <li className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-xs leading-relaxed text-[var(--muted)]">
                    {t('music.setlistEmpty')}
                  </li>
                )}
              </ul>
            )}
          </aside>
        )}

        {/* Columna derecha: Hoja de acordes estilo LaCuerda.net */}
        <section className="sv-card min-w-0 p-5 sm:p-6">
          {!activeSong ? (
            <div className="py-16 text-center text-sm text-[var(--muted)]">
              <MusicIcon className="mx-auto mb-3 h-9 w-9 opacity-40" />
              {t('music.songbookTitle')}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Cabecera de la canción */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--accent)]/12 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
                      {t(`music.cat.${activeSong.category}`)}
                    </span>
                    {activeSong.bpm && (
                      <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]">
                        {activeSong.bpm} BPM
                      </span>
                    )}
                    {activeSong.timeSignature && (
                      <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]">
                        {activeSong.timeSignature}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-[var(--ink)]">{activeSong.title}</h2>
                  <p className="text-sm text-[var(--muted)]">{activeSong.artist}</p>
                  {activeSong.bibleReference && (
                    <button
                      type="button"
                      onClick={() => handleOpenBibleReference(activeSong.bibleReference ?? '')}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      <BookIcon className="h-3.5 w-3.5" />
                      {activeSong.bibleReference}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSetlistSong(activeSong.id)}
                    className={[
                      'sv-btn text-xs',
                      inSetlist
                        ? 'border border-[var(--accent)]/40 bg-[var(--accent)]/12 text-[var(--accent)]'
                        : 'sv-btn-ghost border border-[var(--border)]',
                    ].join(' ')}
                  >
                    {inSetlist ? t('music.inSetlist') : `+ ${t('music.addToSetlist')}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLecternMode((prev) => !prev)}
                    className={[
                      'sv-btn text-xs',
                      lecternMode
                        ? 'sv-btn-primary'
                        : 'sv-btn-ghost border border-[var(--border)]',
                    ].join(' ')}
                  >
                    {lecternMode ? t('music.exitLectern') : t('music.lecternMode')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormState(songToFormState(activeSong))}
                    className="sv-btn sv-btn-ghost border border-[var(--border)] text-xs"
                  >
                    <NoteIcon className="h-3.5 w-3.5" />
                    {t('music.editSong')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(activeSong)}
                    className="sv-btn sv-btn-ghost border border-[var(--border)] text-xs text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                    aria-label={t('common.delete')}
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {inSetlist && setlistSongs.length > 1 && (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/8 px-3 py-2 text-xs">
                  <button
                    type="button"
                    disabled={!prevSetlistSong}
                    onClick={() => prevSetlistSong && handleSelectSong(prevSetlistSong)}
                    className="inline-flex items-center gap-1 font-medium text-[var(--ink)] hover:text-[var(--accent)] disabled:opacity-35"
                  >
                    <ChevronLeftIcon className="h-3.5 w-3.5" />
                    <span>{t('music.prevSong')}</span>
                    {prevSetlistSong && (
                      <span className="hidden text-[var(--muted)] sm:inline">· {prevSetlistSong.title}</span>
                    )}
                  </button>
                  <span className="font-mono text-[11px] font-semibold text-[var(--accent)]">
                    {t('music.setlist')} {setlistIndex + 1}/{setlistIds.length}
                  </span>
                  <button
                    type="button"
                    disabled={!nextSetlistSong}
                    onClick={() => nextSetlistSong && handleSelectSong(nextSetlistSong)}
                    className="inline-flex items-center gap-1 font-medium text-[var(--ink)] hover:text-[var(--accent)] disabled:opacity-35"
                  >
                    {nextSetlistSong && (
                      <span className="hidden text-[var(--muted)] sm:inline">{nextSetlistSong.title} ·</span>
                    )}
                    <span>{t('music.nextSong')}</span>
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Barra de Transporte + Capo + Auto-Scroll */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/70 p-3">
                {/* Transpositor */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--muted)]">{t('music.transpose')}:</span>
                  <div className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                    <button
                      type="button"
                      onClick={() => setSemitones((s) => s - 1)}
                      className="px-2.5 py-1 text-xs font-bold text-[var(--ink)] hover:bg-[var(--surface-2)]"
                    >
                      -½
                    </button>
                    <span className="border-x border-[var(--border)] px-3 py-1 font-mono text-xs font-bold text-[var(--accent)]">
                      {currentKey}
                      {semitones !== 0 && ` (${semitones > 0 ? `+${semitones}` : semitones})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSemitones((s) => s + 1)}
                      className="px-2.5 py-1 text-xs font-bold text-[var(--ink)] hover:bg-[var(--surface-2)]"
                    >
                      +½
                    </button>
                  </div>
                  {semitones !== 0 && (
                    <button
                      type="button"
                      onClick={() => setSemitones(0)}
                      className="text-xs font-medium text-[var(--muted)] underline hover:text-[var(--ink)]"
                    >
                      {t('music.resetKey')}
                    </button>
                  )}
                </div>

                {/* Auto-scroll + Metrónomo sincronizado */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (metro.running) {
                        stopMetronome();
                      } else {
                        syncMetronomeToSong(activeSong.bpm ?? 72, activeSong.timeSignature ?? '4/4');
                        startMetronome();
                      }
                    }}
                    title={t('music.syncSongTempo')}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition',
                      metro.running
                        ? 'border-ember-500/40 bg-ember-500/15 text-ember-700 dark:border-ember-400/40 dark:text-ember-300'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'h-2 w-2 rounded-full transition-transform',
                        metro.running
                          ? metro.currentBeat === 0
                            ? 'scale-125 bg-ember-500 dark:bg-ember-400'
                            : 'bg-ember-500/60 dark:bg-ember-400/60'
                          : 'bg-[var(--muted)]/40',
                      ].join(' ')}
                    />
                    {activeSong.bpm ?? metro.bpm} BPM
                  </button>

                  <button
                    type="button"
                    onClick={() => setScrolling((prev) => !prev)}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                      scrolling ? 'sv-btn sv-btn-primary' : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]',
                    ].join(' ')}
                  >
                    {scrolling ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
                    {scrolling ? t('music.pauseScroll') : t('music.autoScroll')}
                  </button>
                  <label className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                    {t('music.speed')}
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={scrollSpeed}
                      onChange={(e) => setScrollSpeed(Number(e.target.value))}
                      className="w-16 accent-[var(--accent)]"
                    />
                  </label>
                </div>
              </div>

              {/* Sugerencias de Capo */}
              {(activeSong.capo || capoOptions.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-[var(--muted)]">{t('music.capoSuggest')}:</span>
                  {activeSong.capo && activeSong.capo > 0 && (
                    <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 font-semibold text-gold-700 dark:text-gold-300">
                      Original Capo {activeSong.capo}
                    </span>
                  )}
                  {capoOptions.map((opt) => (
                    <span
                      key={opt.capoFret}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 text-[var(--ink)]"
                    >
                      {language === 'es' ? opt.easeLabelEs : opt.easeLabelEn}
                    </span>
                  ))}
                </div>
              )}

              {/* Acordes usados en la canción */}
              {uniqueChords.length > 0 && (
                <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--muted)]">
                      {t('music.chordsUsed')} ({uniqueChords.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowChordStrip((prev) => !prev)}
                      className="text-xs font-medium text-[var(--accent)] hover:underline"
                    >
                      {showChordStrip
                        ? language === 'es'
                          ? 'Ocultar diagramas'
                          : 'Hide diagrams'
                        : language === 'es'
                          ? 'Ver diagramas'
                          : 'Show diagrams'}
                    </button>
                  </div>

                  {showChordStrip && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {uniqueChords.map((chord) => {
                        const firstVoicing = getChordVoicings(chord)[0];
                        if (!firstVoicing) return null;
                        return (
                          <div key={chord} className="shrink-0">
                            <ChordDiagram
                              compact
                              symbol={chord}
                              voicing={firstVoicing}
                              onSelect={() => setInspectedChord(chord)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Visor flotante/fijado de acorde al pulsar dentro de la letra */}
              {inspectedChord && inspectedVoicings[0] && (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <ChordDiagram compact symbol={inspectedChord} voicing={inspectedVoicings[0]} />
                    <div className="text-xs text-[var(--muted)]">
                      <div className="font-mono text-sm font-bold text-[var(--ink)]">{inspectedChord}</div>
                      <div>{inspectedVoicings[0].label}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectedChord(null)}
                    aria-label={t('common.close')}
                    className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Letra y Acordes ENCIMA estilo LaCuerda.net */}
              <div
                ref={sheetRef}
                className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6"
              >
                {parsedLines.map((line, lineIdx) => {
                  if (line.kind === 'empty') {
                    return <div key={lineIdx} className="h-3" />;
                  }
                  if (line.kind === 'section') {
                    return (
                      <div key={lineIdx} className="pt-2">
                        <span className="inline-block rounded-md bg-[var(--surface-2)] px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-[var(--accent)] uppercase">
                          {line.label}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={lineIdx} className="flex flex-wrap items-end leading-snug">
                      {line.segments.map((seg, segIdx) => (
                        <span key={segIdx} className="inline-flex flex-col items-start">
                          {seg.chord ? (
                            <button
                              type="button"
                              onClick={() => handleChordClick(seg.chord ?? '')}
                              className="sv-chord-badge mb-0.5 mr-1 cursor-pointer"
                            >
                              {seg.chord}
                            </button>
                          ) : (
                            <span aria-hidden="true" className="mb-0.5 select-none text-xs leading-none opacity-0">
                              ·
                            </span>
                          )}
                          <span
                            className={[
                              'whitespace-pre-wrap font-mono text-[var(--ink)]',
                              lecternMode ? 'text-[15px] leading-relaxed sm:text-base' : 'text-[13px] sm:text-sm',
                            ].join(' ')}
                          >
                            {seg.text}
                          </span>
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>

              {activeSong.notes && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-3.5 text-xs text-[var(--muted)]">
                  <span className="font-semibold text-[var(--ink)]">Nota: </span>
                  {activeSong.notes}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Modal Añadir / Editar canción */}
      {formState && (
        <Dialog
          title={formState.id ? t('music.editSong') : t('music.addSong')}
          subtitle={t('music.syncHint')}
          onClose={() => setFormState(null)}
          size="lg"
        >
          <form onSubmit={(e) => void handleSaveForm(e)} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songTitle')}</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="sv-input w-full text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songArtist')}</label>
                <input
                  type="text"
                  value={formState.artist}
                  onChange={(e) => setFormState({ ...formState, artist: e.target.value })}
                  className="sv-input w-full text-sm"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songKey')}</label>
                <input
                  type="text"
                  required
                  value={formState.originalKey}
                  onChange={(e) => setFormState({ ...formState, originalKey: e.target.value })}
                  placeholder="G, Am, D..."
                  className="sv-input w-full font-mono text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songCategory')}</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value as SongCategory })}
                  className="sv-input w-full text-sm"
                >
                  {SONG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`music.cat.${cat}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Capo</label>
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={formState.capo}
                  onChange={(e) => setFormState({ ...formState, capo: e.target.value })}
                  placeholder="0"
                  className="sv-input w-full text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songBpm')}</label>
                <input
                  type="number"
                  min={30}
                  max={240}
                  value={formState.bpm}
                  onChange={(e) => setFormState({ ...formState, bpm: e.target.value })}
                  placeholder="72"
                  className="sv-input w-full text-sm"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songBibleRef')}</label>
                <input
                  type="text"
                  value={formState.bibleReference}
                  onChange={(e) => setFormState({ ...formState, bibleReference: e.target.value })}
                  placeholder="Ej. Salmos 103:1"
                  className="sv-input w-full text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songTimeSig')}</label>
                <input
                  type="text"
                  value={formState.timeSignature}
                  onChange={(e) => setFormState({ ...formState, timeSignature: e.target.value })}
                  placeholder="4/4"
                  className="sv-input w-full font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songContent')}</label>
              <textarea
                required
                rows={10}
                value={formState.content}
                onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                placeholder={`[VERSO]\nG              D/F#\nCuan grande es Dios...\n\no con corchetes:\n[G]Cuan grande es [D/F#]Dios`}
                className="sv-input w-full font-mono text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">{t('music.songNotes')}</label>
              <input
                type="text"
                value={formState.notes}
                onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                className="sv-input w-full text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setFormState(null)} className="sv-btn sv-btn-ghost">
                {t('common.cancel')}
              </button>
              <button type="submit" className="sv-btn sv-btn-primary">
                {t('common.save')}
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Modal confirmar borrado */}
      {confirmDelete && (
        <Dialog title={confirmDelete.title} onClose={() => setConfirmDelete(null)}>
          <p className="text-sm text-[var(--muted)]">{t('music.deleteSongConfirm')}</p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setConfirmDelete(null)} className="sv-btn sv-btn-ghost">
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={() => void handleConfirmDelete()}
              className="sv-btn bg-rose-600 text-white hover:bg-rose-700"
            >
              {t('common.delete')}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
