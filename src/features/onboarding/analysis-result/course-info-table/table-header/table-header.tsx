import type { Column } from '@features/onboarding/types/course-info-table';
import { Checkbox } from '@shared/components/checkbox/checkbox';
import { cn } from '@shared/utils/cn';

interface TableHeaderProps {
  columns: readonly Column[];
  isEditing: boolean;
  isAllSelected: boolean;
  onSelectAllClick: () => void;
}

export const TableHeader = ({ columns, isEditing, isAllSelected, onSelectAllClick }: TableHeaderProps) => (
  <thead>
    <tr className="bg-gray-50">
      {isEditing && (
        <th scope="col" className="px-8 py-4 text-left">
          <Checkbox isChecked={isAllSelected} ariaLabel="전체 선택" className="mx-auto" onClick={onSelectAllClick} />
        </th>
      )}
      {columns.map(({ key, label }) => (
        <th
          key={key}
          scope="col"
          className={cn('text-body-sb-16 truncate py-4 text-left text-gray-600', isEditing ? 'px-16' : 'px-8')}
        >
          {label}
        </th>
      ))}
    </tr>
  </thead>
);
