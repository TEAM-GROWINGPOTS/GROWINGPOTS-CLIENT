import type { CourseSearchItemResponse } from '@shared/apis/types/course-search';

export const createCourse = (overrides: Partial<CourseSearchItemResponse> = {}): CourseSearchItemResponse => ({
  courseId: 1,
  courseCode: 'CS101',
  name: '자료구조',
  credit: 3,
  departmentName: '컴퓨터공학과',
  defaultDivisionName: '전공필수',
  area: null,
  recommendedYearLow: null,
  recommendedYearHigh: null,
  openedSemester: 'BOTH',
  isEnglish: false,
  isSw: false,
  alreadyCompleted: false,
  inPlanner: false,
  ...overrides,
});
