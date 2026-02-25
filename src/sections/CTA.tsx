import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface CTAProps {
  onGetStartedClick: () => void;
}

function CTA({ onGetStartedClick }: CTAProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        gsap.set(words, { y: 14, opacity: 0 });
        tl.to(words, { y: 0, opacity: 1, duration: 0.95, stagger: 0.05, ease: 'power3.out' }, 0);
      }

      tl.fromTo(subtextRef.current,
        { y: 9, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, 0.22);

      tl.fromTo(ctaRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, 0.34);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = t.cta.headline.split(' ');

  return (
    <section ref={sectionRef} className="relative w-full bg-transparent py-40 lg:py-52 overflow-visible">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] h-[760px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.16) 0%, rgba(34,197,94,0.045) 34%, transparent 62%)' }} />
        <div className="absolute top-[22%] left-[8%] w-40 h-28 opacity-45" style={{ backgroundImage: 'radial-gradient(circle, rgba(167,243,208,0.9) 1px, transparent 1px)', backgroundSize: '12px 12px', maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.9), transparent 75%)' }} />
        <div className="absolute bottom-[18%] right-[10%] w-48 h-32 opacity-38" style={{ backgroundImage: 'linear-gradient(rgba(110,231,183,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.22) 1px, transparent 1px)', backgroundSize: '16px 16px', maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.85), transparent 75%)' }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto overflow-visible">
        <h2
          ref={headlineRef}
          className="font-display text-[clamp(40px,6.5vw,88px)] leading-[1.08] text-white mb-9 headline-depth pb-4 overflow-visible"
        >
          {headlineWords.map((word, i) => (
            <span key={i} className={`word inline-block mr-[0.18em] pb-[0.08em] ${i === headlineWords.length - 1 ? 'text-gradient-lime' : ''}`}>{word}</span>
          ))}
        </h2>
        <p ref={subtextRef} className="font-body text-[clamp(16px,1.4vw,20px)] text-white/55 max-w-[500px] mx-auto mb-14 leading-[1.75]">
          {t.cta.subheadline}
        </p>
        <div ref={ctaRef} className="flex flex-col items-center gap-5">
          <div className="absolute left-1/2 -translate-x-1/2 top-[72%] w-[320px] h-[100px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(74,222,128,0.26) 0%, rgba(74,222,128,0.07) 36%, transparent 70%)' }} />
          <Button
            type="button"
            onClick={onGetStartedClick}
            className="relative btn-pill h-[58px] px-16 bg-lime text-violet hover:bg-lime-dark font-label font-bold text-[16px] tracking-wide transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_70px_-10px_rgba(34,197,94,0.4)] hover:-translate-y-1 active:scale-[0.97] flex items-center gap-3 border border-lime/40"
          >
            {t.cta.getStartedFree}
            <ArrowRight size={19} />
          </Button>
          <p className="font-body text-[13px] text-white/30">{t.cta.noCard}</p>
        </div>
      </div>
    </section>
  );
}

export default CTA;
