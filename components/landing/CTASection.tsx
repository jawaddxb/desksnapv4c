/**
 * CTASection Component
 *
 * Final call-to-action section before footer.
 * Wabi-Sabi aesthetic with bold, encouraging copy.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-24 md:py-32 bg-[#1a1a2e] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Kintsugi-inspired gold lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-5"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          <path
            d="M0 200 Q200 100 400 200 T800 200"
            stroke="#d4af37"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 300 Q300 200 500 300 T800 250"
            stroke="#d4af37"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        {/* Organic blob */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 opacity-5"
          style={{
            background: 'radial-gradient(ellipse at center, #d4af37 0%, transparent 70%)',
            borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-8 border border-white/10">
          <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
          <span className="text-sm text-white/60">No credit card required</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
          Your Ideas Are Ready.{' '}
          <span className="relative inline-block">
            Let Them Out.
            <svg
              className="absolute -bottom-2 left-0 w-full h-4 text-[#d4af37]/40"
              viewBox="0 0 200 16"
              preserveAspectRatio="none"
            >
              <path
                d="M0 8 Q50 2 100 8 T200 8"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
          Stop perfecting. Start presenting. Create your first deck in minutes—for free.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#d4af37] text-[#1a1a2e] font-semibold rounded-full hover:bg-[#e5c348] transition-all duration-500 hover:scale-[1.02]"
          >
            Create Your First Deck — Free
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Philosophy tagline */}
        <p className="mt-12 text-sm text-white/40 italic">
          "Done beats perfect. Always."
        </p>
      </div>
    </section>
  );
};

export default CTASection;
