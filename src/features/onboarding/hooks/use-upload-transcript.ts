import { getGraduation } from '@shared/apis/get-graduation';
import { getStudentProfile } from '@shared/apis/get-student-profile';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getStudentCourses } from '../apis/get-student-courses';
import { uploadTranscript } from '../apis/upload-transcript';

export const useUploadTranscript = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadTranscript,
    onSuccess: () =>
      Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.GRADUATION.ALL }),
        queryClient.fetchQuery({ queryKey: QUERY_KEY.STUDENTS.ME(), queryFn: getStudentProfile, staleTime: 0 }),
        queryClient.fetchQuery({
          queryKey: QUERY_KEY.STUDENTS.ME_COURSES(),
          queryFn: getStudentCourses,
          staleTime: 0,
        }),
        queryClient.fetchQuery({
          queryKey: QUERY_KEY.GRADUATION.STATUS({ source: 'ALL' }),
          queryFn: () => getGraduation(),
          staleTime: 0,
        }),
      ]),
  });
};
