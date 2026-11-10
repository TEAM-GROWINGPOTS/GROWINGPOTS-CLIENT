export interface StudentProfileCreateRequest {
  schoolId: number;
  departmentId: number;
  admissionYear: number;
}

export interface MainMajorInfo {
  studentMajorId: number;
  departmentName: string;
}

export interface StudentProfileCreateResponse {
  studentProfileId: number;
  mainMajor: MainMajorInfo;
}
