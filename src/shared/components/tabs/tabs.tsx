'use client';

import { cn } from '@shared/utils/cn';
import { cva } from 'class-variance-authority';

const tabVariants = cva('cursor-pointer border-b-2 pb-6 transition-colors', {
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

interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  color?: 'black' | 'white';
  className?: string;
}

export const Tabs = ({ items, value, onChange, color = 'black', className }: TabsProps) => {
  return (
    <ul role="tablist" className={cn('flex items-center gap-20', className)}>
      {items.map(({ value: itemValue, label }) => (
        <li key={itemValue} role="presentation">
          <button
            type="button"
            role="tab"
            aria-selected={itemValue === value}
            className={tabVariants({ color, state: itemValue === value ? 'selected' : 'default' })}
            onClick={() => onChange(itemValue)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
};
