import type { ReactNode } from 'react';
import { useAppStore, dismissToast, type ToastTone } from '@controller/store';
import { useI18n } from '@ui/hooks/useI18n';
import { CheckIcon, CloseIcon } from './icons';

const TONE_STYLES: Record<ToastTone, string> = {
  info: 'border-navy-900/15 bg-white text-navy-900 dark:border-parchment-100/15 dark:bg-navy-800 dark:text-parchment-100',
  success:
    'border-sage-500/40 bg-sage-300/25 text-navy-900 dark:border-sage-300/30 dark:bg-sage-500/20 dark:text-parchment-100',
  error:
    'border-rose-500/40 bg-rose-300/25 text-navy-900 dark:border-rose-300/30 dark:bg-rose-500/20 dark:text-parchment-100',
};

export function Toast(): ReactNode {
  const { toast } = useAppStore();
  const { t } = useI18n();
  if (!toast) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${TONE_STYLES[toast.tone]}`}
      >
        {toast.tone === 'success' ? <CheckIcon size={18} className="mt-0.5 shrink-0" /> : null}
        <p className="text-sm leading-snug">{toast.message}</p>
        <button
          type="button"
          onClick={dismissToast}
          aria-label={t('common.dismiss')}
          className="-m-2 ml-auto inline-flex size-9 shrink-0 items-center justify-center rounded-lg opacity-70 hover:opacity-100"
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );
}
