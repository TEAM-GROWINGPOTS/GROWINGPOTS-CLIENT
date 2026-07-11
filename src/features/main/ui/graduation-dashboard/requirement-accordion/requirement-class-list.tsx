import type { RequirementCourse } from '@features/main/types/requirement';
import { ClassCard } from '@shared/components';
import { cn } from '@shared/utils/cn';

interface RequirementClassListProps {
  requirementName: string;
  courses: RequirementCourse[];
  className?: string;
  showTakenState?: boolean;
}

export const isTakenCourse = ({ taken }: RequirementCourse) => taken;

const getRequirementCourseKey = ({ studentCourseId, departmentName, name }: RequirementCourse) => {
  return studentCourseId ?? `${departmentName}-${name}`;
};

const getRequirementCourseTags = ({ credit, semester }: RequirementCourse, requirementName: string) => {
  const tags = {
    area: requirementName,
    credit: `${credit}학점`,
    semester,
  };

  return [tags.area, tags.credit, tags.semester];
};

export const RequirementClassList = ({
  requirementName,
  courses,
  className,
  showTakenState = false,
}: RequirementClassListProps) => {
  if (courses.length === 0) return null;

  return (
    <ul className={cn('grid grid-cols-2 gap-8', className)}>
      {courses.map((course) => (
        <li key={getRequirementCourseKey(course)}>
          <ClassCard
            department={course.departmentName}
            title={course.name}
            tags={getRequirementCourseTags(course, requirementName)}
            isEnglish={course.isEnglish}
            isSw={course.isSw}
            size="max"
            type={showTakenState && !isTakenCourse(course) ? 'disabled' : 'default'}
          />
        </li>
      ))}
    </ul>
  );
};
