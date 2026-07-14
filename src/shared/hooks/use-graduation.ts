import { getGraduation } from '@shared/apis/get-graduation';
import { QUERY_KEY } from '@shared/apis/query-key';
import type { GraduationQueryParams } from '@shared/apis/types/graduation';
import { useQuery } from '@tanstack/react-query';

export const useGraduation = (params?: GraduationQueryParams) =>
  useQuery({
    queryKey: QUERY_KEY.STUDENTS.ME_GRADUATION(params),
    queryFn: () => getGraduation(params),
  });
