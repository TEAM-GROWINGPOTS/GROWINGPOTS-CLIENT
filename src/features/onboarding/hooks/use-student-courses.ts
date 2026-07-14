import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

import { getStudentCourses } from '../apis/get-student-courses';

export const useStudentCourses = () =>
  useQuery({
    queryKey: QUERY_KEY.STUDENTS.ME_COURSES(),
    queryFn: getStudentCourses,
  });
