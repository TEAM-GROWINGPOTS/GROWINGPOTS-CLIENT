'use client';

import { getOnboardingOptions } from '@features/semester-planner/apis/get-onboarding-options';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

export const useDepartmentOptions = () =>
  useQuery({
    queryKey: QUERY_KEY.ONBOARDING.OPTIONS(),
    queryFn: getOnboardingOptions,
    select: (data) => data.departments,
    staleTime: Infinity,
  });
