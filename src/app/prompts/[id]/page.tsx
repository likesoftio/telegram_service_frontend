'use client';
import { useParams, useRouter } from 'next/navigation';
import { usePromptByIdQuery } from '../../../hooks/usePromptByIdQuery';
import { usePromptVersionsQuery } from '../../../hooks/usePromptVersionsQuery';
import { Button } from '../../../components/ui/button';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function PromptEditPage() {
  const params = useParams();
  const router = useRouter();
  const promptId = Number(params.id);
  const { data, isLoading, error, refetch } = usePromptByIdQuery(promptId);
  const { data: versions, isLoading: loadingVersions, error: errorVersions, refetch: refetchVersions } = usePromptVersionsQuery(promptId);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Инициализация формы после загрузки
  useEffect(() => {
    if (data) {
      setName(data.name);
      setTemplate(data.template);
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setErrMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, template }),
      });
      if (!res.ok) throw new Error('Ошибка сохранения');
      await res.json();
      refetch();
    } catch (e: any) {
      setErrMsg(e.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить промпт?')) return;
    setDeleting(true);
    setErrMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка удаления');
      router.back();
    } catch (e: any) {
      setErrMsg(e.message || 'Ошибка');
    } finally {
      setDeleting(false);
    }
  };

  const handleActivateVersion = async (versionId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/prompt_settings_versions/activate/${versionId}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка активации версии');
      refetchVersions();
      refetch();
    } catch (e: any) {
      setErrMsg(e.message || 'Ошибка');
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-8 max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold mb-4">Редактирование промпта</h1>
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки промпта</div>}
        {data && (
          <>
            <div className="space-y-4">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Название промпта"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <textarea
                className="w-full border rounded px-3 py-2 font-mono"
                placeholder="Шаблон (Jinja2-синтаксис)"
                value={template}
                onChange={e => setTemplate(e.target.value)}
                rows={8}
              />
              {errMsg && <div className="text-red-500 text-sm">{errMsg}</div>}
              <div className="flex gap-2 justify-end">
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Удаление...' : 'Удалить'}
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Версии промпта</h2>
              {loadingVersions && <div>Загрузка версий...</div>}
              {errorVersions && <div className="text-red-500">Ошибка загрузки версий</div>}
              {versions && (
                <div className="space-y-2">
                  {versions.map((v) => (
                    <div key={v.id} className={`flex items-center gap-4 p-2 rounded ${v.is_active ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                      <div className="flex-1">
                        <span className="font-mono">v{v.version}</span> — {new Date(v.created_at).toLocaleString()} {v.is_active && <span className="text-green-600 font-semibold ml-2">(активная)</span>}
                      </div>
                      {!v.is_active && (
                        <Button size="sm" onClick={() => handleActivateVersion(v.id)}>Активировать</Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Предпросмотр шаблона</h2>
              <div className="bg-muted rounded p-4 whitespace-pre-line font-mono">
                {template || 'Пусто'}
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
} 