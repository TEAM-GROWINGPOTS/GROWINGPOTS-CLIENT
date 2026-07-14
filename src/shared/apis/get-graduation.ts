import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';
import type { GraduationQueryParams, GraduationResponse } from '@shared/apis/types/graduation';

export const getGraduation = async (params?: GraduationQueryParams) => {
  const response = await request.get<SuccessResponse<GraduationResponse>>(ENDPOINT.STUDENTS.ME_GRADUATION, {
    searchParams: {
      ...(params?.majorType && { majorType: params.majorType }),
      ...(params?.studentMajorId !== undefined && { studentMajorId: params.studentMajorId }),
      ...(params?.source && { source: params.source }),
    },
  });

  return response.data;
};
