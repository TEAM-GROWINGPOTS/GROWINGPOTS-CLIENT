export interface StudentCourse {
  studentCourseId: number;
  courseCode: string;
  name: string;
  departmentName: string | null;
  credit: number;
  appliedDivisionName: string | null;
  takenYear: number;
  takenSemester: string;
}

export interface StudentCourses {
  courses: StudentCourse[];
}
