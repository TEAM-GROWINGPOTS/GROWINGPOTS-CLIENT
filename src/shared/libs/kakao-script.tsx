'use client';

import Script from 'next/script';

export const KakaoScript = () => (
  <Script
    src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
    strategy="afterInteractive"
    onLoad={() => {
      const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
      if (!clientId) {
        console.error('NEXT_PUBLIC_KAKAO_CLIENT_ID가 정의되지 않았습니다');
        return;
      }
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(clientId);
      }
    }}
  />
);
