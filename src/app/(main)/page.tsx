'use client';

import { Select } from '@shared/components/select/select';
import { useState } from 'react';

const OPTIONS = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리' },
  { value: 'grape', label: '포도' },
  { value: 'mango', label: '망고' },
];

export default function Page() {
  const [singleValue, setSingleValue] = useState('');
  const [multiValues, setMultiValues] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-32 p-32">
      <div className="flex w-[320px] flex-col gap-8">
        <p className="text-body-m-16 text-gray-700">기본 Select</p>
        <Select options={OPTIONS} value={singleValue} onChange={setSingleValue} placeholder="선택하세요" />
      </div>
      <div className="flex w-[320px] flex-col gap-8">
        <p className="text-body-m-16 text-gray-700">Checkbox Select (다중선택)</p>
        <Select showCheckbox options={OPTIONS} value={multiValues} onChange={setMultiValues} placeholder="선택하세요" />
      </div>
    </div>
  );
}
