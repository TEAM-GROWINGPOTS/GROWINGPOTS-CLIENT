import type { GetGraduationCoursesParams } from '@features/main/apis/get-graduation-courses';
import { getGraduationCourses } from '@features/main/apis/get-graduation-courses';
import type { RequirementCode } from '@features/main/types/requirement';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useQueries } from '@tanstack/react-query';

export const useGraduationCoursesQueries = (divisionCodes: RequirementCode[], params: GetGraduationCoursesParams) => {
  const queries = useQueries({
    queries: divisionCodes.map((divisionCode) => ({
      queryKey: QUERY_KEY.GRADUATION.COURSES(divisionCode, params),
      queryFn: () => getGraduationCourses({ divisionCode, ...params }),
    })),
  });

  return {
    data: queries.flatMap(({ data }) => (data ? [data] : [])),
    isPending: queries.some(({ isPending }) => isPending),
    isError: queries.some(({ isError }) => isError),
  };
};
