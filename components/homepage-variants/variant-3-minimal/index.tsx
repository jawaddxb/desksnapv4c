/**
 * Variant 3: Minimalist Statement Homepage
 *
 * Design Philosophy:
 * - Ultra-clean, typography-first design
 * - Maximum whitespace (95% white background)
 * - Single accent color: #6B8E6B (forest green)
 * - NO images in hero - pure typography impact
 * - Elegant text reveal animations
 * - Subtle micro-interactions
 * - Large generous spacing (100-150px between sections)
 *
 * Sections:
 * 1. Hero - MASSIVE headline (80-120px), no images
 * 2. Features - Three animated words + feature list
 * 3. Testimonials - Single quote display with rotation
 * 4. CTA - Clean centered button with subtle border
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from './Hero';
import { Features } from './Features';
import { Testimonials } from './Testimonials';
import { CTA } from './CTA';
import { Logo } from '../shared/CommonComponents';
import { tokens } from '../shared/tokens';

interface Variant3MinimalProps {
  onGetStarted: () => void;
}

export const Variant3Minimal: React.FC<Variant3MinimalProps> = ({ onGetStarted }) => {
  const [showNav, setShowNav] = React.useState(false);

  // Show nav on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-white">
      {/* Minimal floating navigation */}
      <motion.nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full backdrop-blur-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${tokens.colors.border}`,
          boxShadow: tokens.shadows.sm,
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: showNav ? 0 : -100,
          opacity: showNav ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-8">
          <Logo variant="dark" size="sm" />

          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm transition-colors"
              style={{
                fontFamily: tokens.fonts.body,
                color: tokens.colors.textSecondary,
              }}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm transition-colors"
              style={{
                fontFamily: tokens.fonts.body,
                color: tokens.colors.textSecondary,
              }}
            >
              Testimonials
            </a>

            <motion.button
              className="px-5 py-2 text-sm font-medium rounded-full"
              style={{
                fontFamily: tokens.fonts.body,
                background: tokens.colors.accent,
                color: tokens.colors.textOnAccent,
              }}
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Sections */}
      <Hero onGetStarted={onGetStarted} />

      <div id="features">
        <Features />
      </div>

      <div id="testimonials">
        <Testimonials />
      </div>

      <CTA onGetStarted={onGetStarted} />

      {/* Minimal footer */}
      <footer className="relative py-12 px-6 border-t" style={{ borderColor: tokens.colors.border }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo variant="dark" size="sm" />

            <div className="flex items-center gap-8">
              <a
                href="#"
                className="text-sm transition-colors hover:opacity-70"
                style={{
                  fontFamily: tokens.fonts.body,
                  color: tokens.colors.textMuted,
                }}
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm transition-colors hover:opacity-70"
                style={{
                  fontFamily: tokens.fonts.body,
                  color: tokens.colors.textMuted,
                }}
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm transition-colors hover:opacity-70"
                style={{
                  fontFamily: tokens.fonts.body,
                  color: tokens.colors.textMuted,
                }}
              >
                Contact
              </a>
            </div>

            <p
              className="text-sm"
              style={{
                fontFamily: tokens.fonts.body,
                color: tokens.colors.textMuted,
              }}
            >
              © 2025 DeckSnap. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Variant3Minimal;
