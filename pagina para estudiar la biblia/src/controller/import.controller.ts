import { appError, errorMessage, type AppError, type Result } from '../model/errors';
import type { ImportKind, ImportedFileMeta } from '../model/types';
import { translate } from '../i18n';
import { validateReadingPlans, validateReminders, validateVersiculos } from '../rsc';
import {
  deleteFileHandle,
  getFileHandle,
  getResourceData,
  saveFileHandle,
  saveImportedMeta,
  saveResourceData,
  clearResourceData,
} from './idb';
import {
  hasReadPermission,
  isFileSystemAccessSupported,
  pickJsonFile,
  readHandleAsText,
  requestReadPermission,
} from './fs-access.service';
import { appStore, showToast } from './store';

export interface ImportOutcome {
  readonly kind: ImportKind;
  readonly fileName: string;
  readonly itemCount: number;
}

type Validator = (input: unknown) => Result<unknown, AppError>;

const VALIDATORS: Record<ImportKind, { validate: Validator; count: (value: unknown) => number }> = {
  versiculos: {
    validate: (input) => validateVersiculos(input),
    count: (value) => countArrayProp(value, 'verses'),
  },
  'plan-lectura': {
    validate: (input) => validateReadingPlans(input),
    count: (value) => countArrayProp(value, 'plans'),
  },
  recordatorios: {
    validate: (input) => validateReminders(input),
    count: (value) => countArrayProp(value, 'reminders'),
  },
};

function countArrayProp(value: unknown, key: string): number {
  if (typeof value !== 'object' || value === null) return 0;
  const record = value as Record<string, unknown>;
  const array = record[key];
  return Array.isArray(array) ? array.length : 0;
}

/** Valida el texto JSON y devuelve el valor tipado + su serialización canónica. */
function parseAndValidate(
  kind: ImportKind,
  text: string,
): Result<{ readonly value: unknown; readonly canonical: string; readonly itemCount: number }, AppError> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (cause) {
    return {
      ok: false,
      error: appError('PARSE', 'El archivo no contiene JSON válido.', { cause, retryable: false }),
    };
  }

  const validator = VALIDATORS[kind];
  const result = validator.validate(parsed);
  if (!result.ok) return result;

  return {
    ok: true,
    value: {
      value: result.value,
      canonical: JSON.stringify(result.value),
      itemCount: validator.count(result.value),
    },
  };
}

/** Flujo principal: picker → parse → Zod → IndexedDB → estado. */
export async function importResource(kind: ImportKind): Promise<Result<ImportOutcome, AppError>> {
  const language = appStore.getState().preferences.uiLanguage;

  if (!isFileSystemAccessSupported()) {
    const error = appError('UNSUPPORTED', translate(language, 'import.unsupported'), { retryable: false });
    showToast(error.message, 'error');
    return { ok: false, error };
  }

  const picked = await pickJsonFile(`sv-${kind}`);
  if (!picked.ok) {
    if (picked.error.code !== 'ABORTED') showToast(picked.error.message, 'error');
    return { ok: false, error: picked.error };
  }

  const validated = parseAndValidate(kind, picked.value.text);
  if (!validated.ok) {
    showToast(`${translate(language, 'import.error')}: ${validated.error.message}`, 'error');
    return { ok: false, error: validated.error };
  }

  const meta: ImportedFileMeta = {
    kind,
    fileName: picked.value.name,
    importedAt: Date.now(),
    itemCount: validated.value.itemCount,
  };

  try {
    await saveFileHandle(kind, picked.value.handle);
    await saveResourceData(kind, validated.value.canonical);
    await saveImportedMeta(meta);
  } catch (cause) {
    const error = appError('STORAGE', 'El archivo es válido pero no se pudo guardar localmente.', { cause });
    showToast(error.message, 'error');
    return { ok: false, error };
  }

  appStore.setState((state) => ({
    ...state,
    importedMeta: [...state.importedMeta.filter((item) => item.kind !== kind), meta],
  }));

  showToast(translate(language, 'import.success'), 'success');
  return { ok: true, value: { kind, fileName: meta.fileName, itemCount: meta.itemCount } };
}

