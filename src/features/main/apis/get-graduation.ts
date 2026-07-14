import type { GraduationSource } from '@shared/apis/get-graduation';
import { getGraduation as getGraduationRequest } from '@shared/apis/get-graduation';

export type GraduationMajorType = 'ALL' | 'GE' | 'OTHERS';

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

export const getGraduation = (params: GetGraduationParams = {}) =>
  getGraduationRequest(getGraduationSearchParams(params));
