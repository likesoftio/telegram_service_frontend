import { useQuery } from '@tanstack/react-query';
import { PromptTemplate } from './usePromptsQuery';

export function usePromptByIdQuery(id: number) {
  return useQuery<PromptTemplate>({
    queryKey: ['prompt', id],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/prompts/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки промпта');
      return res.json();
    },
  });
}