/**
 * Reconexión transparente: usa el handle persistido en IndexedDB.
 * Si el navegador exige confirmación, se pide permiso dentro del gesto del usuario.
 */
export async function reconnectResource(kind: ImportKind): Promise<Result<ImportOutcome, AppError>> {
  const language = appStore.getState().preferences.uiLanguage;
  const handle = await getFileHandle(kind);
  if (!handle) {
    const error = appError('STORAGE', translate(language, 'import.noFile'), { retryable: false });
    showToast(error.message, 'info');
    return { ok: false, error };
  }
  return processHandle(kind, handle, { persistHandle: false });
}

/**
 * Importación por arrastre: DataTransferItem.getAsFileSystemHandle() también
 * entrega un handle real, por lo que mantiene la persistencia en IndexedDB.
 */
export async function importDroppedResource(
  kind: ImportKind,
  handle: FileSystemFileHandle,
): Promise<Result<ImportOutcome, AppError>> {
  return processHandle(kind, handle, { persistHandle: true });
}

async function processHandle(
  kind: ImportKind,
  handle: FileSystemFileHandle,
  options: { readonly persistHandle: boolean },
): Promise<Result<ImportOutcome, AppError>> {
  const language = appStore.getState().preferences.uiLanguage;

  let permitted = await hasReadPermission(handle);
  if (!permitted) {
    const request = await requestReadPermission(handle);
    if (!request.ok) {
      showToast(request.error.message, 'error');
      return { ok: false, error: request.error };
    }
    permitted = request.value;
  }

  if (!permitted) {
    const error = appError('PERMISSION', translate(language, 'import.permissionNeeded'));
    showToast(error.message, 'error');
    return { ok: false, error };
  }

  const text = await readHandleAsText(handle);
  if (!text.ok) {
    showToast(text.error.message, 'error');
    return { ok: false, error: text.error };
  }

  const validated = parseAndValidate(kind, text.value);
  if (!validated.ok) {
    showToast(`${translate(language, 'import.error')}: ${validated.error.message}`, 'error');
    return { ok: false, error: validated.error };
  }

  const meta: ImportedFileMeta = {
    kind,
    fileName: handle.name,
    importedAt: Date.now(),
    itemCount: validated.value.itemCount,
  };

  try {
    if (options.persistHandle) await saveFileHandle(kind, handle);
    await saveResourceData(kind, validated.value.canonical);
    await saveImportedMeta(meta);
  } catch (cause) {
    return { ok: false, error: appError('STORAGE', errorMessage(cause), { cause }) };
  }

  appStore.setState((state) => ({
    ...state,
    importedMeta: [...state.importedMeta.filter((item) => item.kind !== kind), meta],
  }));

  showToast(translate(language, 'import.success'), 'success');
  return { ok: true, value: { kind, fileName: meta.fileName, itemCount: meta.itemCount } };
}

export async function forgetResource(kind: ImportKind): Promise<void> {
  try {
    await deleteFileHandle(kind);
    await clearResourceData(kind);
  } catch {
    // Si IndexedDB falla, el estado en memoria igual se limpia.
  }
  appStore.setState((state) => ({
    ...state,
    importedMeta: state.importedMeta.filter((item) => item.kind !== kind),
  }));
}

/** Lee los datos validados almacenados (usado por el API Explorer). */
export async function loadResourceJson(kind: ImportKind): Promise<Result<unknown, AppError>> {
  const raw = await getResourceData(kind);
  if (!raw) {
    return { ok: false, error: appError('STORAGE', 'No hay datos importados para este recurso.', { retryable: false }) };
  }
  try {
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch (cause) {
    return { ok: false, error: appError('PARSE', 'Los datos guardados están corruptos.', { cause }) };
  }
}
