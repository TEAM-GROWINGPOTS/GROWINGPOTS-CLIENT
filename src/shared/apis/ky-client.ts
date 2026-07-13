import ky, { isHTTPError } from 'ky';

const API_BASE_URL =
  typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? '');

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
        if (status >= 400 && status < 500 && status !== 429) {
          return false;
        }
      }
      return undefined;
    },
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set('Accept', 'application/json');
      },
    ],

    afterResponse: [
      async ({ response }) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[API] ${response.status} ${response.url}`);
        }
      },
    ],

    beforeError: [
      async ({ error }) => {
        if (isHTTPError(error) && error.response.status === 401) {
          try {
            await ky.post(`${API_BASE_URL}/api/v1/auth/reissue`, { credentials: 'include' });
          } catch {
            document.cookie = 'onboardingCompleted=; path=/; max-age=0; SameSite=Lax';
            document.cookie = 'nickname=; path=/; max-age=0; SameSite=Lax';
            const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/login?redirect=${redirectTo}`;
          }
        }
        return error;
      },
    ],
  },
});
