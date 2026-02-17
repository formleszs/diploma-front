import { Link } from 'react-router-dom';
import { PlusCircle, FolderOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProjects } from '@/data/mock';

export function DashboardPage() {
  const projects = mockProjects;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-white lg:text-3xl">Мои проекты</h1>
          <p className="mt-1 font-body text-sm text-white/70">Учебные материалы по дисциплинам</p>
        </div>
        <Button asChild className="gap-2 rounded-xl bg-lime text-violet hover:bg-lime-dark">
          <Link to="/app/projects/new">
            <PlusCircle size={20} />
            Создать проект
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-surface/10 py-20 text-center">
          <FolderOpen size={64} className="mb-4 text-white/30" />
          <h2 className="font-heading text-xl text-white">У вас пока нет проектов</h2>
          <p className="mt-2 max-w-md font-body text-sm text-white/70">
            Создайте проект и загрузите лекции для начала работы.
          </p>
          <Button asChild className="mt-6 gap-2 rounded-xl bg-lime text-violet hover:bg-lime-dark">
            <Link to="/app/projects/new">
              <PlusCircle size={18} />
              Создать проект
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                to={project.status === 'ready' ? `/app/projects/${project.id}` : '#'}
                className={`block rounded-[28px] border p-6 transition-all ${
                  project.status === 'ready'
                    ? 'border-violet/20 bg-surface hover:border-lime/30 hover:shadow-lg'
                    : 'cursor-wait border-white/10 bg-surface/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-lg text-violet truncate">{project.name}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      {project.status === 'processing' ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-lime" />
                          <span className="font-body text-sm text-violet/70">Обработка</span>
                        </>
                      ) : (
                        <span className="font-body text-sm text-lime">Готов к работе</span>
                      )}
                    </div>
                  </div>
                </div>
                {project.status === 'ready' && (
                  <p className="mt-3 font-body text-xs text-violet/60">
                    Тем: {project.themes.length}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
