'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@shared/utils/cn';
import type { ReactNode } from 'react';

export type TooltipVariant = 'top-center' | 'top-start' | 'bottom-center' | 'bottom-start';
export type TooltipSize = 'sm' | 'md';

const variantMap: Record<TooltipVariant, { side: 'top' | 'bottom'; align: 'center' | 'start' }> = {
  'top-center': { side: 'top', align: 'center' },
  'top-start': { side: 'top', align: 'start' },
  'bottom-center': { side: 'bottom', align: 'center' },
  'bottom-start': { side: 'bottom', align: 'start' },
};

const sizeClass: Record<TooltipSize, string> = {
  sm: 'px-8 py-4 text-caption-r-12',
  md: 'px-12 py-8 text-body-m-14',
};

const arrowBorderClass: Record<'top' | 'bottom', Record<TooltipSize, string>> = {
  top: {
    sm: 'border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-700',
    md: 'border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-700',
  },
  bottom: {
    sm: 'border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-700',
    md: 'border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-700',
  },
};

const arrowOffsetClass: Record<'top' | 'bottom', Record<TooltipSize, string>> = {
  top: { sm: 'bottom-[-6px]', md: 'bottom-[-8px]' },
  bottom: { sm: 'top-[-6px]', md: 'top-[-8px]' },
};

const arrowAlignClass: Record<'center' | 'start', string> = {
  center: 'left-1/2 -translate-x-1/2',
  start: 'left-[12px]',
};

const sideOffsetMap: Record<TooltipSize, number> = {
  sm: 10,
  md: 12,
};

interface TooltipProps {
  trigger: ReactNode;
  content: string;
  variant?: TooltipVariant;
  size?: TooltipSize;
}

export const Tooltip = ({ trigger, content, variant = 'bottom-center', size = 'sm' }: TooltipProps) => {
  const { side, align } = variantMap[variant];

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{trigger}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content side={side} align={align} sideOffset={sideOffsetMap[size]} className="relative">
          <div className={cn('rounded-sm bg-gray-700 text-gray-50', sizeClass[size])}>{content}</div>
          <div
            className={cn(
              'absolute h-0 w-0',
              arrowBorderClass[side][size],
              arrowOffsetClass[side][size],
              arrowAlignClass[align],
            )}
          />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
};
