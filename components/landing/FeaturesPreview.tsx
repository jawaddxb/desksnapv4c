/**
 * FeaturesPreview Component
 *
 * 4-card feature overview for homepage.
 * Wabi-Sabi aesthetic with organic hover effects.
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
    <section id="features" className="py-24 md:py-32 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
            Why DeckSnap
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a2e] mb-4">
            AI That Gets It
          </h2>
          <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto">
            Not another template gallery. A creative partner that understands what makes presentations actually work.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-[#e5e2dd] hover:border-[#d4af37]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#d4af37]/5"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#f5f3ef] flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-[#1a1a2e] group-hover:text-[#d4af37] transition-colors duration-500" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">
                  {feature.headline}
                </h3>
                <p className="text-[#6b6b6b] leading-relaxed mb-4">
                  {feature.copy}
                </p>

                {/* Benefit Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f5f3ef] rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
                  <span className="text-sm text-[#6b6b6b]">{feature.benefit}</span>
                </div>

                {/* Decorative corner element */}
                <div
                  className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, transparent 50%, #d4af37 50%)',
                    opacity: 0.1,
                    borderRadius: '0 0.75rem 0 0',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesPreview;
