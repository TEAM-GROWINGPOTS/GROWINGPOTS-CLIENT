'use client';

import { useRequirementAccordionScroll } from '@features/main/hooks/use-requirement-accordion-scroll';
import { cn } from '@shared/utils/cn';

import { RequirementAccordion, type RequirementAccordionItem } from './requirement-accordion';

interface RequirementAccordionListProps {
  items: RequirementAccordionItem[];
  defaultValue?: string[];
  scrollTargetKey?: string | null;
  admissionYear?: number;
  className?: string;
}

export const RequirementAccordionList = ({
  items,
  defaultValue,
  scrollTargetKey,
  admissionYear,
  className,
}: RequirementAccordionListProps) => {
  const {
    scrollContainerRef,
    itemRefs,
    isAtBottom,
    hasAutoScrollSpace,
    isAutoScrollSpaceAnimated,
    updateIsAtBottom,
    handleManualScrollStart,
  } = useRequirementAccordionScroll({ items, scrollTargetKey });

  return (
    <div className={cn('relative', className)}>
      <div
        ref={scrollContainerRef}
        className="h-[533px] [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden"
        onScroll={updateIsAtBottom}
        onTouchMove={handleManualScrollStart}
        onWheel={handleManualScrollStart}
      >
        <RequirementAccordion
          items={items}
          defaultValue={defaultValue}
          itemRefs={itemRefs}
          admissionYear={admissionYear}
          className="max-w-none"
        />
        <div
          className={cn(
            'shrink-0 overflow-hidden',
            isAutoScrollSpaceAnimated && 'transition-[height] duration-300 ease-out',
            hasAutoScrollSpace ? 'h-[533px]' : 'h-0',
          )}
        />
      </div>
      {!isAtBottom && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-125 bg-gradient-to-b from-white/0 to-white" />
      )}
    </div>
  );
};
