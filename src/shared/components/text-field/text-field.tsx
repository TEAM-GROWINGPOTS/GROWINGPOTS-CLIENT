'use client';

import { cn } from '@shared/utils/cn';
import { InputHTMLAttributes, ChangeEvent } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'maxLength'> {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder: string;
}

export const TextField = ({ value, onChange, maxLength, placeholder, ...props }: TextFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    onChange(e.target.value);
  };

  return (
    <div
      className={`flex h-12 items-center rounded-[10px] border border-gray-200 bg-white px-4 focus-within:border-blue-300`}
    >
      <input
        value={value}
        className="text-body-r-16 min-w-0 flex-1 text-gray-800 outline-none placeholder:text-gray-300"
        onChange={handleChange}
        maxLength={maxLength}
        aria-label={placeholder}
        placeholder={placeholder}
        {...props}
      />
      <span className="text-body-r-14 shrink-0 text-gray-300">
        <span className={cn(value.length >= 1 && 'text-blue-500')}>{value.length}</span>/{maxLength}
      </span>
    </div>
  );
};
