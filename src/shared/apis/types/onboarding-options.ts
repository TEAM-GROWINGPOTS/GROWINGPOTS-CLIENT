export interface SchoolInfo {
  schoolId: number;
  name: string;
}

export interface DepartmentInfo {
  departmentId: number;
  schoolId: number;
  college: string;
  name: string;
}

export interface OnboardingOptionsResponse {
  schools: SchoolInfo[];
  departments: DepartmentInfo[];
  admissionYears: number[];
}
