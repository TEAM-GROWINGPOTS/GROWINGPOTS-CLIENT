'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export const AnalysisLoading = () => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/lottie/Dribbling-soccer.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black/60">
      <Lottie animationData={animationData} loop autoplay className="h-78 w-306" />
      <p className="text-display-sb-28 text-white">졸업 현황을 분석하고 있어요</p>
    </div>
  );
};
