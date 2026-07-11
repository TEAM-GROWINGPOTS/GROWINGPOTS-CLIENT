import { Chip } from '@shared/components';

export interface GraduationDashboardTab {
  value: string;
  label: string;
}

interface GraduationDashboardTabsProps {
  tabs: GraduationDashboardTab[];
  selectedTab: string;
  onTabChange: (value: string) => void;
}

export const GraduationDashboardTabs = ({ tabs, selectedTab, onTabChange }: GraduationDashboardTabsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-10">
      {tabs.map(({ value, label }) => (
        <Chip
          key={value}
          label={label}
          size="medium"
          isSelected={selectedTab === value}
          onClick={() => onTabChange(value)}
        />
      ))}
    </div>
  );
};
