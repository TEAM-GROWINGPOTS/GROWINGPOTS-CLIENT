import ky, { isHTTPError } from "ky";

export const kyClient = ky.create({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
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
        request.headers.set("Accept", "application/json");
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");

          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        }
      },
    ],

    // afterResponse: 성공이든 실패든 서버 응답을 받은 직후, ky가 HTTP 에러를 throw하기 전에 실행
    // - 2xx: 응답 로깅, 응답 헤더 기반 처리
    // - 4xx/5xx: throw 직전 커스텀 처리 (토큰 refresh + 재요청 등)
    afterResponse: [
      async ({ response }) => {
        if (process.env.NODE_ENV === "development") {
          console.debug(`[API] ${response.status} ${response.url}`);
        }
      },
    ],

    // beforeError: 실패한 경우! HTTP/네트워크/타임아웃 에러가 throw되기 직전에 실행
    // - HTTP 에러, 네트워크 끊김, 타임아웃 에러 발생이 아니면 훅 생성 조차 되지 않음
    // - 401 -> 로그인 페이지 리다이렉트
    // - 에러 자체를 return 하고, QueryClient가 처리하도록 하는 방향
    beforeError: [
      ({ error }) => {
        if (isHTTPError(error) && error.response.status === 401) {
          console.error("인증 에러 발생! 로그인이 필요합니다.");
        }
        return error;
      },
    ],
  },
});
