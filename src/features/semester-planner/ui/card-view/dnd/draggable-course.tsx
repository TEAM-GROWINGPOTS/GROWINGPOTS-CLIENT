'use client';

import { useDraggable } from '@dnd-kit/core';
import type { SemesterCourse } from '@features/semester-planner/types/planner';
import { getCourseNote } from '@features/semester-planner/utils/map-planner';
import { ClassCard } from '@shared/components/class-card/class-card';

interface DraggableCourseProps {
  course: SemesterCourse;
  admissionYear?: number;
}

export const DraggableCourse = ({ course, admissionYear }: DraggableCourseProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: course.id,
    data: { course },
  });
  const { departmentName, name, tags, isEnglish, isSw } = course;

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className={isDragging ? 'opacity-30' : undefined}>
      <ClassCard
        department={departmentName}
        title={name}
        tags={tags}
        isEnglish={isEnglish}
        isSw={isSw}
        note={getCourseNote(course, admissionYear)}
        className="w-full cursor-grab border border-gray-100"
      />
    </div>
  );
};
