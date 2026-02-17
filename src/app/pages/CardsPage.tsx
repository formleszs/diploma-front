import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjectById, getCardSetByTheme } from '@/data/mock';

export function CardsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const themeId = searchParams.get('theme');
  const project = projectId ? getProjectById(projectId) : null;
  const cardSet = projectId && themeId ? getCardSetByTheme(projectId, themeId) : null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());

  if (!project || !cardSet) {
    return (
      <div className="rounded-[28px] bg-surface p-8 text-center">
        <p className="font-body text-violet">Карточки не найдены.</p>
        <Button asChild className="mt-4 rounded-xl bg-lime text-violet">
          <Link to={`/app/projects/${projectId}`}>К проекту</Link>
        </Button>
      </div>
    );
  }

  const cards = cardSet.cards;
  const current = cards[currentIndex];
  const markStudied = () => {
    if (current) setStudiedIds((prev) => new Set(prev).add(current.id));
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
          <Link to={`/app/projects/${projectId}`}>
            <ChevronLeft size={20} />
          </Link>
        </Button>
        <h1 className="font-heading text-xl text-white">Карточки</h1>
        <div className="w-10" />
      </div>

      <div className="mx-auto max-w-lg">
        <div className="flex justify-between font-body text-sm text-white/70">
          <span>{currentIndex + 1} / {cards.length}</span>
          <span>Изучено: {studiedIds.size}</span>
        </div>
        {current && (
          <button
            type="button"
            onClick={() => setIsFlipped((f) => !f)}
            className="mt-4 flex min-h-[320px] w-full flex-col items-center justify-center rounded-[28px] border border-white/10 bg-surface p-8 shadow-lg transition-all duration-300 hover:border-lime/20"
          >
            {!isFlipped ? (
              <>
                <span className="font-label text-xs uppercase text-lime">Вопрос</span>
                <p className="mt-4 text-center font-body text-lg text-violet">{current.front}</p>
                <div className="mt-6 flex items-center gap-2 text-violet/50">
                  <RotateCw size={16} />
                  <span className="font-body text-xs">Нажмите, чтобы перевернуть</span>
                </div>
              </>
            ) : (
              <>
                <span className="font-label text-xs uppercase text-violet">Ответ</span>
                <p className="mt-4 text-center font-body text-lg text-violet">{current.back}</p>
              </>
            )}
          </button>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-white/20 text-white hover:bg-white/10"
            disabled={currentIndex === 0}
            onClick={() => { setCurrentIndex((i) => i - 1); setIsFlipped(false); }}
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            className="rounded-xl bg-lime text-violet hover:bg-lime-dark"
            onClick={markStudied}
          >
            Изучено
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border-white/20 text-white hover:bg-white/10"
            disabled={currentIndex === cards.length - 1}
            onClick={() => { setCurrentIndex((i) => i + 1); setIsFlipped(false); }}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        {studiedIds.size === cards.length && cards.length > 0 && (
          <div className="mt-8 rounded-xl border border-lime/30 bg-lime/10 p-4 text-center">
            <p className="font-body text-violet">Вы изучили все карточки по этой теме.</p>
            <Button asChild className="mt-3 rounded-xl bg-lime text-violet hover:bg-lime-dark">
              <Link to={`/app/projects/${projectId}/test?theme=${themeId}`}>Пройти тест по изученному материалу</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
