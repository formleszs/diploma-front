import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Layers, HelpCircle, Sparkles, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

type DemoStage = 'idle' | 'processing' | 'summary' | 'flashcards' | 'complete';

const MOCK_FLASHCARDS = [
  { q: 'Что такое интервальное повторение?', a: 'Метод запоминания с повторением материала через растущие интервалы времени.' },
  { q: 'Кривая забывания Эббингауза показывает:', a: 'Быструю потерю информации в первые часы и дни без повторения.' },
  { q: 'Оптимальный момент для повторения — когда?', a: 'Когда материал близок к моменту забывания (just-in-time review).' },
];

const MOCK_QUIZ = [
  { question: 'Какой эффект даёт увеличение интервалов между повторениями?', options: ['Ухудшение запоминания', 'Улучшение долговременного удержания', 'Нет влияния'], correct: 1 },
  { question: 'Кто ввёл понятие кривой забывания?', options: ['Павлов', 'Эббингауз', 'Выготский'], correct: 1 },
];

const CARDS_META = [
  { key: 'summary', icon: FileText, label: 'Summary', accentColor: 'rgba(52,211,153,0.16)' },
  { key: 'flashcards', icon: Layers, label: 'Flashcards', accentColor: 'rgba(74,222,128,0.14)' },
  { key: 'quiz', icon: HelpCircle, label: 'Quiz', accentColor: 'rgba(134,239,172,0.12)' },
] as const;

const BREATHE = [
  'card-idle-breathe',
  'card-idle-breathe card-idle-breathe-delay-1',
  'card-idle-breathe card-idle-breathe-delay-2',
];

