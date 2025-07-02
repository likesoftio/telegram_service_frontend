'use client';
import { useState } from 'react';
import { Dialog } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
}

export function CreateSubprojectDialog({ open, onClose, projectId }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/subprojects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ project_id: projectId, name, description }),
      });
      if (!res.ok) throw new Error('Ошибка создания подпроекта');
      await res.json();
      queryClient.invalidateQueries({ queryKey: ['subprojects', projectId] });
      setName('');
      setDescription('');
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
        <h2 className="text-xl font-bold mb-2">Создать подпроект</h2>
        <div>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Название подпроекта"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Описание подпроекта"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Отмена</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Создание...' : 'Создать'}</Button>
        </div>
      </form>
    </Dialog>
  );
} 