import type { RequirementCourse } from '@features/main/types/requirement';
import { ClassCard } from '@shared/components';
import { cn } from '@shared/utils/cn';

interface RequirementClassListProps {
  requirementName: string;
  courses: RequirementCourse[];
  className?: string;
}

export const isTakenCourse = ({ taken }: RequirementCourse) => taken;

const getRequirementCourseKey = ({ studentCourseId, departmentName, name }: RequirementCourse) => {
  return studentCourseId ?? `${departmentName}-${name}`;
};

const getRequirementCourseTags = (
  { credit, taken, takenSemester, openedSemester }: RequirementCourse,
  requirementName: string,
) => {
  const semester = taken ? (takenSemester ?? '수강학기') : (openedSemester ?? '개설학기');

  return [requirementName, `${credit}학점`, semester];
};

export const RequirementClassList = ({ requirementName, courses, className }: RequirementClassListProps) => {
  if (courses.length === 0) return null;

  return (
    <ul className={cn('grid grid-cols-2 gap-8', className)}>
      {courses.map((course) => (
        <li key={getRequirementCourseKey(course)}>
          <ClassCard
            department={course.departmentName}
            title={course.name}
            tags={getRequirementCourseTags(course, requirementName)}
            type={isTakenCourse(course) ? 'default' : 'disabled'}
          />
        </li>
      ))}
    </ul>
  );
};
