import type { PlannerTerm, SemesterCourse } from '@features/semester-planner/types/planner';

interface DropRuleInput {
  course: SemesterCourse;
  targetTerm: PlannerTerm;
}

type DropRule = (input: DropRuleInput) => string | null;

const rejectDuplicateCourseInTerm: DropRule = ({ course, targetTerm }) => {
  const selectedFolder = targetTerm.folders.find(({ id }) => id === targetTerm.selectedFolderId);
  const isDuplicate = selectedFolder?.courses.some(
    ({ id, courseId }) => courseId === course.courseId && id !== course.id,
  );
  return isDuplicate ? '이미 해당 학기에 담긴 과목이에요.' : null;
};

const DROP_RULES: DropRule[] = [rejectDuplicateCourseInTerm];

export const getDropViolation = (input: DropRuleInput): string | null =>
  DROP_RULES.map((rule) => rule(input)).find((violation) => violation !== null) ?? null;
