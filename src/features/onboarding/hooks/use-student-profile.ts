import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

import { getStudentProfile } from '../apis/get-student-profile';

export const useStudentProfile = () =>
  useQuery({
    queryKey: QUERY_KEY.STUDENTS.ME(),
    queryFn: getStudentProfile,
  });
