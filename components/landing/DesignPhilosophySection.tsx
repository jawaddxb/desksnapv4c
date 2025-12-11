/**
 * DesignPhilosophySection Component
 *
 * Wabi-Sabi philosophy teaser for the homepage.
 * "Design that breathes."
 * Studio Noir aesthetic.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hexagon, Circle, Triangle } from 'lucide-react';

export const DesignPhilosophySection: React.FC = () => {
  return (
    <section className="py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual - Organic shapes */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] bg-white/5 border border-white/10 relative overflow-hidden">
              {/* Organic asymmetric layout preview */}
              <div className="absolute inset-6">
                {/* Structured side */}
                <div className="absolute left-0 top-0 w-1/2 h-full pr-4">
                  <div className="h-full flex flex-col justify-center space-y-4">
                    <div className="w-8 h-1 bg-[#c5a47e]" />
                    <div className="w-full h-6 bg-white/10" />
                    <div className="w-3/4 h-6 bg-white/10" />
                    <div className="w-1/2 h-6 bg-white/10" />
                  </div>
                </div>

                {/* Organic side */}
                <div className="absolute right-0 top-0 w-1/2 h-full pl-4">
                  <div className="h-full flex items-center justify-center relative">
                    {/* Organic blob shape */}
                    <div
                      className="w-32 h-40 bg-[#c5a47e]/20 border border-[#c5a47e]/30"
                      style={{
                        borderRadius: '60% 40% 55% 45% / 55% 45% 60% 40%',
                      }}
                    />
                    {/* Floating accents */}
                    <div className="absolute top-8 right-8">
                      <Hexagon className="w-6 h-6 text-[#c5a47e]/30" />
                    </div>
                    <div className="absolute bottom-12 left-4">
                      <Circle className="w-4 h-4 text-white/20" />
                    </div>
                    <div className="absolute top-1/3 right-4">
                      <Triangle className="w-3 h-3 text-[#c5a47e]/20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/80 border border-white/20">
                <span className="text-xs text-white/60">Structured</span>
                <span className="text-white/20">+</span>
                <span className="text-xs text-[#c5a47e]">Organic</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              Design Philosophy
            </span>

            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Design that breathes.
            </h2>

            <p className="text-xl text-white/60 leading-relaxed mb-6">
              We built DeckSnap on the principle of wabi-sabi—the Japanese philosophy of
              finding beauty in imperfection and transience.
            </p>

            <p className="text-lg text-white/60 leading-relaxed mb-8">
              Our design system offers hundreds of patterns that balance precision with
              organic flow. Structured when you need authority. Natural when you need warmth.
            </p>

            <p className="text-xl text-white mb-10">
              Your decks won't look like everyone else's.{' '}
              <span className="text-[#c5a47e]">They'll look like yours.</span>
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#c5a47e] hover:text-white transition-colors group"
            >
              Learn about our philosophy
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignPhilosophySection;
