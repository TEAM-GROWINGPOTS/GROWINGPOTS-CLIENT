export type MajorTypes = 'ALL' | 'PRIMARY' | 'MULTI';

export interface RequirementCondition {
  code: string;
  majorType?: MajorTypes;
  name: string;
  current: number;
  required: number;
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
  divisionCode: string;
  divisionName: string;
  current: number;
  required: number;
  satisfied: boolean;
  hasRequiredList: boolean;
  courses: RequirementCourse[];
}

export interface RequirementAccordionItem extends RequirementCondition {
  detail?: RequirementDetail;
  notice?: string;
}
