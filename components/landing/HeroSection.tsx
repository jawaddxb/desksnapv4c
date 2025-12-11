/**
 * HeroSection Component
 *
 * Main hero section with Studio Noir aesthetic.
 * High-contrast black, white, and gold design.
 */

import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20">
              <span className="w-1.5 h-1.5 bg-[#c5a47e]" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                AI-Powered Presentations
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight">
              {['Presentations', 'with', 'Character'].map((word, i) => (
                <span key={i} className={i === 2 ? 'text-[#c5a47e]' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-white/60 max-w-md leading-relaxed">
              AI-powered slide design for modern creators. Create distinctive decks that move audiences—not just impress them.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-6">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-[#c5a47e] transition-colors duration-150"
              >
                Start Creating Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-150"
              >
                <Play className="w-4 h-4" />
                See How It Works
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                Trusted by creators at
              </p>
              <div className="flex items-center gap-8">
                {['Stanford', 'RISD', 'Figma', 'Linear', 'Notion'].map((name) => (
                  <span
                    key={name}
                    className="text-sm text-white/40 font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="relative">
            <div className="aspect-[4/3] bg-white/5 border border-white/10 relative overflow-hidden">
              {/* Mock slide preview */}
              <div className="absolute inset-4 bg-gradient-to-br from-white/10 to-transparent">
                <div className="p-8">
                  <div className="w-16 h-1 bg-[#c5a47e] mb-6" />
                  <div className="w-48 h-6 bg-white/20 mb-3" />
                  <div className="w-36 h-6 bg-white/20" />
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute bottom-4 left-4 px-4 py-3 bg-black border border-white/20">
                <span className="text-3xl font-light">60+</span>
                <span className="text-xs text-white/60 ml-2">Unique Archetypes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
