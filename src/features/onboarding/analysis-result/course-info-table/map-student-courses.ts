import { TAKEN_SEMESTER_OPTIONS } from '../../constants/taken-semester';
import type { PutStudentCourseItem, StudentCourse } from '../../types/course';
import type { Department } from '../../types/onboarding';
import type { CourseInfo } from './course-info-table';

export const mapStudentCoursesToCourseInfo = (courses: StudentCourse[]): CourseInfo[] =>
  courses.map((course) => {
    const semesterOption = TAKEN_SEMESTER_OPTIONS.find(({ code }) => code === course.takenSemester);

    return {
      id: `${course.studentCourseId}`,
      courseName: course.name,
      department: course.departmentName ?? '해당없음',
      credit: `${course.credit}`,
      semester: semesterOption?.label ?? course.takenSemester,
      semesterCode: semesterOption?.code ?? 'FIRST',
      area: course.appliedDivisionName ?? '해당없음',
      areaId: course.appliedDivisionId,
    };
  });

export const mapCourseInfoToPutStudentCourses = (
  rows: CourseInfo[],
  courses: StudentCourse[],
  departments: Department[],
): PutStudentCourseItem[] =>
  rows.map((row) => {
    const original = courses.find((course) => `${course.studentCourseId}` === row.id);
    const department = departments.find((dept) => dept.name === row.department);

    return {
      studentCourseId: Number(row.id),
      courseId: null,
      rawCourseName: row.courseName,
      departmentId: department?.departmentId ?? null,
      credit: Number(row.credit),
      appliedDivisionId: row.areaId,
      takenYear: original?.takenYear ?? new Date().getFullYear(),
      takenSemester: row.semesterCode,
    };
  });
