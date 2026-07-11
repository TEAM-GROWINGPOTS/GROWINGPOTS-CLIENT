import type { RequirementAccordionItem } from '@features/main/types/requirement';
import { useEffect, useRef, useState } from 'react';

interface UseRequirementAccordionScrollParams {
  items: RequirementAccordionItem[];
  scrollTargetKey?: string | null;
}

export const useRequirementAccordionScroll = ({ items, scrollTargetKey }: UseRequirementAccordionScrollParams) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasAutoScrollSpace, setHasAutoScrollSpace] = useState(false);
  const [isAutoScrollSpaceAnimated, setIsAutoScrollSpaceAnimated] = useState(false);
  const [activeScrollTargetKey, setActiveScrollTargetKey] = useState<string | null>(null);

  const updateIsAtBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const bottomGap = container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(bottomGap <= 1);
  };

  useEffect(() => {
    const frameId = requestAnimationFrame(updateIsAtBottom);

    return () => cancelAnimationFrame(frameId);
  }, [items, hasAutoScrollSpace]);

  useEffect(() => {
    if (!scrollTargetKey) return;

    const frameIds: number[] = [];

    frameIds.push(
      requestAnimationFrame(() => {
        setIsAutoScrollSpaceAnimated(false);
        setHasAutoScrollSpace(true);
        setActiveScrollTargetKey(null);

        frameIds.push(
          requestAnimationFrame(() => {
            setActiveScrollTargetKey(scrollTargetKey);
          }),
        );
      }),
    );

    return () => {
      frameIds.forEach(cancelAnimationFrame);
    };
  }, [scrollTargetKey]);

  useEffect(() => {
    if (!activeScrollTargetKey) return;

    itemRefs.current[activeScrollTargetKey]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [activeScrollTargetKey]);

  const handleManualScrollStart = () => {
    setIsAutoScrollSpaceAnimated(true);
    setHasAutoScrollSpace(false);
  };

  return {
    scrollContainerRef,
    itemRefs,
    isAtBottom,
    hasAutoScrollSpace,
    isAutoScrollSpaceAnimated,
    updateIsAtBottom,
    handleManualScrollStart,
  };
};
