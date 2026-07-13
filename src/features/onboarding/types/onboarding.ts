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

export interface CreateStudentProfileRequest {
  schoolId: number;
  departmentId: number;
  admissionYear: number;
}

export interface StudentMajor {
  studentMajorId: number;
  departmentName: string;
}

export interface StudentProfile {
  studentProfileId: number;
  mainMajor: StudentMajor;
}
