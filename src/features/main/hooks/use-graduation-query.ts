import { getGraduation } from '@shared/apis/get-graduation';
import { QUERY_KEY } from '@shared/apis/query-key';
import type { GraduationQueryParams } from '@shared/apis/types/graduation';
import { useQuery } from '@tanstack/react-query';

export const useGraduationQuery = (params: GraduationQueryParams = {}) => {
  return useQuery({
    queryKey: QUERY_KEY.GRADUATION.STATUS(params),
    queryFn: () => getGraduation(params),
  });
};
