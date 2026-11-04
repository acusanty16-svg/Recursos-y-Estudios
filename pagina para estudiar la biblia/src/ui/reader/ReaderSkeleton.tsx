import { useI18n } from '@ui/hooks/useI18n';

/** Esqueleto de lectura: mantiene el ritmo visual mientras llega el capítulo. */
export function ReaderSkeleton() {
  const { t } = useI18n();

  return (
    <div role="status" aria-label={t('reader.loading')} className="animate-pulse">
      <div className="mb-6 border-b border-navy-900/10 pb-5 dark:border-parchment-100/10">
        <div className="sv-skeleton h-3 w-16" />
        <div className="sv-skeleton mt-3 h-9 w-52" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className="flex gap-3">
            <div className="sv-skeleton mt-1 h-3 w-5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="sv-skeleton h-4 w-full" />
              <div className="sv-skeleton h-4 w-11/12" />
              <div className={`sv-skeleton h-4 ${index % 3 === 0 ? 'w-2/3' : 'w-4/5'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
