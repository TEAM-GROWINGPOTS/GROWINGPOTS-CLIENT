import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

import { getOnboardingOptions } from '../apis/get-onboarding-options';

export const useOnboardingOptions = () =>
  useQuery({
    queryKey: QUERY_KEY.ONBOARDING.OPTIONS(),
    queryFn: () => getOnboardingOptions(),
  });

export const useScopedOnboardingOptions = (schoolId?: number) =>
  useQuery({
    queryKey: QUERY_KEY.ONBOARDING.SCOPED_OPTIONS(schoolId),
    queryFn: () => getOnboardingOptions(schoolId),
    enabled: schoolId !== undefined,
  });
