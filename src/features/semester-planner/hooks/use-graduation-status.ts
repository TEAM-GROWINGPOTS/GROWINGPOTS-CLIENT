'use client';

import { getGraduation, type GraduationSource } from '@features/semester-planner/apis/get-graduation';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

export const useGraduationStatus = (source?: GraduationSource) =>
  useQuery({
    queryKey: QUERY_KEY.GRADUATION.STATUS({ source: source ?? 'ALL' }),
    queryFn: () => getGraduation(source),
  });
