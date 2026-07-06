'use client';

import { Chip } from '@shared/components';
import { useState } from 'react';

export default function Page() {
  const [selected, setSelected] = useState(false);

  return (
    <main className="flex flex-col gap-8 p-20">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold">medium</p>
        <div className="flex gap-4">
          <Chip label="기본" size="medium" />
          <Chip label="선택" size="medium" selected />
          <Chip label="비활성" size="medium" disabled />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold">small</p>
        <div className="flex gap-4">
          <Chip label="기본" size="small" />
          <Chip label="선택" size="small" selected />
          <Chip label="비활성" size="small" disabled />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold">토글 (클릭)</p>
        <Chip label={selected ? '선택됨' : '선택 안됨'} selected={selected} onClick={() => setSelected((v) => !v)} />
      </section>
    </main>
  );
}
