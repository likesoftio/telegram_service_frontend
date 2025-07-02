'use client';
import { useState } from 'react';
import { Dialog } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateIntegrationDialog({ open, onClose }: Props) {
  const [type, setType] = useState<'bot' | 'mtproto'>('bot');
  const [token, setToken] = useState('');
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tokenValue = localStorage.getItem('token');
      const body: any = { type };
      if (type === 'bot') body.token = token;
      if (type === 'mtproto') {
        body.api_id = Number(apiId);
        body.api_hash = apiHash;
      }
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tokenValue ? { Authorization: `Bearer ${tokenValue}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Ошибка добавления интеграции');
      await res.json();
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setToken('');
      setApiId('');
      setApiHash('');
      setType('bot');
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
        <h2 className="text-xl font-bold mb-2">Добавить интеграцию</h2>
        <div>
          <select
            className="w-full border rounded px-3 py-2 mb-2"
            value={type}
            onChange={e => setType(e.target.value as 'bot' | 'mtproto')}
          >
            <option value="bot">Bot API</option>
            <option value="mtproto">MTProto</option>
          </select>
        </div>
        {type === 'bot' && (
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Bot Token"
            value={token}
            onChange={e => setToken(e.target.value)}
            required
          />
        )}
        {type === 'mtproto' && (
          <>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="API ID"
              value={apiId}
              onChange={e => setApiId(e.target.value.replace(/\D/g, ''))}
              required
            />
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="API Hash"
              value={apiHash}
              onChange={e => setApiHash(e.target.value)}
              required
            />
          </>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Отмена</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Добавление...' : 'Добавить'}</Button>
        </div>
      </form>
    </Dialog>
  );
} 