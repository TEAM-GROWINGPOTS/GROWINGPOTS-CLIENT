import { create } from 'zustand';

interface SideNavigationState {
  isCollapsed: boolean;
  isInitialized: boolean;
  initializeCollapsed: (isCollapsed: boolean) => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleSidebar: () => void;
}

const SIDE_NAVIGATION_COOKIE_KEY = 'side-navigation-collapsed';

const setCollapsedCookie = (isCollapsed: boolean) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${SIDE_NAVIGATION_COOKIE_KEY}=${String(isCollapsed)}; path=/; samesite=lax`;
};

export const useSideNavigationStore = create<SideNavigationState>((set) => ({
  isCollapsed: false,
  isInitialized: false,
  initializeCollapsed: (isCollapsed) =>
    set((state) => {
      if (state.isInitialized) return state;
      return { isCollapsed, isInitialized: true };
    }),
  closeSidebar: () =>
    set(() => {
      setCollapsedCookie(true);
      return { isCollapsed: true, isInitialized: true };
    }),
  openSidebar: () =>
    set(() => {
      setCollapsedCookie(false);
      return { isCollapsed: false, isInitialized: true };
    }),
  toggleSidebar: () =>
    set((state) => {
      const nextIsCollapsed = !state.isCollapsed;
      setCollapsedCookie(nextIsCollapsed);
      return { isCollapsed: nextIsCollapsed, isInitialized: true };
    }),
}));
