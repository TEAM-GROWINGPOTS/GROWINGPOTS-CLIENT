import type { RequirementCourse } from '@features/main/types/requirement';

import { isTakenCourse, RequirementClassList } from './requirement-class-list';

interface RequirementDetailProps {
  requirementName: string;
  notice?: string;
  unmetDescriptions?: string[];
  areaRequirement?: string[];
  courses?: RequirementCourse[];
  hasRequiredList?: boolean;
}

interface ClassSectionProps {
  requirementName: string;
  title: string;
  courses: RequirementCourse[];
}

const ClassSection = ({ requirementName, title, courses }: ClassSectionProps) => {
  if (courses.length === 0) return null;

  return (
    <section className="mt-12">
      <h4 className="text-body-sb-14 text-gray-600">{title}</h4>
      <RequirementClassList requirementName={requirementName} courses={courses} className="mt-4" showTakenState />
    </section>
  );
};

export const RequirementDetail = ({
  requirementName,
  notice,
  unmetDescriptions = [],
  areaRequirement = [],
  courses,
  hasRequiredList = false,
}: RequirementDetailProps) => {
  const unmetDescription = unmetDescriptions.join(', ');
  const areaRequirementDescription = areaRequirement.join(', ');

  if (!notice && !unmetDescription && !areaRequirementDescription && (!courses || courses.length === 0)) return null;

  const takenCourses = courses?.filter(isTakenCourse) ?? [];
  const untakenCourses = courses?.filter((course) => !isTakenCourse(course)) ?? [];

  return (
    <>
      {notice && <p className="text-caption-r-12 text-darkred-10 mt-4">*{notice}</p>}
      {unmetDescription && <p className="text-caption-r-12 text-darkred-10 mt-4">*{unmetDescription}</p>}
      {areaRequirementDescription && (
        <p className="text-caption-r-12 text-darkred-10 mt-4">*{areaRequirementDescription}</p>
      )}
      {courses && courses.length > 0 && !hasRequiredList && (
        <RequirementClassList requirementName={requirementName} courses={courses} className="mt-12" />
      )}
      {hasRequiredList && (
        <>
          <ClassSection requirementName={requirementName} title="이수 과목" courses={takenCourses} />
          <ClassSection requirementName={requirementName} title="미이수 과목" courses={untakenCourses} />
        </>
      )}
    </>
  );
};
