'use client';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useIntegrationsQuery, Integration } from '../../../hooks/useIntegrationsQuery';
import { Button } from '../../../components/ui/button';
import { useState } from 'react';
import { CreateIntegrationDialog } from './CreateIntegrationDialog';

export default function IntegrationsPage() {
  const { data, isLoading, error, refetch } = useIntegrationsQuery();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить интеграцию?')) return;
    setActionLoading(id);
    setErrMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/integrations/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка удаления');
      refetch();
    } catch (e: any) {
      setErrMsg(e.message || 'Ошибка');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Интеграции Telegram</h1>
          <Button onClick={() => setOpen(true)}>Добавить интеграцию</Button>
        </div>
        <CreateIntegrationDialog open={open} onClose={() => setOpen(false)} />
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки интеграций</div>}
        {errMsg && <div className="text-red-500 text-sm">{errMsg}</div>}
        {data && data.length === 0 && <div>Нет интеграций.</div>}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((int: Integration) => (
              <div key={int.id} className="rounded-lg border bg-card p-6 shadow-sm flex flex-col gap-2">
                <div className="font-semibold text-lg mb-1">{int.type === 'bot' ? 'Bot API' : 'MTProto'}</div>
                {int.token && <div className="text-xs mb-1">Token: {int.token}</div>}
                {int.api_id && <div className="text-xs mb-1">API ID: {int.api_id}</div>}
                {int.api_hash && <div className="text-xs mb-1">API Hash: {int.api_hash}</div>}
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${int.is_valid ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-xs">{int.is_valid ? 'Валидна' : 'Ошибка'}</span>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(int.id)} disabled={actionLoading === int.id}>
                    {actionLoading === int.id ? 'Удаление...' : 'Удалить'}
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