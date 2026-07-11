import type {
  SemesterCardStatus,
  SemesterCourse,
  SemesterFolder,
} from '@features/semester-planner/card-view/semester-card/semester-card';

export type OpenedSemester = 'FIRST' | 'SECOND' | 'BOTH';

export interface PlannedCourseResponse {
  plannerVersionItemId: number;
  courseId: number;
  courseName: string;
  departmentName: string;
  divisionCategory: string;
  divisionName: string;
  recommendedYearLow: number | null;
  recommendedYearHigh: number | null;
  openedSemester: OpenedSemester;
  credit: number;
  coursePositionOrder: number;
}

export interface CompletedCourseResponse {
  studentCourseId: number;
  courseId: number;
  courseName: string;
  departmentName: string;
  divisionCategory: string;
  divisionName: string;
  recommendedYearLow: number | null;
  recommendedYearHigh: number | null;
  openedSemester: OpenedSemester;
  credit: number;
}

export interface PlannerVersionResponse {
  plannerTermVersionId: number;
  versionNo: number;
  name: string;
  versionOrder: number;
  totalCredit: number;
  isSelected: boolean;
  courses: PlannedCourseResponse[];
}

export interface PlannedTermResponse {
  plannerTermId: number;
  yearLevel: number;
  semester: number;
  versions: PlannerVersionResponse[];
}

export interface CompletedTermResponse {
  yearLevel: number;
  semester: number;
  plannerTermVersionId: number;
  name: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
  totalCredit: number;
  courses: CompletedCourseResponse[];
}

export interface PlannerResponse {
  completedTerms: CompletedTermResponse[];
  plannedTerms: PlannedTermResponse[];
}

export interface CourseSearchItemResponse {
  courseId: number;
  courseCode: string;
  name: string;
  credit: number;
  departmentName: string;
  defaultDivisionName: string;
  recommendedYearLow: number | null;
  recommendedYearHigh: number | null;
  openedSemester: OpenedSemester;
  isEnglish: boolean;
  isSw: boolean;
  alreadyCompleted: boolean;
  inPlanner: boolean;
}

export interface PlannerFolder extends SemesterFolder {
  courses: SemesterCourse[];
}

export interface PlannerTerm {
  id: string;
  yearLevel: number;
  semester: number;
  semesterLabel: string;
  status: SemesterCardStatus;
  selectedFolderId?: string;
  folders: PlannerFolder[];
}

export type { SemesterCardStatus, SemesterCourse, SemesterFolder };
