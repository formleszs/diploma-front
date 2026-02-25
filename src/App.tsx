import { useState } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import Hero from '@/sections/Hero';
import HowItWorks from '@/sections/HowItWorks';
import Features from '@/sections/Features';
import LiveDemo from '@/sections/LiveDemo';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import {
  BookOpen, GraduationCap, Sparkles, FileText, Brain,
  Lightbulb, Star, PenTool, Atom, Trophy, Bookmark, Zap, CircleDot, Library, Compass,
} from 'lucide-react';

const PARTICLES = [
  { size: 2, top: '20%', left: '10%', dur: 26, anim: 'p-float-1', delay: 0 },
  { size: 2, top: '50%', left: '86%', dur: 32, anim: 'p-float-2', delay: 6 },
  { size: 1.5, top: '70%', left: '24%', dur: 28, anim: 'p-float-1', delay: 12 },
  { size: 2, top: '85%', left: '72%', dur: 34, anim: 'p-float-2', delay: 18 },
];

const ACCENTS = [
  { Icon: BookOpen,      size: 21, top: '8%',  left: '4.5%',  opacity: 0.24, dur: 10, anim: 'accent-float-1', delay: 0,   rotate: -10, depth: 'near' },
  { Icon: Star,          size: 14, top: '13%', left: '93%',   opacity: 0.17, dur: 12, anim: 'accent-float-2', delay: 1,   rotate: 15,  depth: 'far' },
  { Icon: GraduationCap, size: 19, top: '23%', left: '6%',    opacity: 0.2,  dur: 11, anim: 'accent-float-3', delay: 2,   rotate: 8,   depth: 'near' },
  { Icon: Sparkles,      size: 13, top: '31%', left: '95%',   opacity: 0.23, dur: 9,  anim: 'accent-float-4', delay: 0.5, rotate: -5,  depth: 'near' },
  { Icon: Brain,         size: 16, top: '45%', left: '4%',    opacity: 0.16, dur: 13, anim: 'accent-float-2', delay: 3,   rotate: 12,  depth: 'far' },
  { Icon: Lightbulb,     size: 15, top: '54%', left: '94%',   opacity: 0.2,  dur: 10, anim: 'accent-float-1', delay: 1.5, rotate: -8,  depth: 'near' },
  { Icon: FileText,      size: 17, top: '62%', left: '5%',    opacity: 0.19, dur: 12, anim: 'accent-float-3', delay: 4,   rotate: 6,   depth: 'near' },
  { Icon: PenTool,       size: 13, top: '71%', left: '93%',   opacity: 0.15, dur: 11, anim: 'accent-float-4', delay: 2,   rotate: -14, depth: 'far' },
  { Icon: Atom,          size: 16, top: '79%', left: '4%',    opacity: 0.2,  dur: 14, anim: 'accent-float-1', delay: 5,   rotate: 10,  depth: 'near' },
  { Icon: Trophy,        size: 14, top: '87%', left: '92%',   opacity: 0.16, dur: 10, anim: 'accent-float-2', delay: 3,   rotate: -7,  depth: 'far' },
  { Icon: Bookmark,      size: 14, top: '37%', left: '7%',    opacity: 0.15, dur: 15, anim: 'accent-float-4', delay: 6,   rotate: 18,  depth: 'far' },
  { Icon: Zap,           size: 12, top: '41%', left: '96%',   opacity: 0.22, dur: 10, anim: 'accent-float-3', delay: 1,   rotate: -12, depth: 'near' },
  { Icon: CircleDot,     size: 13, top: '18%', left: '88%',   opacity: 0.16, dur: 11, anim: 'accent-float-1', delay: 0.8, rotate: 0,   depth: 'far' },
  { Icon: Library,       size: 18, top: '66%', left: '89%',   opacity: 0.2,  dur: 13, anim: 'accent-float-2', delay: 2.2, rotate: -5,  depth: 'near' },
  { Icon: Compass,       size: 14, top: '91%', left: '9%',    opacity: 0.16, dur: 12, anim: 'accent-float-3', delay: 1.7, rotate: 9,   depth: 'far' },
];

const NODE_ACCENTS = [
  { top: '16%', left: '12%', size: 6, opacity: 0.42, dur: 8, delay: 0 },
  { top: '28%', left: '86%', size: 5, opacity: 0.36, dur: 10, delay: 1.3 },
  { top: '47%', left: '14%', size: 7, opacity: 0.35, dur: 9, delay: 2 },
  { top: '61%', left: '84%', size: 6, opacity: 0.4, dur: 11, delay: 0.6 },
  { top: '76%', left: '11%', size: 5, opacity: 0.33, dur: 10, delay: 1.8 },
  { top: '89%', left: '80%', size: 7, opacity: 0.34, dur: 12, delay: 2.4 },
];