const SOFT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function DemoPipeline() {
  const { t } = useLanguage();
  const [stage, setStage] = useState<DemoStage>('idle');
  const [sliderUnits, setSliderUnits] = useState(0);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [shimmerActive, setShimmerActive] = useState<number[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);
  const sliderRafRef = useRef<number | null>(null);
  const revealStateRef = useRef({ summary: false, flashcards: false, complete: false });

  const startSequence = useCallback(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    setSliderUnits(0);
    setStage('processing');
    setRevealedCards([]);
    setShimmerActive([]);
    revealStateRef.current = { summary: false, flashcards: false, complete: false };

    const ANIM_DELAY = 260;
    const ANIM_DURATION = 3600;
    const startTime = performance.now() + ANIM_DELAY;
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const linear = Math.min(elapsed / ANIM_DURATION, 1);
      // Uniform slider speed for 1->2 and 2->3 segments
      setSliderUnits(linear * 2);
      if (linear < 1) {
        sliderRafRef.current = requestAnimationFrame(tick);
      }
    };
    sliderRafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) startSequence(); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (sliderRafRef.current) cancelAnimationFrame(sliderRafRef.current);
    };
  }, [startSequence]);

  const allRevealed = stage === 'complete';
  const stageUnits = Math.max(0, Math.min(2, sliderUnits));
  const seg1Progress = Math.max(0, Math.min(1, stageUnits));
  const seg2Progress = Math.max(0, Math.min(1, stageUnits - 1));

  const NODE_1 = 16.666;
  const NODE_2 = 50;
  const NODE_3 = 83.333;
  const NODE_R_PX = 14;
  const DOT_POS = stageUnits <= 1
    ? NODE_1 + (NODE_2 - NODE_1) * stageUnits
    : NODE_2 + (NODE_3 - NODE_2) * Math.min(1, stageUnits - 1);
  const dotVisible = stageUnits > 0 && stageUnits < 1.995;

  useEffect(() => {
    if (!revealStateRef.current.summary && stageUnits > 0.01) {
      revealStateRef.current.summary = true;
      setStage('summary');
      setRevealedCards([0]);
      setShimmerActive([0]);
      setTimeout(() => setShimmerActive([]), 1400);
    }

    if (!revealStateRef.current.flashcards && stageUnits >= 1) {
      revealStateRef.current.flashcards = true;
      setStage('flashcards');
      setRevealedCards([0, 1]);
      setShimmerActive([1]);
      setTimeout(() => setShimmerActive([]), 1400);
    }

    if (!revealStateRef.current.complete && stageUnits >= 2) {
      revealStateRef.current.complete = true;
      setStage('complete');
      setRevealedCards([0, 1, 2]);
      setShimmerActive([2]);
      setTimeout(() => setShimmerActive([]), 1400);
    }
  }, [stageUnits]);

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      <div className="relative mb-10 h-[74px]">
        {/* Rails: right edge -> left edge, without piercing circles */}
        <div
          className="absolute top-[14px] h-px bg-white/12"
          style={{ left: `calc(${NODE_1}% + ${NODE_R_PX}px)`, width: `calc(${NODE_2 - NODE_1}% - ${NODE_R_PX * 2}px)` }}
        />
        <div
          className="absolute top-[14px] h-px bg-white/12"
          style={{ left: `calc(${NODE_2}% + ${NODE_R_PX}px)`, width: `calc(${NODE_3 - NODE_2}% - ${NODE_R_PX * 2}px)` }}
        />

        <div
          className="absolute top-[14px] h-px bg-gradient-to-r from-lime/75 via-lime/55 to-lime/70 transition-[width] duration-[140ms] ease-linear"
          style={{
            left: `calc(${NODE_1}% + ${NODE_R_PX}px)`,
            width: `calc((${NODE_2 - NODE_1}% - ${NODE_R_PX * 2}px) * ${seg1Progress})`,
          }}
        />
        <div
          className="absolute top-[14px] h-px bg-gradient-to-r from-lime/75 via-lime/55 to-lime/70 transition-[width] duration-[140ms] ease-linear"
          style={{
            left: `calc(${NODE_2}% + ${NODE_R_PX}px)`,
            width: `calc((${NODE_3 - NODE_2}% - ${NODE_R_PX * 2}px) * ${seg2Progress})`,
          }}
        />
        <div
          className="absolute top-[14px] w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/85 shadow-[0_0_20px_rgba(74,222,128,0.45)] transition-[left,opacity] duration-[140ms] ease-linear"
          style={{ left: `${DOT_POS}%`, opacity: dotVisible ? 1 : 0 }}
        />

        {['Summary', 'Flashcards', 'Test'].map((label, idx) => {
          const current =
            (stage === 'processing' || stage === 'summary') ? idx === 0 :
            stage === 'flashcards' ? idx === 1 :
            stage === 'complete' ? idx === 2 : false;
          const active =
            stage !== 'idle' && (idx === 0 || (idx === 1 && stageUnits >= 1) || (idx === 2 && stageUnits >= 2));
          const left = idx === 0 ? NODE_1 : idx === 1 ? NODE_2 : NODE_3;
          return (
            <div key={label} className="absolute -translate-x-1/2 w-[116px] flex flex-col items-center" style={{ left: `${left}%`, top: 0 }}>
              <div className={cn(
                'w-7 h-7 rounded-full border flex items-center justify-center mb-4 transition-colors duration-500 bg-[#0d2518]',
                active ? 'bg-lime/25 border-lime/60 shadow-[0_0_20px_rgba(74,222,128,0.4)]' : 'bg-white/[0.03] border-white/20'
              )}>
                <span className={cn('font-label text-[10px] transition-colors duration-500', active ? 'text-lime/95' : 'text-white/35')}>{idx + 1}</span>
              </div>
              <span className={cn('block w-full text-center font-label text-[10px] uppercase tracking-[0.13em] transition-colors duration-500', current || active ? 'text-white/72' : 'text-white/35')}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Processing indicator */}
      <AnimatePresence>
        {stage === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.55, ease: PREMIUM_EASE } }}
            transition={{ duration: 0.75, ease: PREMIUM_EASE }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full bg-lime/20 soft-pulse" />
              <div className="relative w-6 h-6 rounded-full bg-lime/40 flex items-center justify-center">
                <Sparkles size={12} className="text-violet" />
              </div>
            </div>
            <span className="font-label text-[11px] uppercase tracking-[0.16em] text-white/45">{t.demo.analyzing}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: PREMIUM_EASE, delay: 0.1 }}
        className="text-center mb-8"
      >
        <span className="font-label text-[10px] uppercase tracking-[0.18em] text-lime/50">{t.demo.stage3Label}</span>
      </motion.div>

      {/* Result cards with inline content */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 relative">
        {CARDS_META.map((card, i) => {
          const isRevealed = revealedCards.includes(i);
          const hasShimmer = shimmerActive.includes(i);
          const Icon = card.icon;

          const titles = [t.demo.summaryTitle, t.demo.flashcardsTitle, t.demo.quizTitle];
          const descs = [t.demo.summaryDesc, t.demo.flashcardsDesc, t.demo.quizUnlockedDesc];

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0.4, y: 10, scale: 0.99 }}
              animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.52, y: 0, scale: 0.995 }}
              transition={{ duration: isRevealed ? 0.95 : 0.65, ease: PREMIUM_EASE }}
              className={cn(
                'group relative rounded-2xl border p-6 lg:p-7 flex flex-col',
                isRevealed
                  ? 'bg-white/[0.05] border-white/[0.08] result-card-glow'
                  : 'bg-white/[0.025] border-white/[0.07]',
                hasShimmer && 'shimmer-reveal active',
                allRevealed && !hasShimmer && BREATHE[i]
              )}
            >
              {isRevealed && (
                <div
                  className="absolute -inset-[1px] rounded-2xl pointer-events-none"
                  style={{ boxShadow: `0 0 26px -8px ${card.accentColor}` }}
                />
              )}
              {/* Accent top line */}
              <div className={cn(
                'absolute inset-x-0 top-0 h-[2px] rounded-t-2xl transition-opacity duration-1000',
                isRevealed ? 'opacity-100' : 'opacity-0'
              )} style={{ background: `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)` }} />

              {isRevealed && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.025] to-transparent" />
                </div>
              )}

              {/* Header */}
              <div className="relative flex items-center gap-3 mb-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-500',
                  isRevealed ? 'border-lime/15 bg-lime/[0.07]' : 'bg-white/[0.04] border-white/[0.1]'
                )}>
                  <Icon size={18} className={cn('transition-colors duration-700', isRevealed ? 'text-lime' : 'text-white/35')} />
                </div>
                <div>
                  <span className={cn('font-label text-[9px] uppercase tracking-[0.16em] block transition-colors duration-700', isRevealed ? 'text-lime/40' : 'text-white/35')}>{card.label}</span>
                  <h3 className={cn('font-heading text-[15px] font-semibold transition-colors duration-700', isRevealed ? 'text-white' : 'text-white/45')}>{titles[i]}</h3>
                </div>
              </div>

              <p className={cn('font-body text-[12px] leading-[1.6] mb-4 transition-colors duration-700', isRevealed ? 'text-white/45' : 'text-white/28')}>{descs[i]}</p>

              {/* Inline content preview */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.75, ease: PREMIUM_EASE, delay: 0.18 }}
                    className="overflow-hidden flex-1"
                  >
                    {i === 0 && <SummaryPreview text={t.demo.summaryExampleText} />}
                    {i === 1 && <FlashcardPreview cards={MOCK_FLASHCARDS} flippedCard={flippedCard} setFlippedCard={setFlippedCard} />}
                    {i === 2 && <QuizPreview quiz={MOCK_QUIZ} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} t={t} />}
                  </motion.div>
                )}
              </AnimatePresence>
              {!isRevealed && (
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0.58 }}
                  transition={{ duration: 0.7, ease: SOFT_EASE }}
                  className="flex-1"
                >
                  <PlaceholderPreview />
                </motion.div>
              )}
            </motion.div>
          );
        })}
        </div>
      </div>

      {/* Waiting state */}
      <AnimatePresence>
        {stage === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.7 }}
            className="text-center pt-12"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-white/[0.03] border border-white/[0.05] px-5 py-3">
              <div className="w-2 h-2 rounded-full bg-lime/30 soft-pulse" />
              <span className="font-body text-[13px] text-white/35">{t.demo.subtitle}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlaceholderPreview() {
  return (
    <div className="rounded-xl bg-white/[0.025] border border-white/[0.08] p-4 space-y-2.5">
      <div className="h-2 rounded bg-white/[0.12] w-[88%]" />
      <div className="h-2 rounded bg-white/[0.08] w-full" />
      <div className="h-2 rounded bg-white/[0.08] w-[80%]" />
      <div className="pt-2">
        <div className="h-7 rounded-lg bg-white/[0.04] border border-white/[0.08]" />
      </div>
    </div>
  );
}

