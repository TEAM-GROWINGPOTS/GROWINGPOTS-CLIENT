import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import type { ComponentPropsWithoutRef } from 'react';

export type DropDownStatus = 'default' | 'selected';

const dropDownBaseClass =
  'text-body-m-14 flex h-32 cursor-pointer items-center rounded-sm transition-colors pl-12 py-6 pr-10 gap-4';

const dropDownStatusClass: Record<DropDownStatus, string> = {
  default: 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50',
  selected: ' bg-gray-700 text-white',
};

interface DropDownProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string;
  status?: DropDownStatus;
}

export const DropDown = ({ label, status = 'default', className, ...props }: DropDownProps) => {
  return (
    <button type="button" className={cn(dropDownBaseClass, dropDownStatusClass[status], className)} {...props}>
      <span className="truncate">{label}</span>
      <Icon name="ic_chevron_down" size={16} className="shrink-0" />
    </button>
  );
};
