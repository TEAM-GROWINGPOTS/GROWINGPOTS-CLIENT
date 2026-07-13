'use client';

import { useViewMode } from '@features/semester-planner/hooks/use-view-mode';
import { ViewModeToggle } from '@features/semester-planner/view-mode-toggle/view-mode-toggle';
import { useState } from 'react';

import { CardView } from './card-view/card-view';
import { RoadmapView } from './road-view';

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
          {viewMode === 'roadmap' ? <RoadmapView /> : <CardView sidebarSlot={sidebarSlot} />}
        </div>
      </div>
      <div ref={setSidebarSlot} className="h-full shrink-0" />
    </div>
  );
};
