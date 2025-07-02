import { useQuery } from '@tanstack/react-query';

export interface PromptTemplate {
  id: number;
  subproject_id: number;
  name: string;
  template: string;
}

export function usePromptsQuery(subprojectId: number) {
  return useQuery<PromptTemplate[]>({
    queryKey: ['prompts', subprojectId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/prompts?subproject_id=${subprojectId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки промптов');
      return res.json();
    },
    enabled: !!subprojectId,
  });
} 