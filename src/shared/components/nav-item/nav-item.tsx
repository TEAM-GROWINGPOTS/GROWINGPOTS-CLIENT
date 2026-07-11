import Icon from '@shared/components/icon/icon';
import { cn } from '@shared/utils/cn';
import type { ComponentPropsWithoutRef } from 'react';

export type NavItemStatusTypes = 'default' | 'selected';

const navItemBaseClass =
  'group flex h-48 w-full cursor-pointer items-center justify-start rounded-lg p-12 transition-[width,gap,padding,color,background-color] duration-300 ease-in-out';

const navItemStatusClass: Record<NavItemStatusTypes, string> = {
  default: 'text-gray-100 hover:bg-gray-700 hover:text-white',
  selected: 'bg-gray-800 text-lime-400',
};

interface NavItemProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string;
  icon: string;
  status?: NavItemStatusTypes;
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
      className={cn(navItemBaseClass, navItemStatusClass[status], isCollapsed ? 'w-48 gap-0' : 'gap-12', className)}
      {...props}
    >
      <Icon
        name={icon}
        size={24}
        className={cn(
          'shrink-0 transition-colors',
          status === 'selected' ? 'text-lime-400' : 'text-gray-400 group-hover:text-white',
        )}
      />
      <div
        className={cn(
          'grid min-w-0 transition-[grid-template-columns,opacity,transform] duration-200 ease-in-out',
          isCollapsed
            ? 'pointer-events-none -translate-x-1 grid-cols-[0fr] opacity-0'
            : 'translate-x-0 grid-cols-[1fr] opacity-100',
        )}
      >
        <span className="text-body-m-16 overflow-hidden whitespace-nowrap">{label}</span>
      </div>
    </button>
  );
};
