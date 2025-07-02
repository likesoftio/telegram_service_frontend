import { useQuery } from '@tanstack/react-query';

export interface StatsSummary {
  total_messages: number;
  approved: number;
  declined: number;
  likes: number;
  by_day: { date: string; messages: number; likes: number }[];
}

export function useStatsQuery() {
  return useQuery<StatsSummary>({
    queryKey: ['stats', 'summary'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/stats/summary', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки статистики');
      return res.json();
    },
  });
} 