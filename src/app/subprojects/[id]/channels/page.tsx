'use client';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { useChannelsQuery, MonitoredChannel } from '../../../../hooks/useChannelsQuery';
import { Button } from '../../../../components/ui/button';
import { useState } from 'react';
import { CreateChannelDialog } from './CreateChannelDialog';
import { EditChannelFiltersDialog } from './EditChannelFiltersDialog';

export default function ChannelsPage() {
  const params = useParams();
  const router = useRouter();
  const subprojectId = Number(params.id);
  const { data, isLoading, error } = useChannelsQuery(subprojectId);
  const [open, setOpen] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const handleToggleActive = async (ch: MonitoredChannel) => {
    setToggleLoadingId(ch.id);
    setToggleError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/channels/${ch.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ is_active: !ch.is_active }),
      });
      if (!res.ok) throw new Error('Ошибка обновления статуса');
      await res.json();
      // invalidate
      window.location.reload(); // или queryClient.invalidateQueries, если есть доступ
    } catch (e: any) {
      setToggleError(e.message || 'Ошибка');
    } finally {
      setToggleLoadingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Каналы</h1>
          <Button onClick={() => setOpen(true)}>Добавить канал</Button>
        </div>
        <CreateChannelDialog open={open} onClose={() => setOpen(false)} subprojectId={subprojectId} />
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки каналов</div>}
        {toggleError && <div className="text-red-500 text-sm">{toggleError}</div>}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((ch) => (
              <div key={ch.id} className="rounded-lg border bg-card p-6 shadow-sm flex flex-col gap-2">
                <div className="font-semibold text-lg mb-1">{ch.title}</div>
                <div className="text-muted-foreground text-sm mb-2">ID: {ch.channel_id}</div>
                <div className="text-xs mb-2">Ключевые слова: {ch.filters?.keywords?.join(', ') || '—'}</div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${ch.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <span className="text-xs">{ch.is_active ? 'Активен' : 'Отключен'}</span>
                  <Button size="sm" variant="outline" onClick={() => setEditChannel(ch)}>Фильтры</Button>
                  <Button
                    size="sm"
                    variant={ch.is_active ? 'destructive' : 'default'}
                    onClick={() => handleToggleActive(ch)}
                    disabled={toggleLoadingId === ch.id}
                  >
                    {toggleLoadingId === ch.id
                      ? (ch.is_active ? 'Отключение...' : 'Включение...')
                      : (ch.is_active ? 'Отключить' : 'Включить')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 