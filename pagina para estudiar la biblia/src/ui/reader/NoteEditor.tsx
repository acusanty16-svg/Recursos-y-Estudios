import { useEffect, useRef, useState } from 'react';
import { MAX_NOTE_LENGTH } from '@model/constants';
import { useI18n } from '@ui/hooks/useI18n';

interface NoteEditorProps {
  readonly initialBody?: string;
  readonly initialTags?: readonly string[];
  readonly onSave: (body: string, tags: readonly string[]) => void;
  readonly onCancel: () => void;
}

export function NoteEditor({ initialBody = '', initialTags = [], onSave, onCancel }: NoteEditorProps) {
  const { t } = useI18n();
  const [body, setBody] = useState(initialBody);
  const [tags, setTags] = useState(initialTags.join(', '));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = (): void => {
    if (body.trim().length === 0) return;
    const parsedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    onSave(body, parsedTags);
  };

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      <div>
        <label htmlFor="note-body" className="sv-label">
          {t('reader.addNote')}
        </label>
        <textarea
          id="note-body"
          ref={textareaRef}
          className="sv-input min-h-28 resize-y font-serif text-base leading-relaxed"
          placeholder={t('reader.notePlaceholder')}
          value={body}
          maxLength={MAX_NOTE_LENGTH}
          onChange={(event) => setBody(event.target.value)}
        />
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
