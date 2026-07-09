export type ConditionCode =
  | 'MAJOR_BASIC'
  | 'MAJOR_REQUIRED'
  | 'MAJOR_ELECTIVE'
  | 'REQUIRED_GE'
  | 'DISTRIBUTED_GE'
  | 'FREE_GE'
  | 'GENERAL_ELECTIVE'
  | 'ENGLISH_COURSE'
  | 'SW_CERT_COURSE';

export type ConditionUnit = 'CREDITS' | 'COURSES';

export interface Condition {
  code: ConditionCode;
  name: string;
  current: number;
  required: number | null;
  unit: ConditionUnit;
  satisfied: boolean;
  chartTarget: boolean;
}

export interface GraduationRequiredSummary {
  satisfied: boolean;
  totalCredit: number;
  unmetDescriptions: string[];
}

export interface GraduationSection {
  majorName: string | null;
  conditions: Condition[];
  graduationRequired: GraduationRequiredSummary | null;
}

export interface GraduationSections {
  primary: GraduationSection;
  multi: GraduationSection | null;
  ge: GraduationSection;
  others: GraduationSection;
}

export type CertType = 'THESIS' | 'ENGLISH' | 'SW' | 'TOPIK' | 'GRADUATION_CERT';
export type CertResult = 'PASS' | 'FAIL' | 'EXEMPT' | 'NONE';

export interface Cert {
  certType: CertType;
  result: CertResult;
}

export interface GraduationSummary {
  totalCredits: { current: number; required: number };
  gpa: { current: number; min: number | null };
  enrollmentStatus: string;
  graduatable: boolean;
}

export interface GraduationStatusData {
  summary: GraduationSummary;
  conditions: Condition[] | null;
  sections: GraduationSections | null;
  certs: Cert[];
}

export interface GraduationStatusResponse {
  success: boolean;
  code: string;
  message: string;
  data: GraduationStatusData;
}
