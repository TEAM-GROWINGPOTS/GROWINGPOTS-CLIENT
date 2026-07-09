export type MajorTypes = 'ALL' | 'PRIMARY' | 'MULTI' | 'GE' | 'OTHERS';

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

export interface RequirementCondition {
  code: RequirementCode;
  majorType?: MajorTypes;
  name: string;
  current: number;
  required: number | null;
  satisfied: boolean;
}

export interface RequirementCourse {
  studentCourseId: number | null;
  name: string;
  departmentName: string;
  credit: number;
  taken: boolean;
  takenSemester?: string;
  openedSemester?: string;
}

export interface RequirementDetail {
  divisionCode: RequirementCode;
  divisionName: string;
  current: number;
  required: number | null;
  satisfied: boolean;
  hasRequiredList: boolean;
  courses: RequirementCourse[];
}

export interface RequirementAccordionItem extends RequirementCondition {
  detail?: RequirementDetail;
  notice?: string;
}
