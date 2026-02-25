import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface NavigationProps {
  onGetStartedClick: () => void;
}

export default function Navigation({ onGetStartedClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-[background-color,padding,border-color,backdrop-filter] duration-500 ${
        isScrolled
          ? 'bg-violet-dark/90 backdrop-blur-xl py-3 border-b border-white/5'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Logo + language switcher */}
          <div className="flex items-center gap-5 min-w-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-lime flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-glow">
                <BookOpen size={18} className="text-violet" />
              </div>
              <span className="font-heading text-lg font-semibold text-white tracking-tight">StudySync</span>
            </a>
            <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`px-3 py-1.5 rounded-full font-label text-xs uppercase tracking-wider transition-[background-color,color] duration-200 ${
                  lang === 'ru' ? 'bg-lime text-violet shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-full font-label text-xs uppercase tracking-wider transition-[background-color,color] duration-200 ${
                  lang === 'en' ? 'bg-lime text-violet shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center justify-center gap-8 lg:gap-10">
            <button
              onClick={() => scrollToSection('#how-it-works')}
              className="font-body text-sm text-white/60 hover:text-white transition-[color] duration-300 whitespace-nowrap relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-lime/40 hover:after:w-full after:transition-[width] after:duration-300"
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={() => scrollToSection('#features')}
              className="font-body text-sm text-white/60 hover:text-white transition-[color] duration-300 whitespace-nowrap relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-lime/40 hover:after:w-full after:transition-[width] after:duration-300"
            >
              {t.nav.features}
            </button>
            <button
              onClick={() => scrollToSection('#demo')}
              className="font-body text-sm text-white/60 hover:text-white transition-[color] duration-300 whitespace-nowrap relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-lime/40 hover:after:w-full after:transition-[width] after:duration-300"
            >
              {t.nav.demo}
            </button>
          </div>

          {/* CTA — pill primary / outline */}
          <div className="flex justify-end min-w-0">
            <Button
              onClick={onGetStartedClick}
              className={`btn-pill font-label font-medium text-sm px-6 py-2.5 transition-[transform,box-shadow,background-color,border-color,color] duration-300 shrink-0 ${
                isScrolled
                  ? 'bg-lime text-violet hover:bg-lime-dark hover:shadow-glow hover:-translate-y-0.5'
                  : 'border-2 border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white/60'
              }`}
            >
              {t.nav.getStarted}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
