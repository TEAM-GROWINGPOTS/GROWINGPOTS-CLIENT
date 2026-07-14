'use client';

import { GraduationDashboardContainer } from '@features/main/ui';
import { useSideNavigationStore } from '@shared/stores/side-navigation-store';
import { cn } from '@shared/utils/cn';

export default function GraduationDashboardPage() {
  const isCollapsed = useSideNavigationStore((state) => state.isCollapsed);
  const isInitialized = useSideNavigationStore((state) => state.isInitialized);
  const isSidebarCollapsed = isInitialized && isCollapsed;

  return (
    <main
      className={cn(
        'min-h-screen bg-gray-50 py-35 pt-80 transition-[padding] duration-300 ease-in-out',
        isSidebarCollapsed ? 'px-120' : 'px-48',
      )}
    >
      <GraduationDashboardContainer />
    </main>
  );
}
