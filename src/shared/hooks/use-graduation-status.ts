'use client';

import { getGraduation } from '@shared/apis/get-graduation';
import { QUERY_KEY } from '@shared/apis/query-key';
import type { GraduationSource } from '@shared/apis/types/graduation';
import { useQuery } from '@tanstack/react-query';

export const useGraduationStatus = (source?: GraduationSource) =>
  useQuery({
    queryKey: QUERY_KEY.GRADUATION.STATUS({ source: source ?? 'ALL' }),
    queryFn: () => getGraduation({ source }),
  });
