import { TRANSLATIONS } from '@model/constants';
import type { TranslationId } from '@model/types';
import { useI18n } from '@ui/hooks/useI18n';
import { ChevronDownIcon, ColumnsIcon } from '@ui/components/icons';

interface TranslationTabsProps {
  readonly active: TranslationId;
  readonly compare: TranslationId | null;
  readonly onSelect: (translationId: TranslationId) => void;
  readonly onCompare: (translationId: TranslationId | null) => void;
}

export function TranslationTabs({ active, compare, onSelect, onCompare }: TranslationTabsProps) {
  const { t } = useI18n();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        role="group"
        aria-label={t('reader.translation')}
        className="inline-flex shrink-0 items-center rounded-full border border-navy-900/10 bg-white/50 p-0.5 dark:border-parchment-100/10 dark:bg-navy-900/60"
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
                'inline-flex min-h-11 items-center rounded-full px-2.5 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs',
                isActive
                  ? 'bg-navy-900 text-parchment-50 shadow-sm dark:bg-ember-600 dark:text-white'
                  : 'text-navy-600 hover:bg-navy-900/5 dark:text-parchment-200/80 dark:hover:bg-parchment-100/10',
              ].join(' ')}
            >
              {translation.shortLabel}
            </button>
          );
        })}
      </div>

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
            'min-h-11 appearance-none rounded-full border py-2 pl-7 pr-7 text-[11px] font-semibold transition-colors sm:pl-8 sm:pr-8 sm:text-xs',
            compare
              ? 'border-sky-500/40 bg-sky-300/15 text-sky-800 dark:border-sky-300/25 dark:bg-sky-400/10 dark:text-sky-200'
              : 'border-navy-900/10 bg-white/50 text-navy-600 hover:bg-white dark:border-parchment-100/10 dark:bg-navy-900/60 dark:text-parchment-200/80 dark:hover:bg-navy-800',
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
    </div>
  );
}
