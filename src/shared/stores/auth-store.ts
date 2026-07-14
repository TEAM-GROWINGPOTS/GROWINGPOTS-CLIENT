import { create } from 'zustand';

interface AuthState {
  nickname: string;
  setNickname: (nickname: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  nickname: '',
  setNickname: (nickname) => set({ nickname }),
}));
