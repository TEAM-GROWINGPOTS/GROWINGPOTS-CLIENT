import type { TableCellSelectOption } from '@features/onboarding/analysis-result/course-info-table/table-cell/table-cell-select';
import { COURSE_INFO_COLUMNS } from '@features/onboarding/constants/course-info-columns';
import type { Column } from '@features/onboarding/types/course-info-table';

export const getCourseInfoColumns = (
  departmentOptions: TableCellSelectOption[],
  areaOptions: TableCellSelectOption[],
  semesterOptions: TableCellSelectOption[],
): readonly Column[] =>
  COURSE_INFO_COLUMNS.map((column) => {
    if (column.key === 'department') return { ...column, options: departmentOptions };
    if (column.key === 'area') return { ...column, options: areaOptions };
    if (column.key === 'semester') return { ...column, options: semesterOptions };
    return column;
  });
