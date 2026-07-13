'use client';

import { useRequirementSection } from '@features/main/hooks/use-requirement-section';
import { requirementData, requirementDetails } from '@features/main/mocks/requirement';
import { GraduationDashboardHeader, GraduationDashboardSection } from '@features/main/ui';

const admissionYear = 2023;

export default function GraduationDashboardPage() {
  const { tabs, selectedTab, setSelectedTab, shortcuts, items, scrollTargetKey, handleShortcutClick } =
    useRequirementSection({
      data: requirementData,
      details: requirementDetails,
    });

  return (
    <main className="min-h-screen bg-gray-50 px-48 py-35 pt-80">
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
