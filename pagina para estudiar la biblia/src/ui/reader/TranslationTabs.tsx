import { motion } from 'motion/react';
import { TRANSLATIONS } from '@model/constants';
import type { TranslationId } from '@model/types';
import { useI18n } from '@ui/hooks/useI18n';
import { ChevronDownIcon, ColumnsIcon } from '@ui/components/icons';

interface TranslationTabsProps {
  readonly active: TranslationId;
  readonly compare: TranslationId | null;
  readonly onSelect: (translationId: TranslationId) => void;
  readonly onCompare: (translationId: TranslationId | null) => void;
  readonly onSwap?: (() => void) | undefined;
}

export function TranslationTabs({ active, compare, onSelect, onCompare, onSwap }: TranslationTabsProps) {
  const { t } = useI18n();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        role="group"
        aria-label={t('reader.translation')}
        className="inline-flex shrink-0 items-center rounded-full border border-navy-900/10 bg-parchment-200/60 p-0.5 dark:border-parchment-100/10 dark:bg-navy-900"
      >
        {TRANSLATIONS.map((translation) => {
          const isActive = translation.id === active;
          return (
            <button
              key={translation.id}
              type="button"
              onClick={() => onSelect(translation.id)}
              aria-pressed={isActive}
              title={translation.label}
              className={[
                'relative z-10 inline-flex min-h-10 items-center rounded-full px-2.5 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs',
                isActive
                  ? 'text-parchment-50 dark:text-navy-950'
                  : 'text-navy-500 hover:text-navy-900 dark:text-navy-300 dark:hover:text-parchment-100',
              ].join(' ')}
            >
              {isActive ? (
                <motion.span
                  layoutId="reader-translation-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute inset-0 -z-10 rounded-full bg-navy-900 shadow-xs dark:bg-ember-400"
                />
              ) : null}
              {translation.shortLabel}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="relative shrink-0">
          <ColumnsIcon
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-current opacity-70"
          />
          <select
            id="compare-select"
            aria-label={t('reader.compareWith')}
            value={compare ?? ''}
            onChange={(event) => {
              const value = event.target.value;
              onCompare(value === '' ? null : (value as TranslationId));
            }}
            className={[
              'min-h-10 appearance-none rounded-full border py-1.5 pl-7 pr-7 text-[11px] font-semibold transition-colors sm:pl-8 sm:pr-8 sm:text-xs',
              compare
                ? 'border-ember-500/35 bg-ember-500/10 text-ember-700 dark:border-ember-400/30 dark:bg-ember-400/10 dark:text-ember-300'
                : 'border-navy-900/10 bg-white/80 text-navy-600 hover:bg-white dark:border-parchment-100/10 dark:bg-navy-900 dark:text-navy-300 dark:hover:bg-navy-800',
            ].join(' ')}
          >
            <option value="">{t('reader.compare')}</option>
            {TRANSLATIONS.filter((translation) => translation.id !== active).map((translation) => (
              <option key={translation.id} value={translation.id}>
                {translation.shortLabel}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            size={12}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60"
          />
        </div>

        {compare && onSwap ? (
          <motion.button
            type="button"
            whileTap={{ rotate: 180, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            onClick={onSwap}
            aria-label={t('reader.swapTranslations')}
            title={t('reader.swapTranslations')}
            className="inline-flex size-10 items-center justify-center rounded-full border border-ember-500/30 bg-ember-500/10 font-mono text-xs font-bold text-ember-700 transition-colors hover:bg-ember-500/20 dark:border-ember-400/25 dark:text-ember-300"
          >
            ⇄
          </motion.button>
        ) : null}
      </div>
    </div>
  );
}
