/** Errores de dominio discriminados. Prohibido `any`: todo fallo es tipado. */

export type AppErrorCode =
  | 'NETWORK'
  | 'HTTP'
  | 'PARSE'
  | 'VALIDATION'
  | 'PERMISSION'
  | 'ABORTED'
  | 'UNSUPPORTED'
  | 'STORAGE'
  | 'UNKNOWN';

export interface AppError {
  readonly code: AppErrorCode;
  readonly message: string;
  readonly cause?: unknown;
  readonly retryable: boolean;
}

export type Result<T, E = AppError> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function fail(error: AppError): Result<never, AppError> {
  return { ok: false, error };
}

export function appError(
  code: AppErrorCode,
  message: string,
  options: { cause?: unknown; retryable?: boolean } = {},
): AppError {
  const base: AppError = {
    code,
    message,
    retryable: options.retryable ?? (code === 'NETWORK' || code === 'HTTP' || code === 'STORAGE'),
  };
  return options.cause === undefined ? base : { ...base, cause: options.cause };
}

export function toAppError(cause: unknown, fallbackMessage: string): AppError {
  if (isAppError(cause)) return cause;
  if (cause instanceof DOMException) {
    if (cause.name === 'AbortError') {
      return appError('ABORTED', 'Operación cancelada.', { cause, retryable: false });
    }
    if (cause.name === 'NotAllowedError') {
      return appError('PERMISSION', 'Permiso denegado por el navegador.', { cause, retryable: true });
    }
  }
  if (cause instanceof Error) {
    return appError('UNKNOWN', `${fallbackMessage}: ${cause.message}`, { cause });
  }
  return appError('UNKNOWN', fallbackMessage, { cause });
}

export function isAppError(value: unknown): value is AppError {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.code === 'string' && typeof candidate.message === 'string';
}

/** Mensaje apto para UI a partir de un error desconocido. */
export function errorMessage(error: unknown): string {
  if (isAppError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado.';
}
