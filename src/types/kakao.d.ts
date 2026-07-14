interface KakaoAuthObj {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface KakaoAuthAuthorizeOptions {
  redirectUri: string;
  state?: string;
  scope?: string;
  prompt?: string;
}

interface KakaoAuth {
  login(options: { success: (authObj: KakaoAuthObj) => void; fail: (err: unknown) => void }): void;
  authorize(options: KakaoAuthAuthorizeOptions): void;
}

interface KakaoStatic {
  init(appKey: string): void;
  isInitialized(): boolean;
  Auth: KakaoAuth;
}

interface Window {
  Kakao: KakaoStatic;
}
