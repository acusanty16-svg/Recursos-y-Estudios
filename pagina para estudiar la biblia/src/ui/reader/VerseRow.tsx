import { AnimatePresence, motion } from 'motion/react';
import type { Bookmark, Highlight, HighlightColor, MemorizedVerse, Note, TranslationId, Verse } from '@model/types';
import type { VerseReference } from '@model/types';
import { formatCitation } from '@model/reference';
import { useI18n } from '@ui/hooks/useI18n';
import { LinkedScriptureText, NoteCategoryBadge } from '@ui/components/NoteCategoryBadge';
import { BookmarkIcon, CopyIcon, HighlighterIcon, MemorizeIcon, NoteIcon } from '@ui/components/icons';

const HIGHLIGHT_CLASSES: Record<HighlightColor, string> = {
  gold: 'sv-hl-gold',
  sage: 'sv-hl-sage',
  sky: 'sv-hl-sky',
  rose: 'sv-hl-rose',
};

const HIGHLIGHT_SWATCHES: Record<HighlightColor, string> = {
  gold: 'bg-gold-400',
  sage: 'bg-sage-300',
  sky: 'bg-sky-300',
  rose: 'bg-rose-300',
};

const COLORS: readonly HighlightColor[] = ['gold', 'sage', 'sky', 'rose'];

interface VerseRowProps {
  readonly verse: Verse;
  readonly reference: VerseReference;
  readonly translationId: TranslationId;
  readonly active: boolean;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly note: Note | undefined;
  readonly highlight: Highlight | undefined;
  readonly bookmark: Bookmark | undefined;
  readonly memorized: MemorizedVerse | undefined;
  readonly comparisonText: string | undefined;
  readonly comparisonTranslation: TranslationId | null;
  readonly onCopy: () => void;
  readonly onToggleBookmark: () => void;
  readonly onToggleMemorized: () => void;
  readonly onHighlight: (color: HighlightColor) => void;
  readonly onAddNote: () => void;
  readonly onEditNote: (note: Note) => void;
}

