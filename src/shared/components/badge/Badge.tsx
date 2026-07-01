import { cn } from '@shared/utils/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type BadgeVariantTypes = 'primary' | 'secondary' | 'outline' | 'disabled' | 'negative';
type BadgeSizeTypes = 'xsmall' | 'small' | 'medium';

interface BadgeProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  children: ReactNode;
  variant?: BadgeVariantTypes;
  size?: BadgeSizeTypes;
}

const badgeBaseClass = 'inline-flex w-fit items-center justify-center rounded-[0.25rem] whitespace-nowrap';

const badgeVariantClass: Record<BadgeVariantTypes, string> = {
  primary: 'bg-blue-100 text-blue-500',
  secondary: 'bg-gray-100 text-gray-700',
  outline: 'border border-gray-200 bg-white text-gray-700',
  disabled: 'bg-gray-100 text-gray-400',
  negative: 'bg-negative-20 text-negative-30',
};

const badgeSizeClass: Record<BadgeSizeTypes, string> = {
  xsmall: 'h-6 px-2 text-caption-m-12',
  small: 'h-8 px-3 text-body-m-14',
  medium: 'h-10 px-5 text-body-sb-16',
};

export const Badge = ({ children, className, variant = 'primary', size = 'xsmall', ...props }: BadgeProps) => {
  return (
    <span className={cn(badgeBaseClass, badgeVariantClass[variant], badgeSizeClass[size], className)} {...props}>
      {children}
    </span>
  );
};
