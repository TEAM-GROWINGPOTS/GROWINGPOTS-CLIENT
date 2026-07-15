export const COURSE_INFO_COLUMNS = [
  { key: 'courseName', label: '과목명', type: 'text' },
  { key: 'department', label: '개설학부', type: 'select' },
  { key: 'credit', label: '학점', type: 'text', suffix: '학점' },
  { key: 'semester', label: '이수학기', type: 'select' },
  { key: 'area', label: '영역', type: 'select' },
] as const;
