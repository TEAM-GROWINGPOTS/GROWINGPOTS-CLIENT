import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import type { EmptySuccessResponse } from '@shared/apis/type';

export const completeOnboarding = () => request.post<EmptySuccessResponse>(ENDPOINT.AUTH.COMPLETE_ONBOARDING);
