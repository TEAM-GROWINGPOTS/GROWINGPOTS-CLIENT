import type { RequirementAccordionItem, RequirementScrollRequest } from '@features/main/types/requirement';
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
  scrollRequest: RequirementScrollRequest | null;
  onScrollRequestChange: (targetKey: string | null) => void;
  admissionYear?: number;
}

export const GraduationDashboardSection = ({
  tabs,
  selectedTab,
  onTabChange,
  shortcuts,
  totalCredits,
  items,
  scrollRequest,
  onScrollRequestChange,
  admissionYear,
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
          onSelectItem={({ scrollKey }) => {
            if (scrollKey) onScrollRequestChange(scrollKey);
          }}
        />
        <RequirementAccordionList
          key={selectedTab}
          items={items}
          scrollRequest={scrollRequest}
          onScrollRequestChange={onScrollRequestChange}
          admissionYear={admissionYear}
        />
      </div>
    </section>
  );
};
