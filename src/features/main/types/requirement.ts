import type { MajorType } from '@shared/apis/types/graduation';

export type RequirementCode =
  | 'GRADUATION_REQUIRED'
  | 'MAJOR_BASIC'
  | 'MAJOR_REQUIRED'
  | 'MAJOR_ELECTIVE'
  | 'REQUIRED_GE'
  | 'DISTRIBUTED_GE'
  | 'FREE_GE'
  | 'GENERAL_ELECTIVE'
  | 'ENGLISH_COURSE'
  | 'SW_CERT_COURSE';

export type RequirementSemester = 'FIRST' | 'SECOND';

export type RequirementSource = 'COMPLETED' | 'PLANNED';

export interface RequirementDetail {
  divisionCode: RequirementCode;
  divisionName: string;
  majors: RequirementMajor[];
}

export interface RequirementMajor {
  majorType: MajorType | null;
  departmentName: string;
  current: number;
  required: number | null;
  satisfied: boolean;
  hasRequiredList: boolean;
  unmetDescriptions: string[];
  distAreaDescriptions: string[];
  courses: RequirementCourse[];
}

export interface RequirementCourse {
  studentCourseId: number | null;
  name: string;
  departmentName: string;
  credit: number;
  semester: string;
  taken: boolean;
  isEnglish: boolean;
  isSw: boolean;
}
