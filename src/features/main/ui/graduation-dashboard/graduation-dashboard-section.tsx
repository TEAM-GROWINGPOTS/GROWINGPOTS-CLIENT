import type { RequirementAccordionItem } from '@features/main/types/requirement';
import { getProgressGridItems } from '@features/main/utils/progress-grid';
import type { GraduationResponse } from '@shared/apis/types/graduation';

import type { GraduationDashboardTab } from './graduation-dashboard-tabs';
import { GraduationDashboardTabs } from './graduation-dashboard-tabs';
import { GraduationProgressGrid } from './graduation-progress-grid/graduation-progress-grid';
import { RequirementAccordionList } from './requirement-accordion/requirement-accordion-list';

interface GraduationDashboardSectionProps {
  tabs: GraduationDashboardTab[];
  selectedTab: string;
  onTabChange: (value: string) => void;
  shortcuts: RequirementAccordionItem[];
  totalCredits: GraduationResponse['summary']['totalCredits'];
  items: RequirementAccordionItem[];
  scrollTargetKey: string | null;
  admissionYear?: number;
  onShortcutClick: (scrollKey?: string) => void;
}

export const GraduationDashboardSection = ({
  tabs,
  selectedTab,
  onTabChange,
  shortcuts,
  totalCredits,
  items,
  scrollTargetKey,
  admissionYear,
  onShortcutClick,
}: GraduationDashboardSectionProps) => {
  const progressGridItems = getProgressGridItems(shortcuts, totalCredits);
  const enabledScrollKeys = new Set(items.map(({ scrollKey }) => scrollKey).filter(Boolean));
  const interactiveProgressGridItems = progressGridItems.map((item) => ({
    ...item,
    isDisabled: !item.scrollKey || !enabledScrollKeys.has(item.scrollKey),
  }));

  return (
    <section className="rounded-2xl bg-white p-24">
      <GraduationDashboardTabs tabs={tabs} selectedTab={selectedTab} onTabChange={onTabChange} />

      <div className="mt-29 grid grid-cols-2 gap-20">
        <GraduationProgressGrid
          items={interactiveProgressGridItems}
          onSelectItem={({ scrollKey }) => onShortcutClick(scrollKey)}
        />
        <RequirementAccordionList
          key={selectedTab}
          items={items}
          scrollTargetKey={scrollTargetKey}
          admissionYear={admissionYear}
        />
      </div>
    </section>
  );
};
