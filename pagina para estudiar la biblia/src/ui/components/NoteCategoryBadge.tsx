import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { extractBibleReferences, formatReference } from '@model/reference';
import type { NoteCategory, VerseReference } from '@model/types';
import { goToChapter } from '@controller/app.controller';
import { useI18n } from '@ui/hooks/useI18n';
import { CATEGORY_STYLES } from './note-category-styles';

export function NoteCategoryBadge({ category = 'verse' }: { readonly category?: NoteCategory | undefined }) {
  const { t } = useI18n();
  const style = CATEGORY_STYLES[category];
  const Icon = style.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${style.badge}`}
    >
      <Icon size={12} />
      {t(`notes.category.${category}`)}
    </span>
  );
}

function renderRefsOnly(
  segment: string,
  keyPrefix: string,
  language: 'es' | 'en',
  onJump: (ref: VerseReference) => void,
): ReactNode[] {
  const refs = extractBibleReferences(segment);
  if (refs.length === 0) return [segment];

  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const hit of refs) {
    if (hit.start > cursor) {
      nodes.push(segment.slice(cursor, hit.start));
    }
    nodes.push(
      <button
        key={`${keyPrefix}-ref-${hit.start}-${hit.raw}`}
        type="button"
        title={formatReference(hit.reference, language)}
        onClick={() => onJump(hit.reference)}
        className="mx-0.5 inline-flex items-center rounded-md border border-ember-500/25 bg-ember-500/15 px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-ember-700 underline decoration-ember-500/45 underline-offset-2 transition-colors hover:bg-ember-500/25 dark:border-ember-400/30 dark:bg-ember-400/15 dark:text-ember-300 dark:hover:bg-ember-400/25"
      >
        {hit.raw}
      </button>,
    );
    cursor = hit.end;
  }
  if (cursor < segment.length) {
    nodes.push(segment.slice(cursor));
  }
  return nodes;
}

function renderInlineWithRefs(
  lineText: string,
  keyPrefix: string,
  language: 'es' | 'en',
  onJump: (ref: VerseReference) => void,
): ReactNode[] {
  const tokens: ReactNode[] = [];
  const formatRe = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null = formatRe.exec(lineText);

  while (match !== null) {
    if (match.index > lastIdx) {
      tokens.push(...renderRefsOnly(lineText.slice(lastIdx, match.index), `${keyPrefix}-p-${lastIdx}`, language, onJump));
    }
    const raw = match[0];
    if (raw.startsWith('**') && raw.endsWith('**')) {
      tokens.push(
        <strong key={`${keyPrefix}-b-${match.index}`} className="font-semibold text-navy-900 dark:text-parchment-50">
          {renderRefsOnly(raw.slice(2, -2), `${keyPrefix}-bi-${match.index}`, language, onJump)}
        </strong>,
      );
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      tokens.push(
        <em key={`${keyPrefix}-i-${match.index}`} className="italic">
          {renderRefsOnly(raw.slice(1, -1), `${keyPrefix}-ii-${match.index}`, language, onJump)}
        </em>,
      );
    }
    lastIdx = match.index + raw.length;
    match = formatRe.exec(lineText);
  }
  if (lastIdx < lineText.length) {
    tokens.push(...renderRefsOnly(lineText.slice(lastIdx), `${keyPrefix}-tail`, language, onJump));
  }
  return tokens;
}

/**
 * Renderiza el cuerpo de una nota con soporte editorial ligero de Markdown
 * (encabezados #, citas >, listas -, **negrita**, *cursiva*) y citas bíblicas clicables.
 */
export function LinkedScriptureText({
  text,
  className = '',
}: {
  readonly text: string;
  readonly className?: string | undefined;
}) {
  const { language } = useI18n();
  const navigate = useNavigate();

  const jump = (ref: VerseReference): void => {
    void goToChapter(ref.bookNumber, ref.chapter);
    navigate(ROUTES.reader, { state: { verse: ref.verse } });
  };

  const lines = text.replace(/\r\n/g, '\n').split('\n');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {lines.map((rawLine, idx) => {
        const trimmed = rawLine.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="pt-1 text-sm font-semibold text-navy-900 dark:text-parchment-50">
              {renderInlineWithRefs(trimmed.slice(4), `l-${idx}`, language, jump)}
            </h4>
          );
        }
        if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const content = trimmed.startsWith('## ') ? trimmed.slice(3) : trimmed.slice(2);
          return (
            <h3 key={idx} className="pt-1.5 font-serif text-base font-semibold text-navy-900 dark:text-parchment-50">
              {renderInlineWithRefs(content, `l-${idx}`, language, jump)}
            </h3>
          );
        }
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-ember-600/50 pl-3 italic text-navy-600 dark:border-ember-400/50 dark:text-navy-200"
            >
              {renderInlineWithRefs(trimmed.slice(2), `l-${idx}`, language, jump)}
            </blockquote>
          );
        }
        if (/^[-*•]\s+/.test(trimmed)) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-600 dark:bg-ember-400" />
              <div className="min-w-0 flex-1">
                {renderInlineWithRefs(trimmed.replace(/^[-*•]\s+/, ''), `l-${idx}`, language, jump)}
              </div>
            </div>
          );
        }
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineWithRefs(rawLine, `l-${idx}`, language, jump)}
          </p>
        );
      })}
    </div>
  );
}