export function VerseRow({
  verse,
  reference,
  translationId,
  active,
  selected,
  onSelect,
  note,
  highlight,
  bookmark,
  memorized,
  comparisonText,
  comparisonTranslation,
  onCopy,
  onToggleBookmark,
  onToggleMemorized,
  onHighlight,
  onAddNote,
  onEditNote,
}: VerseRowProps) {
  const { t, language } = useI18n();
  const highlightClass = highlight ? HIGHLIGHT_CLASSES[highlight.color] : '';

  const handleRowClick = (event: React.MouseEvent<HTMLLIElement>): void => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, summary, details, a')) return;
    onSelect();
  };

  return (
    <motion.li
      id={`v${verse.number}`}
      layout="position"
      aria-current={active ? 'location' : undefined}
      onClick={handleRowClick}
      animate={{
        backgroundColor: selected
          ? 'color-mix(in oklab, var(--color-ember-500) 7%, transparent)'
          : 'rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.2 }}
      className={[
        'group relative cursor-pointer scroll-mt-44 rounded-xl px-3 py-2.5 transition-colors sm:px-4',
        selected ? '' : 'hover:bg-navy-900/[0.025] dark:hover:bg-parchment-100/[0.025]',
      ].join(' ')}
    >
      {/* Riel deslizante animado entre versículos (solo al seleccionar/enfocar) */}
      {selected ? (
        <motion.span
          layoutId="reader-selected-verse-rail"
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          aria-hidden="true"
          className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-ember-600 dark:bg-ember-400"
        />
      ) : null}

      <div className={highlight ? `sv-verse-highlight ${highlightClass}` : ''}>
        <div className={comparisonTranslation ? 'md:grid md:grid-cols-2 md:items-start md:gap-6' : ''}>
          <div className="flex gap-3.5">
            <div className="flex w-6 shrink-0 flex-col items-end pt-1 select-none" aria-hidden="true">
              <motion.span
                animate={{
                  scale: selected ? 1.12 : 1,
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className={[
                  'font-mono text-[11px] font-semibold tabular-nums transition-colors',
                  selected
                    ? 'text-ember-700 dark:text-ember-400'
                    : active
                      ? 'text-navy-900 dark:text-parchment-100'
                      : 'text-navy-400/80 dark:text-navy-400',
                ].join(' ')}
              >
                {verse.number}
              </motion.span>
              {(bookmark || memorized) && !selected ? (
                <span className="mt-1 flex gap-0.5 text-ember-600/80 dark:text-ember-400/80">
                  {bookmark ? <BookmarkIcon size={10} fill="currentColor" /> : null}
                  {memorized ? <MemorizeIcon size={10} /> : null}
                </span>
              ) : null}
            </div>

            <p className="sv-scripture min-w-0 text-navy-900 dark:text-parchment-50">{verse.text}</p>
          </div>

          <AnimatePresence initial={false}>
            {comparisonTranslation ? (
              <motion.div
                key={`${comparisonTranslation}-${verse.number}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className={`sv-compare-panel mt-3 md:mt-0 ${
                  highlight ? 'sv-compare-panel-highlighted' : ''
                }`}
              >
                <span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ember-700 dark:text-ember-400 md:hidden">
                  {comparisonTranslation}
                </span>
                <p className="sv-scripture text-navy-800 dark:text-parchment-100">
                  {comparisonText ?? <span className="opacity-50">—</span>}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Barra contextual: oculta hasta tocar el versículo */}
      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-1 sm:gap-1 sm:pl-9">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-navy-900/10 bg-white/80 px-2.5 text-xs font-medium text-navy-700 transition hover:border-ember-600/40 hover:text-navy-900 dark:border-parchment-100/10 dark:bg-navy-900 dark:text-parchment-200 dark:hover:text-parchment-50"
                aria-label={`${t('common.copy')} ${formatCitation(reference, translationId, language)}`}
                onClick={onCopy}
              >
                <CopyIcon size={13} />
                <span>{t('common.copy')}</span>
              </button>

              <button
                type="button"
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition ${
                  bookmark
                    ? 'border-ember-500/40 bg-ember-500/15 text-ember-700 dark:text-ember-300'
                    : 'border-navy-900/10 bg-white/80 text-navy-700 hover:border-ember-600/40 dark:border-parchment-100/10 dark:bg-navy-900 dark:text-parchment-200'
                }`}
                aria-pressed={bookmark !== undefined}
                onClick={onToggleBookmark}
              >
                <BookmarkIcon size={13} fill={bookmark ? 'currentColor' : 'none'} />
                <span>{t('reader.bookmark')}</span>
              </button>

              <button
                type="button"
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition ${
                  memorized
                    ? 'border-ember-500/40 bg-ember-500/15 text-ember-700 dark:text-ember-300'
                    : 'border-navy-900/10 bg-white/80 text-navy-700 hover:border-ember-600/40 dark:border-parchment-100/10 dark:bg-navy-900 dark:text-parchment-200'
                }`}
                aria-pressed={memorized !== undefined}
                onClick={onToggleMemorized}
              >
                <MemorizeIcon size={13} />
                <span>{t('notes.tabMemorize')}</span>
              </button>

              <div className="inline-flex h-9 items-center gap-1 rounded-lg border border-navy-900/10 bg-white/80 px-2 dark:border-parchment-100/10 dark:bg-navy-900">
                <HighlighterIcon size={13} className="mr-0.5 text-navy-400 dark:text-navy-300" />
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onHighlight(color)}
                    aria-label={`${t('reader.highlight')}: ${color}`}
                    title={color}
                    className={`size-5 rounded-full transition-transform hover:scale-110 ${HIGHLIGHT_SWATCHES[color]} ${
                      highlight?.color === color
                        ? 'ring-2 ring-navy-900 ring-offset-1 dark:ring-parchment-100 dark:ring-offset-navy-900'
                        : ''
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition ${
                  note
                    ? 'border-ember-500/40 bg-ember-500/15 text-ember-700 dark:text-ember-300'
                    : 'border-navy-900/10 bg-white/80 text-navy-700 hover:border-ember-600/40 dark:border-parchment-100/10 dark:bg-navy-900 dark:text-parchment-200'
                }`}
                onClick={onAddNote}
              >
                <NoteIcon size={13} />
                <span>{note ? t('notes.edit') : t('reader.addNote')}</span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {note ? (
        <div className="mt-2.5 rounded-xl border border-ember-500/20 bg-ember-500/[0.06] p-3.5 sm:ml-9">
          {note.category && note.category !== 'verse' ? (
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <NoteCategoryBadge category={note.category} />
              {note.title ? (
                <span className="text-xs font-semibold text-navy-900 dark:text-parchment-50">{note.title}</span>
              ) : null}
            </div>
          ) : null}
          <LinkedScriptureText
            text={note.body}
            className="text-sm leading-relaxed text-navy-800 dark:text-parchment-100"
          />
          {note.tags.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-navy-900/5 px-2 py-0.5 font-mono text-[10px] font-medium text-navy-500 dark:bg-parchment-100/10 dark:text-navy-300"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            className="mt-2 text-xs font-medium text-ember-700 underline-offset-2 hover:underline dark:text-ember-400"
            onClick={() => onEditNote(note)}
          >
            {t('notes.edit')}
          </button>
        </div>
      ) : null}
    </motion.li>
  );
}
