import { APP_NAME, APP_SHORT_NAME } from '@model/constants';

export function BrandMark({ size = 40 }: { readonly size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={APP_NAME}
      className="shrink-0"
    >
      <rect width="48" height="48" rx="12" fill="#12151C" stroke="#E0B45A" strokeOpacity="0.28" strokeWidth="1.2" />
      <path
        d="M12 14.5c3.6-1.6 7.2-1.6 12 0v20c-4.8-1.6-8.4-1.6-12 0v-20Z"
        fill="none"
        stroke="#FAF8F4"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M36 14.5c-3.6-1.6-7.2-1.6-12 0v20c4.8-1.6 8.4-1.6 12 0v-20Z"
        fill="none"
        stroke="#FAF8F4"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M24 14.5v20" stroke="#E0B45A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="10" r="2" fill="#E0B45A" />
    </svg>
  );
}

export function Brand({ compact = false }: { readonly compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <BrandMark size={compact ? 32 : 40} />
      <div className="min-w-0">
        <p className="truncate font-serif text-lg leading-none text-navy-900 dark:text-parchment-50">
          {compact ? APP_SHORT_NAME : APP_NAME}
        </p>
        {compact ? null : (
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-navy-400 dark:text-parchment-300/60">
            RV1960 · NTV · NLT
          </p>
        )}
      </div>
    </div>
  );
}
