'use client';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { useSubprojectsQuery } from '../../../../hooks/useSubprojectsQuery';
import { Button } from '../../../../components/ui/button';
import { useState } from 'react';
import { CreateSubprojectDialog } from './CreateSubprojectDialog';

export default function SubprojectsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);
  const { data, isLoading, error } = useSubprojectsQuery(projectId);
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Подпроекты</h1>
          <Button onClick={() => setOpen(true)}>Создать подпроект</Button>
        </div>
        <CreateSubprojectDialog open={open} onClose={() => setOpen(false)} projectId={projectId} />
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки подпроектов</div>}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((sub) => (
              <div key={sub.id} className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="font-semibold text-lg mb-2">{sub.name}</div>
                <div className="text-muted-foreground mb-4">{sub.description}</div>
                <Button size="sm" variant="outline" onClick={() => router.push(`/subprojects/${sub.id}/prompts`)}>
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