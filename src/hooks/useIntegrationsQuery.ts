import { useQuery } from '@tanstack/react-query';

export interface Integration {
  id: number;
  type: string;
  token?: string;
  api_id?: number;
  api_hash?: string;
  is_valid: boolean;
}

export function useIntegrationsQuery() {
  return useQuery<Integration[]>({
    queryKey: ['integrations'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/integrations', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки интеграций');
      return res.json();
    },
  });
} 