/**
 * Variant 1: Refined Current - Hero Section
 * Studio Noir structure with Bento Matcha palette
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { tokens, tw, variants } from '../shared/tokens';
import { Button, WorkflowIllustration, FloatingShapes } from '../shared/CommonComponents';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className={`relative min-h-screen ${tw.bgPrimary} overflow-hidden`}>
      {/* Floating decorative shapes */}
      <FloatingShapes />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants.stagger}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={variants.fadeInUp}>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${tw.bgSecondary} ${tw.border} ${tw.textSecondary} text-sm font-medium ${tw.shadow}`}
              >
                <Sparkles className="w-4 h-4 text-[#6B8E6B]" />
                AI-Powered Presentation Studio
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={variants.fadeInUp}
              className={`text-6xl lg:text-7xl font-bold ${tw.textPrimary} leading-[1.1]`}
              style={{ fontFamily: tokens.fonts.display }}
            >
              Create stunning{' '}
              <span className={`${tw.textAccent} relative`}>
                presentations
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M2 10C50 3 100 2 150 6C200 10 250 8 298 4"
                    stroke="#6B8E6B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
              </span>
              <br />
              in minutes
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={variants.fadeInUp}
              className={`text-xl ${tw.textSecondary} max-w-xl leading-relaxed`}
            >
              Transform your ideas into polished decks with AI-powered design, smart layouts, and
              contextual imagery. From ideation to presentation in three simple steps.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={variants.fadeInUp} className="flex flex-wrap gap-4">
              <Button size="lg" onClick={onGetStarted} icon={<ArrowRight className="w-5 h-5" />}>
                Start Creating Free
              </Button>
              <Button variant="secondary" size="lg">
                Watch Demo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={variants.fadeInUp}
              className={`flex items-center gap-6 pt-4 ${tw.textMuted} text-sm`}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['#6B8E6B', '#8FA58F', '#4A5D4A', '#D4E5D4'].map((color, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white ${tw.shadow}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span>
                  <strong className={tw.textSecondary}>2,500+</strong> presentations created
                </span>
              </div>
              <div className="h-4 w-px bg-[#D4E5D4]" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-[#6B8E6B] fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="ml-1">4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: 3-Stage Workflow Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main workflow illustration */}
            <div className={`relative ${tw.bgSecondary} rounded-3xl p-8 ${tw.shadow}`}>
              <WorkflowIllustration className="w-full" />

              {/* Animated stage labels */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  {
                    stage: '01',
                    title: 'Ideate',
                    desc: 'Brainstorm with AI sticky notes',
                    delay: 0.3,
                  },
                  {
                    stage: '02',
                    title: 'Draft',
                    desc: 'Build structure & flow',
                    delay: 0.5,
                  },
                  {
                    stage: '03',
                    title: 'Polish',
                    desc: 'Refine design & export',
                    delay: 0.7,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.delay }}
                    className={`p-4 rounded-xl ${tw.bgTertiary} border ${tw.border}`}
                  >
                    <div
                      className={`text-xs font-mono ${tw.textAccent} font-semibold mb-1`}
                      style={{ fontFamily: tokens.fonts.mono }}
                    >
                      {item.stage}
                    </div>
                    <div
                      className={`text-sm font-semibold ${tw.textPrimary} mb-1`}
                      style={{ fontFamily: tokens.fonts.display }}
                    >
                      {item.title}
                    </div>
                    <div className={`text-xs ${tw.textMuted}`}>{item.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className={`absolute -top-4 -right-4 ${tw.bgAccent} text-white px-6 py-3 rounded-full ${tw.shadowGlow} font-medium`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #FFFFFF)',
        }}
      />
    </section>
  );
};
