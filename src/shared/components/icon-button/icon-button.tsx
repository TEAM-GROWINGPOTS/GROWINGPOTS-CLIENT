import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type IconButtonSize = 'large' | 'medium' | 'small';

const ICON_SIZE: Record<IconButtonSize, number> = {
  large: 24,
  medium: 24,
  small: 16,
};

const iconButtonVariants = cva(
  'flex cursor-pointer items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100  transition-colors text-gray-500 ',
  {
    variants: {
      size: {
        large: 'size-48',
        medium: 'size-40',
        small: 'size-28',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
);

interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'>, VariantProps<typeof iconButtonVariants> {
  name: string;
  'aria-label': string;
}

export const IconButton = ({ name, size = 'medium', className, ...props }: IconButtonProps) => {
  return (
    <button type="button" className={cn(iconButtonVariants({ size }), className)} {...props}>
      <Icon name={name} size={ICON_SIZE[size ?? 'medium']} />
    </button>
  );
};
