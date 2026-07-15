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

const getRequirementCourseTags = ({ credit, divisionName, semester }: RequirementCourse, requirementName: string) => {
  const tags = {
    division: divisionName || requirementName,
    credit: `${credit}학점`,
    semester,
  };

  return [tags.division, tags.credit, tags.semester].filter((tag): tag is string => Boolean(tag));
};

const getRequirementCourseNote = ({ area, divisionCode }: RequirementCourse) => {
  if (divisionCode !== 'DISTRIBUTED_GE' || !area) return undefined;

  return `*${area.name}`;
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
            note={getRequirementCourseNote(course)}
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
