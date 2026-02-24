import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FolderOpen, Loader2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { apiGetProjects, apiDeleteProject } from '@/api/projects';
import type { ProjectDto } from '@/api/projects';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function DashboardPage() {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(() => {
    return apiGetProjects()
      .then((list) => {
        setProjects(list);
        setError(null);
      })
      .catch(() => {
        setError('Не удалось загрузить список проектов');
      });
  }, []);

  useEffect(() => {
    fetchProjects().finally(() => setLoading(false));
  }, [fetchProjects]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirm) return;
    setDeleting(true);
    apiDeleteProject(deleteConfirm.id)
      .then(() => fetchProjects())
      .finally(() => {
        setDeleteConfirm(null);
        setDeleting(false);
      });
  }, [deleteConfirm, fetchProjects]);

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

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-surface/10 py-20">
          <Loader2 size={48} className="animate-spin text-lime" />
          <p className="mt-4 font-body text-sm text-white/70">Загрузка проектов…</p>
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-white/10 bg-surface/10 p-8 text-center">
          <p className="font-body text-white/90">{error}</p>
        </div>
      ) : projects.length === 0 ? (
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
              <div className="relative rounded-[28px] border border-violet/20 bg-surface p-6 transition-all hover:border-lime/30 hover:shadow-lg">
                <Link to={`/app/projects/${project.id}`} className="block pr-12">
                  <h3 className="font-heading text-lg text-violet truncate">{project.name}</h3>
                  <p className="mt-2 font-body text-sm text-violet/60">{formatDate(project.createdAt)}</p>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-0 right-0 h-11 w-11 shrink-0 rounded-tr-[28px] rounded-bl-lg text-violet/70 hover:bg-white/10 hover:text-violet"
                      aria-label="Меню проекта"
                    >
                      <MoreVertical size={24} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={4}
                    className="min-w-[11rem] rounded-xl border border-white/20 bg-surface/60 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl data-[side=bottom]:translate-y-0"
                  >
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer rounded-lg border-none bg-transparent px-4 py-2.5 text-violet outline-none focus:bg-violet/10 focus:text-violet focus:outline-none focus:ring-0 focus-visible:ring-0 data-[variant=destructive]:text-red-400"
                    >
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e) => {
                        e.preventDefault();
                        setDeleteConfirm({ id: project.id, name: project.name });
                      }}
                      className="cursor-pointer rounded-lg border-none bg-transparent px-4 py-2.5 text-red-500 outline-none focus:bg-red-500/15 focus:text-red-600 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    >
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm
                ? `Вы точно хотите удалить проект «${deleteConfirm.name}»? Восстановить данные будет невозможно.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Удаление…' : 'Продолжить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
