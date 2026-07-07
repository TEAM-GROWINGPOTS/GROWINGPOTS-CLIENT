'use client';

import { cn } from '@shared/utils/cn';
import { ChangeEvent, InputHTMLAttributes, useState } from 'react';

interface TableCellProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  mode: 'view' | 'edit';
  value: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

const cellBaseClassName = 'text-body-m-16 text-gray-600 flex h-32 items-center rounded-sm bg-white px-8';

export const TableCellEdit = ({ mode, value, onChange, error = false, className, ...props }: TableCellProps) => {
  const [dirty, setDirty] = useState(false);
  const [prevError, setPrevError] = useState(error);

  if (error !== prevError) {
    setPrevError(error);
    if (error) setDirty(false);
  }

  if (mode === 'view') {
    return <span className={cn(cellBaseClassName, className)}>{value}</span>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    onChange?.(e.target.value);
  };

  const showError = error && !dirty;

  return (
    <input
      value={value}
      onChange={handleChange}
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
