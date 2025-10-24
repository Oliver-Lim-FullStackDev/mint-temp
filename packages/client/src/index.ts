import Cookies from 'js-cookie';

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const BASE_URL = process.env.NEXT_PUBLIC_MINT_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_MINT_API_TOKEN;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_MINT_API_URL is missing');
}

/**
 * Read the user session token from cookies:
 * - on the server: via Next.js headers()
 * - on the client: via js-cookie
 */
/*async function getToken(): Promise<string | undefined> {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const store = await cookies();
    return store.get('mint-session')?.value;
  } else {
    const cookie = Cookies.get('mint-session');
    if (cookie) {
      return cookie;
    }
    return;
  }
}*/

/**
 * Build headers for every request
 */
async function getHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    headers.cookie = (await cookies()).toString();
  }

  if (API_TOKEN) {
    headers['Authorization'] = API_TOKEN;
  }

  /* We set the session cookie in the backend, and always pass it to HG from there
  const sessionToken = await getToken();
  if (sessionToken) {
    headers['Authorization'] = sessionToken;
  }*/

  return headers;
}

/**
 * Validate session token by calling the session endpoint
 * @returns Session data if valid, null if invalid
 */
export async function getServerSession(): Promise<any | null> {
  try {
    // manually fetch so we can handle empty bodies
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/session`, {
      method: 'GET',
      headers,
      cache: 'no-store',
      credentials: 'include', // <-- critical for cookies
    });

    if (!res.ok || res.status === 204) return null;

    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch (err) {
    console.error('Session validation failed:', err);
    return null;
  }
}

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiFetchOptions extends RequestInit {
  body?: any;
  cache?: RequestCache;
}

async function request<T = any>(
  method: FetchMethod,
  path: string,
  body?: any,
  init?: RequestInit & { cache?: RequestCache },
): Promise<T> {
  const headers = await getHeaders();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: init?.cache ?? 'no-store',
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MintAPI ${method} ${path} → ${res.status}: ${err}`);
  }

  return res.json();
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, method = 'GET', cache = 'no-store', headers: optHeaders, ...init } = options;
  const headers = await getHeaders();
  const url = endpoint.startsWith('http') ? endpoint : `${NEXT_PUBLIC_SERVER_URL}${endpoint}`;

  const res = await fetch(url, {
    method,
    ...init,
    headers: {
      ...headers,
      ...(optHeaders ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Next Server API ${method} ${url} → ${res.status}: ${err}`);
  }

  return res.json();
}

// Export method-specific helpers
export const mintApi = {
  get: <T = any>(path: string, init?: RequestInit) =>
    request<T>('GET', path, undefined, init),

  post: <T = any>(path: string, body?: any, init?: RequestInit) =>
    request<T>('POST', path, body, init),

  put: <T = any>(path: string, body?: any, init?: RequestInit) =>
    request<T>('PUT', path, body, init),

  patch: <T = any>(path: string, body?: any, init?: RequestInit) =>
    request<T>('PATCH', path, body, init),

  del: <T = any>(path: string, body?: any, init?: RequestInit) =>
    request<T>('DELETE', path, body, init),
};
