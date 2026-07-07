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

export interface GraduationStatusState {
  data: GraduationStatusData | null;
  setData: (data: GraduationStatusData) => void;
}
