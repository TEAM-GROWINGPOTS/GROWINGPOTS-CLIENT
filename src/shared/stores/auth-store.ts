import { create } from 'zustand';

type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  nickname: string;
  onboardingCompleted: boolean | null;
  setAuthenticated: (nickname: string, onboardingCompleted: boolean) => void;
  setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'initializing',
  nickname: '',
  onboardingCompleted: null,
  setAuthenticated: (nickname, onboardingCompleted) => set({ status: 'authenticated', nickname, onboardingCompleted }),
  setUnauthenticated: () => set({ status: 'unauthenticated', nickname: '', onboardingCompleted: null }),
}));
