'use client';

import { cn } from '@shared/utils/cn';
import { cva } from 'class-variance-authority';
import { useRef } from 'react';

const tabVariants = cva('cursor-pointer whitespace-nowrap border-b-2 pb-6 outline-none transition-colors', {
  variants: {
    color: {
      black: '',
      white: '',
    },
    state: {
      selected: 'text-body-sb-16',
      default: 'text-body-m-16 border-transparent',
    },
  },
  compoundVariants: [
    { color: 'black', state: 'selected', className: 'border-gray-600 text-gray-700' },
    { color: 'black', state: 'default', className: 'text-gray-300' },
    { color: 'white', state: 'selected', className: 'border-gray-400 text-gray-300' },
    { color: 'white', state: 'default', className: 'text-gray-600' },
  ],
  defaultVariants: {
    color: 'black',
    state: 'default',
  },
});

export interface TabItem {
  value: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  color?: 'black' | 'white';
  className?: string;
}

export const Tabs = ({ items, value, onChange, color = 'black', className }: TabsProps) => {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    e.preventDefault();

    let targetIndex: number | null = null;

    if (e.key === 'ArrowRight' && index < items.length - 1) {
      targetIndex = index + 1;
    } else if (e.key === 'ArrowLeft' && index > 0) {
      targetIndex = index - 1;
    }

    if (targetIndex !== null) {
      onChange(items[targetIndex].value);
      buttonRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <ul
      role="tablist"
      className={cn('flex scrollbar-none items-center gap-20 overflow-x-auto [&::-webkit-scrollbar]:hidden', className)}
    >
      {items.map(({ value: itemValue, label }, index) => (
        <li key={itemValue} role="presentation">
          <button
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={itemValue === value}
            tabIndex={itemValue === value ? 0 : -1}
            className={tabVariants({ color, state: itemValue === value ? 'selected' : 'default' })}
            onClick={() => onChange(itemValue)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
};
