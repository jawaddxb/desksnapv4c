/**
 * FeaturesPreview Component
 *
 * 4-card feature overview for homepage.
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { Sparkles, Palette, Image, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    headline: 'Describe, Don\'t Design',
    copy: 'Tell us your topic. Our AI understands context, not just keywords—creating slides that actually make sense together.',
    benefit: 'Go from blank page to complete deck in under 5 minutes.',
  },
  {
    icon: Palette,
    headline: 'Find Your Visual Voice',
    copy: 'From Kintsugi gold to Bauhaus geometry, from Tokyo neon to Nordic calm. Not templates—design systems that adapt to your content.',
    benefit: 'Stand out in a sea of identical slides.',
  },
  {
    icon: Image,
    headline: 'No More Stock Photo Hunting',
    copy: 'Every slide gets custom visuals generated to match your theme. Cohesive. Distinctive. Yours.',
    benefit: 'Spend zero time on image search.',
  },
  {
    icon: RefreshCw,
    headline: 'Refine With Confidence',
    copy: 'Remix layouts, adjust tone, regenerate images—all without starting over. Your presentation evolves as your thinking does.',
    benefit: 'Permission to ship early and improve often.',
  },
];

export const FeaturesPreview: React.FC = () => {
  return (
    <section id="features" className="py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
            Why DeckSnap
          </span>
          <h2 className="text-5xl md:text-6xl font-light mb-6">
            AI That Gets It
          </h2>
          <p className="text-xl text-white/60">
            Not another template gallery. A creative partner that understands what makes presentations actually work.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-white/10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-black p-12 hover:bg-white/5 transition-colors group"
              >
                {/* Icon */}
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8 group-hover:border-[#c5a47e] transition-colors">
                  <Icon className="w-6 h-6 text-white/60 group-hover:text-[#c5a47e] transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-light mb-4">
                  {feature.headline}
                </h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  {feature.copy}
                </p>

                {/* Benefit */}
                <div className="inline-flex items-center gap-2 text-sm text-white/40">
                  <span className="w-1 h-1 bg-[#c5a47e]" />
                  {feature.benefit}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesPreview;
