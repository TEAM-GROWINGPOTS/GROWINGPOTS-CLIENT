'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCourse } from '@features/semester-planner/card-view/dnd/sortable-course';
import { SemesterCard } from '@features/semester-planner/card-view/semester-card/semester-card';
import { getFolderName, getSelectedCourses } from '@features/semester-planner/hooks/use-planner-terms';
import type { PlannerTerm } from '@features/semester-planner/types/planner';

interface DroppableTermProps {
  term: PlannerTerm;
  isDropTarget: boolean;
  onDeleteTerm: () => void;
  onAddFolder: () => void;
  onSelectFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export const DroppableTerm = ({
  term,
  isDropTarget,
  onDeleteTerm,
  onAddFolder,
  onSelectFolder,
  onRenameFolder,
  onDeleteFolder,
}: DroppableTermProps) => {
  const { setNodeRef } = useDroppable({ id: term.id });
  const { id, yearLevel, semester, semesterLabel, status, selectedFolderId, folders } = term;
  const courses = getSelectedCourses(term);

  return (
    <SortableContext id={id} items={courses.map(({ id: courseId }) => courseId)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="h-full">
        <SemesterCard
          className="max-h-full"
          yearLevel={yearLevel}
          semester={semester}
          semesterLabel={semesterLabel}
          status={status}
          folderName={getFolderName(term)}
          courses={courses}
          folders={folders}
          selectedFolderId={selectedFolderId}
          isDropTarget={isDropTarget}
          renderCourse={(course) => <SortableCourse key={course.id} course={course} />}
          onDeleteTerm={onDeleteTerm}
          onAddFolder={onAddFolder}
          onSelectFolder={onSelectFolder}
          onRenameFolder={onRenameFolder}
          onDeleteFolder={onDeleteFolder}
        />
      </div>
    </SortableContext>
  );
};
