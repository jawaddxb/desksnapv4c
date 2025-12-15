/**
 * Features Section - Editorial Variant
 * Side-by-side image/text blocks with SVG illustrations
 * Asymmetric editorial layout with generous white space
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Edit3, Layout, Palette } from 'lucide-react';
import { tw, variants } from '../shared/tokens';
import { IdeateIllustration, DraftIllustration, PolishIllustration } from './illustrations';

const features = [
  {
    id: 1,
    title: 'Ideate with AI',
    description: 'Start with your ideas and let AI help structure your story. No more blank page anxiety. Our intelligent system understands context and helps you organize thoughts into a compelling narrative.',
    illustration: IdeateIllustration,
    icon: Sparkles,
    alignment: 'left' as const,
    accent: '#FBBF24',
  },
  {
    id: 2,
    title: 'Draft Without Friction',
    description: 'Focus on your message, not formatting. Draft mode lets you build your presentation structure with AI-powered suggestions, smart layouts, and instant previews.',
    illustration: DraftIllustration,
    icon: Edit3,
    alignment: 'right' as const,
    accent: '#6B8E6B',
  },
  {
    id: 3,
    title: 'Polish to Perfection',
    description: 'Choose from 30+ curated themes and 60+ layout archetypes. Every element is designed to work together, giving your presentation a professional, cohesive look.',
    illustration: PolishIllustration,
    icon: Palette,
    alignment: 'left' as const,
    accent: '#6B8E6B',
  },
];

export const Features: React.FC = () => {
  return (
    <section className="relative py-32 bg-[#FAFBF8] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#6B8E6B]/3"
          style={{ top: '10%', right: '-10%' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-[#6B8E6B]/4"
          style={{ bottom: '20%', left: '-8%' }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        {/* Section header */}
        <motion.div
          className="max-w-3xl mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={variants.stagger}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B8E6B]/10 border border-[#6B8E6B]/20 mb-6"
            variants={variants.fadeIn}
          >
            <Layout size={16} className="text-[#6B8E6B]" />
            <span className="text-sm font-medium text-[#4A5D4A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              How it works
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl lg:text-6xl font-bold text-[#1E2E1E] leading-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            variants={variants.fadeInUp}
          >
            From idea to
            <span className="block text-[#6B8E6B]">polished deck</span>
          </motion.h2>

          <motion.p
            className="text-xl text-[#4A5D4A] leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
            variants={variants.fadeInUp}
          >
            A thoughtful workflow that mirrors how creative professionals actually work—with room for exploration, iteration, and refinement.
          </motion.p>
        </motion.div>

        {/* Feature blocks */}
        <div className="space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const Illustration = feature.illustration;

            return (
              <motion.div
                key={feature.id}
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  feature.alignment === 'right' ? 'lg:grid-flow-dense' : ''
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-150px' }}
                variants={variants.stagger}
              >
                {/* Illustration side */}
                <motion.div
                  className={`relative ${feature.alignment === 'right' ? 'lg:col-start-2' : ''}`}
                  variants={variants.fadeIn}
                >
                  {/* Background accent */}
                  <motion.div
                    className="absolute -inset-12 bg-white rounded-3xl -z-10 shadow-[0_8px_32px_rgba(107,142,107,0.08)]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />

                  {/* Illustration */}
                  <div className="relative p-8">
                    <Illustration className="w-full h-auto" />
                  </div>

                  {/* Floating number badge */}
                  <motion.div
                    className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-[#6B8E6B] flex items-center justify-center shadow-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4, type: 'spring' }}
                  >
                    <span
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {feature.id}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Content side */}
                <motion.div
                  className={`space-y-6 ${feature.alignment === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                  variants={variants.fadeInUp}
                >
                  {/* Icon badge */}
                  <motion.div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6B8E6B]/10 border border-[#6B8E6B]/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon size={28} className="text-[#6B8E6B]" />
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="text-4xl lg:text-5xl font-bold text-[#1E2E1E] leading-tight"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-lg lg:text-xl text-[#4A5D4A] leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {feature.description}
                  </p>

                  {/* Feature highlights */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {feature.id === 1 && (
                      <>
                        <FeaturePill>Smart Brainstorming</FeaturePill>
                        <FeaturePill>Context-Aware AI</FeaturePill>
                        <FeaturePill>Story Structure</FeaturePill>
                      </>
                    )}
                    {feature.id === 2 && (
                      <>
                        <FeaturePill>Auto-Layout</FeaturePill>
                        <FeaturePill>Live Preview</FeaturePill>
                        <FeaturePill>Quick Iterations</FeaturePill>
                      </>
                    )}
                    {feature.id === 3 && (
                      <>
                        <FeaturePill>60+ Layouts</FeaturePill>
                        <FeaturePill>30+ Themes</FeaturePill>
                        <FeaturePill>AI Images</FeaturePill>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-32 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants.fadeInUp}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-[#D4E5D4] shadow-[0_4px_16px_rgba(107,142,107,0.1)]">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B8E6B] to-[#4A5D4A] border-2 border-white"
                />
              ))}
            </div>
            <span className="text-sm text-[#4A5D4A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Join thousands of creators making better presentations
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Helper component for feature pills
const FeaturePill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className="px-4 py-2 rounded-full bg-[#6B8E6B]/10 text-sm font-medium text-[#4A5D4A] border border-[#6B8E6B]/20"
    style={{ fontFamily: 'Inter, sans-serif' }}
  >
    {children}
  </span>
);

export default Features;
