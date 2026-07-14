'use client';

import Icon from '@shared/components/icon/icon';
import { Tooltip } from '@shared/components/tooltip/tooltip';
import { cn } from '@shared/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const badgeVariants = cva('inline-flex w-fit items-center justify-center gap-4 rounded-[0.25rem] whitespace-nowrap', {
  variants: {
    size: {
      xsmall: 'h-24 px-8 text-caption-m-12',
      small: 'h-32 px-12 text-body-m-14',
      medium: 'h-40 px-20 text-body-sb-16',
    },
    variant: {
      primary: '',
      secondary: 'bg-gray-600 text-gray-100',
      disabled: 'bg-gray-100 text-gray-500',
    },
    color: {
      lime01: '',
      lime02: '',
      purple: '',
      blue: '',
      red: '',
      darkRed: '',
      gray: '',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      color: 'lime01',
      className: 'bg-lime-200 text-lime-900',
    },
    {
      variant: 'primary',
      color: 'lime02',
      className: 'bg-lime-100 text-lime-900',
    },
    {
      variant: 'primary',
      color: 'purple',
      className: 'bg-purple-10 text-purple-20',
    },
    {
      variant: 'primary',
      color: 'blue',
      className: 'bg-blue-10 text-blue-20',
    },
    {
      variant: 'primary',
      color: 'red',
      className: 'bg-red-10 text-red-20',
    },
    {
      variant: 'primary',
      color: 'darkRed',
      className: 'bg-dark-red-20 text-dark-red-10',
    },
    {
      variant: 'primary',
      color: 'gray',
      className: 'bg-gray-100 text-gray-600',
    },
    {
      variant: 'disabled',
      size: 'xsmall',
      className: 'bg-gray-200',
    },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'primary',
    color: 'lime01',
  },
});

interface BadgeProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'>, VariantProps<typeof badgeVariants> {
  children: ReactNode;
  leftIconName?: string;
  leftIconClassName?: string;
  rightIconName?: string;
  rightIconClassName?: string;
  onRightIconClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  truncate?: boolean;
  tooltipOnTruncate?: boolean;
  tooltipContent?: string;
}

export const Badge = ({
  children,
  className,
  variant = 'primary',
  color = 'lime01',
  size = 'medium',
  leftIconName,
  leftIconClassName,
  rightIconName,
  rightIconClassName,
  onRightIconClick,
  truncate = false,
  tooltipOnTruncate = false,
  tooltipContent,
  ...props
}: BadgeProps) => {
  const contentRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    if (!truncate) return;
    const badgeContentElement = contentRef.current;
    if (!badgeContentElement) return;
    setIsTruncated(badgeContentElement.scrollWidth > badgeContentElement.clientWidth);
  }, [children, truncate]);

  const trigger = (
    <span className={cn(badgeVariants({ variant, color, size }), className)} {...props}>
      {size === 'xsmall' && leftIconName && (
        <Icon name={leftIconName} size={16} className={cn('shrink-0', leftIconClassName)} />
      )}
      {truncate ? (
        <span ref={contentRef} className="truncate">
          {children}
        </span>
      ) : (
        children
      )}
      {size === 'xsmall' && rightIconName && (
        <span
          onClick={onRightIconClick}
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            onRightIconClick && 'cursor-pointer',
            rightIconClassName,
          )}
        >
          <Icon name={rightIconName} size={16} />
        </span>
      )}
    </span>
  );

  if (!tooltipOnTruncate) return trigger;

  return (
    <Tooltip
      content={tooltipContent ?? (typeof children === 'string' ? children : '')}
      variant="bottom-start"
      disabled={!isTruncated}
      trigger={trigger}
    />
  );
};
