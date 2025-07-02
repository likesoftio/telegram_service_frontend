import { useQuery } from '@tanstack/react-query';

export interface Subproject {
  id: number;
  project_id: number;
  name: string;
  description: string;
}

export function useSubprojectsQuery(projectId: number) {
  return useQuery<Subproject[]>({
    queryKey: ['subprojects', projectId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/projects/${projectId}/subprojects/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки подпроектов');
      return res.json();
    },
    enabled: !!projectId,
  });
} 