import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { ApiResponse } from '@shared/apis/type';
import type { GraduationResponse } from '@shared/apis/types/graduation';

export type GraduationMajorType = 'ALL' | 'GE' | 'OTHERS';
export type GraduationSource = 'COMPLETED' | 'PLANNED';

export interface GetGraduationParams {
  majorType?: GraduationMajorType;
  studentMajorId?: number;
  source?: GraduationSource;
}

const getGraduationSearchParams = ({ majorType, source, studentMajorId }: GetGraduationParams) => {
  const searchParams = new URLSearchParams();

  if (majorType) searchParams.set('majorType', majorType);
  if (source) searchParams.set('source', source);
  if (studentMajorId !== undefined) searchParams.set('studentMajorId', String(studentMajorId));

  return searchParams;
};

export const getGraduation = async (params: GetGraduationParams = {}) => {
  const response = await request.get<ApiResponse<GraduationResponse>>(ENDPOINT.GRADUATION.STATUS, {
    searchParams: getGraduationSearchParams(params),
  });

  return response.data;
};
