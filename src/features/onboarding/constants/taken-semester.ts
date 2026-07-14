import type { TakenSemester } from '../types/course';

export const TAKEN_SEMESTER_OPTIONS: { code: TakenSemester; label: string }[] = [
  { code: 'FIRST', label: '1학기' },
  { code: 'SUMMER', label: '여름학기' },
  { code: 'SECOND', label: '2학기' },
  { code: 'WINTER', label: '겨울학기' },
];
