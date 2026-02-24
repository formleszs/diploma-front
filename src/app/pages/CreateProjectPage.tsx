import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiCreateProject } from '@/api/projects';

export function CreateProjectPage() {
  const [name, setName] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const project = await apiCreateProject(name.trim());
      navigate(`/app/projects/${project.id}`);
    } catch {
      setSubmitError('Не удалось создать проект. Проверьте подключение и повторите.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
            <Link to="/app">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="font-heading text-2xl text-white lg:text-3xl">Создать проект</h1>
            <p className="mt-1 font-body text-sm text-white/70">Название проекта</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" form="create-project-form" className="rounded-xl bg-lime px-6 text-violet hover:bg-lime-dark" disabled={!name.trim() || isSubmitting}>
            {isSubmitting ? 'Создание…' : 'Создать'}
          </Button>
          <Button type="button" variant="outline" asChild className="rounded-xl border-white/20 text-white hover:bg-white/10">
            <Link to="/app">Отмена</Link>
          </Button>
        </div>
      </div>

      <form id="create-project-form" onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-white/10 bg-surface px-8 py-12">
          <label className="mb-2 block font-label text-xs uppercase tracking-wider text-violet/80">Название проекта</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl border-violet/15 bg-violet/5 text-violet"
            required
          />
          {submitError && <p className="mt-4 font-body text-sm text-red-400">{submitError}</p>}
        </div>
      </form>
    </div>
  );
}
