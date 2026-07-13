export interface School {
  schoolId: number;
  name: string;
}

export interface Department {
  departmentId: number;
  schoolId: number;
  college: string;
  name: string;
}

export interface OnboardingOptions {
  schools: School[];
  departments: Department[];
  admissionYears: number[];
}
