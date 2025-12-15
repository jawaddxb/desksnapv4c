/**
 * Hero Section - Variant 3: Minimalist Statement
 * MASSIVE typography with maximum whitespace, no images
 */

import React from 'react';
import { motion } from 'framer-motion';
import { tokens, tw, variants } from '../shared/tokens';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  // Staggered word animation
  const sentence = "Decks that think with you.";
  const words = sentence.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth reveal
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center px-6 overflow-hidden">
      {/* Subtle background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(107, 142, 107, 0.03) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto text-center">
        {/* Massive headline with staggered animation */}
        <motion.h1
          className="text-[clamp(56px,8vw,120px)] font-light leading-[1.05] tracking-tight mb-16"
          style={{ fontFamily: tokens.fonts.display, color: tokens.colors.text }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={wordVariants}
              style={{ marginRight: index < words.length - 1 ? '0.25em' : 0 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle with delayed fade-in */}
        <motion.p
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-20"
          style={{
            fontFamily: tokens.fonts.body,
            color: tokens.colors.textSecondary,
            lineHeight: 1.6,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          AI-powered presentations that adapt to your story,
          <br className="hidden md:block" />
          not the other way around.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <motion.button
            className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-medium rounded-full overflow-hidden"
            style={{
              fontFamily: tokens.fonts.body,
              background: tokens.colors.accent,
              color: tokens.colors.textOnAccent,
            }}
            onClick={onGetStarted}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button gradient overlay on hover */}
            <motion.div
              className="absolute inset-0"
              style={{ background: tokens.colors.accentHover }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />

            <span className="relative z-10">Get Started</span>

            {/* Arrow icon with slide animation */}
            <motion.svg
              className="relative z-10 ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5"
            style={{ borderColor: tokens.colors.border }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: tokens.colors.accent }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
