import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import { type SuccessResponse } from '@shared/apis/type';

import { type OnboardingOptions } from '../types/onboarding';

export const getOnboardingOptions = async (schoolId?: number) => {
  const response = await request.get<SuccessResponse<OnboardingOptions>>(ENDPOINT.ONBOARDING.OPTIONS, {
    searchParams: schoolId ? { schoolId } : undefined,
  });

  return response.data;
};
