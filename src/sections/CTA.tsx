import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

function CTA() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        }
      });

      // CTA card entrance (0% - 30%)
      scrollTl.fromTo(
        cardRef.current,
        { y: '70vh', scale: 0.88, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Headline words entrance (5% - 30%)
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        scrollTl.fromTo(
          words,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.05
        );
      }

      // Form entrance (10% - 30%)
      scrollTl.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // Sparkles entrance (0% - 25%)
      if (sparklesRef.current) {
        const sparkles = sparklesRef.current.querySelectorAll('.sparkle-item');
        scrollTl.fromTo(
          sparkles,
          { scale: 0, rotate: -30, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, ease: 'none' },
          0
        );
      }

      // Exit phase (70% - 100%)
      scrollTl.fromTo(
        cardRef.current,
        { y: 0, scale: 1, opacity: 1 },
        { y: '-18vh', scale: 0.98, opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        scrollTl.fromTo(
          words,
          { y: 0, opacity: 1 },
          { y: -30, opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl.fromTo(
        formRef.current,
        { y: 0, opacity: 1 },
        { y: 20, opacity: 0, ease: 'power2.in' },
        0.7
      );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  const headlineWords = t.cta.headline.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-violet overflow-hidden z-[60]"
    >
      {/* Sparkles */}
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
        <div className="sparkle-item absolute top-[12%] left-[8%] text-lime animate-sparkle">
          <Sparkles size={28} fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute top-[18%] right-[10%] text-lime animate-sparkle" style={{ animationDelay: '0.5s' }}>
          <Sparkles size={22} fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute bottom-[20%] left-[12%] text-lime animate-sparkle" style={{ animationDelay: '1s' }}>
          <Sparkles size={18} fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute top-[55%] right-[6%] text-lime animate-sparkle" style={{ animationDelay: '1.5s' }}>
          <Sparkles size={24} fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute bottom-[30%] right-[18%] text-lime animate-sparkle" style={{ animationDelay: '2s' }}>
          <Sparkles size={16} fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute top-[35%] left-[5%] text-lime animate-sparkle" style={{ animationDelay: '2.5s' }}>
          <Sparkles size={20} fill="var(--lime)" />
        </div>
        <div className="sparkle-item absolute bottom-[15%] right-[8%] text-lime animate-sparkle" style={{ animationDelay: '3s' }}>
          <Sparkles size={26} fill="var(--lime)" />
        </div>
      </div>

      {/* CTA Card — белая карточка в стиле Hero / How it works, без зелёного фона */}
      <div
        ref={cardRef}
        className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[86vw] max-w-[1080px] h-[58vh] bg-white rounded-[28px] card-shadow flex flex-col items-center justify-center px-6 border border-violet/5"
      >
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-heading text-[clamp(32px,5vw,64px)] leading-[0.95] text-violet text-center mb-4"
        >
        {headlineWords.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.25em]">
              {word}
            </span>
          ))}
        </h2>

        {/* Subheadline */}
        <p className="font-body text-[clamp(14px,1.2vw,18px)] text-violet/70 text-center max-w-[600px] mb-8">
          {t.cta.subheadline}
        </p>

        {/* Form */}
        <div ref={formRef} className="w-full max-w-[480px]">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder={t.cta.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 px-6 bg-violet/5 border border-violet/15 rounded-xl font-body text-violet placeholder:text-violet/40 focus:ring-2 focus:ring-violet/30"
                required
              />
              <Button
                type="submit"
                className="h-14 px-8 bg-lime text-violet hover:bg-lime-dark font-label uppercase tracking-[0.08em] text-sm rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                {t.cta.getStartedFree}
                <ArrowRight size={16} />
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 h-14 bg-violet/5 rounded-xl border border-violet/10">
              <div className="w-8 h-8 bg-lime rounded-full flex items-center justify-center">
                <Check size={18} className="text-violet" />
              </div>
              <span className="font-body text-violet">
                {t.cta.thanks}
              </span>
            </div>
          )}

          <p className="font-body text-xs text-violet/50 text-center mt-4">
            {t.cta.noCard}
          </p>
        </div>
      </div>
    </section>
  );
}

export default CTA;
