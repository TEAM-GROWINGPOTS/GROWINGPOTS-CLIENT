'use client';

import { cn } from '@shared/utils/cn';
import { ChangeEvent, InputHTMLAttributes } from 'react';

import Icon from '../icon/icon';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'maxLength'> {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder: string;
  icon?: string;
}

export const TextField = ({ value, onChange, maxLength, placeholder, icon, ...props }: TextFieldProps) => {
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
      {icon && <Icon name={icon} size={24} className="mr-3" />}
      <input
        value={value}
        className="text-body-r-16 min-w-0 flex-1 text-gray-800 outline-none placeholder:text-gray-300"
        onChange={handleChange}
        maxLength={maxLength}
        aria-label={placeholder}
        placeholder={placeholder}
        {...props}
      />
      <span className="text-body-r-14 ml-2 shrink-0 text-gray-300">
        <span className={cn(value.length >= 1 && 'text-blue-500')}>{value.length}</span>/{maxLength}
      </span>
    </div>
  );
};
