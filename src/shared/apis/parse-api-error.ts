import { isHTTPError } from 'ky';

export interface ParsedApiError {
  status: number;
  code?: string;
  message?: string;
  data?: unknown;
}

export const parseApiError = async (error: unknown): Promise<ParsedApiError | null> => {
  if (!isHTTPError(error)) return null;

  const body = (await error.response
    .clone()
    .json()
    .catch(() => null)) as { code?: string; message?: string; data?: unknown } | null;

  return { status: error.response.status, code: body?.code, message: body?.message, data: body?.data };
};
