import type { GraduationMajorType } from '@features/main/apis/get-graduation';
import type { RequirementCode, RequirementDetail } from '@features/main/types/requirement';
import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

export interface GetGraduationCoursesParams {
  majorType?: GraduationMajorType;
  studentMajorId?: number;
}

interface GetGraduationCoursesRequest extends GetGraduationCoursesParams {
  divisionCode: RequirementCode;
}

const getGraduationCoursesSearchParams = ({ majorType, studentMajorId }: GetGraduationCoursesParams) => {
  const searchParams = new URLSearchParams();

  if (majorType) searchParams.set('majorType', majorType);
  if (studentMajorId !== undefined) searchParams.set('studentMajorId', String(studentMajorId));

  return searchParams;
};

export const getGraduationCourses = async ({ divisionCode, ...params }: GetGraduationCoursesRequest) => {
  const response = await request.get<SuccessResponse<RequirementDetail>>(ENDPOINT.GRADUATION.COURSES(divisionCode), {
    searchParams: getGraduationCoursesSearchParams(params),
  });

  return response.data;
};
