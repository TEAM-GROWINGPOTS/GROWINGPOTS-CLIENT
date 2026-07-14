'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { type FocusEvent, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

export interface TableCellSelectOption {
  value: string;
  label: string;
}

interface TableCellSelectProps {
  options: TableCellSelectOption[];
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  className?: string;
}

export const TableCellSelect = ({
  options,
  value,
  onChange,
  isOpen,
  onOpenChange,
  className,
}: TableCellSelectProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listboxId = useId();
  const selectedIndex = Math.max(
    options.findIndex((opt) => opt.value === value),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    onOpenChange(false);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (ref.current && !ref.current.contains(e.relatedTarget)) {
      onOpenChange(false);
    }
  };

  const handleOpen = () => {
    setActiveIndex(selectedIndex);
    onOpenChange(true);
  };

  const handleToggleClick = () => {
    if (isOpen) {
      onOpenChange(false);
    } else {
      handleOpen();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (options[activeIndex]) handleSelect(options[activeIndex].value);
        break;
      case 'Escape':
        e.preventDefault();
        onOpenChange(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={ref} onBlur={handleBlur} className={cn('relative', className)}>
      <button
        type="button"
        role="combobox"
        onClick={handleToggleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? `${listboxId}-${activeIndex}` : undefined}
        className="text-body-m-16 flex h-32 w-full cursor-pointer items-center justify-between rounded-sm border border-gray-100 bg-white px-8 text-gray-600 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-600"
      >
        <span className="min-w-0 truncate">{options.find((opt) => opt.value === value)?.label}</span>
        <Icon name="ic_chevron_down" size={16} className="shrink-0 text-gray-500" />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="z-dropdown absolute mt-4 flex max-h-171 w-full flex-col gap-9 overflow-y-auto rounded-sm border border-gray-100 bg-white p-8 shadow-[0px_4px_4px_rgba(0,0,0,0.04)]"
        >
          {options.map(({ value: optValue, label }, index) => (
            <li
              key={optValue}
              id={`${listboxId}-${index}`}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="option"
              aria-selected={optValue === value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(optValue)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                'text-body-m-16 flex min-h-32 cursor-pointer items-center rounded-sm px-8 text-gray-600',
                index === activeIndex ? 'bg-gray-50' : 'hover:bg-gray-50',
              )}
            >
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
