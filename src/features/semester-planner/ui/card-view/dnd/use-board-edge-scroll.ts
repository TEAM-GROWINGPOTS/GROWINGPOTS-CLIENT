'use client';

import type { DragStartEvent } from '@dnd-kit/core';
import { type RefObject, useCallback, useEffect, useRef } from 'react';

const EDGE_ZONE_PX = 20;
const SCROLL_SPEED_PX_PER_FRAME = 4;

interface Pointer {
  x: number;
  y: number;
}

export const useBoardEdgeScroll = (
  boardRef: RefObject<HTMLElement | null>,
  wrapperRef: RefObject<HTMLElement | null>,
) => {
  const pointerRef = useRef<Pointer | null>(null);
  const rafRef = useRef<number | null>(null);

  const trackPointer = useCallback((event: PointerEvent) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
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
    pointerRef.current =
      activatorEvent instanceof MouseEvent ? { x: activatorEvent.clientX, y: activatorEvent.clientY } : null;
    window.addEventListener('pointermove', trackPointer);

    const step = () => {
      rafRef.current = requestAnimationFrame(step);
      const pointer = pointerRef.current;
      if (!pointer) return;

      const board = boardRef.current;
      if (board) {
        const rect = board.getBoundingClientRect();
        if (pointer.x <= rect.left + EDGE_ZONE_PX) board.scrollLeft -= SCROLL_SPEED_PX_PER_FRAME;
        else if (pointer.x >= rect.right - EDGE_ZONE_PX) board.scrollLeft += SCROLL_SPEED_PX_PER_FRAME;
      }

      const wrapper = wrapperRef.current;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        if (pointer.y <= rect.top + EDGE_ZONE_PX) wrapper.scrollTop -= SCROLL_SPEED_PX_PER_FRAME;
        else if (pointer.y >= rect.bottom - EDGE_ZONE_PX) wrapper.scrollTop += SCROLL_SPEED_PX_PER_FRAME;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  return { handleDragStart, stopScroll };
};
