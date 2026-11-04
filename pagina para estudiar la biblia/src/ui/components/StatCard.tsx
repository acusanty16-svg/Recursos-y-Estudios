import type { ReactNode } from 'react';

interface StatCardProps {
  readonly label: string;
  readonly value: string | number;
  readonly icon?: ReactNode;
  readonly hint?: string;
}

export function StatCard({ label, value, icon, hint }: StatCardProps) {
  return (
    <div className="sv-card flex items-start gap-3 p-4">
      {icon ? (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy-900/5 text-navy-500 dark:bg-parchment-100/10 dark:text-ember-300">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400 dark:text-parchment-300/60">
          {label}
        </p>
        <p className="mt-1 font-serif text-2xl leading-none text-navy-900 dark:text-parchment-50">{value}</p>
        {hint ? <p className="mt-1 text-xs text-navy-500 dark:text-parchment-200/60">{hint}</p> : null}
      </div>
    </div>
  );
}
