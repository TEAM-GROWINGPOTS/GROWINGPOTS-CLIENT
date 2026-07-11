'use client';

import { CardView } from '@features/semester-planner/card-view/card-view';
import { useViewMode } from '@features/semester-planner/hooks/use-view-mode';
import { ViewModeToggle } from '@features/semester-planner/view-mode-toggle/view-mode-toggle';

export const PlannerView = () => {
  const { viewMode } = useViewMode();

  const viewModeToggle = <ViewModeToggle />;

  return (
    <div className="h-full bg-gray-100">
      {viewMode === 'roadmap' ? (
        <div className="flex h-full flex-col">
          <div className="flex justify-center pt-24">{viewModeToggle}</div>
          <section className="flex min-h-0 flex-1 items-center justify-center">
            <p className="text-body-m-16 text-gray-500">로드맵 자리입니다.</p>
          </section>
        </div>
      ) : (
        <CardView viewModeToggle={viewModeToggle} />
      )}
    </div>
  );
};
