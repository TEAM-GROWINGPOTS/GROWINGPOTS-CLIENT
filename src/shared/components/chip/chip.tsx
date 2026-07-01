import { cn } from '@shared/utils/cn';
import type { ComponentPropsWithoutRef } from 'react';

export type ChipMode = 'primary_selected' | 'primary_default' | 'secondary_selected' | 'secondary_default';

const chipBaseClass =
  'inline-flex h-32 cursor-pointer items-center justify-center rounded-[30px] px-12 gap-10 text-caption-m-12 disabled:cursor-not-allowed transition-colors';

const chipModeClass: Record<ChipMode, string> = {
  primary_selected: 'bg-blue-500 text-white',
  primary_default:
    'border border-blue-200 bg-white text-blue-500 enabled:hover:bg-blue-600 enabled:hover:text-white enabled:hover:border-transparent disabled:bg-blue-200 disabled:text-white disabled:border-transparent',
  secondary_selected: 'bg-gray-700 text-white',
  secondary_default:
    'border border-gray-200 bg-white text-gray-600 enabled:hover:bg-gray-900 enabled:hover:text-white enabled:hover:border-transparent disabled:bg-gray-100 disabled:text-gray-300 disabled:border-transparent',
};

interface ChipProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string;
  mode: ChipMode;
}

export const Chip = ({ label, mode, className, disabled, ...props }: ChipProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={mode.endsWith('_selected')}
      className={cn(chipBaseClass, chipModeClass[mode], className)}
      {...props}
    >
      {label}
    </button>
  );
};
