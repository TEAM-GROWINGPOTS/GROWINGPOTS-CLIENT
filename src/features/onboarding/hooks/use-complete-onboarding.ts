import { useMutation } from '@tanstack/react-query';

import { completeOnboarding } from '../apis/complete-onboarding';

export const useCompleteOnboarding = () =>
  useMutation({
    mutationFn: completeOnboarding,
  });
