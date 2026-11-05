/**
 * Cliente mínimo de Google Drive para este proyecto.
 *
 * Solo se usa el scope `drive.file`: la app únicamente puede ver y modificar
 * los archivos que ella misma crea. No se toca el resto del Drive del usuario.
 */

import { parseSnapshotJson } from '../model/sync';
import type { SyncSnapshot } from '../model/sync';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3';

export const SYNC_FILE_NAME = "Santi's Versicles - Datos.json";
export const EXPORT_FILE_NAME = "Santi's Versicles - Notas.md";

interface DriveFile {
  readonly id: string;
  readonly name: string;
  readonly modifiedTime?: string;
}

export class DriveAuthError extends Error {
  constructor() {
    super('La sesión de Google ha caducado.');
    this.name = 'DriveAuthError';
  }
}

export class DriveError extends Error {
  readonly status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = 'DriveError';
    this.status = status;
  }
}

function escapeQueryValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function checkedFetch(token: string, input: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) throw new DriveAuthError();
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { error?: { message?: unknown } };
      if (typeof body.error?.message === 'string') detail = body.error.message;
    } catch {
      // Sin cuerpo JSON legible.
    }
    throw new DriveError(detail || 'No se pudo hablar con Google Drive.', response.status);
  }
  return response;
}

async function findFileByName(token: string, name: string): Promise<DriveFile | null> {
  const params = new URLSearchParams({
    q: `name = '${escapeQueryValue(name)}' and trashed = false`,
    fields: 'files(id,name,modifiedTime)',
    spaces: 'drive',
    pageSize: '10',
  });

  const response = await checkedFetch(token, `${DRIVE_API}/files?${params.toString()}`);
  const data = (await response.json()) as { files?: DriveFile[] };
  return data.files?.[0] ?? null;
}

function multipartBody(
  metadata: Record<string, unknown>,
  content: string,
  contentType: string,
): { readonly body: string; readonly contentType: string } {
  const boundary = `sv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    `Content-Type: ${contentType}; charset=UTF-8`,
    '',
    content,
    `--${boundary}--`,
    '',
  ].join('\r\n');

  return { body, contentType: `multipart/related; boundary=${boundary}` };
}

async function createTextFile(
  token: string,
  name: string,
  content: string,
  mimeType: string,
): Promise<DriveFile> {
  const multipart = multipartBody({ name, mimeType }, content, mimeType);
  const response = await checkedFetch(
    token,
    `${DRIVE_UPLOAD}/files?uploadType=multipart&fields=id,name,modifiedTime`,
    {
      method: 'POST',
      headers: { 'Content-Type': multipart.contentType },
      body: multipart.body,
    },
  );
  return (await response.json()) as DriveFile;
}

async function updateTextFile(
  token: string,
  id: string,
  content: string,
  mimeType: string,
): Promise<void> {
  await checkedFetch(
    token,
    `${DRIVE_UPLOAD}/files/${encodeURIComponent(id)}?uploadType=media&fields=id,modifiedTime`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': `${mimeType}; charset=UTF-8` },
      body: content,
    },
  );
}

async function downloadFile(token: string, id: string): Promise<string> {
  const response = await checkedFetch(
    token,
    `${DRIVE_API}/files/${encodeURIComponent(id)}?alt=media`,
  );
  return response.text();
}

async function writeNamedFile(
  token: string,
  name: string,
  content: string,
  mimeType: string,
): Promise<void> {
  const existing = await findFileByName(token, name);
  if (existing) {
    await updateTextFile(token, existing.id, content, mimeType);
    return;
  }
  await createTextFile(token, name, content, mimeType);
}

/** Descarga la copia de sincronización, si existe. */
export async function downloadSyncSnapshot(token: string): Promise<SyncSnapshot | null> {
  const file = await findFileByName(token, SYNC_FILE_NAME);
  if (!file) return null;

  const raw = await downloadFile(token, file.id);
  const snapshot = parseSnapshotJson(raw);
  if (!snapshot) {
    throw new DriveError(
      'El archivo de sincronización de Drive no tiene un formato válido. No se ha sobrescrito.',
    );
  }
  return snapshot;
}

/** Sube la copia de sincronización, creándola la primera vez. */
export async function uploadSyncSnapshot(token: string, snapshot: SyncSnapshot): Promise<void> {
  await writeNamedFile(token, SYNC_FILE_NAME, JSON.stringify(snapshot), 'application/json');
}

/** Crea o actualiza la exportación Markdown visible en Drive. */
export async function uploadMarkdownToDrive(token: string, markdown: string): Promise<void> {
  await writeNamedFile(token, EXPORT_FILE_NAME, markdown, 'text/markdown');
}
