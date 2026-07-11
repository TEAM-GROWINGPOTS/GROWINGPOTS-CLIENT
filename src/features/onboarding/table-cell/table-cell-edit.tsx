'use client';

import { cn } from '@shared/utils/cn';
import { ChangeEvent, useState } from 'react';

interface TableCellEditProps {
  mode: 'view' | 'edit';
  value: string;
  onChange: (value: string) => void;
  className?: string;
  suffix?: string;
}

const cellBaseClassName = 'text-body-m-16 text-gray-600 flex h-32 items-center gap-2 rounded-sm bg-white px-8';

export const TableCellEdit = ({ mode, value, onChange, className, suffix }: TableCellEditProps) => {
  const [touched, setTouched] = useState(false);
  const showError = touched && value.trim() === '';

  if (mode === 'view') {
    return (
      <span className={cn(cellBaseClassName, className)}>
        {value}
        {suffix && <span className="text-gray-400">{suffix}</span>}
      </span>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTouched(false);
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  if (suffix) {
    return (
      <span
        className={cn(
          cellBaseClassName,
          'border outline-none',
          showError ? 'border-red-20' : 'border-gray-100',
          className,
        )}
      >
        <input
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError}
          style={{ width: `${Math.max(value.length, 1)}ch` }}
          className="min-w-0 shrink-0 bg-transparent outline-none"
        />
        <span className="shrink-0 text-gray-400">{suffix}</span>
      </span>
    );
  }

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
    />
  );
};
