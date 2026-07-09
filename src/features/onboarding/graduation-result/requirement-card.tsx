import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

export type RequirementVariant = 'default' | 'dark' | 'highlight';

interface RequirementVariantStyle {
  card: string;
  label: string;
  value: string;
  total?: string;
  checkIconName?: string;
}

const variantStyles: Record<RequirementVariant, RequirementVariantStyle> = {
  default: {
    card: 'bg-gray-100',
    label: 'text-gray-600',
    value: 'text-gray-700',
    total: 'text-gray-500',
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

export interface RequirementCardProps {
  label: string;
  value: string;
  total?: string;
  variant?: RequirementVariant;
  disabled?: boolean;
}

export const RequirementCard = ({
  label,
  value,
  total,
  variant = 'default',
  disabled = false,
}: RequirementCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div className={cn('flex h-45 items-center justify-between rounded-sm px-12', styles.card)}>
      <div className="flex items-center gap-4">
        <span className={cn('text-body-m-14', styles.label)}>{label}</span>
        {styles.checkIconName && <Icon name={styles.checkIconName} size={16} />}
      </div>
      <span>
        <span className={cn('text-body-sb-14', disabled ? 'text-gray-300' : styles.value)}>{value}</span>
        {total && <span className={cn('text-body-r-14', styles.total)}>{total}</span>}
      </span>
    </div>
  );
};
