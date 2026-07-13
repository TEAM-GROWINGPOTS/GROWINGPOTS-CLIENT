'use client';

import { useDraggable } from '@dnd-kit/core';
import { LIBRARY_PREFIX } from '@features/semester-planner/card-view/dnd/use-card-view-dnd';
import type { CourseSearchItemResponse } from '@features/semester-planner/types/course-search';
import type { SemesterCourse } from '@features/semester-planner/types/planner';
import { getCourseTags } from '@features/semester-planner/utils/map-planner';
import { ClassCard } from '@shared/components/class-card/class-card';

const toLibrarySemesterCourse = ({
  courseId,
  name,
  departmentName,
  defaultDivisionName,
  credit,
  openedSemester,
  isEnglish,
  isSw,
}: CourseSearchItemResponse): SemesterCourse => ({
  id: `${LIBRARY_PREFIX}${courseId}`,
  department: departmentName,
  name,
  tags: getCourseTags(defaultDivisionName, credit, openedSemester),
  credit,
  divisionName: defaultDivisionName,
  isEnglish,
  isSw,
});

export const LibraryCourse = ({ course }: { course: CourseSearchItemResponse }) => {
  const semesterCourse = toLibrarySemesterCourse(course);
  const { id, department, name, tags, isEnglish, isSw } = semesterCourse;
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { course: semesterCourse },
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <ClassCard
        department={department}
        title={name}
        tags={tags}
        isEnglish={isEnglish}
        isSw={isSw}
        className="cursor-grab border border-gray-100"
      />
    </div>
  );
};
