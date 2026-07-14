import { getStudentProfile } from '@features/main/apis/get-student-profile';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

export const useStudentProfileQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY.STUDENT_PROFILE.ME,
    queryFn: getStudentProfile,
  });
};
