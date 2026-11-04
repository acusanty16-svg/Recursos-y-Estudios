import { MAX_IMPORT_BYTES } from '../model/constants';
import { appError, ok, toAppError, type AppError, type Result } from '../model/errors';

export interface PickedFile {
  readonly handle: FileSystemFileHandle;
  readonly text: string;
  readonly name: string;
}

export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function';
}

const JSON_PICKER_TYPES: readonly SvFilePickerAcceptType[] = [
  {
    description: 'JSON',
    accept: { 'application/json': ['.json'] },
  },
];

/**
 * Sustituto obligatorio de <input type="file">.
 * Devuelve un FileSystemFileHandle persistible en IndexedDB.
 */
export async function pickJsonFile(pickerId: string): Promise<Result<PickedFile, AppError>> {
  if (!isFileSystemAccessSupported()) {
    return {
      ok: false,
      error: appError('UNSUPPORTED', 'File System Access API no está disponible en este navegador.', {
        retryable: false,
      }),
    };
  }

  try {
    const handles = await window.showOpenFilePicker({
      multiple: false,
      excludeAcceptAllOption: false,
      types: JSON_PICKER_TYPES,
      id: pickerId,
    });

    const handle = handles[0];
    if (!handle) {
      return { ok: false, error: appError('ABORTED', 'No se seleccionó ningún archivo.', { retryable: false }) };
    }

    const read = await readHandleAsText(handle);
    if (!read.ok) return read;

    return ok({ handle, text: read.value, name: handle.name });
  } catch (cause) {
    return { ok: false, error: toAppError(cause, 'No se pudo abrir el archivo') };
  }
}

export async function readHandleAsText(handle: FileSystemFileHandle): Promise<Result<string, AppError>> {
  try {
    const file = await handle.getFile();
    if (file.size > MAX_IMPORT_BYTES) {
      return {
        ok: false,
        error: appError('VALIDATION', `El archivo supera el límite de ${MAX_IMPORT_BYTES / 1024 / 1024} MB.`, {
          retryable: false,
        }),
      };
    }
    const text = await file.text();
    return ok(text);
  } catch (cause) {
    return { ok: false, error: toAppError(cause, 'No se pudo leer el archivo') };
  }
}

/** Verifica el permiso sin mostrar prompt (reconexión silenciosa). */
export async function hasReadPermission(handle: FileSystemFileHandle): Promise<boolean> {
  try {
    return (await handle.queryPermission({ mode: 'read' })) === 'granted';
  } catch {
    return false;
  }
}

/** Solicita permiso; debe ejecutarse dentro de un gesto del usuario. */
export async function requestReadPermission(handle: FileSystemFileHandle): Promise<Result<boolean, AppError>> {
  try {
    const state = await handle.requestPermission({ mode: 'read' });
    return ok(state === 'granted');
  } catch (cause) {
    return { ok: false, error: toAppError(cause, 'No se pudo obtener permiso de lectura') };
  }
}
