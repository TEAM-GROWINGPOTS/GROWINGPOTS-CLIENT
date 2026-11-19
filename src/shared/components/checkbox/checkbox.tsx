import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

interface CheckboxProps {
  isChecked: boolean;
  ariaLabel: string;
  onClick: () => void;
  className?: string;
}

export const Checkbox = ({ isChecked, ariaLabel, onClick, className }: CheckboxProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={isChecked}
    aria-label={ariaLabel}
    onClick={onClick}
    className={cn('flex size-20 items-center justify-center', className)}
  >
    <Icon name={isChecked ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'} size={20} />
  </button>
);
