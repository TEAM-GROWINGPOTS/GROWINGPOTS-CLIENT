'use client';

import { type PointerEvent as ReactPointerEvent, type RefObject, useCallback, useEffect, useRef } from 'react';

const PAN_START_THRESHOLD_PX = 5;
// [role="button"]은 dnd-kit useDraggable이 과목 카드에 부여하는 속성 — 과목 드래그와 보드 패닝을 여기서 분리한다
const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea, [role="button"], [contenteditable="true"]';

interface PanSession {
  pointerId: number;
  startX: number;
  startScrollLeft: number;
  isPanning: boolean;
  previousBodyUserSelect: string;
}

export const useBoardDragScroll = (boardRef: RefObject<HTMLElement | null>) => {
  const sessionRef = useRef<PanSession | null>(null);

  const endPan = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    sessionRef.current = null;
    if (!session.isPanning) return;
    document.body.style.userSelect = session.previousBodyUserSelect;
    const board = boardRef.current;
    if (board) board.style.cursor = '';
  }, [boardRef]);

  useEffect(() => endPan, [endPan]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    const board = boardRef.current;
    if (!board) return;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    if ((event.target as Element).closest(INTERACTIVE_SELECTOR)) return;
    board.setPointerCapture(event.pointerId);
    sessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: board.scrollLeft,
      isPanning: false,
      previousBodyUserSelect: document.body.style.userSelect,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const board = boardRef.current;
    const session = sessionRef.current;
    if (!board || !session || event.pointerId !== session.pointerId) return;

    if (!session.isPanning) {
      if (Math.abs(event.clientX - session.startX) < PAN_START_THRESHOLD_PX) return;
      session.isPanning = true;
      session.startX = event.clientX;
      session.startScrollLeft = board.scrollLeft;
      window.getSelection()?.removeAllRanges();
      document.body.style.userSelect = 'none';
      board.style.cursor = 'grabbing';
    }

    board.scrollLeft = session.startScrollLeft - (event.clientX - session.startX);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (sessionRef.current?.pointerId !== event.pointerId) return;
    endPan();
  };

  return { handlePointerDown, handlePointerMove, handlePointerEnd };
};
