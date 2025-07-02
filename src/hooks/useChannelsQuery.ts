import { useQuery } from '@tanstack/react-query';

export interface MonitoredChannel {
  id: number;
  subproject_id: number;
  channel_id: number;
  title: string;
  filters: { keywords: string[] };
  is_active: boolean;
}

export function useChannelsQuery(subprojectId: number) {
  return useQuery<MonitoredChannel[]>({
    queryKey: ['channels', subprojectId],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/channels?subproject_id=${subprojectId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки каналов');
      return res.json();
    },
    enabled: !!subprojectId,
  });
} 