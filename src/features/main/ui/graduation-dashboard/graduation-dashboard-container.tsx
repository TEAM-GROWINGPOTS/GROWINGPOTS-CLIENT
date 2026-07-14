'use client';

import { useGraduationDashboard } from '@features/main/hooks/use-graduation-dashboard';

import { GraduationDashboardHeader } from './graduation-dashboard-header';
import { GraduationDashboardSection } from './graduation-dashboard-section';

export const GraduationDashboardContainer = () => {
  const {
    tabs,
    selectedTab,
    setSelectedTab,
    progressShortcuts,
    totalCredits = { current: 0, required: 0 },
    items,
    scrollTargetKey,
    admissionYear,
    certs = [],
    gpa = 0,
    isError,
    handleShortcutClick,
  } = useGraduationDashboard();

  if (isError) return null;

  return (
    <div className="mx-auto flex flex-col gap-24">
      <GraduationDashboardHeader certs={certs} gpa={gpa} />
      <GraduationDashboardSection
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        shortcuts={progressShortcuts}
        totalCredits={totalCredits}
        items={items}
        scrollTargetKey={scrollTargetKey}
        admissionYear={admissionYear}
        onShortcutClick={handleShortcutClick}
      />
    </div>
  );
};
