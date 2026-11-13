import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@model/constants';
import { LAMP_CLUB_LEVELS, type LampVerseEntry } from '@rsc';
import { goToChapter } from '@controller/app.controller';
import { fetchLampVerseText, markLampVerseMastered, unmarkLampVerseMastered } from '@controller/lamp-club.controller';
import { useAppStore } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { Dialog } from '@ui/components/Dialog';
import { BookIcon, CheckIcon, MemorizeIcon, RefreshIcon, SparklesIcon } from '@ui/components/icons';

interface PracticeWord {
  readonly token: string;
  readonly clean: string;
  readonly blank: boolean;
}

function normalizeWord(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ]/g, '');
}

function buildClozeWords(text: string, seedOffset: number): readonly PracticeWord[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  return tokens.map((token, index) => {
    const clean = normalizeWord(token);
    const eligible = clean.length >= 4 && !/^\d+$/.test(clean);
    const blank = eligible && (index + seedOffset) % 3 === 1;
    return { token, clean, blank };
  });
}

export function LampClubPanel() {
  const state = useAppStore();
  const { t, language } = useI18n();
  const navigate = useNavigate();

  const [selectedLevel, setSelectedLevel] = useState(1);
  const [verseTexts, setVerseTexts] = useState<Record<string, string>>({});
  const [practicing, setPracticing] = useState<LampVerseEntry | null>(null);
  const [practiceMode, setPracticeMode] = useState<'cloze' | 'flashcard'>('cloze');
  const [revealed, setRevealed] = useState(false);
  const [seed, setSeed] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checkedScore, setCheckedScore] = useState<number | null>(null);

  const activeTranslation = state.preferences.activeTranslation;
  const masteredMap = useMemo(() => new Map(state.lampClub.map((item) => [item.id, item])), [state.lampClub]);

  const currentLevel = useMemo(
    () => LAMP_CLUB_LEVELS.find((lvl) => lvl.level === selectedLevel) ?? LAMP_CLUB_LEVELS[0]!,
    [selectedLevel],
  );

  useEffect(() => {
    let cancelled = false;
    for (const entry of currentLevel.verses) {
      const cacheKey = `${entry.id}:${activeTranslation}`;
      if (verseTexts[cacheKey]) continue;
      void fetchLampVerseText(entry, activeTranslation).then((text) => {
        if (!cancelled && text) {
          setVerseTexts((prev) => ({ ...prev, [cacheKey]: text }));
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [currentLevel, activeTranslation, verseTexts]);

  const startPractice = (entry: LampVerseEntry): void => {
    setPracticing(entry);
    setPracticeMode('cloze');
    setRevealed(false);
    setAnswers({});
    setCheckedScore(null);
    setSeed((s) => s + 1);
  };

  const practicingText = practicing ? (verseTexts[`${practicing.id}:${activeTranslation}`] ?? '') : '';

  const clozeWords = useMemo(
    () => (practicingText ? buildClozeWords(practicingText, seed) : []),
    [practicingText, seed],
  );

  const handleCheckCloze = (): void => {
    const blanks = clozeWords
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => item.blank);
    if (blanks.length === 0) {
      setCheckedScore(100);
      return;
    }
    let hits = 0;
    for (const { item, idx } of blanks) {
      if (normalizeWord(answers[idx] ?? '') === item.clean) hits += 1;
    }
    const score = Math.round((hits / blanks.length) * 100);
    setCheckedScore(score);
  };

  const totalMastered = state.lampClub.length;
  const totalVerses = LAMP_CLUB_LEVELS.reduce((acc, lvl) => acc + lvl.verses.length, 0);

  return (
    <div className="space-y-6">
      <div className="sv-card-hero">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="sv-label mb-1 flex items-center gap-1.5 text-ember-600 dark:text-ember-300">
              <MemorizeIcon size={14} />
              {t('lamp.title')}
            </p>
            <h2 className="font-serif text-2xl text-navy-900 dark:text-parchment-50">
              {totalMastered} / {totalVerses} {t('lamp.levelProgress')}
            </h2>
            <p className="mt-1 text-sm text-navy-600 dark:text-parchment-200/80">{t('lamp.subtitle')}</p>
          </div>
          <div className="w-full sm:w-56">
            <div className="h-2.5 overflow-hidden rounded-full bg-navy-900/10 dark:bg-parchment-100/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ember-500 to-gold-400 transition-all duration-300"
                style={{ width: `${Math.round((totalMastered / Math.max(1, totalVerses)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LAMP_CLUB_LEVELS.map((lvl) => {
          const count = lvl.verses.filter((v) => masteredMap.has(v.id)).length;
          const isSelected = lvl.level === selectedLevel;
          return (
            <button
              key={lvl.level}
              type="button"
              onClick={() => setSelectedLevel(lvl.level)}
              className={[
                'rounded-2xl border p-4 text-left transition-all',
                isSelected
                  ? 'border-ember-500 bg-ember-500/10 shadow-md ring-1 ring-ember-500/30 dark:bg-ember-500/15'
                  : 'border-navy-900/10 bg-white/65 hover:border-ember-500/30 dark:border-parchment-100/10 dark:bg-navy-900/55',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ember-700 dark:text-ember-300">
                  {language === 'es' ? lvl.titleEs : lvl.titleEn}
                </span>
                <span className="rounded-full bg-navy-900/5 px-2 py-0.5 text-xs font-semibold text-navy-700 dark:bg-parchment-100/10 dark:text-parchment-100">
                  {count}/{lvl.verses.length}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-navy-600 dark:text-parchment-200/75">
                {language === 'es' ? lvl.subtitleEs : lvl.subtitleEn}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy-900/10 dark:bg-parchment-100/10">
                <div
                  className="h-full rounded-full bg-ember-500 transition-all"
                  style={{ width: `${(count / lvl.verses.length) * 100}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {currentLevel.verses.map((entry) => {
          const mastered = masteredMap.get(entry.id);
          const text = verseTexts[`${entry.id}:${activeTranslation}`];

          return (
            <li
              key={entry.id}
              className={`sv-card flex flex-col justify-between gap-3 border-l-4 ${
                mastered ? 'border-l-sage-500' : 'border-l-ember-500/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-navy-900 dark:text-parchment-50">
                      {entry.referenceLabel}
                    </h3>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-navy-400 dark:text-parchment-300/60">
                      {activeTranslation}
                    </p>
                  </div>

                  {mastered ? (
                    <button
                      type="button"
                      onClick={() => void unmarkLampVerseMastered(entry.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-sage-500/15 px-2.5 py-1 text-xs font-semibold text-sage-500 dark:text-sage-300"
                    >
                      <CheckIcon size={13} />
                      {t('lamp.mastered')}
                    </button>
                  ) : null}
                </div>

                <p className="sv-scripture mt-3 text-base text-navy-800 dark:text-parchment-100">
                  {text ?? <span className="text-xs opacity-60">{t('lamp.loadText')}</span>}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={!text}
                  onClick={() => startPractice(entry)}
                  className="sv-btn sv-btn-primary min-h-9 px-3 py-1.5 text-xs disabled:opacity-50"
                >
                  <SparklesIcon size={14} />
                  {t('lamp.practice')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void goToChapter(entry.bookNumber, entry.chapter);
                    navigate(ROUTES.reader, { state: { verse: entry.verseStart } });
                  }}
                  className="sv-btn sv-btn-ghost min-h-9 px-3 py-1.5 text-xs"
                >
                  <BookIcon size={14} />
                  {t('notes.openInReader')}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {practicing ? (
        <Dialog
          title={`${t('lamp.practiceTitle')} · ${practicing.referenceLabel}`}
          subtitle={activeTranslation}
          onClose={() => setPracticing(null)}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPracticeMode('cloze')}
                className={`sv-btn border text-xs ${
                  practiceMode === 'cloze'
                    ? 'border-ember-500 bg-ember-500/15 text-navy-900 dark:text-parchment-50'
                    : 'border-navy-900/15 text-navy-600 dark:border-parchment-100/15 dark:text-parchment-200'
                }`}
              >
                {t('lamp.modeCloze')}
              </button>
              <button
                type="button"
                onClick={() => setPracticeMode('flashcard')}
                className={`sv-btn border text-xs ${
                  practiceMode === 'flashcard'
                    ? 'border-ember-500 bg-ember-500/15 text-navy-900 dark:text-parchment-50'
                    : 'border-navy-900/15 text-navy-600 dark:border-parchment-100/15 dark:text-parchment-200'
                }`}
              >
                {t('lamp.modeFlashcard')}
              </button>
            </div>

            {practiceMode === 'cloze' ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-navy-900/10 bg-white/70 p-4 font-serif text-lg leading-loose text-navy-900 dark:border-parchment-100/15 dark:bg-navy-950/60 dark:text-parchment-50">
                  {clozeWords.map((word, idx) =>
                    word.blank ? (
                      <span key={idx} className="mx-1 inline-block align-baseline">
                        <input
                          type="text"
                          value={answers[idx] ?? ''}
                          onChange={(event) => {
                            setCheckedScore(null);
                            setAnswers((prev) => ({ ...prev, [idx]: event.target.value }));
                          }}
                          style={{ width: `${Math.max(word.clean.length + 2, 6)}ch` }}
                          className={[
                            'rounded-md border px-1.5 py-0.5 text-center font-sans text-sm outline-none transition-colors',
                            checkedScore === null
                              ? 'border-ember-500/40 bg-parchment-50 text-navy-900 focus:border-ember-500 dark:bg-navy-900 dark:text-parchment-50'
                              : normalizeWord(answers[idx] ?? '') === word.clean
                                ? 'border-sage-500 bg-sage-500/15 text-sage-500 dark:text-sage-300'
                                : 'border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-300',
                          ].join(' ')}
                          aria-label={`Palabra ${idx + 1}`}
                        />
                      </span>
                    ) : (
                      <span key={idx} className="mr-1.5 inline-block">
                        {word.token}
                      </span>
                    ),
                  )}
                </div>

                {checkedScore !== null ? (
                  <p className="text-sm font-semibold text-ember-700 dark:text-ember-300">
                    {t('lamp.score')}: {checkedScore}%
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <button type="button" className="sv-btn sv-btn-primary" onClick={handleCheckCloze}>
                    {t('lamp.checkAnswers')}
                  </button>
                  <button
                    type="button"
                    className="sv-btn sv-btn-ghost"
                    onClick={() => {
                      setAnswers({});
                      setCheckedScore(null);
                      setSeed((s) => s + 1);
                    }}
                  >
                    <RefreshIcon size={15} />
                    {t('lamp.retryPractice')}
                  </button>
                  <button
                    type="button"
                    className="sv-btn sv-btn-ghost text-sage-500 dark:text-sage-300"
                    onClick={() => {
                      void markLampVerseMastered(practicing, checkedScore ?? 100, activeTranslation);
                      setPracticing(null);
                    }}
                  >
                    <CheckIcon size={15} />
                    {t('lamp.markMastered')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-navy-900/10 bg-white/70 p-6 text-center dark:border-parchment-100/15 dark:bg-navy-950/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ember-600 dark:text-ember-300">
                    {practicing.referenceLabel}
                  </p>
                  {revealed ? (
                    <p className="sv-scripture mx-auto mt-4 text-navy-900 dark:text-parchment-50">
                      {practicingText}
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="sv-btn sv-btn-primary mt-5"
                      onClick={() => setRevealed(true)}
                    >
                      {t('lamp.reveal')}
                    </button>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="sv-btn sv-btn-primary"
                    onClick={() => {
                      void markLampVerseMastered(practicing, 100, activeTranslation);
                      setPracticing(null);
                    }}
                  >
                    <CheckIcon size={15} />
                    {t('lamp.markMastered')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}
