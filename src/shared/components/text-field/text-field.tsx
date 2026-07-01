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

export const TextField = ({ value, onChange, maxLength, placeholder, icon, className, ...props }: TextFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.slice(0, maxLength));
  };

  return (
    <div
      className={cn(
        'flex h-48 items-center rounded-[10px] border border-gray-200 bg-white px-16 focus-within:border-blue-300',
        className,
      )}
    >
      {icon && <Icon name={icon} size={24} className="mr-12" />}
      <input
        value={value}
        className="text-body-r-16 min-w-0 flex-1 text-gray-800 outline-none placeholder:text-gray-300"
        onChange={handleChange}
        placeholder={placeholder}
        {...props}
      />
      <span className="text-body-r-14 ml-8 shrink-0 text-gray-300">
        <span className={cn(value.length >= 1 && 'text-blue-500')}>{value.length}</span>/{maxLength}
      </span>
    </div>
  );
};
