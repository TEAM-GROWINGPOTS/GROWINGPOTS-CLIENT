import ky, { isHTTPError } from "ky";

export const kyClient = ky.create({
  baseUrl: "https://api.example.com", // env 값으로 교체 필요
  timeout: 10000,
  hooks: {
    // beforeRequest: 요청이 서버로 나가기 직전에 실행
    // - Authorization 헤더에 토큰 주입, 공통 헤더 수정 가능
    beforeRequest: [
      ({ request }) => {
        request.headers.set("Accept", "application/json");
        const token = localStorage.getItem("accessToken");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    // - HttpOnly 쿠키 기반이면 대부분 생략 가능 (credentials 옵션만 추가)
    // credentials: "include",

    // afterResponse: 성공이든 실패든 서버 응답을 받은 직후, ky가 HTTP 에러를 throw하기 전에 실행
    // - 2xx: 응답 로깅, 응답 헤더 기반 처리 (토큰 갱신 등)
    // - 4xx/5xx: throw 직전 커스텀 처리 (beforeError보다 먼저 실행됨!!)
    afterResponse: [
      async ({ response }) => {
        if (process.env.NODE_ENV === "development") {
          console.debug(`[API] ${response.status} ${response.url}`);
        }
      },
    ],

    // beforeError: 실패한 경우! HTTP/네트워크/타임아웃 에러가 throw되기 직전에 실행
    // - HTTP 에러, 네트워크 끊김, 타임아웃 에러 발생이 아니면 훅 생성 조차 되지 않음
    // - 401 -> 로그인 페이지 리다이렉트, 토큰 재발급
    // - 공통 에러 토스트, 에러 로깅
    // - 반드시 error를 return해야 함!!
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

// api wrapper 유틸
export const api = {
  get: <T>(url: string, options?: Parameters<typeof kyClient.get>[1]) =>
    kyClient.get(url, options).json<T>(),

  post: <T>(
    url: string,
    json?: unknown,
    options?: Parameters<typeof kyClient.post>[1],
  ) => kyClient.post(url, { json, ...options }).json<T>(),

  put: <T>(
    url: string,
    json?: unknown,
    options?: Parameters<typeof kyClient.put>[1],
  ) => kyClient.put(url, { json, ...options }).json<T>(),

  delete: <T>(url: string, options?: Parameters<typeof kyClient.delete>[1]) =>
    kyClient.delete(url, options).json<T>(),

  uploadFile: <T>(
    url: string,
    file: File,
    options?: Parameters<typeof kyClient.post>[1] & {
      field?: string;
      fields?: Record<string, string>;
    },
  ) => {
    const { field = "file", fields, ...kyOptions } = options ?? {};
    const formData = new FormData();
    formData.append(field, file, file.name);

    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value);
      }
    }

    return kyClient.post(url, { body: formData, ...kyOptions }).json<T>();
  },
};
