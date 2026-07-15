import type { TableCellSelectOption } from '@features/onboarding/analysis-result/course-info-table/table-cell/table-cell-select';
import type { COURSE_INFO_COLUMNS } from '@features/onboarding/constants/course-info-columns';

export interface Column {
  key: (typeof COURSE_INFO_COLUMNS)[number]['key'];
  label: string;
  type: 'text' | 'select';
  options?: TableCellSelectOption[];
  suffix?: string;
}
