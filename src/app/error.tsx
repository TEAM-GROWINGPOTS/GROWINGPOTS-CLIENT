'use client';

import { Button } from '@shared/components/button/button';
import { useRouter } from 'next/navigation';

const Error = () => {
  const router = useRouter();

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
      <img src="/images/500.svg" width={859} height={532} alt="500" />
      <div className="-mt-35 flex flex-col items-center justify-center gap-40">
        <h1 className="text-display-sb-32 font-bold text-gray-800">앗, 오류가 발생했어요</h1>
        <Button size="lg" label="메인 페이지로 이동" onClick={() => router.push('/graduation-dashboard')} />
      </div>
    </main>
  );
};

export default Error;
