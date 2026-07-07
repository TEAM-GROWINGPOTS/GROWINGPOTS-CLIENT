'use client';

import { cn } from '@shared/utils/cn';
import { ChangeEvent, FocusEvent, InputHTMLAttributes, useState } from 'react';

interface TableCellProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  mode: 'view' | 'edit';
  value: string;
  onChange?: (value: string) => void;
}

const cellBaseClassName = 'text-body-m-16 text-gray-600 flex h-32 items-center rounded-sm bg-white px-8';

export const TableCellEdit = ({ mode, value, onChange, className, onBlur, ...props }: TableCellProps) => {
  const [touched, setTouched] = useState(false);
  const showError = touched && value.trim() === '';

  if (mode === 'view') {
    return <span className={cn(cellBaseClassName, className)}>{value}</span>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTouched(false);
    onChange?.(e.target.value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    onBlur?.(e);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      aria-invalid={showError}
      className={cn(
        cellBaseClassName,
        'border outline-none',
        showError ? 'border-red-20' : 'border-gray-100',
        className,
      )}
      {...props}
    />
  );
};
