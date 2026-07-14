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

export interface Division {
  id: number;
  name: string;
}

export interface StudentCourses {
  courses: StudentCourse[];
  availableDivisions: Division[];
}

export type TakenSemester = 'FIRST' | 'SUMMER' | 'SECOND' | 'WINTER';

export interface PutStudentCourseItem {
  studentCourseId: number;
  courseId: number | null;
  rawCourseName: string;
  departmentId: number | null;
  credit: number;
  appliedDivisionId: number | null;
  takenYear: number;
  takenSemester: TakenSemester;
}

export interface PutStudentCoursesRequest {
  courses: PutStudentCourseItem[];
}
