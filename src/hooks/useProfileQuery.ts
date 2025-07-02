import { useQuery } from '@tanstack/react-query';

export interface UserProfile {
  id: number;
  username: string;
  full_name: string;
  email?: string;
  language?: string;
}

export function useProfileQuery() {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки профиля');
      return res.json();
    },
  });
} 