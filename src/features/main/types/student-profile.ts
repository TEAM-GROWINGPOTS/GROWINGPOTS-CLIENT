import type { MajorType } from '@shared/apis/types/graduation';

export interface StudentMajor {
  studentMajorId: number;
  majorType: MajorType;
  departmentName: string;
  trackName: string | null;
}

export interface StudentProfile {
  studentProfileId: number;
  name: string;
  schoolName: string;
  departmentName: string;
  studentNo: string;
  admissionYear: number;
  gradeLevel: number;
  semester: number;
  enrollmentStatus: string;
  majors: StudentMajor[];
}
