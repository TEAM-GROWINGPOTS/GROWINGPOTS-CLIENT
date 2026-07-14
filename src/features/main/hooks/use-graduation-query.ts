import type { GetGraduationParams } from '@features/main/apis/get-graduation';
import { getGraduation } from '@features/main/apis/get-graduation';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

export const useGraduationQuery = (params: GetGraduationParams = {}) => {
  return useQuery({
    queryKey: QUERY_KEY.GRADUATION.STATUS(params),
    queryFn: () => getGraduation(params),
  });
};
