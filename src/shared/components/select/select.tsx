'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useEffect, useId, useRef, useState } from 'react';

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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const hasValue = value !== '';
  const ref = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(options.length > 0 ? 0 : -1);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && options[focusedIndex]) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={isOpen && focusedIndex >= 0 ? optionId(focusedIndex) : undefined}
        className={cn(
          'text-body-r-16 flex h-48 w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white px-16',
          hasValue ? 'text-gray-700' : 'text-gray-300',
        )}
      >
        <span className="truncate">{options.find((opt) => opt.value === value)?.label ?? placeholder}</span>
        <Icon name="ic_chevron_down" size={20} className="pointer-events-none shrink-0 text-gray-600" />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="z-dropdown absolute top-full left-0 mt-4 flex max-h-[208px] w-full flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white p-8"
        >
          {options.map((opt, index) => (
            <li
              key={opt.value}
              id={optionId(index)}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                'text-body-m-16 flex h-48 w-full shrink-0 cursor-pointer items-center rounded-lg bg-white px-16 text-gray-700 hover:bg-gray-50',
                focusedIndex === index && 'bg-gray-50',
                opt.value === value && 'bg-gray-50 text-blue-500',
              )}
            >
              <span className="[scrollbar-width:none] overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                {opt.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
