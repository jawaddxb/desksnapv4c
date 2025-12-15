/**
 * Features Section - Variant 3: Minimalist Statement
 * Animated three words + simple feature list
 */

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { tokens } from '../shared/tokens';
import { Lightbulb, Edit3, Layout, Image, Palette, Users } from 'lucide-react';

export const Features: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Three words animation
  const threeWords = ['Ideate.', 'Draft.', 'Polish.'];

  const wordVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Feature list data
  const features = [
    {
      icon: Lightbulb,
      title: 'Ideate with AI',
      description: 'Start with sticky notes and let AI help you brainstorm. No blank page anxiety.',
    },
    {
      icon: Edit3,
      title: 'Draft Mode',
      description: 'Focus on your story structure before committing to design details.',
    },
    {
      icon: Layout,
      title: '60+ Archetypes',
      description: 'Professional layouts that adapt to your content, not the other way around.',
    },
    {
      icon: Image,
      title: 'AI Image Generation',
      description: 'Generate contextual images that match your presentation\'s theme and message.',
    },
    {
      icon: Palette,
      title: 'Theme System',
      description: '30+ curated themes with typography, colors, and visual styles that work together.',
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Work together with your team, with changes synced instantly.',
    },
  ];

  return (
    <section ref={ref} className="relative py-32 md:py-40 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Three Words - Massive and centered */}
        <div className="text-center mb-32">
          <div className="space-y-4">
            {threeWords.map((word, index) => (
              <motion.h2
                key={word}
                className="text-[clamp(56px,10vw,140px)] font-light leading-none tracking-tight"
                style={{
                  fontFamily: tokens.fonts.display,
                  color: tokens.colors.text,
                }}
                custom={index}
                variants={wordVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {word}
              </motion.h2>
            ))}
          </div>

          {/* Divider line */}
          <motion.div
            className="w-24 h-0.5 mx-auto mt-16"
            style={{ background: tokens.colors.accent }}
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </div>

        {/* Feature List - Simple and clean */}
        <motion.div
          className="space-y-12"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 1.0,
              },
            },
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="flex items-start gap-6 group"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                {/* Icon - Minimal line style */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: tokens.colors.accentLight,
                    color: tokens.colors.accent,
                  }}
                >
                  <Icon size={20} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5">
                  <h3
                    className="text-xl font-medium mb-2"
                    style={{
                      fontFamily: tokens.fonts.body,
                      color: tokens.colors.text,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-lg leading-relaxed max-w-xl"
                    style={{
                      fontFamily: tokens.fonts.body,
                      color: tokens.colors.textSecondary,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Hover indicator line */}
                <motion.div
                  className="w-px h-full ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: tokens.colors.accent }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
