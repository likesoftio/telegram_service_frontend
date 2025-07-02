import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../store/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    // Проверка токена (можно добавить fetch /api/users/me)
    if (token) {
      // TODO: проверить валидность токена через backend
    }
  }, [token]);

  useEffect(() => {
    // Автоматический logout при удалении токена
    if (!token) logout();
  }, [token, logout]);

  return <>{children}</>;
} 