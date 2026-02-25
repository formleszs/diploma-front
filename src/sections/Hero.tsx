import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, FileText, Zap, BookOpen, Sparkles, CircleDashed, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onUploadClick: () => void;
}

export default function Hero({ onUploadClick }: HeroProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95 },
        0.15
      );

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        gsap.set(words, { y: 20, opacity: 0 });
        tl.to(words, { y: 0, opacity: 1, duration: 1.05, stagger: 0.06 }, 0.28);
      }

      tl.fromTo(subheadRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95 },
        '-=0.6'
      );

      tl.fromTo(ctaRef.current,
        { y: 9, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.5'
      );

      tl.fromTo(illustrationRef.current,
        { x: 20, opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.92'
      );

      gsap.to(textRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      gsap.to(illustrationRef.current, {
        y: -35,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = t.hero.headline.split(' ');

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-transparent overflow-visible flex items-center pt-24 pb-24">
      <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden />

      <div className="absolute top-1/2 right-[6%] -translate-y-1/2 w-[760px] h-[760px] pointer-events-none" aria-hidden>
        <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.11) 0%, rgba(34,197,94,0.035) 36%, transparent 62%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-[1480px] mx-auto px-6 lg:px-14 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        <div ref={textRef} className="max-w-xl lg:max-w-[640px]">
          <div ref={badgeRef} className="badge-shimmer inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] px-5 py-2 mb-9">
            <Sparkles size={14} className="text-lime" />
            <span className="font-label text-[11px] uppercase tracking-[0.14em] text-white/65">AI-powered study platform</span>
          </div>

          <h1
            ref={headlineRef}
            className="font-display text-[clamp(42px,5.2vw,76px)] leading-[1.02] text-white mb-8 headline-depth pb-3 overflow-visible max-w-[13ch]"
          >
            {headlineWords.map((word, i) => (
              <span key={i} className={`word inline-block mr-[0.16em] pb-[0.06em] ${i === headlineWords.length - 1 ? 'text-gradient-lime' : ''}`}>{word}</span>
            ))}
          </h1>

          <p ref={subheadRef} className="font-body text-[clamp(16px,1.4vw,20px)] text-white/65 leading-[1.75] mb-11 max-w-[88%]">
            {t.hero.subheadline}
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 items-start">
            <Button
              onClick={onUploadClick}
              className="btn-pill bg-lime text-violet hover:bg-lime-dark font-label font-semibold text-[15px] px-11 py-6 transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_50px_-8px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <Upload className="mr-2.5" size={18} />
              {t.hero.uploadNotes}
            </Button>
            <a
              href="#how-it-works"
              className="btn-pill font-label font-medium text-sm border border-white/15 text-white/75 hover:bg-white/[0.06] hover:border-white/30 hover:text-white rounded-full px-8 py-4 transition-[transform,box-shadow,background-color,border-color,color] duration-300 flex items-center"
            >
              {t.hero.seeHowItWorks}
            </a>
          </div>
        </div>

        <div
          ref={illustrationRef}
          className="relative hidden lg:flex items-center justify-center w-full max-w-[620px] min-h-[540px]"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[560px] h-[560px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.028) 32%, transparent 56%)' }} />
          </div>

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center orbit-spin">
            <svg viewBox="0 0 500 500" className="w-[500px] h-[500px] opacity-45">
              <circle cx="250" cy="250" r="185" fill="none" stroke="rgba(74,222,128,0.22)" strokeWidth="1.4" strokeDasharray="5 9" />
              <circle cx="250" cy="250" r="210" fill="none" stroke="rgba(167,243,208,0.18)" strokeWidth="1.1" strokeDasharray="3 11" />
              <circle cx="435" cy="250" r="5" fill="rgba(134,239,172,0.7)" />
            </svg>
          </div>

          <div className="relative card-inner-light bg-[linear-gradient(160deg,rgba(22,52,36,0.96)_0%,rgba(12,34,24,0.95)_100%)] rounded-2xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5)] p-8 w-[350px] border border-lime/20" style={{ transform: 'rotate(-1.4deg)' }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-lime/85 rounded-xl flex items-center justify-center shadow-sm"><FileText size={18} className="text-violet" /></div>
              <div>
                <div className="h-3 w-28 bg-white/16 rounded mb-1" />
                <div className="h-2 w-18 bg-white/10 rounded" />
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="h-2.5 w-full bg-white/14 rounded" />
              <div className="h-2.5 w-[91%] bg-white/14 rounded" />
              <div className="h-2.5 w-[83%] bg-white/12 rounded" />
              <div className="h-2.5 w-[93%] bg-white/12 rounded" />
              <div className="h-2.5 w-[74%] bg-white/10 rounded" />
            </div>
            <div className="mt-5 flex items-center gap-2.5">
              <div className="h-8 w-24 bg-lime rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-[9px] font-label text-violet font-bold uppercase tracking-wider">Summary</span>
              </div>
              <div className="h-8 px-3 rounded-lg bg-white/7 border border-white/16 flex items-center gap-1.5">
                <WandSparkles size={12} className="text-lime/80" />
                <span className="text-[9px] font-label font-semibold uppercase tracking-[0.08em] text-white/72">AI refined</span>
              </div>
            </div>
          </div>

          <div className="absolute -top-7 -right-2 card-inner-light bg-lime rounded-xl p-4 w-[160px] shadow-[0_20px_52px_-10px_rgba(0,0,0,0.38)] float-strong">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Zap size={13} className="text-violet" />
              <span className="text-[10px] font-label uppercase text-violet/75 font-bold tracking-wider">Flashcard</span>
            </div>
            <div className="h-2 w-full bg-violet/12 rounded mb-1.5" />
            <div className="h-2 w-[68%] bg-violet/12 rounded" />
          </div>

          <div className="absolute -bottom-4 -left-8 card-inner-light bg-[#0b2b19] rounded-xl p-4 w-[140px] shadow-[0_20px_52px_-10px_rgba(0,0,0,0.4)] border border-lime/15 float-strong-book">
            <BookOpen size={20} className="text-lime mb-2.5" />
            <div className="h-2 w-full bg-white/10 rounded mb-1.5" />
            <div className="h-2 w-[50%] bg-white/8 rounded" />
          </div>

          <div className="absolute top-[19%] -left-2 card-inner-light bg-[#133323] border border-lime/20 rounded-xl p-3.5 w-[128px] shadow-[0_18px_45px_-12px_rgba(0,0,0,0.38)]">
            <div className="flex items-center gap-1.5 mb-2">
              <CircleDashed size={13} className="text-lime/80" />
              <span className="text-[9px] font-label uppercase tracking-[0.12em] text-lime/60">Pipeline</span>
            </div>
            <div className="h-1.5 w-full rounded bg-lime/20 mb-1.5" />
            <div className="h-1.5 w-[72%] rounded bg-lime/35" />
          </div>

          <div className="absolute bottom-[20%] -right-8 card-inner-light bg-[#103221] border border-lime/20 rounded-xl p-3 w-[122px] shadow-[0_18px_45px_-12px_rgba(0,0,0,0.38)]">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-lime/85" />
              <span className="text-[9px] font-label uppercase tracking-[0.12em] text-lime/60">Quiz</span>
            </div>
            <div className="h-1.5 w-full rounded bg-white/12 mb-1.5" />
            <div className="h-1.5 w-[62%] rounded bg-lime/30" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
