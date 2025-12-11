/**
 * ProblemSection Component
 *
 * Positioning section that highlights what's wrong with other AI deck tools.
 * "Most AI deck tools skip the thinking."
 * Studio Noir aesthetic.
 */

import React from 'react';
import { ArrowRight, Lightbulb, FileEdit, Sparkles } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main positioning statement */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8">
            Most AI deck tools{' '}
            <span className="text-white/40">skip the thinking.</span>
          </h2>
          <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
            They take your prompt and hand you a finished product. Fast, yes. But also flat.
            No room for exploration. No space to develop your ideas.
          </p>
        </div>

        {/* Visual comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Other tools - Linear approach */}
          <div className="p-8 bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                Other AI Tools
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 py-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-white/40 text-sm">Topic</span>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-white/20" />

              <div className="text-center">
                <div className="w-24 h-16 bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-white/40 text-sm">Slides</span>
                </div>
              </div>
            </div>

            <p className="text-white/40 text-center text-sm">
              Straight to output. No thinking involved.
            </p>
          </div>

          {/* DeckSnap - Process approach */}
          <div className="p-8 bg-[#c5a47e]/5 border border-[#c5a47e]/20">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e]">
                DeckSnap
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 py-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-[#c5a47e]/10 border border-[#c5a47e]/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-[#c5a47e]/60 text-xs">Topic</span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-[#c5a47e]/40" />

              <div className="text-center">
                <div className="w-14 h-14 bg-[#c5a47e]/20 border border-[#c5a47e]/40 flex items-center justify-center mx-auto mb-2">
                  <Lightbulb className="w-5 h-5 text-[#c5a47e]" />
                </div>
                <span className="text-[#c5a47e]/60 text-xs">Ideate</span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#c5a47e]/40" />

              <div className="text-center">
                <div className="w-14 h-14 bg-[#c5a47e]/20 border border-[#c5a47e]/40 flex items-center justify-center mx-auto mb-2">
                  <FileEdit className="w-5 h-5 text-[#c5a47e]" />
                </div>
                <span className="text-[#c5a47e]/60 text-xs">Draft</span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#c5a47e]/40" />

              <div className="text-center">
                <div className="w-14 h-14 bg-[#c5a47e]/20 border border-[#c5a47e]/40 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-5 h-5 text-[#c5a47e]" />
                </div>
                <span className="text-[#c5a47e]/60 text-xs">Polish</span>
              </div>
            </div>

            <p className="text-[#c5a47e] text-center text-sm">
              A creative process, not just a generator.
            </p>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl text-white font-light leading-relaxed">
            DeckSnap is different. We built a creative process—not just a generator.{' '}
            <span className="text-[#c5a47e]">
              Because your best ideas don't arrive fully formed. They emerge.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
