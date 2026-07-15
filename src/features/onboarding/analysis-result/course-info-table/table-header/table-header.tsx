import type { Column } from '@features/onboarding/types/course-info-table';
import Icon from '@shared/components/icon/icon';
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
          <button
            type="button"
            onClick={onSelectAllClick}
            aria-label="전체 선택"
            className="mx-auto flex size-20 items-center justify-center"
          >
            <Icon name={isAllSelected ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'} size={20} />
          </button>
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
