'use client';

import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { useEffect, useId, useRef, useState } from 'react';

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
  showCheckbox?: false;
  value: string;
  onChange: (value: string) => void;
};

type MultiSelectProps = BaseProps & {
  showCheckbox: true;
  value: string[];
  onChange: (value: string[]) => void;
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

  const hasValue = props.showCheckbox ? props.value.length > 0 : props.value !== '';

  const isSelected = (optValue: string): boolean => {
    if (props.showCheckbox) return props.value.includes(optValue);
    return props.value === optValue;
  };

  const triggerLabel = (() => {
    if (!props.showCheckbox) return options.find((opt) => opt.value === props.value)?.label ?? placeholder;
    if (props.value.length === 0) return placeholder;
    return props.value.map((v) => options.find((opt) => opt.value === v)?.label ?? v).join(', ');
  })();

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
    if (props.showCheckbox) {
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
        aria-multiselectable={props.showCheckbox || undefined}
        aria-activedescendant={isOpen && focusedIndex >= 0 ? optionId(focusedIndex) : undefined}
        className={cn(
          'text-body-r-16 flex h-48 w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white pr-14 pl-16',
          hasValue ? 'text-gray-700' : 'text-gray-300',
        )}
      >
        <span className="truncate">{triggerLabel}</span>
        <Icon name="ic_chevron_down" size={20} className="pointer-events-none shrink-0 text-gray-600" />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable={props.showCheckbox || undefined}
          className={cn(
            'absolute left-0 z-50 flex max-h-[208px] w-full flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white p-8',
            openUpward ? 'bottom-full mb-4' : 'top-full mt-4',
          )}
        >
          {options.map((opt, index) => (
            <li
              key={opt.value}
              id={optionId(index)}
              role="option"
              aria-selected={isSelected(opt.value)}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                'text-body-m-16 flex h-48 w-full shrink-0 cursor-pointer items-center rounded-lg bg-white px-12 text-gray-700 hover:bg-gray-50',
                focusedIndex === index && 'bg-gray-50',
                isSelected(opt.value) && 'bg-gray-50 text-blue-500',
              )}
            >
              {props.showCheckbox && (
                <Icon
                  name={isSelected(opt.value) ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'}
                  size={20}
                  className="mr-8 shrink-0"
                />
              )}
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
