'use client';

import { useRequirementSection } from '@features/main/hooks/use-requirement-section';
import { requirementData, requirementDetails } from '@features/main/mocks/requirement';
import { GraduationDashboardHeader, GraduationDashboardSection } from '@features/main/ui';
import { useSideNavigationStore } from '@shared/stores/side-navigation-store';
import { cn } from '@shared/utils/cn';

const admissionYear = 2023;

export default function GraduationDashboardPage() {
  const isCollapsed = useSideNavigationStore((state) => state.isCollapsed);
  const isInitialized = useSideNavigationStore((state) => state.isInitialized);
  const isSidebarCollapsed = isInitialized && isCollapsed;
  const { tabs, selectedTab, setSelectedTab, shortcuts, items, scrollTargetKey, handleShortcutClick } =
    useRequirementSection({
      data: requirementData,
      details: requirementDetails,
    });

  return (
    <main className={cn('min-h-screen bg-gray-50 py-35 pt-80', isSidebarCollapsed ? 'px-120' : 'px-48')}>
      <div className="mx-auto flex flex-col gap-24">
        <GraduationDashboardHeader certs={requirementData.certs} gpa={requirementData.summary.gpa.current} />
        <GraduationDashboardSection
          tabs={tabs}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          shortcuts={shortcuts}
          totalCredits={requirementData.summary.totalCredits}
          items={items}
          scrollTargetKey={scrollTargetKey}
          admissionYear={admissionYear}
          onShortcutClick={handleShortcutClick}
        />
      </div>
    </main>
  );
}
