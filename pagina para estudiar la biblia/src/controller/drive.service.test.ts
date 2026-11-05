import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEmptySnapshot } from '../model/sync';
import {
  DriveAuthError,
  DriveError,
  SYNC_FILE_NAME,
  downloadSyncSnapshot,
  uploadSyncSnapshot,
} from './drive.service';

type FetchCall = [input: RequestInfo | URL, init?: RequestInit];

function response(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
  } as Response;
}

function mockFetch(handler: (url: string, init?: RequestInit) => Response): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) =>
    handler(String(input), init),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('uploadSyncSnapshot', () => {
  it('crea el archivo la primera vez', async () => {
    const fetchMock = mockFetch((url) => {
      if (url.includes('/upload/')) return response({ id: 'nuevo', name: SYNC_FILE_NAME });
      return response({ files: [] });
    });

    await uploadSyncSnapshot('token', createEmptySnapshot(1000));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [uploadUrl, uploadInit] = fetchMock.mock.calls[1] as FetchCall;
    expect(String(uploadUrl)).toContain('uploadType=multipart');
    expect(uploadInit?.method).toBe('POST');
    expect(String(uploadInit?.body)).toContain(SYNC_FILE_NAME);
  });

  it('actualiza el archivo existente sin crear duplicados', async () => {
    const fetchMock = mockFetch((url) => {
      if (url.includes('/upload/')) return response({ id: 'existente' });
      return response({ files: [{ id: 'existente', name: SYNC_FILE_NAME }] });
    });

    await uploadSyncSnapshot('token', createEmptySnapshot(1000));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [uploadUrl, uploadInit] = fetchMock.mock.calls[1] as FetchCall;
    expect(String(uploadUrl)).toContain('/files/existente');
    expect(String(uploadUrl)).toContain('uploadType=media');
    expect(uploadInit?.method).toBe('PATCH');
  });
});

describe('downloadSyncSnapshot', () => {
  it('descarga y valida la copia remota', async () => {
    mockFetch((url) => {
      if (url.includes('alt=media')) return response(JSON.stringify(createEmptySnapshot(1234)));
      return response({ files: [{ id: 'existente', name: SYNC_FILE_NAME }] });
    });

    const snapshot = await downloadSyncSnapshot('token');
    expect(snapshot?.updatedAt).toBe(1234);
  });

  it('no sobrescribe si el archivo remoto está corrupto', async () => {
    mockFetch((url) => {
      if (url.includes('alt=media')) return response('esto no es json');
      return response({ files: [{ id: 'existente', name: SYNC_FILE_NAME }] });
    });

    await expect(downloadSyncSnapshot('token')).rejects.toBeInstanceOf(DriveError);
  });

  it('detecta un token caducado', async () => {
    mockFetch(() => response({ error: { message: 'Invalid Credentials' } }, 401));

    await expect(downloadSyncSnapshot('token')).rejects.toBeInstanceOf(DriveAuthError);
  });
});
