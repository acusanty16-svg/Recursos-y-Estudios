import { useState, type DragEvent } from 'react';
import type { ImportKind, ImportedFileMeta } from '@model/types';
import { useAppStore } from '@controller/store';
import { forgetResource, importDroppedResource, importResource, loadResourceJson, reconnectResource } from '@controller/import.controller';
import { useI18n, formatShortDate } from '@ui/hooks/useI18n';
import { PageHeader } from '@ui/components/PageHeader';
import { BookIcon, CalendarIcon, CheckIcon, ExternalIcon, FlameIcon, MusicIcon, RefreshIcon, TrashIcon, UploadIcon } from '@ui/components/icons';

interface ResourceDefinition {
  readonly kind: ImportKind;
  readonly titleKey: 'import.versiculos' | 'import.plan' | 'import.recordatorios' | 'import.canciones';
  readonly shape: string;
  readonly Icon: typeof BookIcon;
}

const RESOURCES: readonly ResourceDefinition[] = [
  {
    kind: 'versiculos',
    titleKey: 'import.versiculos',
    shape: '{ version, generatedAt, verses: [{ bookNumber, chapter, verse, translations }] }',
    Icon: BookIcon,
  },
  {
    kind: 'plan-lectura',
    titleKey: 'import.plan',
    shape: '{ version, plans: [{ id, titleEs, titleEn, days: [...] }] }',
    Icon: CalendarIcon,
  },
  {
    kind: 'recordatorios',
    titleKey: 'import.recordatorios',
    shape: '{ version, reminders: [{ id, time, days, enabled }] }',
    Icon: FlameIcon,
  },
  {
    kind: 'canciones',
    titleKey: 'import.canciones',
    shape: '{ version, songs: [{ id, title, artist, originalKey, category, content }] }',
    Icon: MusicIcon,
  },
];

function isFileHandle(handle: FileSystemHandle): handle is FileSystemFileHandle {
  return handle.kind === 'file' && typeof (handle as FileSystemFileHandle).getFile === 'function';
}

export function ImportPage() {
  const state = useAppStore();
  const { t, locale } = useI18n();
  const [dragging, setDragging] = useState<ImportKind | null>(null);
  const [busy, setBusy] = useState<ImportKind | null>(null);
  const [preview, setPreview] = useState<{ kind: ImportKind; text: string } | null>(null);

  const metaFor = (kind: ImportKind): ImportedFileMeta | undefined =>
    state.importedMeta.find((meta) => meta.kind === kind);

  const run = async (kind: ImportKind, action: () => Promise<unknown>): Promise<void> => {
    setBusy(kind);
    try {
      await action();
    } finally {
      setBusy(null);
    }
  };

  const handleDrop = async (kind: ImportKind, event: DragEvent<HTMLElement>): Promise<void> => {
    event.preventDefault();
    setDragging(null);
    const item = event.dataTransfer.items[0];
    const handle = await item?.getAsFileSystemHandle?.();
    if (handle && isFileHandle(handle)) {
      await run(kind, () => importDroppedResource(kind, handle));
    }
  };

  const showPreview = async (kind: ImportKind): Promise<void> => {
    const result = await loadResourceJson(kind);
    if (result.ok) {
      setPreview({ kind, text: JSON.stringify(result.value, null, 2).slice(0, 4000) });
    } else {
      setPreview({ kind, text: result.error.message });
    }
  };

  return (
    <div>
      <PageHeader title={t('import.title')} subtitle={t('import.subtitle')} />

      {!state.fileSystemSupported ? (
        <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-300/15 p-4 text-sm text-navy-800 dark:text-parchment-100">
          {t('import.unsupported')}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {RESOURCES.map(({ kind, titleKey, shape, Icon }) => {
          const meta = metaFor(kind);
          const isBusy = busy === kind;
          const isDragging = dragging === kind;

          return (
            <section
              key={kind}
              className={`sv-card flex flex-col transition-colors ${
                isDragging ? 'border-ember-500 bg-ember-400/10' : ''
              }`}
              aria-labelledby={`import-${kind}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(kind);
              }}
              onDragLeave={() => setDragging(null)}
              onDrop={(event) => void handleDrop(kind, event)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-navy-900/5 text-navy-600 dark:bg-parchment-100/10 dark:text-ember-300">
                    <Icon size={20} />
                  </span>
                  <h2 id={`import-${kind}`} className="font-serif text-lg text-navy-900 dark:text-parchment-50">
                    {t(titleKey)}
                  </h2>
                </div>
                {meta ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage-300/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-700 dark:bg-sage-500/20 dark:text-parchment-100">
                    <CheckIcon size={12} />
                    {t('import.connected')}
                  </span>
                ) : null}
              </div>

              <code className="mt-3 block overflow-x-auto rounded-lg bg-navy-950/90 p-2.5 text-[10px] leading-relaxed text-parchment-200">
                {shape}
              </code>

              <div className="mt-4 flex-1 text-xs text-navy-500 dark:text-parchment-200/70">
                {meta ? (
                  <>
                    <p className="font-medium text-navy-800 dark:text-parchment-100">{meta.fileName}</p>
                    <p className="mt-1">
                      {t('import.lastImport')}: {formatShortDate(meta.importedAt, locale)} · {meta.itemCount}{' '}
                      {t('import.items')}
                    </p>
                  </>
                ) : (
                  <p>{t('import.noFile')}</p>
                )}
                <p className="mt-2 leading-relaxed opacity-80">{t('import.memory')}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="sv-btn sv-btn-primary"
                  disabled={isBusy || !state.fileSystemSupported}
                  onClick={() => void run(kind, () => importResource(kind))}
                >
                  <UploadIcon size={16} />
                  {isBusy ? t('common.loading') : t('import.pick')}
                </button>

                {meta ? (
                  <>
                    <button
                      type="button"
                      className="sv-btn sv-btn-ghost"
                      disabled={isBusy}
                      onClick={() => void run(kind, () => reconnectResource(kind))}
                    >
                      <RefreshIcon size={16} />
                      {t('import.reconnect')}
                    </button>
                    <button
                      type="button"
                      className="sv-btn sv-btn-ghost"
                      onClick={() => void showPreview(kind)}
                    >
                      <ExternalIcon size={16} />
                      {t('import.preview')}
                    </button>
                    <button
                      type="button"
                      className="sv-btn sv-btn-ghost text-rose-500"
                      onClick={() => void forgetResource(kind)}
                    >
                      <TrashIcon size={16} />
                      {t('import.clear')}
                    </button>
                  </>
                ) : null}
              </div>

              <p className="mt-3 text-[11px] text-navy-400 dark:text-parchment-300/50">{t('import.dragHint')}</p>
            </section>
          );
        })}
      </div>

      {preview ? (
        <section className="sv-card mt-6" aria-labelledby="preview-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="preview-title" className="sv-label mb-0">
              {t('import.preview')} · {preview.kind}
            </h2>
            <button type="button" className="sv-btn sv-btn-ghost" onClick={() => setPreview(null)}>
              {t('common.close')}
            </button>
          </div>
          <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-navy-950/90 p-4 text-[11px] leading-relaxed text-parchment-200 sv-scroll">
            {preview.text}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
