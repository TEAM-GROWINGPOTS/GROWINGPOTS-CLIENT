'use client';

import { CardView } from '@features/semester-planner/card-view/card-view';
import { useViewMode } from '@features/semester-planner/hooks/use-view-mode';
import { usePlannerStore } from '@features/semester-planner/store/planner-store';
import { type ViewMode, ViewModeToggle } from '@features/semester-planner/view-mode-toggle/view-mode-toggle';
import { ConfirmModal } from '@shared/components/modal/confirm-modal';
import { useEffect, useState } from 'react';

export const PlannerView = () => {
  const { viewMode, setViewMode } = useViewMode();
  const [pendingViewMode, setPendingViewMode] = useState<ViewMode | null>(null);
  const isDirty = usePlannerStore((state) => state.isDirty);
  const saveHandler = usePlannerStore((state) => state.saveHandler);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!usePlannerStore.getState().isDirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleBeforeViewModeChange = (next: ViewMode): boolean => {
    if (next === viewMode || !isDirty) return true;
    setPendingViewMode(next);
    return false;
  };

  const handleSaveAndLeave = () => {
    if (!pendingViewMode) return;
    saveHandler?.();
    setViewMode(pendingViewMode);
    setPendingViewMode(null);
  };

  const viewModeToggle = <ViewModeToggle onBeforeChange={handleBeforeViewModeChange} />;

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
      <ConfirmModal
        open={pendingViewMode !== null}
        onOpenChange={(open) => {
          if (!open) setPendingViewMode(null);
        }}
        type="saveChanges"
        title="저장하지 않은 변경사항이 있어요"
        onConfirm={handleSaveAndLeave}
      />
    </div>
  );
};
