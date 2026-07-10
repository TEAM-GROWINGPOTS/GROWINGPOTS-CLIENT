export type CompletedTermStatus = 'COMPLETED' | 'IN_PROGRESS';

export type MajorDivisionCategory = 'MAJOR_REQUIRED' | 'MAJOR_ELECTIVE' | 'MAJOR_BASIC';

export interface CompletedCourse {
  studentCourseId: number;
  courseId: number;
  courseName: string;
  departmentName: string;
  divisionCategory: string | null;
  divisionName: string | null;
  recommendedYearLow: number;
  recommendedYearHigh: number;
  openedSemester: string;
  credit: number;
}

export interface CompletedTerm {
  yearLevel: number;
  semester: number;
  /** 합성값이라 항상 음수 — 다른 API에 넘기지 않는다 */
  plannerTermVersionId: number;
  name: string;
  status: CompletedTermStatus;
  totalCredit: number;
  locked: true;
  courses: CompletedCourse[];
}

export interface PlannedCourse {
  plannerVersionItemId: number;
  courseId: number;
  courseName: string;
  departmentName: string;
  divisionCategory: string | null;
  divisionName: string | null;
  recommendedYearLow: number;
  recommendedYearHigh: number;
  openedSemester: string;
  credit: number;
  positionOrder: number;
}

export interface PlannerTermVersion {
  /** 실제 PK — 항상 양수 */
  plannerTermVersionId: number;
  versionNo: number;
  name: string;
  isSelected: boolean;
  totalCredit: number;
  courses: PlannedCourse[];
}

export interface PlannedTerm {
  plannerTermId: number;
  yearLevel: number;
  semester: number;
  termOrder: number;
  locked: false;
  versions: PlannerTermVersion[];
}

export interface PlannerApiData {
  completedTerms: CompletedTerm[];
  plannedTerms: PlannedTerm[];
}
