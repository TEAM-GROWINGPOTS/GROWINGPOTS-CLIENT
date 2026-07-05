'use client';

import { SearchField } from '@features/semester-planner/card-view/search-field/search-field';
import { useState } from 'react';

export default function Page() {
  const [value, setValue] = useState('');

  return (
    <main>
      <SearchField value={value} onChange={setValue} />
    </main>
  );
}
