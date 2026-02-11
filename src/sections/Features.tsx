import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const { t } = useLanguage();
  const features = useMemo(
    () => [
      { title: t.features.smartSummaries, description: t.features.smartSummariesDesc, icon: FileText, detail: t.features.smartSummariesDetail },
      { title: t.features.autoFlashcards, description: t.features.autoFlashcardsDesc, icon: Layers, detail: t.features.autoFlashcardsDetail },
      { title: t.features.practiceQuiz, description: t.features.practiceQuizDesc, icon: HelpCircle, detail: t.features.practiceQuizDetail },
    ],
    [t]
  );
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        }
      });

      // Heading entrance (0% - 30%)
      scrollTl.fromTo(
        headingRef.current,
        { y: '-18vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      // Карточки: все три должны закончить вход к одному моменту, чтобы правая не «не доезжала»
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feature-card');
        const duration = 0.2;
        const starts = [0, 0.05, 0.1]; // все приходят к 0.2, 0.25, 0.3
        cards.forEach((card, i) => {
          scrollTl.fromTo(
            card,
            { x: '50vw', rotateY: -18, opacity: 0 },
            { x: 0, rotateY: 0, opacity: 1, ease: 'none', duration },
            starts[i]
          );
        });
      }

      // Exit phase (70% - 100%)
      scrollTl.fromTo(
        headingRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feature-card');
        cards.forEach((card) => {
          scrollTl.fromTo(
            card,
            { x: 0, rotateY: 0, opacity: 1 },
            { x: '-18vw', rotateY: 14, opacity: 0, ease: 'power2.in' },
            0.7
          );
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative w-full h-screen bg-violet overflow-hidden z-30"
    >
      {/* Heading */}
      <div
        ref={headingRef}
        className="absolute top-[10vh] left-1/2 -translate-x-1/2 text-center w-[min(52vw,720px)]"
      >
        <span className="font-label uppercase tracking-[0.08em] text-sm text-white/60 mb-4 block">
          {t.features.label}
        </span>
        <h2 className="font-heading text-[clamp(32px,4vw,56px)] leading-[1.0] text-white">
          {t.features.heading}
        </h2>
      </div>

      {/* Feature cards */}
      <div
        ref={cardsRef}
        className="absolute top-[30vh] left-[6vw] right-[6vw] w-[88vw] h-[56vh] flex gap-[3vw] items-start justify-center"
        style={{ perspective: '1000px' }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card flex-1 min-w-0 max-w-[360px] h-full bg-surface rounded-[28px] p-6 lg:p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] group shadow-[0_20px_60px_-15px_rgba(5,46,22,0.3)]"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-lime/20 rounded-xl flex items-center justify-center mb-6 shrink-0">
              <feature.icon size={24} className="text-lime" />
            </div>

            {/* Title */}
            <h3 className="font-heading text-[clamp(18px,1.5vw,24px)] text-violet mb-3 shrink-0">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="font-body text-[15px] text-violet/90 leading-relaxed mb-4 flex-1 min-h-0">
              {feature.description}
            </p>

            {/* Context line */}
            <p className="font-body text-sm text-violet/80 mb-6">
              {feature.detail}
            </p>

            {/* CTA Link */}
            <a
              href="#demo"
              className="flex items-center gap-2 font-label uppercase tracking-[0.08em] text-xs text-lime group-hover:gap-3 transition-all shrink-0"
            >
              {t.features.learnMore}
              <ArrowRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
