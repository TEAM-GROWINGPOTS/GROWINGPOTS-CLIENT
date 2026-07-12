import ky, { isHTTPError } from 'ky';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Add it to .env.local');
}

export const kyClient = ky.create({
  baseUrl: API_BASE_URL,
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
    // beforeRequest: 요청이 서버로 나가기 직전에 실행
    // - Authorization 헤더에 토큰 주입, 공통 헤더 수정 가능
    // - HttpOnly 쿠키 기반이면 대부분 생략 가능 (credentials: "include" 옵션만 추가)
    beforeRequest: [
      ({ request }) => {
        request.headers.set('Accept', 'application/json');
        if (typeof window !== 'undefined') {
          const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('accessToken='))
            ?.split('=')[1];

          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        }
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
            const res = await ky.post(`${API_BASE_URL}api/v1/auth/reissue`, {
              credentials: 'include',
            });
            const data = (await res.json()) as { data: { accessToken: string } };
            const newToken = data.data.accessToken;
            document.cookie = `accessToken=${newToken}; path=/; max-age=1800; SameSite=Lax`;
          } catch {
            const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/login?redirect=${redirectTo}`;
          }
        }
        return error;
      },
    ],
  },
});
