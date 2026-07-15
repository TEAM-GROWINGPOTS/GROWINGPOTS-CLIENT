export const MAX_FOLDERS_PER_TERM = 5;

export const SEMESTER_OPTIONS = [
  { value: '1', label: '1학기' },
  { value: '3', label: '여름학기' },
  { value: '2', label: '2학기' },
  { value: '4', label: '겨울학기' },
] as const;

const SEMESTER_LABEL_BY_NUMBER: Record<number, string> = {
  1: '1학기',
  2: '2학기',
  3: '여름학기',
  4: '겨울학기',
};

export const getSemesterLabel = (semester: number): string => SEMESTER_LABEL_BY_NUMBER[semester] ?? `${semester}학기`;

export const getSemesterLabelByCode = (code: string): string | undefined =>
  SEMESTER_LABEL_BY_NUMBER[Number.parseInt(code, 10)];
