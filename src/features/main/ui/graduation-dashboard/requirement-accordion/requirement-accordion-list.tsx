'use client';

import { useRequirementAccordionScroll } from '@features/main/hooks/use-requirement-accordion-scroll';
import type { RequirementScrollRequest } from '@features/main/types/requirement';
import { cn } from '@shared/utils/cn';

import { RequirementAccordion, type RequirementAccordionItem } from './requirement-accordion';

interface RequirementAccordionListProps {
  items: RequirementAccordionItem[];
  defaultValue?: string[];
  scrollRequest?: RequirementScrollRequest | null;
  onScrollRequestChange?: (targetKey: string | null) => void;
  admissionYear?: number;
  className?: string;
}

export const RequirementAccordionList = ({
  items,
  defaultValue,
  scrollRequest,
  onScrollRequestChange,
  admissionYear,
  className,
}: RequirementAccordionListProps) => {
  const { scrollContainerRef, scrollSpaceRef, itemRefs, isAtBottom, updateIsAtBottom, handleManualScrollStart } =
    useRequirementAccordionScroll({ items, scrollRequest, onScrollRequestChange });

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
          ref={scrollSpaceRef}
          className="h-0 shrink-0 overflow-hidden transition-[height] duration-300 ease-out"
          onTransitionEnd={updateIsAtBottom}
        />
      </div>
      {!isAtBottom && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-125 bg-gradient-to-b from-white/0 to-white" />
      )}
    </div>
  );
};
