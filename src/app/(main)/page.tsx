import { DropDown } from '@features/semester-planner/card-view';

export default function Page() {
  return (
    <main className="flex h-dvh items-center justify-center gap-8 bg-gray-50">
      <DropDown label="text" />
      <DropDown label="text" status="selected" />
    </main>
  );
}
