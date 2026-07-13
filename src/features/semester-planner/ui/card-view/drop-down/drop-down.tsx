import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import type { ComponentPropsWithoutRef } from 'react';

export type DropDownStatusTypes = 'default' | 'selected';

const dropDownBaseClass =
  'text-body-m-14 flex h-32 cursor-pointer items-center rounded-sm transition-colors pl-12 pr-10 gap-4';

const dropDownStatusClass: Record<DropDownStatusTypes, string> = {
  default: 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50',
  selected: 'border border-transparent bg-gray-700 text-white',
};

interface DropDownProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string;
  status?: DropDownStatusTypes;
}

export const DropDown = ({ label, status = 'default', className, ...props }: DropDownProps) => {
  return (
    <button type="button" className={cn(dropDownBaseClass, dropDownStatusClass[status], className)} {...props}>
      <span className="truncate">{label}</span>
      <Icon
        name="ic_chevron_down"
        size={16}
        className={cn('shrink-0', status === 'default' ? 'text-gray-500' : 'text-gray-50')}
      />
    </button>
  );
};
