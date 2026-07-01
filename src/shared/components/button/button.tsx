import { cn } from '@shared/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ButtonMode = 'primary_solid' | 'primary_outline' | 'secondary_solid' | 'secondary_outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const buttonVariants = cva('flex cursor-pointer items-center disabled:cursor-not-allowed', {
  variants: {
    size: {
      sm: 'gap-6 rounded-md px-12 py-6',
      md: 'gap-6 rounded-lg px-14 py-8',
      lg: 'gap-10 rounded-[10px] px-20 py-12',
    },
    mode: {
      primary_solid: 'bg-blue-500 text-white enabled:hover:bg-blue-600 disabled:bg-blue-200',
      primary_outline:
        'border border-blue-500 bg-blue-50 text-blue-500 enabled:hover:bg-blue-100 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-300',
      secondary_solid: 'bg-gray-100 text-gray-700',
      secondary_outline: 'border border-gray-300 bg-white text-gray-500 enabled:hover:bg-gray-100',
    },
  },
  defaultVariants: {
    size: 'md',
    mode: 'primary_solid',
  },
});

const buttonLabelClassName: Record<ButtonSize, string> = {
  sm: 'body-m-14',
  md: 'body-sb-16',
  lg: 'body-sb-16',
};

interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'>, VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  label: string;
}

export const Button = ({
  size: sizeProp,
  mode = 'primary_solid',
  className,
  icon,
  label,
  disabled,
  ...props
}: ButtonProps) => {
  const size = sizeProp ?? 'md';

  return (
    <button type="button" disabled={disabled} className={cn(buttonVariants({ size, mode }), className)} {...props}>
      {icon}
      <span className={buttonLabelClassName[size]}>{label}</span>
    </button>
  );
};