const DOTS = [
  { size: 3, top: '10%', left: '18%', opacity: 0.15, dur: 8, delay: 0 },
  { size: 2, top: '22%', left: '78%', opacity: 0.12, dur: 10, delay: 2 },
  { size: 2.5, top: '35%', left: '42%', opacity: 0.1, dur: 12, delay: 4 },
  { size: 2, top: '48%', left: '68%', opacity: 0.13, dur: 9, delay: 1 },
  { size: 3, top: '58%', left: '30%', opacity: 0.11, dur: 11, delay: 3 },
  { size: 2, top: '68%', left: '82%', opacity: 0.14, dur: 8, delay: 5 },
  { size: 2.5, top: '78%', left: '15%', opacity: 0.1, dur: 13, delay: 2 },
  { size: 2, top: '85%', left: '55%', opacity: 0.12, dur: 10, delay: 6 },
  { size: 3, top: '92%', left: '38%', opacity: 0.09, dur: 14, delay: 1 },
  { size: 2, top: '5%',  left: '60%', opacity: 0.11, dur: 9, delay: 3 },
];

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-violet-dark overflow-x-hidden">
        {/* Layer A: Living base gradient */}
        <div className="fixed inset-0 pointer-events-none bg-depth-drift opacity-[0.66]" aria-hidden />

        {/* Layer B: Soft glow zones (hero / middle / CTA) */}
        <div className="glow-orb glow-orb-1 fixed top-[-18vh] right-[-10vw] z-0" aria-hidden />
        <div className="glow-orb glow-orb-2 fixed top-[34vh] left-[-16vw] z-0" aria-hidden />
        <div className="glow-orb glow-orb-3 fixed bottom-[-22vh] right-[-14vw] z-0" aria-hidden />

        {/* Layer C: Grain texture */}
        <div className="grain-overlay" />
        <div className="haze-overlay" />
        <div className="brand-grid-fragment brand-grid-fragment-1" aria-hidden />
        <div className="brand-grid-fragment brand-grid-fragment-2" aria-hidden />
        <div className="brand-grid-fragment brand-grid-fragment-3" aria-hidden />
        <div className="constellation-cluster constellation-cluster-1" aria-hidden />
        <div className="constellation-cluster constellation-cluster-2" aria-hidden />

        {/* Layer D: Branded floating accents */}
        {ACCENTS.map((a, i) => (
          <a.Icon
            key={`accent-${i}`}
            size={a.size}
            className={`floating-accent ${a.depth === 'near' ? 'floating-accent-near' : 'floating-accent-far'} z-[1]`}
            aria-hidden
            style={{
              top: a.top, left: a.left,
              opacity: a.opacity,
              '--accent-rot': `${a.rotate}deg`,
              animation: `${a.anim} ${a.dur}s ease-in-out ${a.delay}s infinite`,
            } as React.CSSProperties}
          />
        ))}

        {/* Constellation dots — subtle pulsing points */}
        {DOTS.map((d, i) => (
          <div
            key={`dot-${i}`}
            className="constellation-dot z-[1]"
            aria-hidden
            style={{
              width: d.size, height: d.size,
              top: d.top, left: d.left,
              '--dot-base': d.opacity,
              animation: `dot-pulse ${d.dur}s ease-in-out ${d.delay}s infinite`,
            } as React.CSSProperties}
          />
        ))}

        {NODE_ACCENTS.map((node, i) => (
          <div
            key={`node-${i}`}
            className="node-accent z-[1]"
            aria-hidden
            style={{
              top: node.top,
              left: node.left,
              width: node.size,
              height: node.size,
              opacity: node.opacity,
              animation: `dot-pulse ${node.dur}s ease-in-out ${node.delay}s infinite`,
            }}
          />
        ))}

        {/* Particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={`part-${i}`}
            className="particle z-[1]"
            aria-hidden
            style={{
              width: p.size, height: p.size,
              top: p.top, left: p.left,
              animation: `${p.anim} ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        <Navigation onGetStartedClick={openAuthModal} />

        <main className="relative z-[2]">
          <Hero onUploadClick={openAuthModal} />
          <HowItWorks />
          <Features />
          <LiveDemo />
          <CTA onGetStartedClick={openAuthModal} />
          <Footer />
        </main>

        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      </div>
    </LanguageProvider>
  );
}

export default App;
