import type { OpenedSemester } from '@features/semester-planner/types/planner';

export type DivisionCategory =
  | 'MAJOR_BASIC'
  | 'MAJOR_REQUIRED'
  | 'MAJOR_ELECTIVE'
  | 'REQUIRED_GE'
  | 'DISTRIBUTED_GE'
  | 'FREE_GE'
  | 'GENERAL_ELECTIVE'
  | 'CROSS_MAJOR';

export type OtherRequired = 'SW' | 'ENGLISH';

export interface CourseSearchParams {
  keyword?: string;
  collegeName?: string;
  departmentId?: string;
  divisionCategory?: DivisionCategory[];
  year?: string[];
  semester?: OpenedSemester[];
  credits?: string[];
  otherRequired?: OtherRequired[];
  campus?: string;
  page?: number;
  size?: number;
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

export interface CoursePageResponse {
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface CourseSearchResponse {
  courses: CourseSearchItemResponse[];
  page: CoursePageResponse;
}
