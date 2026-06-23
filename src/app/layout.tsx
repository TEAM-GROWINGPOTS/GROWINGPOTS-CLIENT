import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Growing Pots",
  description:
    "졸업까지 남은 이수 영역·학점을 한 화면에서 보고, 향후 수강 계획을 시뮬레이션하는 비주얼 학사 플래너",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
