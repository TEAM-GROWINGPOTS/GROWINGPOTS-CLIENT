'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  getFolderName,
  getSelectedCourses,
  getSelectedTotalCredit,
} from '@features/semester-planner/hooks/use-planner-terms';
import type { PlannerTerm } from '@features/semester-planner/types/planner';
import { DraggableCourse } from '@features/semester-planner/ui/card-view/dnd/draggable-course';
import { SemesterCard } from '@features/semester-planner/ui/card-view/semester-card/semester-card';
import type { Ref } from 'react';

interface DroppableTermProps {
  term: PlannerTerm;
  cardRef?: Ref<HTMLElement>;
  scrollToCourse?: { courseId: string; key: number };
  isDropTarget: boolean;
  onDeleteTerm: () => void;
  onAddFolder: () => void;
  onSelectFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onDeleteFolder: (folderId: string) => void;
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
  const { yearLevel, semester, semesterLabel, status, selectedFolderId, folders } = term;

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
        renderCourse={(course) => <DraggableCourse key={course.id} course={course} admissionYear={admissionYear} />}
        onDeleteTerm={onDeleteTerm}
        onAddFolder={onAddFolder}
        onSelectFolder={onSelectFolder}
        onRenameFolder={onRenameFolder}
        onDeleteFolder={onDeleteFolder}
      />
    </div>
  );
};
