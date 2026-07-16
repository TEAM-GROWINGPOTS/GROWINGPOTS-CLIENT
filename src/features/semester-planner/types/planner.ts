import type { GraduationResponse } from '@shared/apis/types/graduation';

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

export interface PlannerSaveItem {
  courseId: number;
  coursePositionOrder: number;
}

export interface PlannerSaveVersion {
  versionNo: number;
  name: string;
  isSelected: boolean;
  versionOrder: number;
  items: PlannerSaveItem[];
}

export interface PlannerSaveTerm {
  yearLevel: number;
  semester: number;
  versions: PlannerSaveVersion[];
}

export interface PlannerSaveRequest {
  plannerSimulationId: number | null;
  terms: PlannerSaveTerm[];
}

export interface PlannerSaveResponse {
  graduation: GraduationResponse;
  hasDuplicateCourse: boolean;
}

export type SemesterCardStatus = 'completed' | 'current' | 'planned';

export interface SemesterCourse {
  id: string;
  courseId: number;
  departmentName: string;
  name: string;
  tags: string[];
  credit: number;
  /** 학기 트리(get-planner)에 배치된 과목만 내려온다. 아직 배치 전인 검색 라이브러리 과목엔 없다. */
  divisionCategory?: string;
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
  totalCredit: number;
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
