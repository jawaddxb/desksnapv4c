/**
 * Variant 2: Image-Rich Editorial Homepage
 *
 * Magazine-style editorial layout with large custom SVG illustrations.
 * Features oversized serif typography, asymmetric layouts, and generous white space.
 *
 * Design Philosophy:
 * - Editorial serif headlines (Playfair Display)
 * - Clean sans body text (Inter)
 * - Large custom SVG illustrations throughout
 * - Asymmetric magazine-style layouts
 * - White/cream backgrounds with forest green accents
 * - Abstract decorative shapes in brand colors
 */

import React from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Gallery } from './Gallery';
import { Testimonials } from './Testimonials';
import { CTA } from './CTA';

interface Variant2EditorialProps {
  onGetStarted: () => void;
}

const Variant2Editorial: React.FC<Variant2EditorialProps> = ({ onGetStarted }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Hero Section: Split layout with 60% SVG illustration + 40% headline */}
      <Hero onGetStarted={onGetStarted} />

      {/* Features Section: Side-by-side image/text blocks */}
      <Features />

      {/* Gallery Section: Grid of theme preview illustrations */}
      <Gallery />

      {/* Testimonials Section: Cards with abstract avatar illustrations */}
      <Testimonials />

      {/* CTA Section: Full-width with decorative SVG background */}
      <CTA onGetStarted={onGetStarted} />

      {/* Global font imports for editorial typography */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap');

          /* Smooth scroll behavior */
          html {
            scroll-behavior: smooth;
          }

          /* Remove default margins for editorial typography */
          h1, h2, h3, h4, h5, h6 {
            margin: 0;
            line-height: 1.1;
          }

          /* Enhance readability */
          p {
            margin: 0;
          }

          /* Custom selection color */
          ::selection {
            background-color: rgba(107, 142, 107, 0.2);
            color: #1E2E1E;
          }

          /* Webkit scrollbar styling */
          ::-webkit-scrollbar {
            width: 12px;
          }

          ::-webkit-scrollbar-track {
            background: #F5FAF7;
          }

          ::-webkit-scrollbar-thumb {
            background: #6B8E6B;
            border-radius: 6px;
            border: 3px solid #F5FAF7;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #5A7A5A;
          }
        `
      }} />
    </div>
  );
};

export default Variant2Editorial;
