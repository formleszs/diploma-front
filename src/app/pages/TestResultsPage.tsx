import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjectById } from '@/data/mock';

export function TestResultsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const score = Number(searchParams.get('score')) || 0;
  const total = Number(searchParams.get('total')) || 1;
  const project = projectId ? getProjectById(projectId) : null;

  const percent = Math.round((score / total) * 100);

  if (!project) {
    return (
      <div className="rounded-[28px] bg-surface p-8 text-center">
        <p className="font-body text-violet">Проект не найден.</p>
        <Button asChild className="mt-4 rounded-xl bg-lime text-violet">
          <Link to="/app">На главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
          <Link to={`/app/projects/${projectId}`}>
            <RotateCw size={20} />
          </Link>
        </Button>
        <h1 className="font-heading text-2xl text-white">Результаты теста</h1>
      </div>

      <div className="mx-auto max-w-xl space-y-6 rounded-[28px] border border-white/10 bg-surface p-8">
        <div className="flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime/20">
            <span className="font-heading text-3xl text-lime">{percent}%</span>
          </div>
          <p className="mt-4 font-body text-violet">
            Правильно: {score} из {total}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-violet/5 px-3 py-2">
            <CheckCircle size={18} className="text-lime" />
            <span className="font-body text-sm text-violet">Правильных: {score}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-violet/5 px-3 py-2">
            <XCircle size={18} className="text-red-400" />
            <span className="font-body text-sm text-violet">Ошибок: {total - score}</span>
          </div>
        </div>
        <p className="font-body text-sm text-violet/80">
          Рекомендуем повторить карточки по темам, где были ошибки.
        </p>
        <Button asChild className="w-full rounded-xl bg-lime text-violet hover:bg-lime-dark">
          <Link to={`/app/projects/${projectId}`}>Вернуться к проекту</Link>
        </Button>
      </div>
    </div>
  );
}
