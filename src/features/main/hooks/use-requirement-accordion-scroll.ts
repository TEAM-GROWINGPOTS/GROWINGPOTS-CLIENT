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
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasAutoScrollSpace, setHasAutoScrollSpace] = useState(false);
  const [isAutoScrollSpaceAnimated, setIsAutoScrollSpaceAnimated] = useState(false);
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
  }, [items, hasAutoScrollSpace, updateIsAtBottom]);

  useEffect(() => {
    if (!scrollRequest || !hasScrollTarget) return;

    pendingFrameRef.current = requestAnimationFrame(() => {
      setIsAutoScrollSpaceAnimated(false);
      setHasAutoScrollSpace(true);

      pendingFrameRef.current = requestAnimationFrame(() => {
        pendingFrameRef.current = null;
        const { targetKey } = scrollRequest;
        const container = scrollContainerRef.current;
        const targetItem = itemRefs.current[targetKey];
        if (!container || !targetItem) return;

        const containerRect = container.getBoundingClientRect();
        const targetRect = targetItem.getBoundingClientRect();
        const scrollTop = targetRect.top - containerRect.top + container.scrollTop;

        isAutoScrollingRef.current = true;
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      });
    });

    return cancelAutoScroll;
  }, [scrollRequest, hasScrollTarget, cancelAutoScroll]);

  const handleManualScrollStart = useCallback(() => {
    cancelAutoScroll();
    onScrollRequestChange?.(null);
    setIsAutoScrollSpaceAnimated(true);
    setHasAutoScrollSpace(false);
  }, [cancelAutoScroll, onScrollRequestChange]);

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
