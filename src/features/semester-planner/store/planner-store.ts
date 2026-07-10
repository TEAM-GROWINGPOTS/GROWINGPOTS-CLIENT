import { create } from 'zustand';

interface PlannerState {
  isDirty: boolean;
  saveHandler: (() => void) | null;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (saveHandler: (() => void) | null) => void;
}

export const usePlannerStore = create<PlannerState>((set) => ({
  isDirty: false,
  saveHandler: null,
  setIsDirty: (isDirty) => set({ isDirty }),
  setSaveHandler: (saveHandler) => set({ saveHandler }),
}));
