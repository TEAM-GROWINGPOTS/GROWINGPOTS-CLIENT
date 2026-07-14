import type { PutStudentCourseItem, StudentCourse } from '../../types/course';
import type { Department } from '../../types/onboarding';
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

export const mapCourseInfoToPutStudentCourses = (
  rows: CourseInfo[],
  courses: StudentCourse[],
  departments: Department[],
): PutStudentCourseItem[] =>
  rows.map((row) => {
    const original = courses.find((course) => `${course.studentCourseId}` === row.id);
    const department = departments.find((dept) => dept.name === row.department);
    const isAreaUnchanged = row.area === (original?.appliedDivisionName ?? '해당없음');

    return {
      studentCourseId: Number(row.id),
      courseId: null,
      rawCourseName: row.courseName,
      departmentId: department?.departmentId ?? null,
      credit: Number(row.credit),
      appliedDivisionId: isAreaUnchanged ? (original?.appliedDivisionId ?? null) : null,
      takenYear: original?.takenYear ?? new Date().getFullYear(),
      takenSemester: row.semester,
    };
  });
