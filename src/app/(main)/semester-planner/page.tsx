import { PlannerView } from '@features/semester-planner';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <PlannerView />
    </Suspense>
  );
}
