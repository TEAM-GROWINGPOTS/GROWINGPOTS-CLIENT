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
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* 카드뷰/로드맵뷰 어느 쪽이든 아래 컨텐츠 위에 항상 같은 위치로 겹쳐 그린다(정상 흐름에 넣지 않음).
            창 상단에서 40px 떨어진 위치로 고정한다(로드맵뷰의 졸업 현황 아코디언은 24px). */}
        <div className="pointer-events-none absolute inset-x-0 top-40 z-50 flex justify-center">
          <div className="pointer-events-auto">
            <ViewModeToggle />
          </div>
        </div>
        <div className="min-h-0 flex-1">
          {viewMode === 'roadmap' ? <RoadmapView /> : <CardView sidebarSlot={sidebarSlot} />}
        </div>
      </div>
      <div ref={setSidebarSlot} className="h-full shrink-0" />
    </div>
  );
};
