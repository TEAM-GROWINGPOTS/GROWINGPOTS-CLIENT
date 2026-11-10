import type { COURSE_INFO_COLUMNS } from '@features/onboarding/constants/course-info-columns';

export interface CourseInfo {
  id: string;
  courseId: number | null;
  courseName: string;
  department: string;
  departmentId: number | null;
  credit: string;
  takenYear: number | null;
  semester: string | null;
  area: string;
  areaId: number | null;
}

export interface TableCellSelectOption {
  value: string;
  label: string;
}

export interface Column {
  key: (typeof COURSE_INFO_COLUMNS)[number]['key'];
  label: string;
  type: 'text' | 'select';
  options?: TableCellSelectOption[];
  suffix?: string;
}
