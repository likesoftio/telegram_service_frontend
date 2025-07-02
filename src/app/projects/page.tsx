'use client';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useProjectsQuery } from '../../hooks/useProjectsQuery';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { CreateProjectDialog } from './CreateProjectDialog';

export default function ProjectsPage() {
  const { data, isLoading, error } = useProjectsQuery();
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Проекты</h1>
          <Button onClick={() => setOpen(true)}>Создать проект</Button>
        </div>
        <CreateProjectDialog open={open} onClose={() => setOpen(false)} />
        {isLoading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">Ошибка загрузки проектов</div>}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((project) => (
              <div key={project.id} className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="font-semibold text-lg mb-2">{project.name}</div>
                <div className="text-muted-foreground mb-4">{project.description}</div>
                <Button size="sm" variant="outline" onClick={() => window.location.href = `/projects/${project.id}/subprojects`}>
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