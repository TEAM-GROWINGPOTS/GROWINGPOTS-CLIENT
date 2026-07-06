import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

export type GraduationRequirementVariant = 'default' | 'dark' | 'highlight';

interface GraduationRequirementVariantStyle {
  card: string;
  label: string;
  value: string;
  total?: string;
  checkIconName: string;
}

const variantStyles: Record<GraduationRequirementVariant, GraduationRequirementVariantStyle> = {
  default: {
    card: 'bg-gray-100',
    label: 'text-gray-600',
    value: 'text-gray-700',
    total: 'text-gray-500',
    checkIconName: 'ic_check_circle',
  },
  dark: {
    card: 'bg-gray-700',
    label: 'text-gray-50',
    value: 'text-gray-50',
    total: 'text-gray-400',
    checkIconName: 'ic_check_circle_lime',
  },
  highlight: {
    card: 'bg-lime-500',
    label: 'text-gray-700',
    value: 'text-gray-700',
    checkIconName: 'ic_check_circle_black',
  },
};

interface GraduationRequirementCardProps {
  label: string;
  value: string;
  total?: string;
  checked?: boolean;
  variant?: GraduationRequirementVariant;
  valueClassName?: string;
}

export const GraduationRequirementCard = ({
  label,
  value,
  total,
  checked = false,
  variant = 'default',
  valueClassName,
}: GraduationRequirementCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div className={cn('flex h-45 items-center justify-between rounded-sm px-12', styles.card)}>
      <div className="flex items-center gap-4">
        <span className={cn('text-body-m-14', styles.label)}>{label}</span>
        {checked && <Icon name={styles.checkIconName} size={16} />}
      </div>
      <span>
        <span className={cn('text-body-sb-14', styles.value, valueClassName)}>{value}</span>
        {total && <span className={cn('text-body-r-14', styles.total)}>{total}</span>}
      </span>
    </div>
  );
};
