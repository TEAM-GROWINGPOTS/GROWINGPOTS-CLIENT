import { getAccessToken, refreshAccessToken } from '@shared/apis/auth-token';
import ky, { isHTTPError } from 'ky';

const API_BASE_URL = (() => {
  if (typeof window !== 'undefined') return window.location.origin;
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!url) throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Add it to .env.local');
  return url;
})();

export const AUTH_REQUEST_CONTEXT = { skipAuth: true, skipAuthRefresh: true };

export const kyClient = ky.create({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  timeout: 10000,
  retry: {
    limit: 2,
    retryOnTimeout: true,
    jitter: true,
    shouldRetry: ({ error }) => {
      if (isHTTPError(error)) {
        const status = error.response.status;
        if ((status >= 400 && status < 500 && status !== 429) || status >= 500) {
          return false;
        }
      }
      return undefined;
    },
  },
  hooks: {
    beforeRequest: [
      ({ request, options }) => {
        request.headers.set('Accept', 'application/json');

        if (options.context?.skipAuth) return;

        const token = getAccessToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],

    afterResponse: [
      async ({ request, response, options }) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[API] ${response.status} ${response.url}`);
        }

        if (response.status === 401 && !options.context?.skipAuthRefresh) {
          try {
            const newToken = await refreshAccessToken();
            const cloned = request.clone();
            cloned.headers.set('Authorization', `Bearer ${newToken}`);
            return fetch(cloned);
          } catch {
            const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/api/auth/logout?redirect=${redirectTo}`;
          }
        }
      },
    ],
  },
});
