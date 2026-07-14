'use client';

import { cn } from '@shared/utils/cn';
import { ChangeEvent, useRef, useState } from 'react';

interface TableCellEditProps {
  mode: 'view' | 'edit';
  value: string;
  onChange: (value: string) => void;
  className?: string;
  suffix?: string;
}

const cellBaseClassName =
  'text-body-m-16 text-gray-600 flex h-32 w-full min-w-0 items-center gap-2 rounded-sm bg-white';

export const TableCellEdit = ({ mode, value, onChange, className, suffix }: TableCellEditProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);
  const showError = touched && value.trim() === '';

  if (mode === 'view') {
    return (
      <span className={cn(cellBaseClassName, className)}>
        <span className="min-w-0 truncate">{value}</span>
        {suffix && <span className="shrink-0">{suffix}</span>}
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

  const wrapperClassName = cn(
    cellBaseClassName,
    'px-8 border outline-none',
    showError ? 'border-red-20' : 'border-gray-100',
    className,
  );

  if (suffix) {
    return (
      <span className={wrapperClassName} onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError}
          style={{ width: `${Math.max(value.length, 1)}ch` }}
          className="max-w-full min-w-0 shrink-0 border-0 bg-transparent p-0 outline-none"
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
      className={wrapperClassName}
    />
  );
};
