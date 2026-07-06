import { Badge } from '@shared/components/badge/badge';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectedBadgeListProps {
  values: string[];
  options: SelectOption[];
  variant?: 'primary' | 'secondary' | 'outline' | 'disabled' | 'negative';
  size?: 'xsmall';
}

export const SelectedBadgeList = ({
  values,
  options,
  variant = 'primary',
  size = 'xsmall',
}: SelectedBadgeListProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {values.map((v) => {
        const label = options.find((opt) => opt.value === v)?.label ?? v;
        return (
          <Badge key={v} variant={variant} size={size}>
            {label}
          </Badge>
        );
      })}
    </div>
  );
};
