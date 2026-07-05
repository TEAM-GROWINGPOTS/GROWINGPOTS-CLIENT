'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { ChangeEvent, InputHTMLAttributes } from 'react';

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'placeholder'> {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const SearchField = ({ value, onChange, placeholder, className, ...props }: SearchFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className={cn('flex h-44 items-center gap-8 rounded-sm border border-gray-200 bg-white px-12', className)}>
      <Icon name="ic_search" size={24} className="text-gray-400" />
      <input
        type="text"
        value={value}
        className="text-body-r-16 min-w-0 flex-1 text-gray-800 outline-none placeholder:text-gray-300"
        onChange={handleChange}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
};
