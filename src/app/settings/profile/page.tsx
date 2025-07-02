'use client';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useProfileQuery } from '../../../hooks/useProfileQuery';
import { Button } from '../../../components/ui/button';
import { useState, useEffect } from 'react';
import LogoutButton from '../../../components/LogoutButton';

export default function ProfilePage() {
  const { data, isLoading, error, refetch } = useProfileQuery();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('');
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setFullName(data.full_name || '');
      setEmail(data.email || '');
      setLanguage(data.language || '');
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setErrMsg(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ full_name: fullName, email, language }),
      });
      if (!res.ok) throw new Error('Ошибка сохранения');
      await res.json();
      setSuccess(true);
      refetch();
    } catch (e: any) {
      setErrMsg(e.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-8 max-w-lg mx-auto space-y-8">
        <h1 className="text-2xl font-bold mb-4">Профиль</h1>
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки профиля</div>}
        {errMsg && <div className="text-red-500 text-sm">{errMsg}</div>}
        {success && <div className="text-green-600 text-sm">Сохранено!</div>}
        {data && (
          <div className="space-y-4">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Имя"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Язык (ru, en)"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</Button>
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 