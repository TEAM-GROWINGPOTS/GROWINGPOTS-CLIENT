'use client';

import Script from 'next/script';

export const KakaoScript = () => (
  <Script
    src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
    strategy="afterInteractive"
    onLoad={() => {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!);
      }
    }}
  />
);
