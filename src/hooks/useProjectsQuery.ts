import { useQuery } from '@tanstack/react-query';

export interface Project {
  id: number;
  name: string;
  description: string;
}

export function useProjectsQuery() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/projects/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки проектов');
      return res.json();
    },
  });
} 