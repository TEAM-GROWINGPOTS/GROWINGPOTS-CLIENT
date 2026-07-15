import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

export interface MissingPrerequisite {
  courseId: number;
  name: string;
  type: 'REQUIRED' | 'RECOMMENDED';
}

export interface PrerequisiteCheckResult {
  courseId: number;
  name: string;
  missingPrerequisites: MissingPrerequisite[];
}

export interface PrerequisiteCheckData {
  results: PrerequisiteCheckResult[];
}

export const checkPrerequisite = async (courseIds: number[]) => {
  const response = await request.post<SuccessResponse<PrerequisiteCheckData>>(ENDPOINT.PLANNER.PREREQUISITE_CHECK, {
    courseIds,
  });
  return response.data;
};
