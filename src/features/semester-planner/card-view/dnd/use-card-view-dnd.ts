'use client';

import {
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  pointerWithin,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { detectCoverageCollision, DWELL_MS } from '@features/semester-planner/card-view/dnd/collision';
import { getSelectedCourses } from '@features/semester-planner/hooks/use-planner-terms';
import type { PlannerTerm, SemesterCourse } from '@features/semester-planner/types/planner';
import { useEffect, useRef, useState } from 'react';

export const LIBRARY_ID = 'library';
export const LIBRARY_PREFIX = 'lib-';
export const TRASH_ID = 'trash';

interface UseCardViewDndInput {
  plannedTerms: PlannerTerm[];
  snapshot: () => void;
  restoreSnapshot: () => void;
  moveCourseToTerm: (activeId: string, targetTermId: string) => void;
  insertCourse: (termId: string, course: SemesterCourse) => void;
  removeCourse: (courseId: string) => void;
}

export const useCardViewDnd = ({
  plannedTerms,
  snapshot,
  restoreSnapshot,
  moveCourseToTerm,
  insertCourse,
  removeCourse,
}: UseCardViewDndInput) => {
  const [activeCourse, setActiveCourse] = useState<SemesterCourse | null>(null);
  const [overTermId, setOverTermId] = useState<string | null>(null);
  const [isLibraryDrag, setIsLibraryDrag] = useState(false);
  const copyCountRef = useRef(0);
  const lastOverIdRef = useRef<string | null>(null);
  const dwellRef = useRef<{ container: string; timer: ReturnType<typeof setTimeout> } | null>(null);

  const isContainerId = (id: UniqueIdentifier) => plannedTerms.some((term) => term.id === String(id));

  const collisionDetection: CollisionDetection = (args) => {
    const trashHit = pointerWithin(args).find(({ id }) => String(id) === TRASH_ID);
    if (trashHit) return [trashHit];
    return detectCoverageCollision(args, { isContainerId, lastOverIdRef });
  };

  const findContainer = (id: string): string | undefined => {
    if (id === TRASH_ID) return TRASH_ID;
    if (id.startsWith(LIBRARY_PREFIX)) return LIBRARY_ID;
    return plannedTerms.find((term) => term.id === id || getSelectedCourses(term).some((course) => course.id === id))
      ?.id;
  };

  const clearDwell = () => {
    if (dwellRef.current) {
      clearTimeout(dwellRef.current.timer);
      dwellRef.current = null;
    }
  };

  useEffect(() => clearDwell, []);

  const handleDragStart = ({ active }: DragStartEvent) => {
    snapshot();
    lastOverIdRef.current = null;
    clearDwell();
    setIsLibraryDrag(findContainer(String(active.id)) === LIBRARY_ID);
    setActiveCourse((active.data.current?.course as SemesterCourse) ?? null);
  };

  const handleDragCancel = () => {
    clearDwell();
    lastOverIdRef.current = null;
    restoreSnapshot();
    setActiveCourse(null);
    setOverTermId(null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      setOverTermId(null);
      clearDwell();
      restoreSnapshot();
      return;
    }
    const activeId = String(active.id);
    const overId = String(over.id);
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
    if (overContainer === TRASH_ID) {
      setOverTermId(null);
      clearDwell();
      return;
    }
    const isTermTarget = overContainer && overContainer !== LIBRARY_ID;
    setOverTermId(isTermTarget ? overContainer : null);
    if (activeContainer === LIBRARY_ID) {
      clearDwell();
      return;
    }
    if (!activeContainer || !overContainer) return;
    if (overContainer === LIBRARY_ID) {
      clearDwell();
      restoreSnapshot();
      return;
    }
    if (activeContainer === overContainer) {
      clearDwell();
      return;
    }

    if (dwellRef.current?.container === overContainer) return;
    clearDwell();
    const timer = setTimeout(() => {
      dwellRef.current = null;
      moveCourseToTerm(activeId, overContainer);
    }, DWELL_MS);
    dwellRef.current = { container: overContainer, timer };
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    clearDwell();
    lastOverIdRef.current = null;
    setActiveCourse(null);
    setOverTermId(null);
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeContainer = findContainer(activeId);
    const overContainer = overId ? findContainer(overId) : undefined;

    if (overContainer === TRASH_ID) {
      if (activeContainer !== LIBRARY_ID) removeCourse(activeId);
      return;
    }

    if (!overContainer || overContainer === LIBRARY_ID) {
      restoreSnapshot();
      return;
    }

    if (activeContainer === LIBRARY_ID) {
      const course = active.data.current?.course as SemesterCourse | undefined;
      if (!course) return;
      copyCountRef.current += 1;
      const copy = { ...course, id: `${course.id.replace(LIBRARY_PREFIX, 'course-')}-copy-${copyCountRef.current}` };
      insertCourse(overContainer, copy);
      return;
    }

    if (activeContainer !== overContainer) moveCourseToTerm(activeId, overContainer);
  };

  return {
    activeCourse,
    overTermId,
    isLibraryDrag,
    contextProps: {
      collisionDetection,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
    },
  };
};
