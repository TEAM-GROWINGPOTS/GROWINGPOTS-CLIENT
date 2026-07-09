export interface GraduationCondition {
  code: string;
  name: string;
  current: number;
  required: number | null;
  satisfied: boolean;
}

export interface GraduationSummary {
  totalCredits: { current: number; required: number };
  gpa: { current: number; min: number };
  enrollmentStatus: string;
}

export interface GraduationStatusData {
  summary: GraduationSummary;
  conditions: GraduationCondition[];
  overallMet: boolean;
}

export interface DoubleMajorData {
  conditions: GraduationCondition[];
}

export interface GraduationStatusState {
  mainMajor: GraduationStatusData | null;
  doubleMajor: DoubleMajorData | null;
  setMainMajor: (data: GraduationStatusData) => void;
  setDoubleMajor: (data: DoubleMajorData) => void;
}
