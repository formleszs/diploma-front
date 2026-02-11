import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const AUTHORS = ['A.', 'M.', 'J.', 'L.', 'T.', 'S.'];

export default function Testimonials() {
  const { t } = useLanguage();
  const testimonials = useMemo(
    () =>
      t.testimonials.quotes.map((quote, i) => ({
        quote,
        author: AUTHORS[i],
        major: t.testimonials.majors[i],
        rating: 5,
      })),
    [t]
  );
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // Вход (0% — 30%)
      scrollTl.fromTo(
        contentRef.current,
        { y: '15vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );
      if (headingRef.current) {
        scrollTl.fromTo(
          headingRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.02
        );
      }
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.testimonial-card');
        cards.forEach((card, i) => {
          scrollTl.fromTo(
            card,
            { y: '8vh', scale: 0.98, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, ease: 'none' },
            0.04 + i * 0.02
          );
        });
      }

      // Выход (70% — 100%)
      scrollTl.fromTo(
        contentRef.current,
        { y: 0, opacity: 1 },
        { y: '-12vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative w-full h-screen bg-violet overflow-hidden z-50"
    >
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center py-[8vh] px-4"
      >
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-8 px-4 shrink-0">
          <span className="font-label uppercase tracking-[0.08em] text-sm text-white/60 mb-4 block">
            {t.testimonials.label}
          </span>
          <h2 className="font-heading text-[clamp(28px,3.5vw,48px)] leading-[1.0] text-white">
            {t.testimonials.heading}
          </h2>
        </div>

        {/* Testimonial cards grid */}
        <div
          ref={cardsRef}
          className="max-w-[1200px] w-full mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-hidden"
        >
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="testimonial-card bg-white rounded-[24px] p-6 lg:p-8 card-shadow-light transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Quote icon */}
            <div className="mb-4">
              <Quote size={28} className="text-lime" fill="#DDFD53" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} size={14} className="text-lime" fill="#DDFD53" />
              ))}
            </div>

            {/* Quote text */}
            <p className="font-body text-[clamp(14px,1.1vw,16px)] text-violet leading-relaxed mb-6">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet/10 rounded-full flex items-center justify-center shrink-0">
                <span className="font-heading text-sm text-violet">
                  {testimonial.author}
                </span>
              </div>
              <div>
                <p className="font-label text-sm text-violet/60 uppercase tracking-wide">
                  {testimonial.major}
                </p>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
