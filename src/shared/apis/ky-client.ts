import ky, { isHTTPError } from 'ky';

const API_BASE_URL = (() => {
  if (typeof window !== 'undefined') return window.location.origin;
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!url) throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Add it to .env.local');
  return url;
})();

const MAX_REISSUE_ATTEMPTS = 3;
let isRefreshing = false;
let pendingResolvers: Array<(succeeded: boolean) => void> = [];

const waitForRefresh = () =>
  new Promise<boolean>((resolve) => {
    pendingResolvers.push(resolve);
  });

const flushPending = (succeeded: boolean) => {
  pendingResolvers.forEach((resolve) => resolve(succeeded));
  pendingResolvers = [];
};

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
      ({ request }) => {
        request.headers.set('Accept', 'application/json');
      },
    ],

    afterResponse: [
      async ({ request, response }) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[API] ${response.status} ${response.url}`);
        }

        if (response.status === 401) {
          if (isRefreshing) {
            const reissueSucceeded = await waitForRefresh();
            if (reissueSucceeded) return fetch(request.clone());
            return;
          }

          isRefreshing = true;
          let succeeded = false;
          let authFailed = false;

          for (let attempt = 0; attempt < MAX_REISSUE_ATTEMPTS; attempt++) {
            try {
              await ky.post(`${API_BASE_URL}/api/v1/auth/reissue`, { credentials: 'include' });
              succeeded = true;
              break;
            } catch (error) {
              if (isHTTPError(error) && error.response.status < 500) {
                authFailed = true;
                break;
              }
            }
          }

          isRefreshing = false;

          if (succeeded) {
            flushPending(true);
            return fetch(request.clone());
          }

          if (authFailed) {
            flushPending(false);
            const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/api/auth/logout?redirect=${redirectTo}`;
            return;
          }

          flushPending(false);
        }
      },
    ],
  },
});
