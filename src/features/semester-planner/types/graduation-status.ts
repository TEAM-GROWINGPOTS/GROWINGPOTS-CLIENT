export type GraduationUnit = 'CREDITS' | 'COURSES';
export type MajorType = 'MAIN' | 'DOUBLE';

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
  required: number | null;
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
  gpa: { current: number; min: number };
  enrollmentStatus: string;
}

export interface GraduationCert {
  certType: 'THESIS' | 'ENGLISH' | 'SW' | 'TOPIK' | 'GRADUATION_CERT';
  result: 'PASS' | 'FAIL' | 'EXEMPT' | 'NONE';
}

export interface GraduationData {
  summary: GraduationSummary;
  graduatable: boolean;
  sections: AllSections;
  certs: GraduationCert[];
}

export interface GraduationStatusState {
  data: GraduationData | null;
  setData: (data: GraduationData) => void;
}
