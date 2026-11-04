import type { ReactNode } from 'react';

interface EmptyStateProps {
  readonly icon?: ReactNode;
  readonly title: string;
  readonly body?: string;
  readonly action?: ReactNode;
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-navy-900/15 px-6 py-12 text-center dark:border-parchment-100/15">
      {icon ? <div className="mb-3 text-navy-400 dark:text-parchment-300/70">{icon}</div> : null}
      <p className="font-serif text-lg text-navy-800 dark:text-parchment-100">{title}</p>
      {body ? <p className="mt-2 max-w-sm text-sm text-navy-500 dark:text-parchment-200/70">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
