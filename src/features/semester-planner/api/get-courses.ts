import type { CourseSearchParams, CourseSearchResponse } from '@features/semester-planner/types/course-search';
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

export const getCourses = (params: CourseSearchParams) =>
  request.get<SuccessResponse<CourseSearchResponse>>('courses', { searchParams: toSearchParams(params) });
