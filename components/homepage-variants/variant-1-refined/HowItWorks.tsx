/**
 * Variant 1: Refined Current - How It Works Section
 * 3-stage process explanation with alternating backgrounds
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, FileText, Sparkles, Image, Layout, Palette } from 'lucide-react';
import { tokens, tw, variants } from '../shared/tokens';

const steps = [
  {
    number: '01',
    title: 'Ideate with AI',
    description:
      'Start with a simple prompt. Our AI generates a presentation plan with sticky notes, helping you brainstorm structure and key points without the pressure of a blank page.',
    features: [
      'AI-powered brainstorming',
      'Sticky note ideation',
      'Smart content suggestions',
      'Topic analysis',
    ],
    icon: Lightbulb,
    bgColor: '#F5FAF7', // sage
  },
  {
    number: '02',
    title: 'Draft & Structure',
    description:
      'Transform sticky notes into slides with Draft Mode. Focus on your narrative flow and content hierarchy before committing to visual design. Add, reorder, and refine.',
    features: [
      '60+ layout archetypes',
      'Smart content blocks',
      'Drag-and-drop editing',
      'Speaker notes',
    ],
    icon: FileText,
    bgColor: '#FFFFFF', // white
  },
  {
    number: '03',
    title: 'Polish & Present',
    description:
      'Choose from 30+ curated themes, generate contextual AI images, and fine-tune typography. Export to PDF or present directly with our optimized presentation mode.',
    features: [
      'AI image generation',
      '30+ premium themes',
      'Advanced typography',
      'Export & share',
    ],
    icon: Sparkles,
    bgColor: '#F5FAF7', // sage
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className={`relative py-32 overflow-hidden`}>
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={variants.fadeInUp}
        >
          <span
            className={`inline-block ${tw.textAccent} text-sm font-semibold uppercase tracking-wider mb-4`}
          >
            How It Works
          </span>
          <h2
            className={`text-5xl lg:text-6xl font-bold ${tw.textPrimary} mb-6`}
            style={{ fontFamily: tokens.fonts.display }}
          >
            From idea to impact
            <br />
            in three steps
          </h2>
          <p className={`text-xl ${tw.textSecondary} max-w-2xl mx-auto`}>
            Our AI-powered workflow guides you from rough concept to polished presentation,
            focusing your energy where it matters most: your story.
          </p>
        </motion.div>
      </div>

      {/* Process Steps */}
      <div className="space-y-0">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={variants.fadeIn}
            className="relative"
            style={{ backgroundColor: step.bgColor }}
          >
            <div className="max-w-7xl mx-auto px-6 py-20">
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <motion.div
                  variants={variants.fadeInUp}
                  className={index % 2 === 1 ? 'lg:order-2' : ''}
                >
                  {/* Step number */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl ${tw.bgAccent} flex items-center justify-center ${tw.shadowGlow}`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div
                      className={`text-7xl font-bold ${tw.textAccent} opacity-20`}
                      style={{ fontFamily: tokens.fonts.display }}
                    >
                      {step.number}
                    </div>
                  </div>

                  <h3
                    className={`text-4xl font-bold ${tw.textPrimary} mb-4`}
                    style={{ fontFamily: tokens.fonts.display }}
                  >
                    {step.title}
                  </h3>

                  <p className={`text-lg ${tw.textSecondary} mb-8 leading-relaxed`}>
                    {step.description}
                  </p>

                  {/* Features list */}
                  <div className="grid grid-cols-2 gap-3">
                    {step.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-2 ${tw.textSecondary}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${tw.bgAccent}`} />
                        <span className="text-sm font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Visual */}
                <motion.div
                  variants={variants.scaleIn}
                  className={index % 2 === 1 ? 'lg:order-1' : ''}
                >
                  <div
                    className={`relative ${tw.bgSecondary} rounded-3xl p-8 ${tw.shadow} overflow-hidden`}
                  >
                    {/* Mockup based on step */}
                    {index === 0 && <IdeateVisual />}
                    {index === 1 && <DraftVisual />}
                    {index === 2 && <PolishVisual />}

                    {/* Decorative corner accent */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 opacity-10"
                      style={{
                        background: `radial-gradient(circle at top right, ${tokens.colors.accent} 0%, transparent 70%)`,
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Divider (except for last item) */}
            {index < steps.length - 1 && (
              <div className="max-w-7xl mx-auto px-6">
                <div className={`h-px ${tw.bgPrimary}`} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Visual mockups for each step
const IdeateVisual: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      {[
        { color: '#FBBF24', text: 'Problem' },
        { color: '#60A5FA', text: 'Solution' },
        { color: '#4ADE80', text: 'Impact' },
        { color: '#F472B6', text: 'Timeline' },
        { color: '#A78BFA', text: 'Team' },
        { color: '#FB923C', text: 'Budget' },
      ].map((note, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="aspect-square rounded-xl p-3 flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${note.color}30`, borderLeft: `3px solid ${note.color}` }}
        >
          <span className="text-xs font-medium text-gray-700">{note.text}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const DraftVisual: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}
        className={`${tw.bgTertiary} rounded-xl p-4 border ${tw.border}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-lg ${tw.bgAccent} ${tw.bgAccentLight}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-3 ${tw.bgAccent} ${tw.bgAccentLight} rounded w-3/4`} />
            <div className={`h-2 bg-[#D4E5D4] rounded w-full`} />
          </div>
        </div>
        <div className={`h-20 bg-[#D4E5D4] rounded-lg`} />
      </motion.div>
    ))}
  </div>
);

const PolishVisual: React.FC = () => (
  <div className="relative">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`aspect-[16/10] rounded-2xl ${tw.bgAccent} ${tw.bgAccentLight} border-2 ${tw.borderAccent} p-6 relative overflow-hidden`}
    >
      {/* Slide content */}
      <div className="space-y-3">
        <div className={`h-6 ${tw.bgAccent} rounded w-1/2`} />
        <div className={`h-4 bg-[#8FA58F] rounded w-3/4 opacity-50`} />
        <div className={`h-4 bg-[#8FA58F] rounded w-2/3 opacity-50`} />
      </div>

      {/* Image placeholder */}
      <div className="absolute bottom-6 right-6 w-32 h-24 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-center">
        <Image className="w-8 h-8 text-white/50" />
      </div>

      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-4 right-4 w-12 h-12 border-2 border-white/20 rounded-full"
      />
    </motion.div>

    {/* Theme selector */}
    <div className="absolute -bottom-4 -right-4 flex gap-2">
      {['#6B8E6B', '#8FA58F', '#4A5D4A'].map((color, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className={`w-10 h-10 rounded-full border-2 border-white ${tw.shadow}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  </div>
);
