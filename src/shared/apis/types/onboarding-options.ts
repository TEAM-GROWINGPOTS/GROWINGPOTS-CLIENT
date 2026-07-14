export interface SchoolResponse {
  schoolId: number;
  name: string;
}

export interface DepartmentResponse {
  departmentId: number;
  schoolId: number;
  college: string;
  name: string;
}

export interface OnboardingOptionsResponse {
  schools: SchoolResponse[];
  departments: DepartmentResponse[];
  admissionYears: number[];
}
