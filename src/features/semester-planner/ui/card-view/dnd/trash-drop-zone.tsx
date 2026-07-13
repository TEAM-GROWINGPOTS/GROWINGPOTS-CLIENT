'use client';

import { useDroppable } from '@dnd-kit/core';
import { TRASH_ID } from '@features/semester-planner/ui/card-view/dnd/use-card-view-dnd';
import { IconButton } from '@shared/components/icon-button/icon-button';
import { cn } from '@shared/utils/cn';

export const TrashDropZone = () => {
  const { setNodeRef, isOver } = useDroppable({ id: TRASH_ID });

  return (
    <div
      ref={setNodeRef}
      className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-16"
    >
      <p className="text-title-m-18 text-gray-700">여기로 드래그하여 삭제</p>
      <IconButton
        icon="ic_trash"
        aria-label="여기로 드래그하여 삭제"
        size="large"
        className={cn('transition-transform duration-150', isOver && 'scale-125')}
      />
    </div>
  );
};
