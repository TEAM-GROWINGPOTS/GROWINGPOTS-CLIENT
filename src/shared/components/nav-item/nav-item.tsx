import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import type { ComponentPropsWithoutRef } from 'react';

export type NavItemStatus = 'default' | 'selected';

const navItemBaseClass = 'flex cursor-pointer items-center gap-12 rounded-lg transition-colors p-12';

const navItemStatusClass: Record<NavItemStatus, string> = {
  default: 'text-gray-100 hover:bg-gray-700 hover:text-white',
  selected: 'bg-gray-800 text-lime-400',
};

interface NavItemProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string;
  icon: string;
  status?: NavItemStatus;
  isCollapsed?: boolean;
}

export const NavItem = ({
  label,
  icon,
  status = 'default',
  isCollapsed = false,
  className,
  ...props
}: NavItemProps) => {
  return (
    <button
      type="button"
      aria-current={status === 'selected' ? 'page' : undefined}
      aria-label={isCollapsed ? label : undefined}
      className={cn(
        navItemBaseClass,
        navItemStatusClass[status],
        isCollapsed ? 'size-48 justify-center' : 'h-48 w-full',
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={24} className="shrink-0" />
      {!isCollapsed && <span className="text-body-m-16 truncate">{label}</span>}
    </button>
  );
};
