'use client';

import { useState } from 'react';
import { TextField } from '@shared/components';

export default function Page() {
  const [value, setValue] = useState('');

  return (
    <div className="p-4">
      <TextField placeholder="옹심아화이팅" value={value} onChange={setValue} />
    </div>
  );
}
