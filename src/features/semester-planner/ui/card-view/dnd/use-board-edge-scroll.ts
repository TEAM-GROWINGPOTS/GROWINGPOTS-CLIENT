'use client';

import type { DragStartEvent } from '@dnd-kit/core';
import { type RefObject, useCallback, useEffect, useRef } from 'react';

const EDGE_ZONE_PX = 20;
const SCROLL_SPEED_PX_PER_FRAME = 4;

export const useBoardEdgeScroll = (boardRef: RefObject<HTMLElement | null>) => {
  const pointerXRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const trackPointer = useCallback((event: PointerEvent) => {
    pointerXRef.current = event.clientX;
  }, []);

  const stopScroll = useCallback(() => {
    window.removeEventListener('pointermove', trackPointer);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [trackPointer]);

  useEffect(() => stopScroll, [stopScroll]);

  const handleDragStart = ({ activatorEvent }: DragStartEvent) => {
    stopScroll();
    pointerXRef.current = activatorEvent instanceof MouseEvent ? activatorEvent.clientX : null;
    window.addEventListener('pointermove', trackPointer);

    const step = () => {
      rafRef.current = requestAnimationFrame(step);
      const board = boardRef.current;
      const pointerX = pointerXRef.current;
      if (!board || pointerX === null) return;
      const rect = board.getBoundingClientRect();
      if (pointerX <= rect.left + EDGE_ZONE_PX) board.scrollLeft -= SCROLL_SPEED_PX_PER_FRAME;
      else if (pointerX >= rect.right - EDGE_ZONE_PX) board.scrollLeft += SCROLL_SPEED_PX_PER_FRAME;
    };
    rafRef.current = requestAnimationFrame(step);
  };

  return { handleDragStart, stopScroll };
};
