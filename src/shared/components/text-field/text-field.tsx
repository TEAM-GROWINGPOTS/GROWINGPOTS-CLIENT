'use client';

import { cn } from '@shared/utils/cn';
import { ChangeEvent, InputHTMLAttributes, Ref } from 'react';

import Icon from '../icon/icon';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'maxLength'> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder: string;
  icon?: string;
  errorMessage?: string;
  ref?: Ref<HTMLInputElement>;
}

export const TextField = ({
  value,
  onChange,
  maxLength,
  placeholder,
  icon,
  errorMessage,
  ref,
  className,
  ...props
}: TextFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(maxLength !== undefined ? e.target.value.slice(0, maxLength) : e.target.value);
  };

  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      <div
        className={cn(
          'flex h-48 items-center rounded-lg border bg-white px-16 focus-within:border-gray-600',
          errorMessage ? 'border-red-20 focus-within:border-red-20' : 'border-gray-200',
        )}
      >
        {icon && <Icon name={icon} size={24} className="mr-12" />}
        <input
          ref={ref}
          value={value}
          className="text-body-r-16 min-w-0 flex-1 text-gray-800 outline-none placeholder:text-gray-300"
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={!!errorMessage}
          {...props}
        />
        {maxLength !== undefined && (
          <span className="text-body-r-14 ml-8 shrink-0 text-gray-300">
            <span className={cn(value.length >= 1 && 'text-gray-700')}>{value.length}</span>/{maxLength}
          </span>
        )}
      </div>
      {errorMessage && <p className="text-body-r-16 text-red-20">{errorMessage}</p>}
    </div>
  );
};
