'use client';

import { getOnboardingOptions } from '@features/semester-planner/api/get-onboarding-options';
import { useQuery } from '@tanstack/react-query';

export const useDepartmentOptions = () =>
  useQuery({
    queryKey: ['onboarding-options'],
    queryFn: getOnboardingOptions,
    select: (data) => data.departments,
    staleTime: Infinity,
  });
