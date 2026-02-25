import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = ['Загрузка файлов', 'Распознавание текста', 'Сохранение лекции'] as const;

interface AddLectureProgressModalProps {
  open: boolean;
  progressStep: number;
  onCancel: () => void;
}

export function AddLectureProgressModal({ open, progressStep, onCancel }: AddLectureProgressModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  useEffect(() => {
    if (!open && visible) {
      const overlay = overlayRef.current;
      const card = cardRef.current;
      if (overlay && card) {
        const tl = gsap.timeline();
        tl.to(card, { scale: 0.95, opacity: 0, duration: 0.2, ease: 'power2.in' });
        tl.to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1');
        tl.call(() => setVisible(false), [], 0.25);
      } else {
        setVisible(false);
      }
    }
  }, [open, visible]);

  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const card = cardRef.current;
    const lineFill = lineFillRef.current;
    if (!overlay || !card) return;
    gsap.set(overlay, { opacity: 0 });
    gsap.set(card, { scale: 0.85, opacity: 0 });
    if (lineFill) gsap.set(lineFill, { scaleX: progressStep / 3 });
    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    tl.to(card, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }, '-=0.15');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const lineFill = lineFillRef.current;
    if (lineFill) gsap.to(lineFill, { scaleX: progressStep / 3, duration: 0.5, ease: 'power2.out', transformOrigin: 'left' });
    if (progressStep <= prevStepRef.current) return;
    const completedStepIndex = progressStep - 2;
    if (completedStepIndex < 0) {
      prevStepRef.current = progressStep;
      return;
    }
    const el = stepRefs.current[completedStepIndex];
    if (el) {
      const circle = el.querySelector('[data-step-circle]');
      const number = el.querySelector('[data-step-number]');
      const check = el.querySelector('[data-step-check]');
      if (circle && number && check) {
        gsap.set(check, { scale: 0, opacity: 0 });
        gsap.to(circle, { scale: 1.15, duration: 0.2, ease: 'power2.out' });
        gsap.to(circle, { scale: 1, duration: 0.3, ease: 'back.out(2)', delay: 0.1 });
        gsap.to(number, { scale: 0, opacity: 0, duration: 0.15 });
        gsap.to(check, { scale: 1, opacity: 1, duration: 0.35, delay: 0.1, ease: 'back.out(2)' });
      }
    }
    prevStepRef.current = progressStep;
  }, [open, progressStep]);

  useEffect(() => {
    if (!open) prevStepRef.current = 0;
  }, [open]);

  if (!visible) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2, 44, 34, 0.75)', backdropFilter: 'blur(8px)' }}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-surface/95 shadow-2xl"
        style={{ boxShadow: '0 25px 80px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' }}
      >
        <div className="p-8">
          <div className="mb-2 flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-lime" />
            <h3 className="font-heading text-xl text-violet">Распознаём лекцию</h3>
          </div>
          <p className="mb-8 font-body text-sm text-violet/70">
            Это может занять до 30 секунд. Не закрывайте страницу.
          </p>

          <div className="relative">
            {/* Progress line background */}
            <div className="absolute left-0 right-0 top-5 h-0.5 -translate-y-1/2 bg-violet/20" style={{ width: 'calc(100% - 4rem)', marginLeft: '2rem' }} />
            <div
              ref={lineFillRef}
              className="absolute left-0 top-5 h-0.5 -translate-y-1/2 rounded-full bg-lime"
              style={{ width: 'calc(100% - 4rem)', marginLeft: '2rem', transformOrigin: 'left' }}
            />

            <ul className="relative flex justify-between">
              {STEPS.map((label, i) => {
                const completed = progressStep > i + 1;
                const active = progressStep === i + 1;
                return (
                  <li
                    key={label}
                    ref={(r) => { stepRefs.current[i] = r; }}
                    className="flex flex-col items-center"
                    style={{ width: '4rem' }}
                  >
                    <div
                      data-step-circle
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                        completed ? 'border-lime bg-lime' : active ? 'border-lime bg-lime/30 step-active-breathe' : 'border-violet/30 bg-violet/10'
                      }`}
                    >
                      {completed ? (
                        <Check data-step-check className="h-5 w-5 text-violet" strokeWidth={3} />
                      ) : (
                        <span data-step-number className="font-heading text-sm text-violet/80">
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <p className={`mt-3 text-center font-body text-xs ${completed || active ? 'text-violet' : 'text-violet/50'}`}>
                      {label}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-violet/30 bg-surface/80 px-6 py-2.5 font-body text-violet shadow-lg transition-transform hover:scale-[1.02] hover:bg-violet/10 active:scale-[0.98]"
              onClick={onCancel}
            >
              Отменить загрузку
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
