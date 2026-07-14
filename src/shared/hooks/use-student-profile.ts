import { getStudentProfile } from '@shared/apis/get-student-profile';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

export const useStudentProfile = () =>
  useQuery({
    queryKey: QUERY_KEY.STUDENTS.ME(),
    queryFn: getStudentProfile,
  });
