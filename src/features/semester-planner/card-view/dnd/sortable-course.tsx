'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SemesterCourse } from '@features/semester-planner/card-view/semester-card/semester-card';
import { ClassCard } from '@shared/components/class-card/class-card';

export const SortableCourse = ({ course }: { course: SemesterCourse }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: course.id,
    data: { course },
  });
  const { department, name, tags, isEnglish, isSw } = course;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-30' : undefined}
    >
      <ClassCard
        department={department}
        title={name}
        tags={tags}
        isEnglish={isEnglish}
        isSw={isSw}
        className="w-full cursor-grab border border-gray-100"
      />
    </div>
  );
};
