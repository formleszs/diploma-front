import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Bot, RotateCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function LiveDemo() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const flashcardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.7,
          onUpdate: (self) => {
            // Flip flashcard based on scroll progress (45% - 65%)
            const progress = self.progress;
            if (progress >= 0.45 && progress <= 0.65) {
              const flipProgress = (progress - 0.45) / 0.2;
              setIsFlipped(flipProgress > 0.5);
            } else if (progress < 0.45) {
              setIsFlipped(false);
            } else {
              setIsFlipped(true);
            }
          }
        }
      });

      // Demo card entrance (0% - 30%)
      scrollTl.fromTo(
        cardRef.current,
        { y: '60vh', scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Chat messages entrance (5% - 30%)
      if (chatRef.current) {
        const messages = chatRef.current.querySelectorAll('.chat-message');
        messages.forEach((msg, i) => {
          scrollTl.fromTo(
            msg,
            { x: '-10vw', opacity: 0 },
            { x: 0, opacity: 1, ease: 'none' },
            0.05 + i * 0.05
          );
        });
      }

      // Flashcard entrance (10% - 30%)
      scrollTl.fromTo(
        flashcardRef.current,
        { x: '40vw', rotateZ: 6, opacity: 0 },
        { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // Exit phase (70% - 100%)
      scrollTl.fromTo(
        cardRef.current,
        { y: 0, scale: 1, opacity: 1 },
        { y: '-28vh', scale: 0.96, opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (chatRef.current) {
        const messages = chatRef.current.querySelectorAll('.chat-message');
        scrollTl.fromTo(
          messages,
          { x: 0, opacity: 1 },
          { x: '-8vw', opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl.fromTo(
        flashcardRef.current,
        { x: 0, rotateZ: 0, opacity: 1 },
        { x: '20vw', rotateZ: 10, opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative w-full h-screen bg-violet overflow-hidden z-40"
    >
      {/* Demo card */}
      <div
        ref={cardRef}
        className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 w-[88vw] max-w-[1140px] h-[68vh] bg-white rounded-[28px] card-shadow overflow-hidden"
      >
        <div className="flex h-full">
          {/* Left chat panel */}
          <div ref={chatRef} className="w-[58%] h-full p-6 lg:p-10 flex flex-col">
            <div className="mb-6">
              <span className="font-label uppercase tracking-[0.08em] text-sm text-violet/60 mb-2 block">
                {t.demo.label}
              </span>
              <h2 className="font-heading text-[clamp(24px,3vw,40px)] leading-[1.1] text-violet">
                {t.demo.heading}
              </h2>
            </div>

            {/* Chat messages */}
            <div className="flex-1 space-y-4 overflow-y-auto hide-scrollbar">
              {/* User message */}
              <div className="chat-message flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-violet/10 rounded-full flex items-center justify-center">
                  <User size={16} className="text-violet" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 max-w-[90%]">
                    <p className="font-body text-sm text-violet">
                      {t.demo.userQuestion}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI message */}
              <div className="chat-message flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-lime rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-violet" />
                </div>
                <div className="flex-1">
                  <div className="bg-white border border-violet/10 rounded-2xl rounded-tl-sm p-4 max-w-[95%] shadow-sm">
                    <p className="font-body text-sm text-violet leading-relaxed">
                      {t.demo.aiAnswerIntro} <span className="bg-lime/30 px-1 rounded">{t.demo.aiAnswerHighlight}</span> {t.demo.aiAnswerRest}
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-lime mt-1">•</span>
                        <span className="font-body text-sm text-violet/80">{t.demo.aiBullet1}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-lime mt-1">•</span>
                        <span className="font-body text-sm text-violet/80">{t.demo.aiBullet2}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Follow-up user message */}
              <div className="chat-message flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-violet/10 rounded-full flex items-center justify-center">
                  <User size={16} className="text-violet" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 max-w-[90%]">
                    <p className="font-body text-sm text-violet">
                      {t.demo.userFollowUp}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="mt-4 pt-4 border-t border-violet/10">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <input
                  type="text"
                  placeholder={t.demo.placeholder}
                  className="flex-1 bg-transparent font-body text-sm text-violet placeholder:text-violet/40 outline-none"
                  readOnly
                />
                <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
                  <Bot size={16} className="text-violet" />
                </div>
              </div>
            </div>
          </div>

          {/* Right flashcard panel */}
          <div className="w-[42%] h-full bg-violet/5 flex items-center justify-center p-6">
            <div
              ref={flashcardRef}
              className="relative w-full max-w-[280px] h-[320px]"
              style={{ perspective: '1000px' }}
            >
              <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front of card */}
                <div
                  className="absolute inset-0 bg-white rounded-[22px] card-shadow p-6 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-12 h-12 bg-lime/20 rounded-xl flex items-center justify-center mb-6">
                    <span className="font-heading text-xl text-lime">Q</span>
                  </div>
                  <h3 className="font-heading text-xl text-violet text-center mb-4">
                    {t.demo.flashcardQuestion}
                  </h3>
                  <p className="font-body text-sm text-violet/60 text-center">
                    {t.demo.flashcardPrompt}
                  </p>
                  <div className="absolute bottom-4 right-4">
                    <RotateCw size={18} className="text-violet/30" />
                  </div>
                </div>

                {/* Back of card */}
                <div
                  className="absolute inset-0 bg-lime rounded-[22px] card-shadow p-6 flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="w-12 h-12 bg-violet/20 rounded-xl flex items-center justify-center mb-6">
                    <span className="font-heading text-xl text-violet">A</span>
                  </div>
                  <p className="font-body text-sm text-violet text-center leading-relaxed">
                    {t.demo.flashcardAnswer}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <div className="h-2 w-16 bg-violet/20 rounded" />
                    <div className="h-2 w-12 bg-violet/20 rounded" />
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <RotateCw size={18} className="text-violet/40" />
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
