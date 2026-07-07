import { GraduationStatusAccordion } from '@features/semester-planner/road-view/graduation-status-accordion/graduation-status-accordion';

export default function Page() {
  return (
    <main className="flex min-h-screen items-start justify-end gap-24 bg-white p-24">
      <GraduationStatusAccordion hasDoubleMajor={false} />
      <GraduationStatusAccordion hasDoubleMajor={true} />
    </main>
  );
}
