'use client';

import { cn } from '@shared/utils/cn';

interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs = ({ items, value, onChange, className }: TabsProps) => {
  const handleTabClick = (nextValue: string) => onChange(nextValue);

  return (
    <ul role="tablist" className={cn('flex items-center gap-20', className)}>
      {items.map(({ value: itemValue, label }) => (
        <li key={itemValue} role="presentation">
          <button
            type="button"
            role="tab"
            aria-selected={itemValue === value}
            className={cn(
              'cursor-pointer border-b-2 pb-6 transition-colors',
              itemValue === value
                ? 'text-body-sb-16 border-gray-600 text-gray-700'
                : 'text-body-m-16 border-transparent text-gray-300',
            )}
            onClick={() => handleTabClick(itemValue)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
};
