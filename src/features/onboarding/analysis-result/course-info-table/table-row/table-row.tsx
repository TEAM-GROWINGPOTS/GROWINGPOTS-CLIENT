import type { Column } from '@features/onboarding/types/course-info-table';
import Icon from '@shared/components/icon/icon';

import type { CourseInfo } from '../course-info-table';
import { TableCellEdit } from '../table-cell/table-cell-edit';
import { TableCellSelect } from '../table-cell/table-cell-select';

interface TableRowProps {
  course: CourseInfo;
  columns: readonly Column[];
  isEditing: boolean;
  isSelected: boolean;
  openCellKey: string | null;
  onOpenCellKeyChange: (key: string | null) => void;
  onRowSelectClick: (id: string) => () => void;
  onCellChange: (id: string, key: Column['key']) => (value: string) => void;
  onDepartmentChange: (id: string) => (value: string) => void;
  onAreaChange: (id: string) => (value: string) => void;
}

export const TableRow = ({
  course,
  columns,
  isEditing,
  isSelected,
  openCellKey,
  onOpenCellKeyChange,
  onRowSelectClick,
  onCellChange,
  onDepartmentChange,
  onAreaChange,
}: TableRowProps) => (
  <tr>
    {isEditing && (
      <td className="px-8 py-4 align-middle">
        <button
          type="button"
          onClick={onRowSelectClick(course.id)}
          aria-label={`${course.courseName} 선택`}
          className="mx-auto flex size-20 items-center justify-center"
        >
          <Icon name={isSelected ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'} size={20} />
        </button>
      </td>
    )}
    {columns.map((column) => (
      <td key={column.key} className="px-8 py-4 align-middle">
        {isEditing && column.type === 'select' ? (
          <TableCellSelect
            options={column.options ?? []}
            value={course[column.key]}
            onChange={
              column.key === 'department'
                ? onDepartmentChange(course.id)
                : column.key === 'area'
                  ? onAreaChange(course.id)
                  : onCellChange(course.id, column.key)
            }
            isOpen={openCellKey === `${course.id}:${column.key}`}
            onOpenChange={(open) => onOpenCellKeyChange(open ? `${course.id}:${column.key}` : null)}
          />
        ) : (
          <TableCellEdit
            mode={isEditing ? 'edit' : 'view'}
            value={course[column.key]}
            onChange={onCellChange(course.id, column.key)}
            suffix={column.suffix}
          />
        )}
      </td>
    ))}
  </tr>
);
