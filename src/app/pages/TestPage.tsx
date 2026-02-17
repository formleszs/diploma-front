import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjectById, getTestByTheme } from '@/data/mock';

export function TestPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const themeId = searchParams.get('theme');
  const project = projectId ? getProjectById(projectId) : null;
  const test = themeId ? getTestByTheme(themeId) : null;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const navigate = useNavigate();

  if (!project || !test) {
    return (
      <div className="rounded-[28px] bg-surface p-8 text-center">
        <p className="font-body text-violet">Тест не найден.</p>
        <Button asChild className="mt-4 rounded-xl bg-lime text-violet">
          <Link to={`/app/projects/${projectId}`}>К проекту</Link>
        </Button>
      </div>
    );
  }

  const question = test.questions[currentQ];
  const isLast = currentQ === test.questions.length - 1;

  const handleAnswer = (optionIndex: number) => {
    const next = [...answers, optionIndex];
    setAnswers(next);
    if (isLast) {
      const correct = next.reduce((acc, a, i) => acc + (a === test.questions[i].correctIndex ? 1 : 0), 0);
      navigate(`/app/projects/${projectId}/test/results?theme=${themeId}&score=${correct}&total=${test.questions.length}`);
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
          <Link to={`/app/projects/${projectId}`}>
            <ChevronLeft size={20} />
          </Link>
        </Button>
        <h1 className="font-heading text-xl text-white">Тест</h1>
        <span className="font-body text-sm text-white/70">{currentQ + 1} / {test.questions.length}</span>
      </div>

      <div className="mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-surface p-8">
        <p className="font-body text-lg text-violet">{question.question}</p>
        <ul className="mt-6 space-y-3">
          {question.options.map((opt, i) => (
            <li key={i}>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start rounded-xl border-violet/20 py-4 text-violet hover:bg-violet/10"
                onClick={() => handleAnswer(i)}
              >
                {opt}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
