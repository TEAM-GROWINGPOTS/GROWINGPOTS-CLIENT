'use client';

import { useEffect, useRef, useState } from 'react';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select = ({ options, value, onChange, placeholder, disabled, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasValue = value !== '';
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

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white py-3 pl-4 pr-3.5 text-body-r-16',
          hasValue ? 'text-gray-700' : 'text-gray-300',
        )}
      >
        <span>{hasValue ? (options.find((opt) => opt.value === value)?.label ?? placeholder) : placeholder}</span>
        <Icon name="ic_chevron_down" size={20} className="pointer-events-none shrink-0 text-gray-600" />
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-10 mt-1 w-full flex flex-col rounded-xl border border-gray-200 bg-white p-2">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="flex h-12 w-full shrink-0 items-center gap-3 pl-4 pr-3.5 text-body-r-16 text-gray-700 hover:rounded-lg hover:border hover:border-white hover:bg-gray-50"
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};