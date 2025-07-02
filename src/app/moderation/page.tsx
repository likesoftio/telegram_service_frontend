'use client';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useModerationMessagesQuery, ModerationMessage } from '../../hooks/useModerationMessagesQuery';
import { Button } from '../../components/ui/button';
import { useState } from 'react';

export default function ModerationPage() {
  const { data, isLoading, error, refetch } = useModerationMessagesQuery();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleAction = async (id: number, action: 'approve' | 'decline' | 'like', ai_response?: string) => {
    setActionLoading(id);
    setErrMsg(null);
    try {
      const token = localStorage.getItem('token');
      let url = `/api/messages/${id}/${action}`;
      let options: RequestInit = {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {},
      };
      if (action === 'like') options = { ...options, method: 'POST' };
      if (action === 'approve' && ai_response) {
        url = `/api/messages/${id}`;
        options = {
          ...options,
          method: 'PATCH',
          body: JSON.stringify({ ai_response }),
        };
      }
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('Ошибка действия');
      refetch();
      setEditId(null);
    } catch (e: any) {
      setErrMsg(e.message || 'Ошибка');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Модерация</h1>
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки сообщений</div>}
        {errMsg && <div className="text-red-500 text-sm">{errMsg}</div>}
        {data && data.length === 0 && <div>Нет сообщений на модерацию.</div>}
        {data && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Канал</th>
                  <th className="p-2 border">Сообщение</th>
                  <th className="p-2 border">AI-ответ</th>
                  <th className="p-2 border">Дата</th>
                  <th className="p-2 border">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data.map((msg: ModerationMessage) => (
                  <tr key={msg.id} className="border-b">
                    <td className="p-2 border text-center">{msg.id}</td>
                    <td className="p-2 border text-center">{msg.channel_id}</td>
                    <td className="p-2 border whitespace-pre-line max-w-xs">{msg.text}</td>
                    <td className="p-2 border whitespace-pre-line max-w-xs">
                      {editId === msg.id ? (
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                        />
                      ) : (
                        msg.ai_response
                      )}
                    </td>
                    <td className="p-2 border text-center">{new Date(msg.created_at).toLocaleString()}</td>
                    <td className="p-2 border flex flex-col gap-2 min-w-[120px]">
                      {editId === msg.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAction(msg.id, 'approve', editText)} disabled={actionLoading === msg.id}>Сохранить</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Отмена</Button>
                        </div>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => handleAction(msg.id, 'approve')} disabled={actionLoading === msg.id}>Одобрить</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(msg.id, 'decline')} disabled={actionLoading === msg.id}>Отклонить</Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditId(msg.id); setEditText(msg.ai_response); }}>Редактировать</Button>
                          <Button size="sm" variant="ghost" onClick={() => handleAction(msg.id, 'like')} disabled={actionLoading === msg.id}>Лайк</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 