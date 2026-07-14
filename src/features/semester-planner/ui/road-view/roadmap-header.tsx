'use client';

import type { GraduationResponse } from '@shared/apis/types/graduation';

import { GraduationStatusAccordion } from './graduation-status-accordion';

interface RoadmapHeaderProps {
  data?: GraduationResponse;
}

export const RoadmapHeader = ({ data }: RoadmapHeaderProps) => {
  return <GraduationStatusAccordion data={data} />;
};
