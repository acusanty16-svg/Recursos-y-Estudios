/**
 * Autenticación con Google Identity Services.
 *
 * Decisión: flujo de token en el navegador, sin backend.
 * - El Client ID es público y puede venir de VITE_GOOGLE_CLIENT_ID o guardarse
 *   en este navegador para probar sin recompilar.
 * - El access token vive en sessionStorage y caduca en ~1 hora.
 * - No se guarda ningún refresh token: no hay secretos en el cliente.
 */

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const SESSION_KEY = 'sv.google.session.v1';
const CLIENT_ID_KEY = 'sv.google.clientId.v1';
const SCOPE = 'openid email profile https://www.googleapis.com/auth/drive.file';
const EXPIRY_MARGIN_MS = 60_000;

export const GOOGLE_AUTH_REQUIRED = 'GOOGLE_AUTH_REQUIRED';

export interface GoogleAccount {
  readonly email: string;
  readonly name: string;
  readonly picture: string;
}

export interface GoogleSession extends GoogleAccount {
  readonly accessToken: string;
  readonly expiresAt: number;
}

interface TokenResponse {
  readonly access_token?: string;
  readonly expires_in?: number;
  readonly id_token?: string;
  readonly error?: string;
  readonly error_description?: string;
}

interface TokenClientConfig {
  readonly client_id: string;
  readonly scope: string;
  readonly callback: (response: TokenResponse) => void;
  readonly error_callback?: (error: { readonly type?: string; readonly message?: string }) => void;
}

interface TokenClient {
  requestAccessToken: (overrideConfig?: { readonly prompt?: string }) => void;
}

interface GoogleOAuth2 {
  initTokenClient: (config: TokenClientConfig) => TokenClient;
  revoke: (accessToken: string, done?: () => void) => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: GoogleOAuth2;
      };
    };
  }
}

let gisLoader: Promise<void> | null = null;

export function getGoogleClientId(): string {
  const fromEnv = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();
  if (fromEnv) return fromEnv;
  try {
    return (localStorage.getItem(CLIENT_ID_KEY) ?? '').trim();
  } catch {
    return '';
  }
}

export function setGoogleClientId(clientId: string): void {
  const trimmed = clientId.trim();
  try {
    if (trimmed) localStorage.setItem(CLIENT_ID_KEY, trimmed);
    else localStorage.removeItem(CLIENT_ID_KEY);
  } catch {
    // Ignorado: sin almacenamiento no se puede configurar manualmente.
  }
}

export function isGoogleConfigured(): boolean {
  return getGoogleClientId().length > 0;
}

function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gisLoader) return gisLoader;

  gisLoader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-gis]');
    const script = existing ?? document.createElement('script');

    const handleLoad = (): void => {
      if (window.google?.accounts?.oauth2) resolve();
      else reject(new Error('Google Identity Services no está disponible.'));
    };
    const handleError = (): void => {
      gisLoader = null;
      reject(new Error('No se pudo cargar Google Identity Services.'));
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });

    if (!existing) {
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.dataset.googleGis = 'true';
      document.head.appendChild(script);
    }
  });

  return gisLoader;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function fetchAccount(accessToken: string): Promise<GoogleAccount> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('No se pudo obtener la cuenta de Google.');
  const data = (await response.json()) as {
    email?: unknown;
    name?: unknown;
    picture?: unknown;
  };
  return {
    email: typeof data.email === 'string' ? data.email : '',
    name: typeof data.name === 'string' ? data.name : '',
    picture: typeof data.picture === 'string' ? data.picture : '',
  };
}

function readSession(): GoogleSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;
    if (
      typeof candidate.accessToken !== 'string' ||
      typeof candidate.expiresAt !== 'number' ||
      typeof candidate.email !== 'string' ||
      typeof candidate.name !== 'string' ||
      typeof candidate.picture !== 'string'
    ) {
      return null;
    }
    return {
      accessToken: candidate.accessToken,
      expiresAt: candidate.expiresAt,
      email: candidate.email,
      name: candidate.name,
      picture: candidate.picture,
    };
  } catch {
    return null;
  }
}

function saveSession(session: GoogleSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Sin sessionStorage la sesión dura solo esta página.
  }
}

/** Sesión utilizable ahora mismo (con margen para no enviar peticiones caducadas). */
export function getValidSession(): GoogleSession | null {
  const session = readSession();
  if (!session) return null;
  return session.expiresAt - EXPIRY_MARGIN_MS > Date.now() ? session : null;
}

/** Última cuenta conocida, aunque el token haya caducado. Sirve para ofrecer "Reconectar". */
export function getLastAccount(): GoogleAccount | null {
  const session = readSession();
  if (!session) return null;
  return { email: session.email, name: session.name, picture: session.picture };
}

export function requireAccessToken(): string {
  const session = getValidSession();
  if (!session) throw new Error(GOOGLE_AUTH_REQUIRED);
  return session.accessToken;
}

async function requestToken(prompt: 'select_account' | 'consent' | ''): Promise<GoogleSession> {
  const clientId = getGoogleClientId();
  if (!clientId) throw new Error('GOOGLE_NOT_CONFIGURED');

  await loadGis();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) throw new Error('Google Identity Services no está disponible.');

  return new Promise<GoogleSession>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (response) => {
        void (async (): Promise<void> => {
          if (response.error || !response.access_token) {
            reject(new Error(response.error_description ?? response.error ?? 'Autorización cancelada.'));
            return;
          }

          const accessToken = response.access_token;
          const claims = response.id_token ? decodeJwtPayload(response.id_token) : null;
          const email = typeof claims?.email === 'string' ? claims.email : '';
          const name = typeof claims?.name === 'string' ? claims.name : '';
          const picture = typeof claims?.picture === 'string' ? claims.picture : '';

          const account =
            email.length > 0 ? { email, name, picture } : await fetchAccount(accessToken);

          const session: GoogleSession = {
            accessToken,
            expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000,
            ...account,
          };
          saveSession(session);
          resolve(session);
        })();
      },
      error_callback: (error) => {
        reject(new Error(error.message ?? 'No se pudo abrir la ventana de Google.'));
      },
    });

    client.requestAccessToken({ prompt });
  });
}

/** Primer inicio de sesión: deja elegir cuenta. */
export function signInWithGoogle(): Promise<GoogleSession> {
  return requestToken('select_account');
}

/** Renueva el token sin volver a pedir permisos si la sesión de Google sigue activa. */
export function reconnectGoogle(): Promise<GoogleSession> {
  return requestToken('');
}

export async function signOutGoogle(): Promise<void> {
  const session = readSession();
  try {
    if (session && window.google?.accounts?.oauth2) {
      await new Promise<void>((resolve) => {
        window.google?.accounts?.oauth2?.revoke(session.accessToken, () => resolve());
        window.setTimeout(resolve, 800);
      });
    }
  } catch {
    // El token caducará igualmente; no bloquea el cierre de sesión.
  }

  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignorado.
  }
}
