import { ViewModeToggle } from '@features/semester-planner';
import { Suspense } from 'react';

export default function Page() {
  return (
    <main className="mt-40 flex justify-center">
      <Suspense>
        <ViewModeToggle />
      </Suspense>
    </main>
  );
}
