import { cn } from '@shared/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ButtonMode = 'primary_solid' | 'primary_outline' | 'secondary_solid' | 'secondary_outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const buttonVariants = cva('flex cursor-pointer items-center disabled:cursor-not-allowed', {
  variants: {
    size: {
      sm: 'gap-4 rounded px-12 py-6 text-body-m-14',
      md: 'gap-6 rounded px-14 py-8 text-body-sb-16',
      lg: 'gap-10 rounded-lg px-20 py-12 text-body-sb-16',
    },
    mode: {
      primary_solid: 'bg-gray-700 text-white enabled:hover:bg-gray-800 disabled:bg-gray-300',
      primary_outline:
        'border border-gray-300 bg-gray-50 text-gray-600 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-300',
      secondary_solid: 'bg-gray-100 text-gray-700',
      secondary_outline:
        'border border-gray-300 bg-white text-gray-600 enabled:hover:bg-gray-100 enabled:hover:text-gray-500',
    },
  },
  defaultVariants: {
    size: 'md',
    mode: 'primary_solid',
  },
});

interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'>, VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  label: string;
}

export const Button = ({
  size = 'md',
  mode = 'primary_solid',
  className,
  icon,
  label,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button type="button" disabled={disabled} className={cn(buttonVariants({ size, mode }), className)} {...props}>
      {icon}
      <span>{label}</span>
    </button>
  );
};
