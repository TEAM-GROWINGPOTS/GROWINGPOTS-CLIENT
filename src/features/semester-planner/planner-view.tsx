'use client';

import { CardView } from '@features/semester-planner/card-view/card-view';
import { useViewMode } from '@features/semester-planner/hooks/use-view-mode';
import { ViewModeToggle } from '@features/semester-planner/view-mode-toggle/view-mode-toggle';
import { useState } from 'react';

export const PlannerView = () => {
  const { viewMode } = useViewMode();
  const [sidebarSlot, setSidebarSlot] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full bg-gray-100">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-center pt-24">
          <ViewModeToggle />
        </div>
        <div className="min-h-0 flex-1">
          {viewMode === 'roadmap' ? (
            <section className="flex h-full items-center justify-center">
              <p className="text-body-m-16 text-gray-500">로드맵 자리입니다.</p>
            </section>
          ) : (
            <CardView sidebarSlot={sidebarSlot} />
          )}
        </div>
      </div>
      <div ref={setSidebarSlot} className="h-full shrink-0" />
    </div>
  );
};
