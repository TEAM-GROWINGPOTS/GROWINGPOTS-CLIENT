import { getOnboardingOptions } from '@shared/apis/get-onboarding-options';
import { QUERY_KEY } from '@shared/apis/query-key';
import { useQuery } from '@tanstack/react-query';

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
