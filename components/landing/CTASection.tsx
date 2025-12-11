/**
 * CTASection Component
 *
 * Final call-to-action section before footer.
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-32 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 mb-12">
          <span className="w-1.5 h-1.5 bg-[#c5a47e]" />
          <span className="text-sm text-white/60">No credit card required</span>
        </div>

        {/* Headline */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-[0.95]">
          Your Ideas Are Ready.
          <br />
          <span className="text-[#c5a47e]">Let Them Out.</span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
          Stop perfecting. Start presenting. Create your first deck in minutes—for free.
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-3 px-10 py-5 bg-[#c5a47e] text-black font-medium hover:bg-white transition-colors duration-150"
        >
          Create Your First Deck — Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Philosophy tagline */}
        <p className="mt-16 text-sm text-white/30 italic">
          "Done beats perfect. Always."
        </p>
      </div>
    </section>
  );
};

export default CTASection;
