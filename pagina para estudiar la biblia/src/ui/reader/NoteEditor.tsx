import { useEffect, useRef, useState } from 'react';
import { MAX_NOTE_LENGTH } from '@model/constants';
import { formatReference, parseReferenceInput, toDayKey } from '@model/reference';
import { NOTE_CATEGORIES, type NoteCategory, type VerseReference } from '@model/types';
import { useI18n } from '@ui/hooks/useI18n';
import { CATEGORY_STYLES } from '@ui/components/note-category-styles';
import { LinkedScriptureText } from '@ui/components/NoteCategoryBadge';

export interface NoteEditorPayload {
  readonly category: NoteCategory;
  readonly title?: string;
  readonly speaker?: string;
  readonly eventDate?: string;
  readonly reference?: VerseReference;
  readonly body: string;
  readonly tags: readonly string[];
}

interface NoteEditorProps {
  readonly initialCategory?: NoteCategory;
  readonly initialTitle?: string;
  readonly initialSpeaker?: string;
  readonly initialDate?: string;
  readonly initialReference?: VerseReference;
  readonly initialBody?: string;
  readonly initialTags?: readonly string[];
  readonly allowCategoryChange?: boolean;
  readonly allowReferenceInput?: boolean;
  readonly expanded?: boolean;
  readonly onSave: (payload: NoteEditorPayload) => void;
  readonly onCancel: () => void;
}

const TEMPLATES: Record<'sermon' | 'study' | 'seminar', string> = {
  sermon:
    'Texto base: \nIdea central:\n\n1. Punto principal:\n2. Desarrollo bíblico:\n3. Aplicación personal:\n',
  study:
    'Observación (¿Qué dice el texto?):\n\nInterpretación (¿Qué significa en su contexto?):\n\nPasajes paralelos:\n\nAplicación:\n',
  seminar:
    'Tema / Módulo:\n\nConceptos clave:\n- \n\nCitas y referencias:\n\nPreguntas / Conclusiones:\n',
};

