import { create } from 'zustand';

interface SideNavigationState {
  isCollapsed: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleSidebar: () => void;
}

export const useSideNavigationStore = create<SideNavigationState>((set) => ({
  isCollapsed: false,
  closeSidebar: () => set({ isCollapsed: true }),
  openSidebar: () => set({ isCollapsed: false }),
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
