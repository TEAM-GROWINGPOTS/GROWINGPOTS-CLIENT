export const MAX_FOLDERS_PER_TERM = 5;

export const SEMESTER_OPTIONS = [
  { value: '1', label: '1학기' },
  { value: '3', label: '여름학기' },
  { value: '2', label: '2학기' },
  { value: '4', label: '겨울학기' },
] as const;

const SEMESTER_LABEL_BY_NUMBER: Record<number, string> = {
  1: '1학기',
  2: '2학기',
  3: '여름학기',
  4: '겨울학기',
};

const SEMESTER_SORT_ORDER: Record<number, number> = {
  1: 0,
  3: 1,
  2: 2,
  4: 3,
};

export interface PlannerTermLike {
  yearLevel: number;
  semester: number;
}

export const comparePlannerTerms = (a: PlannerTermLike, b: PlannerTermLike): number =>
  a.yearLevel - b.yearLevel ||
  (SEMESTER_SORT_ORDER[a.semester] ?? a.semester) - (SEMESTER_SORT_ORDER[b.semester] ?? b.semester);

export const isPastPlannerTerm = (candidate: PlannerTermLike, anchor: PlannerTermLike): boolean =>
  comparePlannerTerms(candidate, anchor) < 0;

export const getLatestCompletedOrCurrentTerm = <
  T extends PlannerTermLike & { status: 'completed' | 'current' | 'planned' },
>(
  terms: T[],
): T | null => {
  const relevant = terms.filter(({ status }) => status === 'completed' || status === 'current');
  if (relevant.length === 0) return null;

  return relevant.reduce((latest, term) => (comparePlannerTerms(term, latest) > 0 ? term : latest));
};

export const getSemesterLabel = (semester: number): string => SEMESTER_LABEL_BY_NUMBER[semester] ?? `${semester}학기`;

export const getSemesterLabelByCode = (code: string): string | undefined =>
  SEMESTER_LABEL_BY_NUMBER[Number.parseInt(code, 10)];

const MAJOR_DIVISION_CATEGORY_SET = new Set(['MAJOR_REQUIRED', 'MAJOR_ELECTIVE', 'MAJOR_BASIC']);
const GENERAL_EDUCATION_DIVISION_CATEGORY_SET = new Set(['GENERAL', 'REQUIRED_GE', 'DISTRIBUTED_GE', 'FREE_GE']);

export type DivisionCategoryBadgeColor = 'lime02' | 'purple' | 'blue';

export const getDivisionCategoryBadgeColor = (divisionCategory: string): DivisionCategoryBadgeColor => {
  if (MAJOR_DIVISION_CATEGORY_SET.has(divisionCategory)) return 'lime02';
  if (GENERAL_EDUCATION_DIVISION_CATEGORY_SET.has(divisionCategory)) return 'purple';
  return 'blue';
};