export function NoteEditor({
  initialCategory = 'verse',
  initialTitle = '',
  initialSpeaker = '',
  initialDate = toDayKey(),
  initialReference,
  initialBody = '',
  initialTags = [],
  allowCategoryChange = true,
  allowReferenceInput = false,
  expanded = false,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const { t, language } = useI18n();
  const [category, setCategory] = useState<NoteCategory>(initialCategory);
  const [title, setTitle] = useState(initialTitle);
  const [speaker, setSpeaker] = useState(initialSpeaker);
  const [eventDate, setEventDate] = useState(initialDate);
  const [passageText, setPassageText] = useState(
    initialReference ? formatReference(initialReference, language) : '',
  );
  const [body, setBody] = useState(initialBody);
  const [tags, setTags] = useState(initialTags.join(', '));
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editorMode === 'write') {
      textareaRef.current?.focus();
    }
  }, [editorMode]);

  const showExtendedMeta = category !== 'verse';
  const parsedPassage = passageText.trim() ? parseReferenceInput(passageText) : null;

  const handleSave = (): void => {
    if (body.trim().length === 0) return;
    const parsedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const resolvedRef = allowReferenceInput ? (parsedPassage ?? undefined) : initialReference;

    onSave({
      category,
      body,
      tags: parsedTags,
      ...(showExtendedMeta && title.trim() ? { title: title.trim() } : {}),
      ...(showExtendedMeta && speaker.trim() ? { speaker: speaker.trim() } : {}),
      ...(showExtendedMeta && eventDate.trim() ? { eventDate: eventDate.trim() } : {}),
      ...(resolvedRef ? { reference: resolvedRef } : {}),
    });
  };

  const applyTemplate = (kind: 'sermon' | 'study' | 'seminar'): void => {
    const template = TEMPLATES[kind];
    setBody((prev) => (prev.trim() ? `${prev.trim()}\n\n${template}` : template));
    textareaRef.current?.focus();
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      {allowCategoryChange ? (
        <div>
          <span className="sv-label">{t('notes.typeLabel')}</span>
          <div className="flex flex-wrap gap-1.5">
            {NOTE_CATEGORIES.map((cat) => {
              const style = CATEGORY_STYLES[cat];
              const Icon = style.Icon;
              const selected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={[
                    'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all',
                    selected
                      ? `${style.badge} ring-2 ring-ember-500/30`
                      : 'border-navy-900/10 text-navy-600 hover:bg-navy-900/5 dark:border-parchment-100/10 dark:text-parchment-200/80 dark:hover:bg-parchment-100/10',
                  ].join(' ')}
                >
                  <Icon size={13} />
                  {t(`notes.category.${cat}`)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {showExtendedMeta ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="note-title" className="sv-label">
              {t('notes.titleLabel')}
            </label>
            <input
              id="note-title"
              className="sv-input"
              placeholder={t('notes.titlePlaceholder')}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="note-speaker" className="sv-label">
              {t('notes.speakerLabel')} <span className="normal-case opacity-70">({t('common.optional')})</span>
            </label>
            <input
              id="note-speaker"
              className="sv-input"
              placeholder={t('notes.speakerPlaceholder')}
              value={speaker}
              onChange={(event) => setSpeaker(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="note-date" className="sv-label">
              {t('notes.dateLabel')}
            </label>
            <input
              id="note-date"
              type="date"
              className="sv-input"
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
            />
          </div>
        </div>
      ) : null}

      {allowReferenceInput ? (
        <div>
          <label htmlFor="note-passage" className="sv-label">
            {t('notes.passageLabel')} <span className="normal-case opacity-70">({t('common.optional')})</span>
          </label>
          <input
            id="note-passage"
            className="sv-input"
            placeholder={t('notes.passagePlaceholder')}
            value={passageText}
            onChange={(event) => setPassageText(event.target.value)}
          />
          {passageText.trim() && !parsedPassage ? (
            <p className="mt-1 text-xs text-rose-500">{t('reader.jumpInvalid')}</p>
          ) : parsedPassage ? (
            <p className="mt-1 text-xs text-sage-500">{formatReference(parsedPassage, language)}</p>
          ) : null}
        </div>
      ) : null}

      {showExtendedMeta ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-400 dark:text-parchment-300/60">
            {t('notes.templates')}:
          </span>
          <button
            type="button"
            onClick={() => applyTemplate('sermon')}
            className="rounded-lg border border-navy-900/10 px-2.5 py-1 text-xs text-navy-600 hover:bg-navy-900/5 dark:border-parchment-100/15 dark:text-parchment-200 dark:hover:bg-parchment-100/10"
          >
            {t('notes.templateSermon')}
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('study')}
            className="rounded-lg border border-navy-900/10 px-2.5 py-1 text-xs text-navy-600 hover:bg-navy-900/5 dark:border-parchment-100/15 dark:text-parchment-200 dark:hover:bg-parchment-100/10"
          >
            {t('notes.templateStudy')}
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('seminar')}
            className="rounded-lg border border-navy-900/10 px-2.5 py-1 text-xs text-navy-600 hover:bg-navy-900/5 dark:border-parchment-100/15 dark:text-parchment-200 dark:hover:bg-parchment-100/10"
          >
            {t('notes.templateSeminar')}
          </button>
        </div>
      ) : null}

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor="note-body" className="sv-label mb-0">
            {t('reader.addNote')}
          </label>
          <div className="inline-flex rounded-lg border border-navy-900/10 bg-navy-900/[0.03] p-0.5 dark:border-parchment-100/10 dark:bg-parchment-100/[0.04]">
            <button
              type="button"
              onClick={() => setEditorMode('write')}
              className={[
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                editorMode === 'write'
                  ? 'bg-parchment-50 text-navy-900 shadow-xs dark:bg-navy-800 dark:text-parchment-50'
                  : 'text-navy-500 hover:text-navy-800 dark:text-parchment-300/70 dark:hover:text-parchment-100',
              ].join(' ')}
            >
              {t('notes.writeMode')}
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={[
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                editorMode === 'preview'
                  ? 'bg-parchment-50 text-navy-900 shadow-xs dark:bg-navy-800 dark:text-parchment-50'
                  : 'text-navy-500 hover:text-navy-800 dark:text-parchment-300/70 dark:hover:text-parchment-100',
              ].join(' ')}
            >
              {t('notes.previewMode')}
            </button>
          </div>
        </div>

        {editorMode === 'write' ? (
          <textarea
            id="note-body"
            ref={textareaRef}
            className={[
              'sv-input resize-y font-serif text-base leading-relaxed',
              expanded ? 'min-h-[320px]' : 'min-h-36',
            ].join(' ')}
            placeholder={t('reader.notePlaceholder')}
            value={body}
            maxLength={MAX_NOTE_LENGTH}
            onChange={(event) => setBody(event.target.value)}
          />
        ) : (
          <div
            className={[
              'sv-card overflow-y-auto p-4 font-serif text-base leading-relaxed text-navy-900 dark:text-parchment-100',
              expanded ? 'min-h-[320px]' : 'min-h-36',
            ].join(' ')}
          >
            {body.trim() ? (
              <LinkedScriptureText text={body} />
            ) : (
              <p className="text-sm italic text-navy-400 dark:text-parchment-300/60">{t('reader.notePlaceholder')}</p>
            )}
          </div>
        )}
        <p className="mt-1.5 text-[11px] text-navy-400 dark:text-parchment-300/60">
          {t('notes.linkedVersesHint')} · {t('notes.markdownHint')}
        </p>
      </div>

      <div>
        <label htmlFor="note-tags" className="sv-label">
          {t('reader.tags')} <span className="normal-case opacity-70">({t('common.optional')})</span>
        </label>
        <input
          id="note-tags"
          className="sv-input"
          placeholder={t('reader.tagsHint')}
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="sv-btn sv-btn-primary" disabled={body.trim().length === 0}>
          {t('reader.saveNote')}
        </button>
        <button type="button" className="sv-btn sv-btn-ghost" onClick={onCancel}>
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
}
