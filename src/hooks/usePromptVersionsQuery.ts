import { useQuery } from '@tanstack/react-query';

export interface PromptVersion {
  id: number;
  prompt_template_id: number;
  version: number;
  is_active: boolean;
  created_at: string;
}

export function usePromptVersionsQuery(promptTemplateId: number) {
  return useQuery<PromptVersion[]>({
    queryKey: ['prompt_versions', promptTemplateId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/prompts/${promptTemplateId}/settings`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки версий промпта');
      return res.json();
    },
    enabled: !!promptTemplateId,
  });
} 