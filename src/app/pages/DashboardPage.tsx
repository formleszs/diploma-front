import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
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
  const gridRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (loading || projects.length === 0) return;
    const cards = gridRef.current?.querySelectorAll('.dashboard-project-card');
    const header = headerRef.current;
    if (!cards?.length && !header) return;
    const tl = gsap.timeline({ defaults: { ease: [0.25, 0.1, 0.25, 1] } });
    if (header) {
      tl.fromTo(header, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
    }
    if (cards?.length) {
      tl.fromTo(cards, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, stagger: 0.07 }, '-=0.22');
    }
  }, [loading, projects.length]);

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
    <div className="space-y-10">
      <div ref={headerRef} className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white lg:text-3xl">Мои проекты</h1>
          <p className="mt-2 font-body text-[15px] text-white/75 leading-relaxed">Учебные материалы по дисциплинам</p>
        </div>
        <Button asChild className="btn-pill gap-2 bg-lime text-violet hover:bg-lime-dark hover:shadow-glow hover:-translate-y-0.5 transition-all">
          <Link to="/app/projects/new">
            <PlusCircle size={20} />
            Создать проект
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.04] border border-white/8 py-24">
          <Loader2 size={48} className="animate-spin text-lime" />
          <p className="mt-5 font-body text-[15px] text-white/75">Загрузка проектов…</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-10 text-center">
          <p className="font-body text-[15px] text-white/90 leading-relaxed">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.04] border border-white/8 py-24 text-center">
          <FolderOpen size={64} className="mb-5 text-white/35" />
          <h2 className="font-heading text-xl font-bold text-white">У вас пока нет проектов</h2>
          <p className="mt-3 max-w-md font-body text-[15px] text-white/75 leading-relaxed">
            Создайте проект и загрузите лекции для начала работы.
          </p>
          <Button asChild className="mt-8 gap-2 btn-pill bg-lime text-violet hover:bg-lime-dark hover:shadow-glow hover:-translate-y-0.5 transition-all">
            <Link to="/app/projects/new">
              <PlusCircle size={18} />
              Создать проект
            </Link>
          </Button>
        </div>
      ) : (
        <ul ref={gridRef} className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id} className="dashboard-project-card">
              <div className="relative rounded-2xl bg-white/[0.06] border border-white/10 p-7 transition-all duration-300 hover:bg-white/[0.09] hover:border-white/15 hover:-translate-y-1 hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.35)]">
                <Link to={`/app/projects/${project.id}`} className="block pr-12">
                  <h3 className="font-heading text-lg font-semibold text-white truncate">{project.name}</h3>
                  <p className="mt-2.5 font-body text-[14px] text-white/72">{formatDate(project.createdAt)}</p>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-0 right-0 h-11 w-11 shrink-0 rounded-tr-2xl rounded-bl-lg text-white/70 hover:bg-white/10 hover:text-white"
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
