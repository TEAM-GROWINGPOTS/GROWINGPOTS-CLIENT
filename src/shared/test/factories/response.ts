import type { SuccessResponse } from '@shared/apis/type';

export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  code: 'SUCCESS',
  message: '요청에 성공했습니다.',
  success: true,
  data,
});
