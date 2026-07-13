export type OpenedSemester = 'FIRST' | 'SECOND' | 'BOTH';

export interface PlannerCourseBaseResponse {
  courseId: number;
  name: string;
  departmentName: string;
  divisionCategory: string;
  divisionName: string;
  recommendedYearLow: number | null;
  recommendedYearHigh: number | null;
  openedSemester: OpenedSemester;
  credit: number;
  isEnglish: boolean;
  isSw: boolean;
}

export interface PlannedCourseResponse extends PlannerCourseBaseResponse {
  plannerVersionItemId: number;
  coursePositionOrder: number;
}

export interface CompletedCourseResponse extends PlannerCourseBaseResponse {
  studentCourseId: number;
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

export type SemesterCardStatus = 'completed' | 'current' | 'planned';

export interface SemesterCourse {
  id: string;
  department: string;
  name: string;
  tags: string[];
  credit: number;
  divisionName: string;
  isEnglish?: boolean;
  isSw?: boolean;
}

export interface SemesterFolder {
  id: string;
  name: string;
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
