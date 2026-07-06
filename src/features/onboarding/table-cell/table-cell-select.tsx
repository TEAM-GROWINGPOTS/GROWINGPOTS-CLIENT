'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useEffect, useRef, useState } from 'react';

export interface TableCellSelectOption {
  value: string;
  label: string;
}

interface TableCellSelectProps {
  options: TableCellSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TableCellSelect = ({ options, value, onChange, className }: TableCellSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="text-body-m-16 flex h-32 w-full cursor-pointer items-center justify-between rounded-sm border border-gray-100 bg-white px-8 text-gray-600"
      >
        <span className="truncate">{options.find((opt) => opt.value === value)?.label}</span>
        <Icon name="ic_chevron_down" size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <ul className="z-dropdown absolute flex max-h-130 w-full flex-col gap-9 overflow-y-auto rounded-sm bg-white p-8">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                'text-body-m-16 flex h-32 cursor-pointer items-center rounded-sm px-8 text-gray-600',
                opt.value === value && 'bg-red-20',
              )}
            >
              <span className="truncate">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
