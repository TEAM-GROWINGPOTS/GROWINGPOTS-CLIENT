import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';
import type { GraduationQueryParams, GraduationResponse } from '@shared/apis/types/graduation';

export const getGraduation = async (params: GraduationQueryParams = {}) => {
  const response = await request.get<SuccessResponse<GraduationResponse>>(ENDPOINT.GRADUATION.STATUS, {
    searchParams: { ...params },
  });

  return response.data;
};
