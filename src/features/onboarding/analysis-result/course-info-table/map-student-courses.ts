import { TAKEN_SEMESTER_OPTIONS } from '../../constants/taken-semester';
import type { PutStudentCourseItem, StudentCourse } from '../../types/course';
import type { CourseInfo } from './course-info-table';

export const mapStudentCoursesToCourseInfo = (courses: StudentCourse[]): CourseInfo[] =>
  courses.map((course) => ({
    id: `${course.studentCourseId}`,
    courseId: null,
    courseName: course.name,
    department: course.departmentName ?? '해당없음',
    departmentId: course.departmentId,
    credit: `${course.credit}`,
    semester: course.takenSemester,
    area: course.appliedDivisionName ?? '해당없음',
    areaId: course.appliedDivisionId,
  }));

export const mapCourseInfoToPutStudentCourses = (
  rows: CourseInfo[],
  originalCourses: StudentCourse[],
): PutStudentCourseItem[] =>
  rows.map((row) => {
    const original = originalCourses.find((course) => `${course.studentCourseId}` === row.id);
    const semesterOption = TAKEN_SEMESTER_OPTIONS.find(({ label }) => label === row.semester);

    return {
      studentCourseId: original?.studentCourseId ?? null,
      courseId: row.courseId,
      rawCourseName: row.courseName,
      departmentId: row.departmentId,
      credit: Number(row.credit),
      appliedDivisionId: row.areaId,
      takenYear: original?.takenYear ?? new Date().getFullYear(),
      takenSemester: semesterOption?.code ?? 'FIRST',
    };
  });
