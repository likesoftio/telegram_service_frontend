import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  full_name: string;
  photo_url?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isAuth: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user, isAuth: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuth: false });
  },
  setUser: (user) => set({ user }),
})); 