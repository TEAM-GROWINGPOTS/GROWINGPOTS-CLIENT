'use client';

import { useDraggable } from '@dnd-kit/core';
import type { SemesterCourse } from '@features/semester-planner/types/planner';
import type { Course } from '@features/semester-planner/ui/card-view/add-course-sidebar/add-course-sidebar';
import { LIBRARY_PREFIX } from '@features/semester-planner/ui/card-view/dnd/use-card-view-dnd';
import { ClassCard } from '@shared/components/class-card/class-card';

const toLibrarySemesterCourse = ({
  id,
  department,
  title,
  tags,
  credit,
  divisionName,
  isEnglish,
  isSw,
}: Course): SemesterCourse => ({
  id: `${LIBRARY_PREFIX}${id}`,
  department,
  name: title,
  tags,
  credit,
  divisionName,
  isEnglish,
  isSw,
});

export const LibraryCourse = ({ course }: { course: Course }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `${LIBRARY_PREFIX}${course.id}`,
    data: { course: toLibrarySemesterCourse(course) },
  });
  const { department, title, tags, isEnglish, isSw } = course;

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <ClassCard
        department={department}
        title={title}
        tags={tags}
        isEnglish={isEnglish}
        isSw={isSw}
        className="cursor-grab border border-gray-100"
      />
    </div>
  );
};
