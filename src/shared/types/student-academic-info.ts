export interface Major {
  // TODO: 실제 전공 응답 필드가 확정되면 채운다.
  [key: string]: unknown;
}

export interface StudentAcademicInfo {
  studentProfileId: number;
  name: string;
  schoolName: string;
  departmentName: string;
  studentNo: string;
  admissionYear: number;
  gradeLevel: number;
  semester: number;
  enrollmentStatus: string;
  majors: Major[];
}
