import type { RequirementCourse } from '@features/main/types/requirement';

import { isTakenCourse, RequirementClassList } from './requirement-class-list';

interface RequirementDetailProps {
  requirementName: string;
  notice?: string;
  unmetDescriptions?: string[];
  distAreaDescriptions?: string[];
  courses?: RequirementCourse[];
  hasRequiredList?: boolean;
  admissionYear?: number;
}

interface ClassSectionProps {
  requirementName: string;
  title: string;
  courses: RequirementCourse[];
  admissionYear?: number;
}

const ClassSection = ({ requirementName, title, courses, admissionYear }: ClassSectionProps) => {
  if (courses.length === 0) return null;

  return (
    <section className="mt-12">
      <h4 className="text-body-sb-14 text-gray-600">{title}</h4>
      <RequirementClassList
        requirementName={requirementName}
        courses={courses}
        className="mt-4"
        showTakenState
        admissionYear={admissionYear}
      />
    </section>
  );
};

export const RequirementDetail = ({
  requirementName,
  notice,
  unmetDescriptions = [],
  distAreaDescriptions = [],
  courses,
  hasRequiredList = false,
  admissionYear,
}: RequirementDetailProps) => {
  const unmetDescription = unmetDescriptions.join(', ');
  const distAreaDescription = distAreaDescriptions.join(', ');

  if (!notice && !unmetDescription && !distAreaDescription && (!courses || courses.length === 0)) return null;

  const takenCourses = courses?.filter(isTakenCourse) ?? [];
  const untakenCourses = courses?.filter((course) => !isTakenCourse(course)) ?? [];

  return (
    <>
      {notice && <p className="text-caption-r-12 text-dark-red-10 mt-12">*{notice}</p>}
      {unmetDescription && <p className="text-caption-r-12 text-dark-red-10 mt-12">*{unmetDescription}</p>}
      {distAreaDescription && <p className="text-caption-r-12 text-dark-red-10 mt-12">*{distAreaDescription}</p>}
      {courses && courses.length > 0 && !hasRequiredList && (
        <RequirementClassList
          requirementName={requirementName}
          courses={courses}
          className="mt-12"
          admissionYear={admissionYear}
        />
      )}
      {hasRequiredList && (
        <>
          <ClassSection
            requirementName={requirementName}
            title="이수 과목"
            courses={takenCourses}
            admissionYear={admissionYear}
          />
          <ClassSection
            requirementName={requirementName}
            title="미이수 과목"
            courses={untakenCourses}
            admissionYear={admissionYear}
          />
        </>
      )}
    </>
  );
};
