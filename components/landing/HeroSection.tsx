/**
 * HeroSection Component
 *
 * Main hero section with Wabi-Sabi aesthetic.
 * Features asymmetric layout, gold accents, and organic shapes.
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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#fafaf8]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Organic blob shapes */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 opacity-[0.03]"
          style={{
            background: 'radial-gradient(ellipse at center, #d4af37 0%, transparent 70%)',
            borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
          }}
        />
        <div
          className="absolute top-1/2 -left-32 w-64 h-64 opacity-[0.02]"
          style={{
            background: 'radial-gradient(ellipse at center, #1a1a2e 0%, transparent 70%)',
            borderRadius: '40% 60% 45% 55% / 55% 45% 55% 45%',
          }}
        />
        {/* Kintsugi-inspired gold line */}
        <svg
          className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M20 180 Q50 120 80 140 T140 80 T180 20"
            stroke="#d4af37"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content - Asymmetric positioning */}
          <div className="lg:pr-8">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f5f3ef] rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b]">
                AI-Powered Presentations
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-[#1a1a2e] leading-[1.1] mb-6">
              Presentations{' '}
              <span className="relative">
                with
                <svg
                  className="absolute -bottom-1 left-0 w-full h-3 text-[#d4af37]/30"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 6 Q25 2 50 6 T100 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>{' '}
              <br />
              Character
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-[#6b6b6b] leading-relaxed mb-8 max-w-lg">
              AI-powered slide design inspired by Wabi-Sabi philosophy.
              Create distinctive decks that move audiences—not just impress them.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1a1a2e] text-white font-medium rounded-full hover:bg-[#2a2a3e] transition-all duration-500 hover:scale-[1.02]"
              >
                Start Creating Free
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-[#e5e2dd] text-[#1a1a2e] font-medium rounded-full hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all duration-500"
              >
                <Play className="w-4 h-4" />
                See How It Works
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t border-[#e5e2dd]">
              <p className="text-sm text-[#6b6b6b] mb-4">
                Trusted by creators at
              </p>
              <div className="flex flex-wrap items-center gap-6 opacity-50">
                {/* Placeholder logos */}
                {['Stanford', 'RISD', 'Figma', 'Linear', 'Notion'].map((name) => (
                  <span
                    key={name}
                    className="text-sm font-semibold text-[#1a1a2e] tracking-tight"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="relative lg:pl-8">
            {/* Decorative frame */}
            <div
              className="absolute -inset-4 bg-gradient-to-br from-[#d4af37]/5 to-transparent rounded-3xl"
              style={{
                borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
              }}
            />

            {/* Preview Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-zinc-200/50 overflow-hidden border border-[#e5e2dd]">
              {/* Mock slide preview */}
              <div className="aspect-[16/10] bg-gradient-to-br from-[#1a1a2e] to-[#2a2a3e] p-8 flex flex-col justify-between">
                {/* Slide content mock */}
                <div>
                  <div className="w-24 h-2 bg-[#d4af37]/60 rounded mb-4" />
                  <div className="w-48 h-6 bg-white/20 rounded mb-2" />
                  <div className="w-36 h-6 bg-white/20 rounded" />
                </div>

                {/* Decorative elements */}
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <div className="w-32 h-2 bg-white/10 rounded" />
                    <div className="w-24 h-2 bg-white/10 rounded" />
                    <div className="w-28 h-2 bg-white/10 rounded" />
                  </div>
                  <div
                    className="w-32 h-32 bg-[#d4af37]/20 rounded-2xl"
                    style={{
                      borderRadius: '40% 60% 55% 45% / 45% 55% 50% 50%',
                    }}
                  />
                </div>
              </div>

              {/* Theme indicator */}
              <div className="px-6 py-4 bg-[#fafaf8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1a1a2e]" />
                  <span className="text-sm font-medium text-[#1a1a2e]">Kintsugi Theme</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#d4af37]" />
                  <div className="w-3 h-3 rounded-full bg-[#c4a484]" />
                  <div className="w-3 h-3 rounded-full bg-[#1a1a2e]" />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-white rounded-full shadow-lg border border-[#e5e2dd] flex items-center gap-2">
              <span className="text-2xl">60+</span>
              <span className="text-xs text-[#6b6b6b]">Unique<br/>Archetypes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
