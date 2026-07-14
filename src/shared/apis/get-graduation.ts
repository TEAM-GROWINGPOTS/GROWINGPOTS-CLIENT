import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';
import type { GraduationResponse } from '@shared/apis/types/graduation';

export type GraduationSource = 'COMPLETED' | 'PLANNED';

export const getGraduation = async (searchParams?: URLSearchParams) => {
  const response = await request.get<SuccessResponse<GraduationResponse>>(ENDPOINT.GRADUATION.STATUS, {
    searchParams,
  });

  return response.data;
};
