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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-violet/90 backdrop-blur-md py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Logo + переключатель языка — слева */}
          <div className="flex items-center gap-4 min-w-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group shrink-0"
            >
              <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <BookOpen size={18} className="text-violet" />
              </div>
              <span className="font-heading text-lg text-white">StudySync</span>
            </a>
            <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1 shrink-0">
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`px-2.5 py-1 rounded-md font-label text-xs uppercase tracking-wider transition-colors ${
                  lang === 'ru' ? 'bg-lime text-violet' : 'text-white/70 hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md font-label text-xs uppercase tracking-wider transition-colors ${
                  lang === 'en' ? 'bg-lime text-violet' : 'text-white/70 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Nav links — по центру экрана */}
          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
            <button
              onClick={() => scrollToSection('#how-it-works')}
              className="font-label uppercase tracking-[0.08em] text-xs text-white/70 hover:text-white transition-colors whitespace-nowrap"
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={() => scrollToSection('#features')}
              className="font-label uppercase tracking-[0.08em] text-xs text-white/70 hover:text-white transition-colors whitespace-nowrap"
            >
              {t.nav.features}
            </button>
            <button
              onClick={() => scrollToSection('#demo')}
              className="font-label uppercase tracking-[0.08em] text-xs text-white/70 hover:text-white transition-colors whitespace-nowrap"
            >
              {t.nav.demo}
            </button>
            <button
              onClick={() => scrollToSection('#testimonials')}
              className="font-label uppercase tracking-[0.08em] text-xs text-white/70 hover:text-white transition-colors whitespace-nowrap"
            >
              {t.nav.testimonials}
            </button>
          </div>

          {/* CTA — справа */}
          <div className="flex justify-end min-w-0">
            <Button
              onClick={onGetStartedClick}
              variant={isScrolled ? 'default' : 'outline'}
              className={`font-label uppercase tracking-[0.08em] text-xs px-5 py-2 rounded-lg transition-all duration-300 shrink-0 ${
                isScrolled
                  ? 'bg-lime text-violet hover:bg-lime-dark'
                  : 'border-lime text-lime hover:bg-lime hover:text-violet'
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
