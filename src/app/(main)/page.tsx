'use client';

import { TextField } from '@shared/components';
import { useState } from 'react';

export default function Page() {
  const [value, setValue] = useState('');

  return (
    <div className="p-4">
      <TextField placeholder="옹심아화이팅" value={value} onChange={setValue} maxLength={10} />
      <TextField placeholder="옹심아화이팅" icon="ic_search" value={value} onChange={setValue} maxLength={10} />
    </div>
  );
}
