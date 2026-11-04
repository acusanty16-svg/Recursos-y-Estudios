import type { Bookmark, Highlight, HighlightColor, Note, TranslationId, Verse } from '@model/types';
import type { VerseReference } from '@model/types';
import { formatCitation } from '@model/reference';
import { useI18n } from '@ui/hooks/useI18n';
import { BookmarkIcon, CopyIcon, HighlighterIcon, NoteIcon } from '@ui/components/icons';

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
  readonly note: Note | undefined;
  readonly highlight: Highlight | undefined;
  readonly bookmark: Bookmark | undefined;
  readonly comparisonText: string | undefined;
  readonly comparisonTranslation: TranslationId | null;
  readonly onCopy: () => void;
  readonly onToggleBookmark: () => void;
  readonly onHighlight: (color: HighlightColor) => void;
  readonly onAddNote: () => void;
  readonly onEditNote: (note: Note) => void;
}

export function VerseRow({
  verse,
  reference,
  translationId,
  active,
  note,
  highlight,
  bookmark,
  comparisonText,
  comparisonTranslation,
  onCopy,
  onToggleBookmark,
  onHighlight,
  onAddNote,
  onEditNote,
}: VerseRowProps) {
  const { t, language } = useI18n();
  const highlightClass = highlight ? HIGHLIGHT_CLASSES[highlight.color] : '';

  return (
    <li
      id={`v${verse.number}`}
      aria-current={active ? 'location' : undefined}
      className={[
        'group scroll-mt-44 rounded-xl px-2 py-3 transition-colors sm:px-3',
        active ? 'sv-verse-active' : 'hover:bg-navy-900/[0.025] dark:hover:bg-parchment-100/[0.03]',
      ].join(' ')}
    >
      <div className={highlight ? `sv-verse-highlight ${highlightClass}` : ''}>
        <div className={comparisonTranslation ? 'md:grid md:grid-cols-2 md:gap-6' : ''}>
          <div className="flex gap-3">
            <span
              className={[
                'w-5 shrink-0 select-none pt-1 text-right font-sans text-[11px] font-semibold tabular-nums transition-colors',
                active
                  ? 'text-ember-700 dark:text-ember-300'
                  : 'text-ember-600/70 dark:text-ember-300/60',
              ].join(' ')}
              aria-hidden="true"
            >
              {verse.number}
            </span>
            <p className="sv-scripture min-w-0 text-navy-900 dark:text-parchment-50">
              {verse.text}
            </p>
          </div>

          {comparisonTranslation ? (
            <div
              className={`sv-compare-panel mt-3 md:mt-0 ${
                highlight ? 'sv-compare-panel-highlighted' : ''
              }`}
            >
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300 md:hidden">
                {comparisonTranslation}
              </span>
              <p className="sv-scripture text-navy-800 dark:text-parchment-100">
                {comparisonText ?? <span className="opacity-50">—</span>}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-0.5 pl-8 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100 md:opacity-40">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-navy-500 transition-colors hover:bg-navy-900/5 hover:text-navy-900 dark:text-parchment-300/70 dark:hover:bg-parchment-100/10 dark:hover:text-parchment-50"
          aria-label={`${t('common.copy')} ${formatCitation(reference, translationId, language)}`}
          title={t('common.copy')}
          onClick={onCopy}
        >
          <CopyIcon size={15} />
        </button>

        <button
          type="button"
          className={`inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-navy-900/5 dark:hover:bg-parchment-100/10 ${
            bookmark ? 'text-ember-600 dark:text-ember-300' : 'text-navy-500 dark:text-parchment-300/70'
          }`}
          aria-label={bookmark ? t('reader.removeBookmark') : t('reader.bookmark')}
          aria-pressed={bookmark !== undefined}
          title={bookmark ? t('reader.removeBookmark') : t('reader.bookmark')}
          onClick={onToggleBookmark}
        >
          <BookmarkIcon size={15} fill={bookmark ? 'currentColor' : 'none'} />
        </button>

        <details className="relative">
          <summary
            className={`inline-flex size-10 cursor-pointer list-none items-center justify-center rounded-md transition-colors hover:bg-navy-900/5 dark:hover:bg-parchment-100/10 ${
              highlight ? 'text-ember-600 dark:text-ember-300' : 'text-navy-500 dark:text-parchment-300/70'
            }`}
            aria-label={t('reader.highlight')}
            title={t('reader.highlight')}
          >
            <HighlighterIcon size={15} />
          </summary>
          <div className="absolute left-0 top-11 z-20 flex gap-1 rounded-lg border border-navy-900/10 bg-white p-1.5 shadow-lg dark:border-parchment-100/15 dark:bg-navy-800">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onHighlight(color)}
                aria-label={`${t('reader.highlight')}: ${color}`}
                title={color}
                className={`size-7 rounded-full ${HIGHLIGHT_SWATCHES[color]} ${
                  highlight?.color === color ? 'ring-2 ring-navy-900 ring-offset-1 dark:ring-parchment-100' : ''
                }`}
              />
            ))}
          </div>
        </details>

        <button
          type="button"
          className={`inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-navy-900/5 dark:hover:bg-parchment-100/10 ${
            note ? 'text-ember-600 dark:text-ember-300' : 'text-navy-500 dark:text-parchment-300/70'
          }`}
          aria-label={t('reader.addNote')}
          title={t('reader.addNote')}
          onClick={onAddNote}
        >
          <NoteIcon size={15} />
        </button>
      </div>

      {note ? (
        <div className="ml-8 mt-2 rounded-xl border border-ember-500/25 bg-ember-400/10 p-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-800 dark:text-parchment-100">
            {note.body}
          </p>
          {note.tags.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-navy-900/5 px-2 py-0.5 text-[10px] font-medium text-navy-500 dark:bg-parchment-100/10 dark:text-parchment-200/70"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            className="mt-2 text-xs font-medium text-ember-700 underline-offset-2 hover:underline dark:text-ember-300"
            onClick={() => onEditNote(note)}
          >
            {t('notes.edit')}
          </button>
        </div>
      ) : null}
    </li>
  );
}
