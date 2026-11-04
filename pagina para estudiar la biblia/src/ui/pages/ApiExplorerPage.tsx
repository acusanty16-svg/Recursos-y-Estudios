import { useCallback, useEffect, useRef } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import type { ImportKind } from '@model/types';
import { loadResourceJson } from '@controller/import.controller';
import { useI18n } from '@ui/hooks/useI18n';
import { PageHeader } from '@ui/components/PageHeader';
import { DownloadIcon } from '@ui/components/icons';

const LOCAL_PREFIX = 'https://local.santis/';

const LOCAL_KIND_BY_PATH: Record<string, ImportKind> = {
  versiculos: 'versiculos',
  planes: 'plan-lectura',
  recordatorios: 'recordatorios',
};

/**
 * Swagger UI estático.
 * Decisión: no hay backend. Los endpoints `local.santis` se resuelven leyendo
 * los JSON validados de IndexedDB y sirviéndolos como Blob URL, de modo que
 * "Try it out" funciona sin infraestructura adicional.
 */
export default function ApiExplorerPage() {
  const { t } = useI18n();
  const blobUrls = useRef<Set<string>>(new Set());

  // Los Blob URL sobreviven a la petición de Swagger: se liberan al desmontar.
  useEffect(() => {
    const urls = blobUrls.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  const requestInterceptor = useCallback(
    async (request: { url?: string } & Record<string, unknown>) => {
      const url = typeof request.url === 'string' ? request.url : '';
      if (!url.startsWith(LOCAL_PREFIX)) return request;

      const segment = url.slice(LOCAL_PREFIX.length).replace(/\/+$/, '');
      const kind = LOCAL_KIND_BY_PATH[segment];
      if (!kind) return request;

      const result = await loadResourceJson(kind);
      const payload: unknown = result.ok ? result.value : { error: result.error.message };
      const blobUrl = URL.createObjectURL(
        new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
      );
      blobUrls.current.add(blobUrl);

      return { ...request, url: blobUrl };
    },
    [],
  );

  return (
    <div>
      <PageHeader
        title={t('api.title')}
        subtitle={t('api.subtitle')}
        actions={
          <a href="/openapi.yaml" download className="sv-btn sv-btn-ghost border border-navy-900/15 dark:border-parchment-100/15">
            <DownloadIcon size={16} />
            {t('api.downloadSpec')}
          </a>
        }
      />

      <p className="mb-5 rounded-lg bg-navy-900/5 px-4 py-3 text-xs leading-relaxed text-navy-600 dark:bg-parchment-100/5 dark:text-parchment-200/70">
        {t('api.note')}
      </p>

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-navy-900/10 bg-white/70 p-2 dark:border-parchment-100/10 dark:bg-navy-900/40">
        <SwaggerUI
          url="/openapi.yaml"
          docExpansion="list"
          defaultModelsExpandDepth={1}
          tryItOutEnabled
          requestInterceptor={requestInterceptor}
          displayRequestDuration
        />
      </div>
    </div>
  );
}
