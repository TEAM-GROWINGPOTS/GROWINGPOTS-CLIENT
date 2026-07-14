export interface StudentCourse {
  studentCourseId: number;
  courseCode: string;
  name: string;
  departmentName: string | null;
  departmentId: number | null;
  credit: number;
  appliedDivisionName: string | null;
  appliedDivisionId: number | null;
  takenYear: number;
  takenSemester: string;
}

export interface StudentCourses {
  courses: StudentCourse[];
}

export interface PutStudentCourseItem {
  studentCourseId: number;
  courseId: number | null;
  rawCourseName: string;
  departmentId: number | null;
  credit: number;
  appliedDivisionId: number | null;
  takenYear: number;
  takenSemester: string;
}

export interface PutStudentCoursesRequest {
  courses: PutStudentCourseItem[];
}
