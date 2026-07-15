import type { GraduationCondition, MajorType } from '@shared/apis/types/graduation';

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

export interface RequirementAccordionItem extends GraduationCondition {
  majorName?: string | null;
  scrollKey?: string;
  detail?: {
    hasRequiredList: boolean;
    unmetDescriptions: string[];
    distAreaDescriptions: string[];
    courses: RequirementCourse[];
  };
  notice?: string;
}

export interface RequirementDetail {
  conditionCode: RequirementCode;
  conditionName: string;
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

export interface RequirementCourseArea {
  code: string;
  name: string;
}

export interface RequirementCourse {
  divisionCode: RequirementCode;
  divisionName: string;
  studentCourseId: number | null;
  name: string;
  departmentName: string;
  credit: number;
  semester: string | null;
  taken: boolean;
  isEnglish: boolean;
  isSw: boolean;
  area?: RequirementCourseArea | null;
}
