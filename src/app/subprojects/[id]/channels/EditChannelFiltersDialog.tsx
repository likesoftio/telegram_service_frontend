'use client';
import { useState } from 'react';
import { Dialog } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { MonitoredChannel } from '../../../hooks/useChannelsQuery';

interface Props {
  open: boolean;
  onClose: () => void;
  channel: MonitoredChannel;
  subprojectId: number;
}

export function EditChannelFiltersDialog({ open, onClose, channel, subprojectId }: Props) {
  const [keywords, setKeywords] = useState(channel.filters?.keywords?.join(', ') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/channels/${channel.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ filters: { keywords: keywords.split(',').map(k => k.trim()).filter(Boolean) } }),
      });
      if (!res.ok) throw new Error('Ошибка обновления фильтров');
      await res.json();
      queryClient.invalidateQueries({ queryKey: ['channels', subprojectId] });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-2">Редактировать фильтры</h2>
        <div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Ключевые слова (через запятую)"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Отмена</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</Button>
        </div>
      </form>
    </Dialog>
  );
} 