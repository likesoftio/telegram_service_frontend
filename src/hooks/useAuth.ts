import { useAuthStore } from '../store/auth';

export function useAuth() {
  const { token, user, isAuth, login, logout, setUser } = useAuthStore();
  return { token, user, isAuth, login, logout, setUser };
} 