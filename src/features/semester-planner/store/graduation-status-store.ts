import type { GraduationResponse } from '@shared/apis/types/graduation';
import { create } from 'zustand';

interface GraduationStatusState {
  data: GraduationResponse | null;
  setData: (data: GraduationResponse) => void;
}

export const useGraduationStatusStore = create<GraduationStatusState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
