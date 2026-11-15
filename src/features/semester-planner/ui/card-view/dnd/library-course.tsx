'use client';

import { useDraggable } from '@dnd-kit/core';
import type { SemesterCourse } from '@features/semester-planner/types/planner';
import { LIBRARY_PREFIX } from '@features/semester-planner/ui/card-view/dnd/use-card-view-dnd';
import { getCourseNote, getCourseTags } from '@features/semester-planner/utils/map-planner';
import type { CourseSearchItemResponse } from '@shared/apis/types/course-search';
import { ClassCard } from '@shared/components/class-card/class-card';
import { memo, useMemo } from 'react';

const toLibrarySemesterCourse = ({
  courseId,
  name,
  departmentName,
  defaultDivisionName,
  area,
  credit,
  openedSemester,
  isEnglish,
  isSw,
}: CourseSearchItemResponse): SemesterCourse => ({
  id: `${LIBRARY_PREFIX}${courseId}`,
  courseId,
  departmentName,
  name,
  tags: getCourseTags(defaultDivisionName, credit, openedSemester),
  credit,
  divisionName: defaultDivisionName,
  isEnglish,
  isSw,
  area,
});

interface LibraryCourseProps {
  course: CourseSearchItemResponse;
  admissionYear?: number;
}

const LibraryCourseComponent = ({ course, admissionYear }: LibraryCourseProps) => {
  const semesterCourse = useMemo(() => toLibrarySemesterCourse(course), [course]);
  const { id, departmentName, name, tags, isEnglish, isSw } = semesterCourse;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { course: semesterCourse },
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <ClassCard
        department={departmentName}
        title={name}
        tags={tags}
        isEnglish={isEnglish}
        isSw={isSw}
        note={getCourseNote(semesterCourse, admissionYear)}
        type={isDragging ? 'disabled' : 'default'}
        className="cursor-grab border border-gray-100"
      />
    </div>
  );
};

export const LibraryCourse = memo(LibraryCourseComponent);
