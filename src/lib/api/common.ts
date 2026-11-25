// src/lib/api/common.ts
/**
 * Generic fetch wrapper for Xploria Web API.
 * All requests use `credentials: "include"` so Laravel session cookies are sent.
 * For mutating requests a CSRF token is read from the `XSRF-TOKEN` cookie
 * and sent as `X-XSRF-TOKEN` header.
 */
const mockModules = import.meta.glob('./mocks/*.ts');

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<any> {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/web/v1';
  const xsrf = typeof document !== 'undefined'
    ? document.cookie
        .split('; ')
        .find((c) => c.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
    : undefined;

  const headers = new Headers(init.headers ?? {});
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  if (xsrf) headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrf));

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      let msg = response.statusText;
      try {
        const err = await response.json();
        msg = err.message ?? JSON.stringify(err);
      } catch { }
      throw new Error(`Request failed ${response.status}: ${msg}`);
    }
    return await response.json();
  } catch (e) {
    // Fallback mock data when backend unreachable (dev mode)
    if (import.meta.env.DEV) {
      try {
        // Strip query params if any before mapping to mock file
        const cleanPath = path.split('?')[0];
        const formattedName = cleanPath.startsWith('/') ? cleanPath.slice(1).replaceAll('/', '_') : cleanPath.replaceAll('/', '_');
        const mockKey = `./mocks/_${formattedName}.ts`;

        if (mockModules[mockKey]) {
          const mod: any = await mockModules[mockKey]();
          return mod.default;
        }

        console.warn('No mock found for', path, 'checked key:', mockKey);
        return {};
      } catch (err) {
        console.warn('Error loading mock for', path, err);
        return {};
      }
    }
    throw e;
  }
}
