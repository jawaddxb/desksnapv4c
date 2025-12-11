/**
 * HeroSection Component
 *
 * Main hero section with Studio Noir aesthetic.
 * New narrative: "Decks that think with you"
 * Emphasizes the 3-stage creative process with cascade animations.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Lightbulb, FileEdit, Sparkles } from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
  popIn,
  viewportOnce,
  springs,
} from './animations';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const workflowSteps = [
  { label: 'Ideate', icon: Lightbulb },
  { label: 'Draft', icon: FileEdit },
  { label: 'Polish', icon: Sparkles },
];

const stickyNoteColors = [
  { bg: 'rgba(250, 204, 21, 0.2)', border: 'rgba(250, 204, 21, 0.3)' },
  { bg: 'rgba(96, 165, 250, 0.2)', border: 'rgba(96, 165, 250, 0.3)' },
  { bg: 'rgba(74, 222, 128, 0.2)', border: 'rgba(74, 222, 128, 0.3)' },
  { bg: 'rgba(244, 114, 182, 0.2)', border: 'rgba(244, 114, 182, 0.3)' },
];

// Animated step indicator with drawing line
const AnimatedWorkflowSteps: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [lineProgress, setLineProgress] = useState([0, 0]);

  useEffect(() => {
    const animateSteps = async () => {
      // First step
      setActiveStep(0);
      await new Promise(r => setTimeout(r, 1000));
      setLineProgress([100, 0]);

      // Second step
      await new Promise(r => setTimeout(r, 500));
      setActiveStep(1);
      await new Promise(r => setTimeout(r, 1000));
      setLineProgress([100, 100]);

      // Third step
      await new Promise(r => setTimeout(r, 500));
      setActiveStep(2);

      // Reset
      await new Promise(r => setTimeout(r, 3000));
      setActiveStep(0);
      setLineProgress([0, 0]);
    };

    animateSteps();
    const interval = setInterval(animateSteps, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {workflowSteps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i <= activeStep;

        return (
          <React.Fragment key={step.label}>
            <motion.div
              className="flex items-center gap-2"
              animate={{
                opacity: isActive ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-8 h-8 border border-white/20 flex items-center justify-center"
                animate={{
                  borderColor: isActive ? 'rgba(197, 164, 126, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                  boxShadow: isActive ? '0 0 15px rgba(197, 164, 126, 0.3)' : 'none',
                }}
              >
                <motion.div
                  animate={i === activeStep ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Icon className="w-4 h-4 text-[#c5a47e]" />
                </motion.div>
              </motion.div>
              <span className="text-sm text-white/60">{step.label}</span>
            </motion.div>
            {i < workflowSteps.length - 1 && (
              <div className="w-8 h-px bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#c5a47e]"
                  animate={{ width: `${lineProgress[i]}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Animated sticky note with hover effect
const AnimatedStickyNote: React.FC<{ color: typeof stickyNoteColors[0]; delay: number }> = ({ color, delay }) => {
  return (
    <motion.div
      className="w-16 h-12 rounded-sm cursor-pointer"
      style={{
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 1,
      }}
      initial={{ opacity: 0, y: -15, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        ...springs.bouncy,
        delay,
      }}
      whileHover={{
        y: -4,
        scale: 1.05,
        boxShadow: `0 8px 20px ${color.border}`,
      }}
    />
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Label */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 border border-white/20"
            >
              <motion.span
                className="w-1.5 h-1.5 bg-[#c5a47e]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                A New Way to Build Presentations
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight"
            >
              Decks that{' '}
              <motion.span
                className="text-[#c5a47e]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                think
              </motion.span>{' '}
              with you.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/60 max-w-lg leading-relaxed"
            >
              Ideate with AI, refine in rough draft, polish to perfection. Beautiful decks deserve a beautiful process.
            </motion.p>

            {/* 3-Step Workflow Indicator */}
            <motion.div variants={fadeInUp}>
              <AnimatedWorkflowSteps />
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-6"
            >
              <motion.button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-[#c5a47e] transition-colors duration-150"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start creating
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 4 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
              <motion.button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-150"
                whileHover={{ scale: 1.02 }}
              >
                <Play className="w-4 h-4" />
                See how it works
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={fadeInUp}
              className="pt-8 border-t border-white/10"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                Trusted by creators at
              </p>
              <motion.div
                className="flex items-center gap-8"
                variants={staggerContainer}
              >
                {['Stanford', 'RISD', 'Figma', 'Linear', 'Notion'].map((name, i) => (
                  <motion.span
                    key={name}
                    variants={popIn}
                    className="text-sm text-white/40 font-medium"
                    whileHover={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {name}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Visual */}
          <div className="relative">
            {/* Three-stage visual with cascade animation */}
            <div className="space-y-4">
              {/* Stage 1: Ideate */}
              <motion.div
                className="bg-white/5 border border-white/10 p-6 relative overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-6 h-6 bg-[#c5a47e]/20 flex items-center justify-center"
                    animate={{
                      boxShadow: ['0 0 0 0 rgba(197, 164, 126, 0)', '0 0 15px 5px rgba(197, 164, 126, 0.2)', '0 0 0 0 rgba(197, 164, 126, 0)'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                  >
                    <Lightbulb className="w-3 h-3 text-[#c5a47e]" />
                  </motion.div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Ideate</span>
                </div>
                <div className="flex gap-2">
                  {stickyNoteColors.map((color, i) => (
                    <AnimatedStickyNote key={i} color={color} delay={0.5 + i * 0.1} />
                  ))}
                </div>
              </motion.div>

              {/* Stage 2: Draft */}
              <motion.div
                className="bg-white/5 border border-white/10 p-6 relative overflow-hidden ml-8"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-6 h-6 bg-[#c5a47e]/20 flex items-center justify-center"
                    animate={{
                      boxShadow: ['0 0 0 0 rgba(197, 164, 126, 0)', '0 0 15px 5px rgba(197, 164, 126, 0.2)', '0 0 0 0 rgba(197, 164, 126, 0)'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <FileEdit className="w-3 h-3 text-[#c5a47e]" />
                  </motion.div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Draft</span>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-20 h-14 bg-white/10 border border-white/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.15, ...springs.gentle }}
                      whileHover={{
                        scale: 1.05,
                        borderColor: 'rgba(197, 164, 126, 0.4)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Stage 3: Polish */}
              <motion.div
                className="bg-white/5 border border-white/10 p-6 relative overflow-hidden ml-16"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-6 h-6 bg-[#c5a47e]/20 flex items-center justify-center"
                    animate={{
                      boxShadow: ['0 0 0 0 rgba(197, 164, 126, 0)', '0 0 15px 5px rgba(197, 164, 126, 0.2)', '0 0 0 0 rgba(197, 164, 126, 0)'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                    >
                      <Sparkles className="w-3 h-3 text-[#c5a47e]" />
                    </motion.div>
                  </motion.div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Polish</span>
                </div>
                <motion.div
                  className="aspect-video bg-gradient-to-br from-[#c5a47e]/20 to-transparent border border-[#c5a47e]/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  whileHover={{
                    boxShadow: '0 0 30px rgba(197, 164, 126, 0.2)',
                    borderColor: 'rgba(197, 164, 126, 0.5)',
                  }}
                >
                  <div className="p-4">
                    <motion.div
                      className="w-12 h-1 bg-[#c5a47e] mb-3"
                      initial={{ width: 0 }}
                      animate={{ width: 48 }}
                      transition={{ delay: 1.4, duration: 0.4 }}
                    />
                    <motion.div
                      className="w-32 h-3 bg-white/20 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    />
                    <motion.div
                      className="w-24 h-3 bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 px-4 py-3 bg-black border border-white/20"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5, ...springs.bouncy }}
              whileHover={{
                borderColor: 'rgba(197, 164, 126, 0.5)',
                boxShadow: '0 0 20px rgba(197, 164, 126, 0.2)',
              }}
            >
              <motion.span
                className="text-3xl font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
              >
                3
              </motion.span>
              <span className="text-xs text-white/60 ml-2">Stage Process</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
