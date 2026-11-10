import type { RequirementCode, RequirementDetail } from '@features/main/types/requirement';
import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';
import type { GraduationMajorFilter } from '@shared/apis/types/graduation';

export interface GetGraduationCoursesParams {
  majorType?: GraduationMajorFilter;
  studentMajorId?: number;
}

interface GetGraduationCoursesRequest extends GetGraduationCoursesParams {
  divisionCode: RequirementCode;
}

export const getGraduationCourses = async ({ divisionCode, ...params }: GetGraduationCoursesRequest) => {
  const response = await request.get<SuccessResponse<RequirementDetail>>(ENDPOINT.GRADUATION.COURSES(divisionCode), {
    searchParams: params,
  });

  return response.data;
};
