import { create } from 'zustand';

interface AuthState {
  nickname: string;
  onboardingCompleted: boolean;
  setAuthInfo: (nickname: string, onboardingCompleted: boolean) => void;
  clearAuthInfo: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  nickname: '',
  onboardingCompleted: false,
  setAuthInfo: (nickname, onboardingCompleted) => set({ nickname, onboardingCompleted }),
  clearAuthInfo: () => set({ nickname: '', onboardingCompleted: false }),
}));
