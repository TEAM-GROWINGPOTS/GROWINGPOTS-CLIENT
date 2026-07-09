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

export type RequirementSemester = 'FIRST' | 'SECOND' | 'SUMMER' | 'WINTER';

export type RequirementUnit = 'CREDITS' | 'COURSES';

export type MajorTypes = 'ALL' | 'MAIN' | 'DOUBLE' | 'GE' | 'OTHERS';

export interface RequirementData {
  summary: RequirementSummary;
  graduatable: boolean;
  conditions: RequirementCondition[] | null;
  graduationRequired: RequirementRequired | null;
  sections: RequirementSections;
  certs: RequirementCert[];
}

export interface RequirementSummary {
  totalCredits: { current: number; required: number };
  gpa: { current: number; min: number };
  enrollmentStatus: string;
}

export interface RequirementSections {
  primary: RequirementSection;
  multi: RequirementSection | null;
  ge: RequirementSection;
  others: RequirementSection;
}

export interface RequirementSection {
  majorName: string | null;
  conditions: RequirementCondition[];
  graduationRequired: RequirementRequired | null;
}

export interface RequirementCondition {
  code: RequirementCode;
  name: string;
  current: number;
  required: number | null;
  unit: RequirementUnit;
  satisfied: boolean;
  chartTarget: boolean;
}

export interface RequirementRequired {
  hasGraduationRequired: boolean;
  satisfied: boolean;
  totalCredit: number;
  unmetDescriptions: string[];
  items: RequirementProgress[];
}

export interface RequirementProgress {
  name: string;
  current: number;
  required: number | null;
  unit: RequirementUnit;
  satisfied: boolean;
}

export interface RequirementCert {
  certType: 'THESIS' | 'ENGLISH' | 'SW' | 'TOPIK' | 'GRADUATION_CERT';
  result: 'PASS' | 'FAIL' | 'EXEMPT' | 'NONE';
}

export interface RequirementDetail {
  divisionCode: RequirementCode;
  divisionName: string;
  majors: RequirementMajor[];
}

export interface RequirementMajor {
  majorType: MajorTypes;
  departmentName: string;
  current: number;
  required: number | null;
  satisfied: boolean;
  hasRequiredList: boolean;
  unmetDescriptions: string[];
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
