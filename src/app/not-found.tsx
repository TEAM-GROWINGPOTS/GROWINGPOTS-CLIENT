'use client';
import { Button } from '@shared/components/button/button';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-58 bg-gray-50">
      <img src="/images/404.svg" width={774} height={478} alt="404" />
      <div className="flex flex-col items-center justify-center gap-40">
        <h1 className="text-display-sb-32 font-bold text-gray-800">페이지를 찾을 수 없어요</h1>
        <Button size="lg" label="메인 페이지로 이동" onClick={() => router.push('/graduation-dashboard')} />
      </div>
    </main>
  );
};

export default NotFound;
