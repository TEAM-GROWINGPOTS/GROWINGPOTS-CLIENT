import { QUERY_KEY } from '@shared/apis/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateStudentCourses } from '../apis/update-student-courses';

export const useUpdateStudentCourses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentCourses,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.STUDENTS.ME_COURSES() }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.GRADUATION.ALL }),
      ]),
  });
};
