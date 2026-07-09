import type { RequirementCourse } from '@features/main/types/requirement';
import { isTakenCourse, RequirementClassList } from '@features/main/ui/requirement-accordion/requirement-class-list';

interface RequirementDetailProps {
  requirementName: string;
  notice?: string;
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
      <RequirementClassList requirementName={requirementName} courses={courses} className="mt-4" />
    </section>
  );
};

export const RequirementDetail = ({
  requirementName,
  notice,
  courses,
  hasRequiredList = false,
}: RequirementDetailProps) => {
  if (!notice && (!courses || courses.length === 0)) return null;

  const takenCourses = courses?.filter(isTakenCourse) ?? [];
  const untakenCourses = courses?.filter((course) => !isTakenCourse(course)) ?? [];

  return (
    <>
      {notice && <p className="text-caption-r-12 text-darkred-10 mt-4">*{notice}</p>}
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
