import { cn } from '@shared/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

const chipVariants = cva(
  'inline-flex w-fit cursor-pointer items-center justify-center rounded-[30px] border transition-colors disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        small: 'py-6 px-12 text-caption-m-12',
        medium: 'py-8 px-20 text-body-m-16',
      },
    },
    defaultVariants: {
      size: 'small',
    },
  },
);

interface ChipProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'>, VariantProps<typeof chipVariants> {
  label: string;
  isSelected?: boolean;
}

export const Chip = ({ label, size, isSelected, className, disabled, ...props }: ChipProps) => {
  return (
    <button
      {...props}
      type="button"
      disabled={disabled}
      aria-pressed={isSelected}
      className={cn(
        chipVariants({ size }),
        'disabled:border-transparent disabled:bg-gray-100 disabled:text-gray-300',
        isSelected
          ? 'border-transparent bg-gray-700 text-white'
          : 'border-gray-200 bg-white text-gray-500 enabled:hover:border-transparent enabled:hover:bg-gray-900 enabled:hover:text-white',
        className,
      )}
    >
      {label}
    </button>
  );
};
