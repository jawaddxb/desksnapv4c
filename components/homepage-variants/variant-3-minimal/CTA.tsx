/**
 * CTA Section - Variant 3: Minimalist Statement
 * Clean, centered call-to-action with subtle border
 */

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { tokens } from '../shared/tokens';

interface CTAProps {
  onGetStarted: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onGetStarted }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA card */}
        <motion.div
          className="relative rounded-3xl border-2 p-16 md:p-24 text-center overflow-hidden"
          style={{
            borderColor: tokens.colors.border,
            background: tokens.colors.surface,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle gradient background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${tokens.colors.accent} 0%, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Headline */}
            <motion.h2
              className="text-[clamp(36px,6vw,72px)] font-light leading-[1.1] tracking-tight mb-6"
              style={{
                fontFamily: tokens.fonts.display,
                color: tokens.colors.text,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Ready to create?
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
              style={{
                fontFamily: tokens.fonts.body,
                color: tokens.colors.textSecondary,
                lineHeight: 1.6,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Start building presentations that think with you.
              <br className="hidden md:block" />
              No credit card required.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.button
                className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-medium rounded-full overflow-hidden"
                style={{
                  fontFamily: tokens.fonts.body,
                  background: tokens.colors.accent,
                  color: tokens.colors.textOnAccent,
                  boxShadow: tokens.shadows.md,
                }}
                onClick={onGetStarted}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: tokens.colors.accentHover }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />

                <span className="relative z-10">Get Started for Free</span>

                {/* Arrow icon */}
                <motion.svg
                  className="relative z-10 ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </motion.button>
            </motion.div>

            {/* Trust badge */}
            <motion.p
              className="mt-8 text-sm"
              style={{
                fontFamily: tokens.fonts.body,
                color: tokens.colors.textMuted,
              }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Join 10,000+ creators making better presentations
            </motion.p>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-5 pointer-events-none"
          style={{ background: tokens.colors.accent }}
          initial={{ scale: 0, rotate: 0 }}
          animate={isInView ? { scale: 1, rotate: 180 } : { scale: 0, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-5 pointer-events-none"
          style={{ background: tokens.colors.accent }}
          initial={{ scale: 0, rotate: 0 }}
          animate={isInView ? { scale: 1, rotate: -180 } : { scale: 0, rotate: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
        />
      </div>
    </section>
  );
};

export default CTA;
