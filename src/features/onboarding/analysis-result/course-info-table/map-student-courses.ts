import type { StudentCourse } from '../../types/course';
import type { CourseInfo } from './course-info-table';

export const mapStudentCoursesToCourseInfo = (courses: StudentCourse[]): CourseInfo[] =>
  courses.map((course) => ({
    id: `${course.studentCourseId}`,
    courseName: course.name,
    department: course.departmentName ?? '해당없음',
    credit: `${course.credit}`,
    semester: course.takenSemester,
    area: course.appliedDivisionName ?? '해당없음',
  }));
