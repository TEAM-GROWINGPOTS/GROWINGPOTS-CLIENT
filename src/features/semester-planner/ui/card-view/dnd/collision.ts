import type { ClientRect, CollisionDetection, UniqueIdentifier } from '@dnd-kit/core';
import type { RefObject } from 'react';

export const OVERLAP_ENTER = 0.25;
export const OVERLAP_EXIT = 0.05;
export const DWELL_MS = 120;

export const getCoverageRatio = (cardRect: ClientRect, targetRect: ClientRect): number => {
  const left = Math.max(cardRect.left, targetRect.left);
  const right = Math.min(cardRect.left + cardRect.width, targetRect.left + targetRect.width);
  const top = Math.max(cardRect.top, targetRect.top);
  const bottom = Math.min(cardRect.top + cardRect.height, targetRect.top + targetRect.height);
  if (right <= left || bottom <= top) return 0;
  const cardArea = cardRect.width * cardRect.height;
  if (cardArea <= 0) return 0;
  return ((right - left) * (bottom - top)) / cardArea;
};

interface CoverageCollisionOptions {
  isContainerId: (id: UniqueIdentifier) => boolean;
  lastOverIdRef: RefObject<string | null>;
}

export const detectCoverageCollision = (
  { collisionRect, droppableRects, droppableContainers }: Parameters<CollisionDetection>[0],
  { isContainerId, lastOverIdRef }: CoverageCollisionOptions,
): ReturnType<CollisionDetection> => {
  const scored = droppableContainers
    .map((container) => {
      const rect = droppableRects.get(container.id);
      const value = rect ? getCoverageRatio(collisionRect, rect) : 0;
      return { id: container.id, data: { droppableContainer: container, value } };
    })
    .filter(({ data }) => data.value > 0);

  const itemCollisions = scored.filter(({ id }) => !isContainerId(id)).sort((a, b) => b.data.value - a.data.value);
  const containerCollisions = scored.filter(({ id }) => isContainerId(id)).sort((a, b) => b.data.value - a.data.value);
  const ranked = [...itemCollisions, ...containerCollisions];

  const entered = ranked.filter(({ data }) => data.value >= OVERLAP_ENTER);
  if (entered.length > 0) {
    lastOverIdRef.current = String(entered[0].id);
    return entered;
  }

  const currentId = lastOverIdRef.current;
  const current = currentId ? ranked.find(({ id }) => String(id) === currentId) : undefined;
  if (current && current.data.value >= OVERLAP_EXIT) {
    return [current];
  }

  lastOverIdRef.current = null;
  return [];
};
