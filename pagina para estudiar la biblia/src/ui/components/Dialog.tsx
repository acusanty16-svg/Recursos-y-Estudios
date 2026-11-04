import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@ui/hooks/useI18n';
import { useVisualViewport } from '@ui/hooks/useVisualViewport';
import { CloseIcon } from './icons';

interface DialogProps {
  readonly title: string;
  readonly subtitle?: string | undefined;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly size?: 'md' | 'lg';
}

/**
 * Diálogo base con animación de entrada, cierre por Escape y bloqueo de scroll.
 * Se usa tanto para notas como para el selector de referencias.
 */
export function Dialog({ title, subtitle, onClose, children, size = 'md' }: DialogProps) {
  const { t } = useI18n();
  const viewport = useVisualViewport();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-x-0 z-50 flex items-end justify-center bg-navy-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      style={{ top: viewport.offsetTop, height: viewport.height, bottom: 'auto' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sv-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={[
          'sv-dialog-panel max-h-full w-full overflow-y-auto overscroll-contain rounded-t-2xl border border-navy-900/10 bg-parchment-50 p-5 shadow-2xl sv-scroll sm:rounded-2xl dark:border-parchment-100/15 dark:bg-navy-900',
          size === 'lg' ? 'max-w-2xl' : 'max-w-lg',
        ].join(' ')}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="sv-dialog-title" className="font-serif text-xl text-navy-900 dark:text-parchment-50">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-xs text-navy-500 dark:text-parchment-300/70">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-900/5 dark:text-parchment-300 dark:hover:bg-parchment-100/10"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <CloseIcon size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
