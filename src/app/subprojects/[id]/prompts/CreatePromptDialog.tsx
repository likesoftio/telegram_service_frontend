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

export function CreatePromptDialog({ open, onClose, subprojectId }: Props) {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ subproject_id: subprojectId, name, template }),
      });
      if (!res.ok) throw new Error('Ошибка создания промпта');
      await res.json();
      queryClient.invalidateQueries({ queryKey: ['prompts', subprojectId] });
      setName('');
      setTemplate('');
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
        <h2 className="text-xl font-bold mb-2">Создать промпт</h2>
        <div>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Название промпта"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Шаблон (Jinja2-синтаксис)"
            value={template}
            onChange={e => setTemplate(e.target.value)}
            rows={5}
            required
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