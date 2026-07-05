'use client';

import { Badge } from '@shared/components/badge/badge';
import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useEffect, useId, useRef, useState } from 'react';

import { SelectOptionItem } from './select-option';

interface SelectOption {
  value: string;
  label: string;
}

type BaseProps = {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

type SingleSelectProps = BaseProps & {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
};

type MultiSelectProps = BaseProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  badgeVariant?: 'primary' | 'secondary' | 'outline' | 'disabled' | 'negative';
  badgeSize?: 'xsmall' | 'small' | 'medium';
};

type SelectProps = SingleSelectProps | MultiSelectProps;

export const Select = (props: SelectProps) => {
  const { options, placeholder, disabled, className } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  const isMulti = props.multiple === true;
  const hasValue = isMulti ? (props as MultiSelectProps).value.length > 0 : (props as SingleSelectProps).value !== '';

  const isSelected = (optValue: string): boolean => {
    if (props.multiple) return props.value.includes(optValue);
    return props.value === optValue;
  };

  const triggerLabel = isMulti
    ? placeholder
    : (options.find((opt) => opt.value === (props as SingleSelectProps).value)?.label ?? placeholder);

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
    if (props.multiple) {
      const newValue = props.value.includes(optValue)
        ? props.value.filter((v) => v !== optValue)
        : [...props.value, optValue];
      props.onChange(newValue);
    } else {
      props.onChange(optValue);
      setIsOpen(false);
      setFocusedIndex(-1);
    }
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
        onClick={() => {
          if (!isOpen && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setOpenUpward(window.innerHeight - rect.bottom < 220);
          }
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={isOpen && focusedIndex >= 0 ? optionId(focusedIndex) : undefined}
        className={cn(
          'text-body-r-16 flex w-full justify-between rounded-[10px] border border-gray-200 bg-white pr-14 pl-16',
          isMulti ? 'min-h-48 items-start py-12' : 'h-48 items-center',
          hasValue ? 'text-gray-700' : 'text-gray-300',
        )}
      >
        {isMulti && hasValue ? (
          <div className="flex flex-wrap gap-4">
            {(props as MultiSelectProps).value.map((v) => {
              const label = options.find((opt) => opt.value === v)?.label ?? v;
              return (
                <Badge
                  key={v}
                  variant={(props as MultiSelectProps).badgeVariant ?? 'primary'}
                  size={(props as MultiSelectProps).badgeSize ?? 'xsmall'}
                >
                  {label}
                </Badge>
              );
            })}
          </div>
        ) : (
          <span className="truncate">{triggerLabel}</span>
        )}
        <Icon name="ic_chevron_down" size={20} className="pointer-events-none shrink-0 text-gray-600" />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable={isMulti || undefined}
          className={cn(
            'absolute left-0 z-50 flex max-h-[208px] w-full flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white p-8',
            openUpward ? 'bottom-full mb-4' : 'top-full mt-4',
          )}
        >
          {options.map((opt, index) => (
            <SelectOptionItem
              key={opt.value}
              id={optionId(index)}
              label={opt.label}
              isSelected={isSelected(opt.value)}
              isFocused={focusedIndex === index}
              isMulti={isMulti}
              onClick={() => handleSelect(opt.value)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
