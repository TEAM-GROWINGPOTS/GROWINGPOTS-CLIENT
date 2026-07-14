import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';
import type { OnboardingOptionsResponse } from '@shared/apis/types/onboarding-options';

export const getOnboardingOptions = async () => {
  const response = await request.get<SuccessResponse<OnboardingOptionsResponse>>(ENDPOINT.ONBOARDING.OPTIONS);

  return response.data;
};
