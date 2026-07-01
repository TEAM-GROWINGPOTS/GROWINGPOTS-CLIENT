import { cn } from '@shared/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type BadgeVariantTypes = 'primary' | 'secondary' | 'outline' | 'disabled' | 'negative';
type BadgeSizeTypes = 'xsmall' | 'small' | 'medium';

const badgeVariants = cva('inline-flex w-fit items-center justify-center rounded-[0.25rem] whitespace-nowrap', {
  variants: {
    size: {
      xsmall: 'h-24 px-8 text-caption-m-12',
      small: 'h-32 px-12 text-body-m-14',
      medium: 'h-40 px-20 text-body-sb-16',
    },
    variant: {
      primary: 'bg-blue-100 text-blue-500',
      secondary: 'bg-gray-100 text-gray-700',
      outline: 'border border-gray-200 bg-white text-gray-700',
      disabled: 'bg-gray-100 text-gray-400',
      negative: 'bg-negative-20 text-negative-30',
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'primary',
  },
});

interface BadgeProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>, VariantProps<typeof badgeVariants> {
  children: ReactNode;
  variant?: BadgeVariantTypes;
  size?: BadgeSizeTypes;
}

export const Badge = ({ children, className, variant = 'primary', size = 'medium', ...props }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
};
