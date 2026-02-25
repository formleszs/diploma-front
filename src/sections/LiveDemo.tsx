import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DemoPipeline from '@/sections/DemoPipeline';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function LiveDemo() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
      });
      tl.fromTo(headerRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out' }, 0);
      tl.fromTo(contentRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.12);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="demo" className="relative w-full bg-transparent py-28 lg:py-40 overflow-hidden">
      <div className="absolute top-1/3 right-0 section-glow opacity-52" />
      <div className="absolute top-16 left-[9%] w-44 h-28 pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(circle, rgba(167,243,208,0.95) 1px, transparent 1px)', backgroundSize: '13px 13px', maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.9), transparent 75%)' }} />
      <div className="absolute bottom-14 right-[8%] w-52 h-32 pointer-events-none opacity-35" style={{ backgroundImage: 'linear-gradient(rgba(110,231,183,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.22) 1px, transparent 1px)', backgroundSize: '17px 17px', maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.85), transparent 76%)' }} />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-14">
        <div ref={headerRef} className="text-center mb-16">
          <span className="font-label uppercase tracking-[0.16em] text-[11px] text-lime/60 mb-4 block">
            {t.demo.label}
          </span>
          <h2 className="font-display text-[clamp(34px,4.5vw,60px)] leading-[1.05] text-white mb-5 headline-depth pb-1 overflow-visible">
            {t.demo.heading}
          </h2>
          <p className="font-body text-[clamp(15px,1.2vw,18px)] text-white/50 max-w-lg mx-auto leading-[1.7]">
            {t.demo.subtitle}
          </p>
        </div>

        <div ref={contentRef}>
          <DemoPipeline />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
