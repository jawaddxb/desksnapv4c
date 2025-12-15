/**
 * Variant 1: Refined Current
 * Studio Noir layout structure with Bento Matcha palette
 *
 * A polished, professional homepage that recolors the existing Studio Noir design
 * with soft sage backgrounds and forest green accents, maintaining the animated
 * 3-stage workflow visualization.
 */

import React from 'react';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { Testimonials } from './Testimonials';
import { CTA } from './CTA';

interface Variant1RefinedProps {
  onGetStarted: () => void;
}

export default function Variant1Refined({ onGetStarted }: Variant1RefinedProps) {
  return (
    <div className="bg-white">
      <Hero onGetStarted={onGetStarted} />
      <HowItWorks />
      <Testimonials />
      <CTA onGetStarted={onGetStarted} />
    </div>
  );
}
