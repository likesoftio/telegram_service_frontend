'use client';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { usePromptsQuery } from '../../../../hooks/usePromptsQuery';
import { Button } from '../../../../components/ui/button';
import { useState } from 'react';
import { CreatePromptDialog } from './CreatePromptDialog';

export default function PromptsPage() {
  const params = useParams();
  const router = useRouter();
  const subprojectId = Number(params.id);
  const { data, isLoading, error } = usePromptsQuery(subprojectId);
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Промпты</h1>
          <Button onClick={() => setOpen(true)}>Создать промпт</Button>
        </div>
        <CreatePromptDialog open={open} onClose={() => setOpen(false)} subprojectId={subprojectId} />
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки промптов</div>}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((prompt) => (
              <div key={prompt.id} className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="font-semibold text-lg mb-2">{prompt.name}</div>
                <div className="text-muted-foreground mb-4 whitespace-pre-line">{prompt.template}</div>
                <Button size="sm" variant="outline" onClick={() => router.push(`/prompts/${prompt.id}`)}>
                  Открыть
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 