/* ——— Inline preview components ——— */

function SummaryPreview({ text }: { text: string }) {
  const preview = text.slice(0, 220);
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
      <p className="font-body text-[12px] leading-[1.7] text-white/60">
        {preview}…
      </p>
    </div>
  );
}

function FlashcardPreview({
  cards,
  flippedCard,
  setFlippedCard,
}: {
  cards: typeof MOCK_FLASHCARDS;
  flippedCard: number | null;
  setFlippedCard: (v: number | null) => void;
}) {
  return (
    <div className="space-y-2.5">
      {cards.slice(0, 2).map((card, idx) => {
        const isFlipped = flippedCard === idx;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => setFlippedCard(isFlipped ? null : idx)}
            className="w-full text-left rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5 hover:bg-white/[0.05] transition-colors duration-300"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-body text-[12px] leading-[1.6] text-white/65 flex-1">{card.q}</p>
              <ChevronDown
                size={14}
                className={cn(
                  'text-white/25 mt-0.5 shrink-0 transition-transform duration-300',
                  isFlipped && 'rotate-180 text-lime/50'
                )}
              />
            </div>
            <AnimatePresence>
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2.5 pt-2.5 border-t border-lime/10">
                    <p className="font-body text-[11px] leading-[1.65] text-lime/60">{card.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}

function QuizPreview({
  quiz,
  selectedAnswers,
  setSelectedAnswers,
  t,
}: {
  quiz: typeof MOCK_QUIZ;
  selectedAnswers: Record<number, number>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  t: ReturnType<typeof useLanguage>['t'];
}) {
  const item = quiz[0];
  const selected = selectedAnswers[0];
  const showResult = selected !== undefined;

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
      <p className="font-heading text-[12px] font-semibold text-white/80 mb-3 leading-[1.5]">{item.question}</p>
      <div className="space-y-1.5">
        {item.options.map((opt, oIdx) => (
          <button
            key={oIdx}
            type="button"
            disabled={showResult}
            onClick={() => setSelectedAnswers(prev => ({ ...prev, 0: oIdx }))}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg font-body text-[11px] transition-colors duration-200',
              !showResult && 'bg-white/[0.03] border border-white/[0.06] text-white/65 hover:bg-white/[0.07] hover:border-white/12',
              showResult && oIdx === item.correct && 'bg-lime/12 border border-lime/25 text-white/90',
              showResult && selected === oIdx && oIdx !== item.correct && 'bg-red-500/12 border border-red-500/20 text-white/70',
              showResult && oIdx !== item.correct && oIdx !== selected && 'bg-white/[0.02] border border-white/[0.04] text-white/30'
            )}
          >
            {opt}
            {showResult && oIdx === item.correct && <span className="ml-1.5 text-lime text-[10px]">{t.demo.quizCorrect}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
