'use client';

import { toast } from '@shared/components';

export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <button onClick={() => toast.information('옹심이 화이팅')}>information</button>
      <button onClick={() => toast.success('감자전해줄사람')}>success</button>
      <button onClick={() => toast.notice('안녕하세요 여러분')}>notice</button>
      <button onClick={() => toast.negative('가나다라마바라사 아이우에오이우 꺙꺙꺙꺙 울랄라 아우우')}>negative</button>
    </div>
  );
}
