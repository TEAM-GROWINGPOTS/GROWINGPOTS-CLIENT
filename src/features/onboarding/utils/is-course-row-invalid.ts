import type { CourseInfo } from '@features/onboarding/types/course-info-table';
import { SEMESTER_OPTIONS } from '@shared/components/modal/add-course-modal';

export const isCourseRowInvalid = (course: CourseInfo) =>
  course.areaId === null || !SEMESTER_OPTIONS.some((option) => option.value === course.semester);
