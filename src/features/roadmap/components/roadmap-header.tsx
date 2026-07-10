'use client';

import { GraduationStatusAccordion } from '@features/semester-planner/road-view/graduation-status-accordion';
import { ViewModeToggle } from '@features/semester-planner/view-mode-toggle/view-mode-toggle';

export const RoadmapHeader = () => {
  return (
    <div className="flex w-full items-center justify-between px-20 py-16">
      <ViewModeToggle />
      <GraduationStatusAccordion />
    </div>
  );
};
