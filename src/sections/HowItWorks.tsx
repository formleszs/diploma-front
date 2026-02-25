import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Brain, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const { t } = useLanguage();
  const steps = useMemo(
    () => [
      { number: '01', title: t.howItWorks.step1Title, description: t.howItWorks.step1Desc, icon: Upload, accent: 'from-emerald-500/20 to-emerald-600/5' },
      { number: '02', title: t.howItWorks.step2Title, description: t.howItWorks.step2Desc, icon: Brain, accent: 'from-green-400/20 to-green-500/5' },
      { number: '03', title: t.howItWorks.step3Title, description: t.howItWorks.step3Desc, icon: GraduationCap, accent: 'from-lime-400/20 to-lime-500/5' },
    ],
    [t]
  );
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heading = headingRef.current;
      if (heading) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
        });
        tl.fromTo(heading.querySelector('.step-label'),
          { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0);
        tl.fromTo(heading.querySelector('.step-heading'),
          { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' }, 0.1);
        tl.fromTo(heading.querySelector('.step-tagline'),
          { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.2);
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.step-card');
        gsap.fromTo(cards,
          { x: () => (window.innerWidth >= 1024 ? Math.min(window.innerWidth * 0.42, 620) : 160), y: 0, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.16,
            scrollTrigger: { trigger: cardsRef.current, start: 'top 88%', once: true } }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative w-full bg-transparent py-28 lg:py-40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 section-glow opacity-55" />
      <div
        className="absolute top-[25%] left-[48%] -translate-x-1/2 w-[48vw] h-[46vh] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.03) 35%, transparent 62%)' }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-14 lg:gap-24">
        <div ref={headingRef} className="lg:w-[38%] max-w-md">
          <span className="step-label font-label uppercase tracking-[0.16em] text-[11px] text-lime/60 mb-3 block">
            {t.howItWorks.label}
          </span>
          <h2 className="step-heading font-display text-[clamp(34px,4.5vw,60px)] leading-[1.05] text-white mb-7 headline-depth pb-1 overflow-visible">
            {t.howItWorks.heading}
          </h2>
          <p className="step-tagline font-body text-[clamp(15px,1.2vw,18px)] text-white/55 leading-[1.75]">
            {t.howItWorks.tagline}
          </p>
        </div>

        <div ref={cardsRef} className="relative flex-1 w-full lg:max-w-[55%] flex flex-col gap-4">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="step-card card-inner-light group rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] border border-white/[0.14] p-6 lg:p-7 flex items-center gap-5 transition-[transform,box-shadow,background-color,border-color] duration-300 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.045)_100%)] hover:border-lime/30 hover:-translate-y-1 hover:shadow-[0_24px_58px_-14px_rgba(0,0,0,0.35)]">
                <div className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${step.accent} border border-lime/12 flex items-center justify-center`} style={{ width: 52, height: 52 }}>
                  <span className="font-display text-sm text-lime">{step.number}</span>
                </div>
                <div className="step-card-icon flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.08] border border-white/20 flex items-center justify-center transition-transform duration-300">
                  <step.icon size={20} className="text-lime" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-[clamp(16px,1.2vw,19px)] font-semibold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="font-body text-[14px] text-white/50 leading-[1.65]">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && <div className="py-1.5" />}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
