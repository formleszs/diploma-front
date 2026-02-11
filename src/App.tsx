import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageProvider } from '@/context/LanguageContext';
import Navigation from '@/components/Navigation';
import UploadModal from '@/components/UploadModal';
import Hero from '@/sections/Hero';
import HowItWorks from '@/sections/HowItWorks';
import Features from '@/sections/Features';
import LiveDemo from '@/sections/LiveDemo';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    // Wait for all ScrollTriggers to be created
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      // Build pinned ranges with settle centers
      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      // Снап: скролл на секциях = намерение листать дальше. Порог 35% — перешли 35% пути к следующей секции → идём вперёд.
      const centers = pinnedRanges.map(r => r.center);
      const THRESHOLD = 0.35;
      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const buffer = 0.12;
            const inPinned = pinnedRanges.some(
              r => value >= r.start - buffer && value <= r.end + buffer
            );
            if (!inPinned) return value;

            if (value <= centers[0]) return centers[0];
            if (value >= centers[centers.length - 1]) return centers[centers.length - 1];

            for (let i = 0; i < centers.length - 1; i++) {
              const a = centers[i];
              const b = centers[i + 1];
              if (value >= a && value <= b) {
                const split = a + (b - a) * THRESHOLD;
                return value < split ? a : b;
              }
            }
            return centers[0];
          },
          duration: { min: 0.12, max: 0.28 },
          delay: 0,
          ease: 'power2.inOut',
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return (
    <LanguageProvider>
      <div className="relative bg-violet min-h-screen">
        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Navigation */}
        <Navigation onGetStartedClick={openUploadModal} />

        {/* Main content */}
        <main className="relative">
          <Hero onUploadClick={openUploadModal} />
          <HowItWorks />
          <Features />
          <LiveDemo />
          <CTA />
          <Footer />
        </main>

        {/* Upload Modal */}
        <UploadModal isOpen={isUploadModalOpen} onClose={closeUploadModal} />
      </div>
    </LanguageProvider>
  );
}

export default App;
