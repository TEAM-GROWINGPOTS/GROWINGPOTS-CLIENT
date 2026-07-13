import type { CourseSearchParams, CourseSearchResponse } from '@features/semester-planner/types/course-search';
import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

const toSearchParams = (params: CourseSearchParams): URLSearchParams => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }
    searchParams.append(key, String(value));
  });

  return searchParams;
};

export const getCourses = async (params: CourseSearchParams) => {
  const response = await request.get<SuccessResponse<CourseSearchResponse>>(ENDPOINT.COURSES.LIST, {
    searchParams: toSearchParams(params),
  });

  return response.data;
};
