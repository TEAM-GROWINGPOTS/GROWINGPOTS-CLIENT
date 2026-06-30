'use client';
import { toast, Toaster } from '@features/onboarding';
import Icon from '@shared/components/icon/icon';

export default function OnboardingPage() {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <button onClick={() => toast.information('여긴 아이콘이 바뀐대요', <Icon name="ic_alert_circle" />)}>
          information
        </button>
        <button onClick={() => toast.success('옹심이 화이팅')}>success</button>
        <button onClick={() => toast.notice('안녕하세요 여러분')}>notice</button>
        <button onClick={() => toast.negative('가나다라마바라사 아이우에오이우 꺙꺙꺙꺙 울랄라 아우우')}>
          negative
        </button>
      </div>
      <Toaster />
    </>
  );
}
