'use client';

import { getGraduation, type GraduationSource } from '@features/semester-planner/api/get-graduation';
import { useQuery } from '@tanstack/react-query';

export const useGraduationStatus = (source?: GraduationSource) =>
  useQuery({
    queryKey: ['graduation', source ?? 'ALL'],
    queryFn: () => getGraduation(source),
    select: ({ data }) => data,
  });
