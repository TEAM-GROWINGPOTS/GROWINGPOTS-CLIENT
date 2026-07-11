'use client';

import Lottie from 'lottie-react';

import animationData from './analyze.json';

export const AnalysisLoading = () => {
  return (
    <>
      <section className="z-analysis-loading fixed inset-0 flex flex-col items-center justify-center gap-12 bg-black/60">
        <Lottie animationData={animationData} loop autoplay className="h-150 w-150" />
        <p className="text-display-sb-28 text-white">졸업 현황을 분석하고 있어요</p>
      </section>
    </>
  );
};
