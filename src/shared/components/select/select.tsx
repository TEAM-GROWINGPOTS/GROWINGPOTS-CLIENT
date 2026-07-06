'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useEffect, useId, useRef, useState } from 'react';

import { SelectedBadgeList } from './select-badge-list';
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
  badgeSize?: 'xsmall';
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
  const hasValue = props.multiple ? props.value.length > 0 : props.value !== '';

  const isSelected = (optValue: string): boolean => {
    if (props.multiple) return props.value.includes(optValue);
    return props.value === optValue;
  };

  const triggerLabel = props.multiple
    ? placeholder
    : (options.find((opt) => opt.value === props.value)?.label ?? placeholder);

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

  const openDropdown = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setOpenUpward(window.innerHeight - rect.bottom < 220);
    }
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
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
      case ' ':
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
          if (!isOpen) openDropdown();
          else setIsOpen(false);
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={isOpen && focusedIndex >= 0 ? optionId(focusedIndex) : undefined}
        className={cn(
          'text-body-r-16 flex w-full justify-between rounded-[8px] border border-gray-200 bg-white pr-14 pl-16',
          isMulti ? 'min-h-48 items-start py-12' : 'h-48 items-center',
          hasValue ? 'text-gray-700' : 'text-gray-300',
        )}
      >
        {props.multiple && hasValue ? (
          <SelectedBadgeList
            values={props.value}
            options={options}
            variant={props.badgeVariant}
            size={props.badgeSize}
          />
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
            'absolute left-0 z-50 flex max-h-[208px] w-full flex-col overflow-y-auto rounded-[8px] border border-gray-200 bg-white p-8',
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
