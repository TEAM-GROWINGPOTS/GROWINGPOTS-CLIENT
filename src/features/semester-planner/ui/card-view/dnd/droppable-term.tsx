'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  getFolderName,
  getSelectedCourses,
  getSelectedTotalCredit,
} from '@features/semester-planner/hooks/use-planner-terms';
import type { PlannerTerm, SemesterCourse } from '@features/semester-planner/types/planner';
import { DraggableCourse } from '@features/semester-planner/ui/card-view/dnd/draggable-course';
import { SemesterCard } from '@features/semester-planner/ui/card-view/semester-card/semester-card';
import { type Ref, useCallback } from 'react';

interface DroppableTermProps {
  term: PlannerTerm;
  cardRef?: Ref<HTMLElement>;
  scrollToCourse?: { courseId: string; key: number };
  isDropTarget: boolean;
  onDeleteTerm: (term: PlannerTerm) => void;
  onAddFolder: (termId: string) => void;
  onSelectFolder: (termId: string, folderId: string) => void;
  onRenameFolder: (termId: string, folderId: string, name: string) => void;
  onDeleteFolder: (term: PlannerTerm, folderId: string) => void;
  admissionYear?: number;
}

export const DroppableTerm = ({
  term,
  cardRef,
  scrollToCourse,
  isDropTarget,
  onDeleteTerm,
  onAddFolder,
  onSelectFolder,
  onRenameFolder,
  onDeleteFolder,
  admissionYear,
}: DroppableTermProps) => {
  const { setNodeRef } = useDroppable({ id: term.id });
  const { id: termId, yearLevel, semester, semesterLabel, status, selectedFolderId, folders } = term;

  // useDroppable은 드래그 상태가 바뀔 때마다 이 컴포넌트를 다시 렌더하므로, memo된 SemesterCard에는
  // 참조가 유지되는 콜백만 넘겨 카드 본문까지 다시 그려지지 않게 한다.
  const renderCourse = useCallback(
    (course: SemesterCourse) => <DraggableCourse key={course.id} course={course} admissionYear={admissionYear} />,
    [admissionYear],
  );
  const handleDeleteTerm = useCallback(() => onDeleteTerm(term), [onDeleteTerm, term]);
  const handleAddFolder = useCallback(() => onAddFolder(termId), [onAddFolder, termId]);
  const handleSelectFolder = useCallback(
    (folderId: string) => onSelectFolder(termId, folderId),
    [onSelectFolder, termId],
  );
  const handleRenameFolder = useCallback(
    (folderId: string, name: string) => onRenameFolder(termId, folderId, name),
    [onRenameFolder, termId],
  );
  const handleDeleteFolder = useCallback((folderId: string) => onDeleteFolder(term, folderId), [onDeleteFolder, term]);

  return (
    <div ref={setNodeRef} className="h-full">
      <SemesterCard
        ref={cardRef}
        className="max-h-full"
        scrollToCourse={scrollToCourse}
        yearLevel={yearLevel}
        semester={semester}
        semesterLabel={semesterLabel}
        status={status}
        folderName={getFolderName(term)}
        totalCredit={getSelectedTotalCredit(term)}
        courses={getSelectedCourses(term)}
        folders={folders}
        selectedFolderId={selectedFolderId}
        isDropTarget={isDropTarget}
        admissionYear={admissionYear}
        renderCourse={renderCourse}
        onDeleteTerm={handleDeleteTerm}
        onAddFolder={handleAddFolder}
        onSelectFolder={handleSelectFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
      />
    </div>
  );
};
