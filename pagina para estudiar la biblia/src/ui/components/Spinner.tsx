export function Spinner({ label }: { readonly label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-sm text-navy-500 dark:text-parchment-200/70">
      <span
        className="inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />
      {label ? <span role="status">{label}</span> : null}
    </div>
  );
}
