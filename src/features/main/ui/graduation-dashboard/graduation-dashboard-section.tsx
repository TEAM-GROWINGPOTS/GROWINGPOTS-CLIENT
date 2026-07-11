import type { RequirementAccordionItem } from '@features/main/types/requirement';

import { GraduationDashboardTabs } from './graduation-dashboard-tabs';
import { RequirementAccordionList } from './requirement-accordion/requirement-accordion-list';

interface GraduationDashboardTab {
  value: string;
  label: string;
}

interface GraduationDashboardSectionProps {
  tabs: GraduationDashboardTab[];
  selectedTab: string;
  onTabChange: (value: string) => void;
  shortcuts: RequirementAccordionItem[];
  items: RequirementAccordionItem[];
  scrollTargetKey: string | null;
  onShortcutClick: (scrollKey?: string) => void;
}

export const GraduationDashboardSection = ({
  tabs,
  selectedTab,
  onTabChange,
  shortcuts,
  items,
  scrollTargetKey,
  onShortcutClick,
}: GraduationDashboardSectionProps) => {
  return (
    <section className="rounded-2xl bg-white p-24">
      <GraduationDashboardTabs tabs={tabs} selectedTab={selectedTab} onTabChange={onTabChange} />

      <div className="mt-29 grid grid-cols-[528px_509px] gap-24">
        <div className="grid h-fit grid-cols-3 gap-8">
          {shortcuts.map(({ code, scrollKey, name }) => (
            <button
              key={code}
              type="button"
              className="text-caption-m-12 rounded bg-gray-50 px-12 py-8 text-left text-gray-700"
              onClick={() => onShortcutClick(scrollKey)}
            >
              {name}
            </button>
          ))}
        </div>

        <RequirementAccordionList items={items} scrollTargetKey={scrollTargetKey} />
      </div>
    </section>
  );
};
