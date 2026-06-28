import { type Options } from "ky";

import { kyClient } from "@/shared/api/ky-client";

type RequestOptions = Pick<
  Options,
  "searchParams" | "retry" | "timeout" | "headers"
>;

function resolveBody(
  body?: unknown,
): { json: unknown } | { body: FormData } | object {
  if (body === undefined) return {};
  if (body instanceof FormData) return { body };
  return { json: body };
}

export const request = {
  get<T>(url: string, options?: RequestOptions) {
    return kyClient.get(url, options).json<T>();
  },

  post<T>(url: string, body?: unknown, options?: RequestOptions) {
    return kyClient.post(url, { ...options, ...resolveBody(body) }).json<T>();
  },

  put<T>(url: string, body?: unknown, options?: RequestOptions) {
    return kyClient.put(url, { ...options, ...resolveBody(body) }).json<T>();
  },

  patch<T>(url: string, body?: unknown, options?: RequestOptions) {
    return kyClient.patch(url, { ...options, ...resolveBody(body) }).json<T>();
  },

  delete<T>(url: string, options?: RequestOptions) {
    return kyClient.delete(url, options).json<T>();
  },
};
