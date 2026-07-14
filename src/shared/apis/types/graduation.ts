export type GraduationUnit = 'CREDITS' | 'COURSES';
export type MajorType = 'MAIN' | 'DOUBLE';
export type CertType = 'THESIS' | 'GRADUATION_CERT' | 'TOPIK' | 'GPA';
export type CertResult = 'PASS' | 'FAIL' | 'EXEMPT' | 'NONE';
export type GraduationMajorFilter = 'ALL' | 'GE' | 'OTHERS';
export type GraduationSource = 'COMPLETED' | 'PLANNED';

export interface GraduationQueryParams {
  majorType?: GraduationMajorFilter;
  studentMajorId?: number;
  source?: GraduationSource;
}

export interface GraduationCondition {
  code: string;
  name: string;
  current: number;
  required: number | null;
  unit: GraduationUnit;
  satisfied: boolean;
  chartTarget: boolean;
}

export interface RequirementProgress {
  name: string;
  current: number;
  required: number;
  unit: GraduationUnit;
  satisfied: boolean;
}

export interface GraduationRequired {
  hasGraduationRequired: boolean;
  satisfied: boolean;
  totalCredit: number;
  unmetDescriptions: string[];
  items: RequirementProgress[] | null;
}

export interface MajorSection {
  majorName: string;
  majorType: MajorType;
  conditions: GraduationCondition[];
  graduationRequired: GraduationRequired | null;
}

export interface GeSection {
  majorName: null;
  majorType: null;
  conditions: GraduationCondition[];
  graduationRequired: null;
}

export interface AllSections {
  majors: MajorSection[];
  ge: GeSection;
  others: GeSection;
}

export interface GraduationSummary {
  totalCredits: { current: number; required: number };
  gpa: { current: number; min: number | null };
  enrollmentStatus: string;
}

export interface GraduationCert {
  certType: CertType;
  result: CertResult;
}

export interface GraduationResponse {
  summary: GraduationSummary;
  graduatable: boolean;
  conditions: GraduationCondition[] | null;
  graduationRequired: GraduationRequired | null;
  sections: AllSections | null;
  certs: GraduationCert[];
}
