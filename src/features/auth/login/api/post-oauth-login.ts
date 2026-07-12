import { request } from '@shared/apis/request';
import { type SuccessResponse } from '@shared/apis/type';

interface OAuthLoginRequest {
  provider: 'KAKAO';
  oauthAccessToken: string;
}

interface OAuthLoginData {
  accessToken: string;
  refreshToken: string;
  onboardingCompleted: boolean;
  nickname: string;
}

export type OAuthLoginResponse = SuccessResponse<OAuthLoginData>;

export const postOAuthLogin = (body: OAuthLoginRequest) =>
  request.post<OAuthLoginResponse>('api/v1/auth/oauth/login', body);
