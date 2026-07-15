import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';

export const completeOnboarding = () => request.post<{ success: boolean }>(ENDPOINT.AUTH.COMPLETE_ONBOARDING);
