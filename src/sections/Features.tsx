import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const CARD_STYLES = [
  { iconGradient: 'from-emerald-500/30 to-emerald-600/10', iconWrap: 'bg-white/[0.04]' },
  { iconGradient: 'from-green-400/26 to-green-500/8', iconWrap: 'bg-white/[0.06]' },
  { iconGradient: 'from-lime-400/28 to-lime-500/9', iconWrap: 'bg-white/[0.05]' },
];

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
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true } }
        );
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feature-card');
        gsap.fromTo(cards,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', stagger: 0.15,
            scrollTrigger: { trigger: cardsRef.current, start: 'top 88%', once: true } }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="relative w-full bg-transparent py-28 lg:py-40">
      <div className="absolute top-0 left-1/4 section-glow opacity-35" />
      <div className="absolute -top-12 right-[12%] w-44 h-44 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0.02) 55%, transparent 70%)' }} />
      <div className="absolute bottom-10 left-[10%] w-52 h-36 pointer-events-none opacity-35" style={{ backgroundImage: 'radial-gradient(circle, rgba(167,243,208,0.9) 1px, transparent 1px)', backgroundSize: '14px 14px', maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.85), transparent 75%)' }} />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-14">
        <div ref={headingRef} className="text-center mb-16">
          <span className="font-label uppercase tracking-[0.16em] text-[11px] text-lime/60 mb-4 block">
            {t.features.label}
          </span>
          <h2 className="font-display text-[clamp(34px,4.5vw,60px)] leading-[1.05] text-white max-w-2xl mx-auto headline-depth pb-1 overflow-visible">
            {t.features.heading}
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-start">
          {features.map((feature, index) => {
            const style = CARD_STYLES[index];
            return (
              <div
                key={index}
                className="feature-card card-inner-light group rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] border border-white/[0.12] p-7 lg:p-8 flex flex-col transition-[transform,box-shadow,background-color,border-color] duration-300 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.045)_100%)] hover:border-lime/30 hover:-translate-y-2 hover:shadow-[0_28px_64px_-14px_rgba(0,0,0,0.4)]"
              >
                <div className={`feature-card-icon ${style.iconWrap} bg-gradient-to-br ${style.iconGradient} rounded-xl flex items-center justify-center mb-7 border border-lime/20 transition-transform duration-300`} style={{ width: 52, height: 52 }}>
                  <feature.icon size={23} className="text-lime" />
                </div>
                <h3 className="font-heading text-[clamp(18px,1.4vw,22px)] font-semibold text-white mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="font-body text-[15px] text-white/60 leading-[1.7] mb-3 flex-1">
                  {feature.description}
                </p>
                <div className="mb-7 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-label text-[10px] uppercase tracking-[0.1em] text-lime/72">Feature focus</span>
                    <span className="px-2 py-1 rounded-full text-[9px] font-label uppercase tracking-[0.08em] text-lime/82 bg-lime/10 border border-lime/20">
                      {index === 0 ? 'Summary' : index === 1 ? 'Flashcards' : 'Quiz'}
                    </span>
                  </div>
                  <p className="font-body text-[12px] text-white/45 leading-relaxed mt-2.5">{feature.detail}</p>
                </div>
                <a
                  href="#demo"
                  className="flex items-center gap-2 font-label uppercase tracking-[0.1em] text-[11px] font-medium text-lime/70 group-hover:text-lime group-hover:gap-3.5 transition-[color,gap] duration-300"
                >
                  {t.features.learnMore}
                  <ArrowRight size={13} className="feature-card-arrow transition-transform duration-300" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
