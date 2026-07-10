'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@shared/utils/cn';
import type { ReactElement } from 'react';

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

const arrowWrapperSizeClass: Record<TooltipSize, string> = {
  sm: 'h-[7px] w-[14px]',
  md: 'h-[9px] w-[17px]',
};

const arrowWrapperSideClass: Record<'top' | 'bottom', string> = {
  top: 'top-full -translate-y-[2px]',
  bottom: 'bottom-full translate-y-[2px]',
};

const arrowSquareSizeClass: Record<TooltipSize, string> = {
  sm: 'size-[10px]',
  md: 'size-[12px]',
};

const arrowSquareSideClass: Record<'top' | 'bottom', string> = {
  top: 'top-0 -translate-y-1/2',
  bottom: 'bottom-0 translate-y-1/2',
};

const arrowAlignClass: Record<'center' | 'start', Record<TooltipSize, string>> = {
  center: { sm: 'left-1/2 -translate-x-1/2', md: 'left-1/2 -translate-x-1/2' },
  start: { sm: 'left-[12px] -translate-x-1/2', md: 'left-[16px] -translate-x-1/2' },
};

const sideOffsetMap: Record<TooltipSize, number> = {
  sm: 10,
  md: 12,
};

interface TooltipProps {
  trigger: ReactElement;
  content: string;
  variant?: TooltipVariant;
  size?: TooltipSize;
  disabled?: boolean;
}

export const Tooltip = ({ trigger, content, variant = 'bottom-center', size = 'sm', disabled }: TooltipProps) => {
  const { side, align } = variantMap[variant];

  if (disabled) return trigger;

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{trigger}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={sideOffsetMap[size]}
          avoidCollisions={false}
          className="z-tooltip relative"
        >
          <div className={cn('rounded-sm bg-gray-700 whitespace-pre-line text-gray-50', sizeClass[size])}>
            {content}
          </div>
          <div
            className={cn(
              'absolute overflow-hidden',
              arrowWrapperSizeClass[size],
              arrowWrapperSideClass[side],
              arrowAlignClass[align][size],
            )}
          >
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 rotate-45 rounded-xs bg-gray-700',
                arrowSquareSizeClass[size],
                arrowSquareSideClass[side],
              )}
            />
          </div>
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
};
