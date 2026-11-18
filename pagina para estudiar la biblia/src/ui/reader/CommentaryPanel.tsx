import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatChapterLabel } from '@model/reference';
import { resolveCommentaryTarget, type ChapterCommentary } from '@model/commentary';
import { loadMatthewHenryCommentary, translateCommentaryEnToEs } from '@controller/commentary.service';
import { useI18n } from '@ui/hooks/useI18n';
import { BookIcon, ExternalIcon, RefreshIcon, SparklesIcon } from '@ui/components/icons';

interface CommentaryPanelProps {
  readonly bookNumber: number;
  readonly chapter: number;
  readonly focusVerse?: number | null | undefined;
}

export function CommentaryPanel({ bookNumber, chapter, focusVerse }: CommentaryPanelProps) {
  const { t, language } = useI18n();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [commentary, setCommentary] = useState<ChapterCommentary | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSpanish, setShowSpanish] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translatedMap, setTranslatedMap] = useState<Record<string, string>>({});
  const [translateFailed, setTranslateFailed] = useState(false);
  const [showBookIntro, setShowBookIntro] = useState(false);

  const chapterLabel = formatChapterLabel(bookNumber, chapter, language);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setCommentary(null);
    setErrorMsg('');
    setShowSpanish(false);
    setTranslateFailed(false);
    setShowBookIntro(false);

    void loadMatthewHenryCommentary(bookNumber, chapter).then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setCommentary(res.value);
        setStatus('ready');
      } else {
        setErrorMsg(res.error.message);
        setStatus('error');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [bookNumber, chapter]);

  const targetResolution = useMemo(
    () => (commentary ? resolveCommentaryTarget(commentary.sections, focusVerse) : null),
    [commentary, focusVerse],
  );

  const scrollToTarget = useCallback(
    (behavior: ScrollBehavior = 'smooth'): void => {
      if (!targetResolution) return;
      const el = document.getElementById(`mh-sec-${targetResolution.index}`);
      el?.scrollIntoView({ behavior, block: 'start' });
    },
    [targetResolution],
  );

  useEffect(() => {
    if (status !== 'ready' || !targetResolution) return;
    let rafId = 0;
    let timerId = 0;
    rafId = window.requestAnimationFrame(() => {
      timerId = window.setTimeout(() => {
        scrollToTarget('smooth');
      }, 180);
    });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
    };
  }, [status, targetResolution, scrollToTarget]);

  const handleToggleTranslate = async (): Promise<void> => {
    if (showSpanish) {
      setShowSpanish(false);
      return;
    }
    if (!commentary) return;

    const neededKeys: { readonly key: string; readonly source: string }[] = [];
    if (commentary.chapterIntroduction) {
      neededKeys.push({ key: 'intro', source: commentary.chapterIntroduction });
    }
    commentary.sections.forEach((sec, idx) => {
      neededKeys.push({ key: `sec-${idx}`, source: sec.text });
    });

    const missing = neededKeys.filter((item) => !translatedMap[item.key]);
    if (missing.length === 0) {
      setShowSpanish(true);
      return;
    }

    setTranslating(true);
    setTranslateFailed(false);

    const nextEntries: Record<string, string> = {};
    let hadError = false;

    for (const item of missing) {
      const translated = await translateCommentaryEnToEs(item.source);
      if (translated) {
        nextEntries[item.key] = translated;
      } else {
        hadError = true;
        break;
      }
    }

    setTranslating(false);
    if (Object.keys(nextEntries).length > 0) {
      setTranslatedMap((prev) => ({ ...prev, ...nextEntries }));
    }
    if (hadError && Object.keys(nextEntries).length === 0) {
      setTranslateFailed(true);
    } else {
      setShowSpanish(true);
    }
  };

  const chapterIntroText = useMemo(() => {
    if (!commentary?.chapterIntroduction) return null;
    if (showSpanish && translatedMap.intro) return translatedMap.intro;
    return commentary.chapterIntroduction;
  }, [commentary, showSpanish, translatedMap]);

  if (status === 'loading') {
    return (
      <div className="mt-4 space-y-3">
        <p className="text-xs text-navy-500 dark:text-parchment-300/70">{t('commentary.loading')}</p>
        <div className="sv-skeleton h-20 w-full" />
        <div className="sv-skeleton h-28 w-full" />
        <div className="sv-skeleton h-24 w-full" />
      </div>
    );
  }

  if (status === 'error' || !commentary) {
    return (
      <div className="mt-4 rounded-xl border border-navy-900/10 bg-white/60 p-4 text-sm text-navy-600 dark:border-parchment-100/10 dark:bg-navy-800/40 dark:text-parchment-200/80">
        <p>{errorMsg || t('commentary.emptyChapter')}</p>
      </div>
    );
  }

  const hasContent = Boolean(commentary.chapterIntroduction) || commentary.sections.length > 0;

  return (
    <div className="mt-3 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-navy-900/10 bg-parchment-100/70 p-3 dark:border-parchment-100/10 dark:bg-navy-800/60">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ember-700 dark:text-ember-300">
            <BookIcon size={13} />
            {chapterLabel}
          </p>
          <p className="truncate text-[11px] text-navy-500 dark:text-parchment-300/70">
            {t('commentary.sourceCredit')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleToggleTranslate()}
          disabled={translating || !hasContent}
          className="sv-btn sv-btn-primary min-h-9 px-3 py-1.5 text-xs disabled:opacity-50"
        >
          {translating ? (
            <RefreshIcon size={13} className="animate-spin" />
          ) : (
            <SparklesIcon size={13} />
          )}
          <span>
            {translating
              ? t('commentary.translating')
              : showSpanish
                ? t('commentary.showOriginal')
                : t('commentary.translateToEs')}
          </span>
        </button>
      </div>

      {targetResolution ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ember-500/30 bg-ember-500/10 px-3.5 py-2.5 text-xs text-ember-800 dark:border-ember-400/35 dark:bg-ember-400/15 dark:text-ember-200">
          <span className="min-w-0 flex-1 leading-snug">
            {targetResolution.isExact
              ? `${t('commentary.exactFocus')} ${targetResolution.verseNumber}`
              : t('commentary.nearestNotice')
                  .replace('{requested}', String(focusVerse ?? ''))
                  .replace('{matched}', String(targetResolution.verseNumber))}
          </span>
          <button
            type="button"
            onClick={() => scrollToTarget('smooth')}
            className="shrink-0 rounded-lg border border-ember-500/35 bg-white/80 px-2.5 py-1 font-semibold text-ember-700 transition hover:bg-white dark:border-ember-400/40 dark:bg-navy-900/70 dark:text-ember-300 dark:hover:bg-navy-900"
          >
            {t('commentary.jumpToFocused').replace('{verse}', String(targetResolution.verseNumber))}
          </button>
        </div>
      ) : null}

      {translateFailed ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-200">
          <span>{t('commentary.translateError')}</span>
          <a
            href={`https://translate.google.com/?sl=en&tl=es&text=${encodeURIComponent(
              (commentary.chapterIntroduction ?? commentary.sections[0]?.text ?? '').slice(0, 1800),
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold underline"
          >
            Google Translate
            <ExternalIcon size={12} />
          </a>
        </div>
      ) : null}

      {!hasContent ? (
        <p className="rounded-xl border border-navy-900/10 p-4 text-sm text-navy-500 dark:border-parchment-100/10 dark:text-parchment-300/70">
          {t('commentary.emptyChapter')}
        </p>
      ) : null}

      {commentary.bookIntroduction ? (
        <div className="rounded-xl border border-navy-900/10 bg-white/50 p-3.5 dark:border-parchment-100/10 dark:bg-navy-800/35">
          <button
            type="button"
            onClick={() => setShowBookIntro((prev) => !prev)}
            className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-ember-700 dark:text-ember-300"
          >
            <span>{t('commentary.bookIntro')} ({commentary.bookName})</span>
            <span>{showBookIntro ? '−' : '+'}</span>
          </button>
          {showBookIntro ? (
            <p className="mt-2.5 whitespace-pre-line font-serif text-sm leading-relaxed text-navy-800 dark:text-parchment-100">
              {commentary.bookIntroduction}
            </p>
          ) : null}
        </div>
      ) : null}

      {chapterIntroText ? (
        <section className="rounded-xl border border-ember-500/20 bg-ember-500/[0.06] p-4">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ember-700 dark:text-ember-300">
            {t('commentary.chapterIntro')}
          </h3>
          <p className="mt-2 whitespace-pre-line font-serif text-sm leading-relaxed text-navy-900 dark:text-parchment-50">
            {chapterIntroText}
          </p>
        </section>
      ) : null}

      <ul className="space-y-3">
        {commentary.sections.map((section, idx) => {
          const isFocused = targetResolution !== null && targetResolution.index === idx;
          const displayBody = showSpanish && translatedMap[`sec-${idx}`] ? translatedMap[`sec-${idx}`] : section.text;

          return (
            <li
              key={`${section.verseNumber ?? 'gen'}-${idx}`}
              id={`mh-sec-${idx}`}
              className={[
                'scroll-mt-4 rounded-xl border p-4 transition-colors',
                isFocused
                  ? 'border-ember-500/60 bg-ember-500/12 ring-1 ring-ember-500/25 dark:border-ember-400/60 dark:bg-ember-400/15'
                  : 'border-navy-900/10 bg-white/60 dark:border-parchment-100/10 dark:bg-navy-800/40',
              ].join(' ')}
            >
              {section.verseNumber !== null ? (
                <p className="mb-1.5 font-mono text-xs font-semibold text-ember-700 dark:text-ember-300">
                  {t('commentary.versePrefix')} {section.verseNumber}
                </p>
              ) : null}
              <p className="whitespace-pre-line font-serif text-sm leading-relaxed text-navy-800 dark:text-parchment-100">
                {displayBody}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
