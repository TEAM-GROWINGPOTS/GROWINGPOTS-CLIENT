import type { OnboardingOptionsResponse } from '@features/semester-planner/types/onboarding-options';
import { request } from '@shared/apis/request';
import type { SuccessResponse } from '@shared/apis/type';

export const getOnboardingOptions = () => request.get<SuccessResponse<OnboardingOptionsResponse>>('onboarding/options');
