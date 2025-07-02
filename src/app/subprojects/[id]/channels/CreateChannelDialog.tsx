'use client';
import { useState } from 'react';
import { Dialog } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onClose: () => void;
  subprojectId: number;
}

export function CreateChannelDialog({ open, onClose, subprojectId }: Props) {
  const [title, setTitle] = useState('');
  const [channelId, setChannelId] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          subproject_id: subprojectId,
          channel_id: Number(channelId),
          title,
          filters: { keywords: keywords.split(',').map(k => k.trim()).filter(Boolean) },
        }),
      });
      if (!res.ok) throw new Error('Ошибка добавления канала');
      await res.json();
      queryClient.invalidateQueries({ queryKey: ['channels', subprojectId] });
      setTitle('');
      setChannelId('');
      setKeywords('');
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
        <h2 className="text-xl font-bold mb-2">Добавить канал</h2>
        <div>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Название канала"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="ID канала (число)"
            value={channelId}
            onChange={e => setChannelId(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
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
          <Button type="submit" disabled={loading}>{loading ? 'Добавление...' : 'Добавить'}</Button>
        </div>
      </form>
    </Dialog>
  );
} 