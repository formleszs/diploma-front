import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Sparkles, FileText, Zap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onUploadClick: () => void;
}

export default function Hero({ onUploadClick }: HeroProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline();

      // Card entrance
      loadTl.fromTo(
        cardRef.current,
        { y: '18vh', scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
      );

      // Headline words stagger
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        loadTl.fromTo(
          words,
          { y: 40, rotateX: 25, opacity: 0 },
          { y: 0, rotateX: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
          '-=0.6'
        );
      }

      // Subheadline
      loadTl.fromTo(
        subheadRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      );

      // CTA buttons
      loadTl.fromTo(
        ctaRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );

      // Illustration
      loadTl.fromTo(
        illustrationRef.current,
        { x: '10vw', rotateY: -18, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.8'
      );

      // Sparkles
      if (sparklesRef.current) {
        const sparkles = sparklesRef.current.querySelectorAll('.sparkle-item');
        loadTl.fromTo(
          sparkles,
          { scale: 0, rotate: -45, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.7)' },
          '-=0.6'
        );
      }

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.set(cardRef.current, { y: 0, scale: 1, opacity: 1 });
            gsap.set(headlineRef.current, { x: 0, opacity: 1 });
            gsap.set(illustrationRef.current, { x: 0, rotateY: 0, opacity: 1 });
            if (sparklesRef.current) {
              gsap.set(sparklesRef.current.querySelectorAll('.sparkle-item'), { scale: 1, rotate: 0, opacity: 1 });
            }
          }
        }
      });

      // Exit animations (70% - 100%)
      scrollTl.fromTo(
        cardRef.current,
        { y: 0, scale: 1, opacity: 1 },
        { y: '-22vh', scale: 0.96, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        illustrationRef.current,
        { x: 0, rotateY: 0, opacity: 1 },
        { x: '12vw', rotateY: 12, opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (sparklesRef.current) {
        scrollTl.fromTo(
          sparklesRef.current.querySelectorAll('.sparkle-item'),
          { scale: 1, rotate: 0, opacity: 1 },
          { scale: 0.6, rotate: 25, opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = t.hero.headline.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-violet overflow-hidden z-10"
    >
      {/* Blob gradient background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[120vw] h-[120vh] blob-gradient opacity-60" />
      </div>

      {/* Sparkles */}
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
        <div className="sparkle-item absolute top-[15%] left-[8%] text-lime animate-sparkle">
          <Sparkles size={28} fill="#DDFD53" />
        </div>
        <div className="sparkle-item absolute top-[25%] right-[12%] text-lime animate-sparkle" style={{ animationDelay: '0.5s' }}>
          <Sparkles size={22} fill="#DDFD53" />
        </div>
        <div className="sparkle-item absolute bottom-[20%] left-[15%] text-lime animate-sparkle" style={{ animationDelay: '1s' }}>
          <Sparkles size={18} fill="#DDFD53" />
        </div>
        <div className="sparkle-item absolute top-[60%] right-[8%] text-lime animate-sparkle" style={{ animationDelay: '1.5s' }}>
          <Sparkles size={24} fill="#DDFD53" />
        </div>
        <div className="sparkle-item absolute bottom-[30%] right-[20%] text-lime animate-sparkle" style={{ animationDelay: '2s' }}>
          <Sparkles size={16} fill="#DDFD53" />
        </div>
      </div>

      {/* Main card — центрирование через flex */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={cardRef}
          className="pointer-events-auto w-[86vw] max-w-[1100px] h-[64vh] bg-white rounded-[28px] card-shadow overflow-hidden"
        >
          <div className="flex h-full">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-12 py-8">
            <h1
              ref={headlineRef}
              className="font-heading text-[clamp(28px,4vw,52px)] leading-[0.95] tracking-[-0.02em] text-violet mb-4"
            >
              {headlineWords.map((word, i) => (
                <span key={i} className="word inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
            </h1>
            
            <p
              ref={subheadRef}
              className="font-body text-[clamp(14px,1.2vw,18px)] text-violet/70 leading-relaxed mb-8 max-w-[90%]"
            >
              {t.hero.subheadline}
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 items-start">
              <Button
                onClick={onUploadClick}
                className="bg-lime text-violet hover:bg-lime-dark font-label uppercase tracking-[0.08em] text-sm px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Upload className="mr-2" size={18} />
                {t.hero.uploadNotes}
              </Button>
              <a
                href="#how-it-works"
                className="font-label uppercase tracking-[0.08em] text-sm text-violet/70 hover:text-violet transition-colors flex items-center py-3"
              >
                {t.hero.seeHowItWorks}
              </a>
            </div>
          </div>

          {/* Right illustration */}
          <div
            ref={illustrationRef}
            className="hidden lg:flex flex-1 items-center justify-center relative"
            style={{ perspective: '1000px' }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* 3D Notes Illustration */}
              <div className="relative">
                {/* Main document */}
                <div className="relative bg-white rounded-2xl shadow-card p-6 w-[280px] transform rotate-[-3deg] border border-violet/10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-violet" />
                    </div>
                    <div className="h-3 w-24 bg-violet/20 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-violet/10 rounded" />
                    <div className="h-2 w-[90%] bg-violet/10 rounded" />
                    <div className="h-2 w-[85%] bg-violet/10 rounded" />
                    <div className="h-2 w-[95%] bg-violet/10 rounded" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-2 w-16 bg-lime/50 rounded" />
                    <div className="h-2 w-12 bg-violet/10 rounded" />
                  </div>
                </div>

                {/* Floating flashcard */}
                <div className="absolute -top-8 -right-12 bg-lime rounded-xl p-4 w-[140px] shadow-card transform rotate-[8deg] animate-float">
                  <div className="flex items-center gap-1 mb-2">
                    <Zap size={14} className="text-violet" />
                    <span className="text-[10px] font-label uppercase text-violet/70">Flashcard</span>
                  </div>
                  <div className="h-2 w-full bg-violet/20 rounded mb-1" />
                  <div className="h-2 w-[80%] bg-violet/20 rounded" />
                </div>

                {/* Floating book */}
                <div className="absolute -bottom-6 -left-8 bg-violet rounded-xl p-4 w-[120px] shadow-card transform rotate-[-5deg] animate-float" style={{ animationDelay: '1s' }}>
                  <BookOpen size={24} className="text-lime mb-2" />
                  <div className="h-2 w-full bg-white/20 rounded" />
                </div>

                {/* Highlight marker */}
                <div className="absolute top-1/2 -right-4 bg-white rounded-lg p-2 shadow-card transform rotate-[12deg]">
                  <div className="w-3 h-12 bg-lime/60 rounded" />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
