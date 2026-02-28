import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Loader2, FileText, Layers, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  apiGetLecture,
  apiPostLectureSummary,
  apiPostLectureFlashcards,
  apiGetLectureQuiz,
} from '@/api/lectures';
import type { LectureDto } from '@/api/lectures';

export function LecturePage() {
  const { projectId, lectureId } = useParams<{ projectId: string; lectureId: string }>();
  const [lecture, setLecture] = useState<LectureDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [flashcardsMessage, setFlashcardsMessage] = useState<string | null>(null);
  const [quizLocked, setQuizLocked] = useState<boolean>(true);

  const fetchLecture = useCallback(() => {
    if (!lectureId) return Promise.reject();
    return apiGetLecture(lectureId).then(setLecture);
  }, [lectureId]);

  useEffect(() => {
    if (!lectureId) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    fetchLecture()
      .then(() => setNotFound(false))
      .catch(() => {
        setLecture(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [lectureId, fetchLecture]);

  useEffect(() => {
    if (!lectureId) return;
    apiGetLectureQuiz(lectureId)
      .then((res) => setQuizLocked(res.locked ?? true))
      .catch(() => setQuizLocked(true));
  }, [lectureId]);

  const handleSummary = async () => {
    if (!lectureId) return;
    setSummaryLoading(true);
    setSummaryText(null);
    try {
      const res = await apiPostLectureSummary(lectureId);
      setSummaryText(res.summary ?? 'Саммари пока недоступно.');
    } catch {
      setSummaryText('Не удалось загрузить саммари.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleFlashcards = async () => {
    if (!lectureId) return;
    setFlashcardsMessage(null);
    try {
      await apiPostLectureFlashcards(lectureId);
      setFlashcardsMessage('Карточки пока в разработке (заглушка).');
    } catch {
      setFlashcardsMessage('Ошибка запроса.');
    }
  };

  const handleQuiz = () => {
    if (!lectureId || quizLocked) return;
    // TODO: открыть страницу/модал квиза, когда будет разблокирован
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={48} className="animate-spin text-lime" />
        <p className="mt-4 font-body text-sm text-white/70">Загрузка…</p>
      </div>
    );
  }

  if (notFound || !lecture) {
    return (
      <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(160deg,rgba(14,43,28,0.94)_0%,rgba(8,30,20,0.94)_100%)] p-8 text-center">
        <p className="font-body text-white/85">Лекция не найдена.</p>
        <Button asChild className="mt-4 rounded-xl bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet hover:brightness-95 border border-lime/50">
          <Link to={projectId ? `/app/projects/${projectId}` : '/app'}>Назад</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
          <Link to={projectId ? `/app/projects/${projectId}` : '/app'}>
            <ArrowRight size={20} className="rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl text-white lg:text-3xl">{lecture.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] p-6 backdrop-blur-[2px]">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-lime" />
            <span className="font-label text-xs uppercase text-lime/65">Summary</span>
          </div>
          <p className="mt-2 font-body text-sm text-white/65">Краткое резюме по лекции</p>
          <Button
            type="button"
            className="mt-4 w-full rounded-xl bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet hover:brightness-95 border border-lime/50"
            onClick={handleSummary}
            disabled={summaryLoading}
          >
            {summaryLoading ? 'Загрузка…' : 'Получить саммари'}
          </Button>
          {summaryText !== null && (
            <div className="mt-4 rounded-xl border border-white/12 bg-white/[0.03] p-4">
              <pre className="whitespace-pre-wrap break-words font-body text-sm text-white/80">{summaryText}</pre>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] p-6 backdrop-blur-[2px]">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-lime" />
            <span className="font-label text-xs uppercase text-lime/65">Flashcards</span>
          </div>
          <p className="mt-2 font-body text-sm text-white/65">Карточки для запоминания</p>
          <Button
            type="button"
            className="mt-4 w-full rounded-xl bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet hover:brightness-95 border border-lime/50"
            onClick={handleFlashcards}
          >
            Сгенерировать карточки
          </Button>
          {flashcardsMessage && <p className="mt-4 font-body text-sm text-white/68">{flashcardsMessage}</p>}
        </div>

        <div
          className={`rounded-[28px] border border-white/12 p-6 transition-colors ${
            quizLocked
              ? 'cursor-not-allowed bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] opacity-90'
              : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)]'
          }`}
        >
          {quizLocked ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="block">
                  <div className="flex items-center gap-2 text-white/38">
                    <HelpCircle size={20} className="text-white/28" />
                    <span className="font-label text-xs uppercase">Quiz</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-white/45">Проверка знаний</p>
                  <div className="mt-4 flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] py-3 font-body text-sm text-white/45">
                    Открыть квиз
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[260px] border border-white/20 bg-violet-dark px-4 py-2.5 text-center text-sm text-white">
                Сначала вы должны изучить все карточки!
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-lime" />
                <span className="font-label text-xs uppercase text-lime/65">Quiz</span>
              </div>
              <p className="mt-2 font-body text-sm text-white/65">Проверка знаний</p>
              <Button
                type="button"
                className="mt-4 w-full rounded-xl bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet hover:brightness-95 border border-lime/50"
                onClick={handleQuiz}
              >
                Открыть квиз
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
