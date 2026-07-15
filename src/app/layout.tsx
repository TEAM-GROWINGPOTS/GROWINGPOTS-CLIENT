import '@shared/styles/globals.css';

import { Toaster } from '@shared/components';
import { pretendard } from '@shared/styles/fonts';
import type { Metadata } from 'next';

import Providers from './providers';

const SITE_URL = 'https://growingpots.kr';
const SITE_TITLE = 'Growing Pots | 대학 졸업까지의 모든 가능성을 한눈에';
const SITE_DESCRIPTION =
  'Growing Pots는 졸업사정표 PDF를 업로드하면 졸업 요건 충족 현황을 자동 분석하고, 학기 계획과 졸업 경로 시뮬레이션까지 제공하는 대학 졸업 관리 서비스입니다.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Growing Pots',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
