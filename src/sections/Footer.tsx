import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Twitter, Instagram, Github, Linkedin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Github, href: '#' },
  { icon: Linkedin, href: '#' },
];

export default function Footer() {
  const { t } = useLanguage();
  const links = useMemo(
    () => [
      { label: t.footer.howItWorks, href: '#how-it-works' },
      { label: t.footer.features, href: '#features' },
      { label: t.footer.pricing, href: '#' },
      { label: t.footer.support, href: '#' },
      { label: t.footer.privacy, href: '#' },
    ],
    [t]
  );
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-violet pt-[8vh] pb-[6vh] z-[70]"
    >
      <div
        ref={contentRef}
        className="max-w-[920px] mx-auto px-6 text-center"
      >
        {/* Logo and tagline */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center">
              <BookOpen size={22} className="text-violet" />
            </div>
            <span className="font-heading text-2xl text-white">StudySync</span>
          </div>
          <p className="font-body text-white/60">
            {t.footer.tagline}
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 mb-8">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="font-label uppercase tracking-[0.08em] text-xs text-white/60 hover:text-lime transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="font-body text-xs text-white/40">
            {t.footer.copyright}
          </p>

          {/* Social icons */}
          <div className="flex gap-4">
            {socials.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-lime/20 transition-colors group"
              >
                <social.icon size={16} className="text-white/60 group-hover:text-lime transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
