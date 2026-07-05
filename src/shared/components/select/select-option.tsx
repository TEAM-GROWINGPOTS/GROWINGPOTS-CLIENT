import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';

interface SelectOptionItemProps {
  id: string;
  label: string;
  isSelected: boolean;
  isFocused: boolean;
  isMulti: boolean;
  onClick: () => void;
}

export const SelectOptionItem = ({ id, label, isSelected, isFocused, isMulti, onClick }: SelectOptionItemProps) => {
  return (
    <li
      id={id}
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        'text-body-m-16 flex h-48 w-full shrink-0 cursor-pointer items-center rounded-lg bg-white px-12 text-gray-700 hover:bg-gray-50',
        isFocused && 'bg-gray-50',
        isSelected && 'bg-gray-50 text-blue-500',
      )}
    >
      {isMulti && (
        <Icon name={isSelected ? 'ic_checkbox_checked' : 'ic_checkbox_unchecked'} size={20} className="mr-8 shrink-0" />
      )}
      <span className="[scrollbar-width:none] overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
        {label}
      </span>
    </li>
  );
};
