import type { RequirementAccordionItem, RequirementScrollRequest } from '@features/main/types/requirement';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseRequirementAccordionScrollParams {
  items: RequirementAccordionItem[];
  scrollRequest?: RequirementScrollRequest | null;
  onScrollRequestChange?: (targetKey: string | null) => void;
}

export const useRequirementAccordionScroll = ({
  items,
  scrollRequest,
  onScrollRequestChange,
}: UseRequirementAccordionScrollParams) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollSpaceRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isAtBottom, setIsAtBottom] = useState(false);
  const pendingFrameRef = useRef<number | null>(null);
  const isAutoScrollingRef = useRef(false);
  const hasScrollTarget = Boolean(
    scrollRequest && items.some(({ scrollKey }) => scrollKey === scrollRequest.targetKey),
  );

  const cancelAutoScroll = useCallback(() => {
    if (pendingFrameRef.current !== null) {
      cancelAnimationFrame(pendingFrameRef.current);
      pendingFrameRef.current = null;
    }

    if (isAutoScrollingRef.current) {
      const container = scrollContainerRef.current;
      container?.scrollTo({ top: container.scrollTop, behavior: 'instant' });
      isAutoScrollingRef.current = false;
    }
  }, []);

  const updateIsAtBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const bottomGap = container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(bottomGap <= 1);
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(updateIsAtBottom);

    return () => cancelAnimationFrame(frameId);
  }, [items, updateIsAtBottom]);

  useEffect(() => {
    if (!scrollRequest || !hasScrollTarget) return;

    pendingFrameRef.current = requestAnimationFrame(() => {
      pendingFrameRef.current = null;
      const { targetKey } = scrollRequest;
      const container = scrollContainerRef.current;
      const space = scrollSpaceRef.current;
      const targetItem = itemRefs.current[targetKey];
      if (!container || !space || !targetItem) return;

      space.style.transitionProperty = 'none';
      space.style.height = `${container.clientHeight}px`;

      const containerRect = container.getBoundingClientRect();
      const targetRect = targetItem.getBoundingClientRect();
      const scrollTop = targetRect.top - containerRect.top - container.clientTop + container.scrollTop;

      isAutoScrollingRef.current = true;
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      updateIsAtBottom();
    });

    return cancelAutoScroll;
  }, [scrollRequest, hasScrollTarget, cancelAutoScroll, updateIsAtBottom]);

  const handleManualScrollStart = useCallback(() => {
    cancelAutoScroll();
    onScrollRequestChange?.(null);
    const space = scrollSpaceRef.current;
    if (space) {
      space.style.transitionProperty = 'height';
      space.style.height = '0px';
    }
  }, [cancelAutoScroll, onScrollRequestChange]);

  return {
    scrollContainerRef,
    scrollSpaceRef,
    itemRefs,
    isAtBottom,
    updateIsAtBottom,
    handleManualScrollStart,
  };
};
