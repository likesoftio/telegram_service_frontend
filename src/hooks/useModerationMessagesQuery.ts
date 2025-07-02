import { useQuery } from '@tanstack/react-query';

export interface ModerationMessage {
  id: number;
  channel_id: number;
  text: string;
  ai_response: string;
  status: string;
  created_at: string;
}

export function useModerationMessagesQuery() {
  return useQuery<ModerationMessage[]>({
    queryKey: ['moderation_messages'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/messages/?status=pending', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки сообщений');
      return res.json();
    },
  });
} 