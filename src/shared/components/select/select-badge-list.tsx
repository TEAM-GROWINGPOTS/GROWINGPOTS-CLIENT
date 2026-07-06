import { Badge } from '@shared/components/badge/badge';
import type { MouseEvent } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectedBadgeListProps {
  values: string[];
  options: SelectOption[];
  onRemove: (value: string) => void;
}

export const SelectedBadgeList = ({ values, options, onRemove }: SelectedBadgeListProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {values.map((v) => {
        const label = options.find((opt) => opt.value === v)?.label ?? v;
        return (
          <Badge
            key={v}
            variant="primary"
            color="lime02"
            size="xsmall"
            rightIconName="ic_delete"
            onRightIconClick={(e: MouseEvent<HTMLSpanElement>) => {
              e.stopPropagation();
              onRemove(v);
            }}
          >
            {label}
          </Badge>
        );
      })}
    </div>
  );
};
