import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Brain, GraduationCap, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const { t } = useLanguage();
  const steps = useMemo(
    () => [
      { number: '01', title: t.howItWorks.step1Title, description: t.howItWorks.step1Desc, icon: Upload },
      { number: '02', title: t.howItWorks.step2Title, description: t.howItWorks.step2Desc, icon: Brain },
      { number: '03', title: t.howItWorks.step3Title, description: t.howItWorks.step3Desc, icon: GraduationCap },
    ],
    [t]
  );
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // Heading entrance (0% - 30%)
      scrollTl.fromTo(
        headingRef.current,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Step cards entrance (0% - 30%) with stagger
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.step-card');
        cards.forEach((card, i) => {
          scrollTl.fromTo(
            card,
            { x: '60vw', rotateZ: 6, opacity: 0 },
            { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
            i * 0.05
          );
        });
      }

      // Sparkles entrance
      if (sparklesRef.current) {
        const sparkles = sparklesRef.current.querySelectorAll('.sparkle-item');
        scrollTl.fromTo(
          sparkles,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'none' },
          0.05
        );
      }

      // Settle phase (30% - 70%) - hold positions

      // Exit phase (70% - 100%)
      scrollTl.fromTo(
        headingRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.step-card');
        scrollTl.fromTo(
          cards,
          { y: 0, scale: 1, opacity: 1 },
          { y: '-18vh', scale: 0.96, opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

      if (sparklesRef.current) {
        const sparkles = sparklesRef.current.querySelectorAll('.sparkle-item');
        scrollTl.fromTo(
          sparkles,
          { scale: 1, opacity: 1 },
          { scale: 0.7, opacity: 0, ease: 'power2.in' },
          0.75
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full h-screen bg-violet overflow-hidden z-20"
    >
      {/* Soft gradient like Hero — в стиле остальных сцен */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[120vw] h-[120vh] blob-gradient opacity-50" />
      </div>

      {/* Sparkles decoration — лайм как акцент, не перебивает */}
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
        <div className="sparkle-item absolute top-[12%] left-[5%] text-lime">
          <Sparkles size={32} className="text-lime" fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute top-[20%] right-[8%] text-lime">
          <Sparkles size={24} className="text-lime" fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute bottom-[15%] left-[10%] text-lime">
          <Sparkles size={20} className="text-lime" fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute top-[50%] right-[5%] text-lime">
          <Sparkles size={28} className="text-lime" fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute bottom-[25%] right-[15%] text-lime">
          <Sparkles size={18} className="text-lime" fill="var(--lime)" />
        </div>
      </div>

      <div className="relative flex h-full items-center px-[7vw]">
        {/* Left heading */}
        <div ref={headingRef} className="w-[34vw] pr-8">
          <span className="font-label uppercase tracking-[0.08em] text-sm text-white/60 mb-4 block">
            {t.howItWorks.label}
          </span>
          <h2 className="font-heading text-[clamp(32px,4vw,56px)] leading-[1.0] text-white mb-6">
            {t.howItWorks.heading}
          </h2>
          <p className="font-body text-[clamp(14px,1.1vw,18px)] text-white/70 leading-relaxed">
            {t.howItWorks.tagline}
          </p>
        </div>

        {/* Right step cards */}
        <div ref={cardsRef} className="flex-1 flex flex-col gap-[2.2vh] pl-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-card bg-surface rounded-[28px] card-shadow p-6 lg:p-8 flex items-center gap-6 transition-transform duration-300 hover:scale-[1.02]"
            >
              {/* Step number circle */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-violet flex items-center justify-center">
                <span className="font-heading text-lg text-violet">{step.number}</span>
              </div>

              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-lime/30 rounded-xl flex items-center justify-center">
                <step.icon size={24} className="text-violet" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-heading text-[clamp(16px,1.3vw,22px)] text-violet mb-1">
                  {step.title}
                </h3>
                <p className="font-body text-[15px] text-violet/90 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
