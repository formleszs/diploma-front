import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjectById, getCardSetByTheme } from '@/data/mock';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : null;
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(project?.themes[0]?.id ?? null);

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

  const selectedTheme = selectedThemeId ? project.themes.find((t) => t.id === selectedThemeId) : null;
  const cardSet = selectedThemeId ? getCardSetByTheme(project.id, selectedThemeId) : null;
  const allCardsStudied = cardSet ? cardSet.cards.every((c) => c.status === 'studied') : false;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
          <Link to="/app">
            <ArrowRight size={20} className="rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl text-white lg:text-3xl">{project.name}</h1>
          <p className="mt-1 font-body text-sm text-white/70">Рабочее пространство проекта</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Темы */}
        <div className="rounded-[28px] border border-white/10 bg-surface p-6 lg:col-span-1">
          <h2 className="font-heading text-lg text-violet">Темы</h2>
          <p className="mt-1 font-body text-sm text-violet/70">Выберите тему для работы</p>
          <ul className="mt-4 space-y-2">
            {project.themes.map((theme) => (
              <li key={theme.id}>
                <button
                  type="button"
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`w-full rounded-xl px-4 py-3 text-left font-body text-sm transition-colors ${
                    selectedThemeId === theme.id ? 'bg-lime/20 text-violet' : 'bg-violet/5 text-violet hover:bg-violet/10'
                  }`}
                >
                  {theme.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Действия */}
        <div className="lg:col-span-2">
          <div className="rounded-[28px] border border-white/10 bg-surface p-6">
            <h2 className="font-heading text-lg text-violet">Действия</h2>
            {selectedTheme ? (
              <>
                <p className="mt-1 font-body text-sm text-violet/70">Для темы: {selectedTheme.title}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-violet/10 bg-violet/5 p-4">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-lime" />
                      <span className="font-label text-xs uppercase text-violet/80">Саммари</span>
                    </div>
                    <p className="mt-2 font-body text-sm text-violet">Краткое резюме по теме</p>
                  </div>
                  <div className="rounded-xl border border-violet/10 bg-violet/5 p-4">
                    <div className="flex items-center gap-2">
                      <Layers size={20} className="text-lime" />
                      <span className="font-label text-xs uppercase text-violet/80">Карточки</span>
                    </div>
                    <p className="mt-2 font-body text-sm text-violet">Карточки для повторения</p>
                    {cardSet && (
                      <Button asChild className="mt-3 w-full rounded-lg bg-lime text-violet hover:bg-lime-dark">
                        <Link to={`/app/projects/${projectId}/cards?theme=${selectedThemeId}`}>
                          Открыть карточки
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="rounded-xl border border-violet/10 bg-violet/5 p-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle size={20} className="text-lime" />
                      <span className="font-label text-xs uppercase text-violet/80">Тест</span>
                    </div>
                    <p className="mt-2 font-body text-sm text-violet">Проверка знаний</p>
                    {allCardsStudied && (
                      <Button asChild className="mt-3 w-full rounded-lg bg-lime text-violet hover:bg-lime-dark">
                        <Link to={`/app/projects/${projectId}/test?theme=${selectedThemeId}`}>
                          Пройти тест
                        </Link>
                      </Button>
                    )}
                    {!allCardsStudied && cardSet && (
                      <p className="mt-3 font-body text-xs text-violet/60">Сначала изучите все карточки</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-4 font-body text-violet/70">Выберите тему слева</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
