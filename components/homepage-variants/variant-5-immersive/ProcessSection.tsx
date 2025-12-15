/**
 * ProcessSection - Scroll-triggered animations showing Ideate/Draft/Polish
 */

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FullScreenSection } from './FullScreenSection';
import { Lightbulb, FileText, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Ideate',
    subtitle: 'Start with sticky notes',
    description: 'Brainstorm freely with AI assistance. No structure required—just dump your ideas and let the AI help you organize them.',
    icon: Lightbulb,
    color: '#FBBF24',
    colorLight: 'rgba(251, 191, 36, 0.1)',
  },
  {
    number: '02',
    title: 'Draft',
    subtitle: 'Focus on the story',
    description: 'AI generates a presentation structure based on your ideas. Edit, rearrange, and refine the narrative before worrying about design.',
    icon: FileText,
    color: '#60A5FA',
    colorLight: 'rgba(96, 165, 250, 0.1)',
  },
  {
    number: '03',
    title: 'Polish',
    subtitle: 'Apply professional themes',
    description: 'Choose from 30+ curated themes. AI generates contextual images and applies professional styling in seconds.',
    icon: Sparkles,
    color: '#6B8E6B',
    colorLight: 'rgba(107, 142, 107, 0.1)',
  },
];

export const ProcessSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <FullScreenSection id="process" backgroundColor="#FFFFFF">
      <div ref={ref} className="relative w-full h-full max-w-7xl mx-auto px-8 flex items-center">
        {/* Floating background shapes */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#6B8E6B]/5"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative w-full space-y-16">
          {/* Header */}
          <motion.div
            className="text-center space-y-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-[#6B8E6B]/10 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-medium text-[#6B8E6B]">How It Works</span>
            </motion.div>

            <motion.h2
              className="text-[5.5rem] font-bold leading-[0.95] tracking-tight text-[#1E2E1E]"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Three steps to
              <br />
              <span className="text-[#6B8E6B]">presentation perfection</span>
            </motion.h2>
          </motion.div>

          {/* Process Steps */}
          <div className="space-y-24 pt-8">
            {steps.map((step, index) => {
              const stepRef = useRef(null);
              const stepInView = useInView(stepRef, { once: false, amount: 0.5 });

              return (
                <motion.div
                  key={index}
                  ref={stepRef}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                  initial={{ opacity: 0, y: 60 }}
                  animate={stepInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Left: Content */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    {/* Number */}
                    <motion.div
                      className="text-[8rem] font-bold leading-none text-[#6B8E6B]/10"
                      initial={{ opacity: 0, x: -30 }}
                      animate={stepInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      {step.number}
                    </motion.div>

                    <div className="space-y-4 -mt-16">
                      {/* Title */}
                      <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={stepInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: step.colorLight }}
                        >
                          <step.icon className="w-7 h-7" style={{ color: step.color }} />
                        </div>
                        <div>
                          <h3 className="text-4xl font-bold text-[#1E2E1E]">{step.title}</h3>
                          <p className="text-lg text-[#8FA58F]">{step.subtitle}</p>
                        </div>
                      </motion.div>

                      {/* Description */}
                      <motion.p
                        className="text-xl text-[#4A5D4A] leading-relaxed max-w-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={stepInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        {step.description}
                      </motion.p>
                    </div>
                  </div>

                  {/* Right: Visual */}
                  <motion.div
                    className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={stepInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-white to-[#F5FAF7] rounded-3xl border-2 border-[#D4E5D4] shadow-xl overflow-hidden">
                      {/* Content based on step */}
                      {index === 0 && (
                        <div className="p-12 h-full flex flex-col justify-center gap-6">
                          {/* Sticky notes scattered */}
                          <motion.div
                            className="absolute top-12 left-12 w-32 h-24 bg-yellow-200/30 border-2 border-yellow-400/50 rounded-xl rotate-[-5deg] shadow-lg p-4"
                            initial={{ opacity: 0, y: 20, rotate: -5 }}
                            animate={stepInView ? { opacity: 1, y: 0, rotate: -5 } : { opacity: 0, y: 20, rotate: -5 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                          >
                            <div className="space-y-2">
                              <div className="h-2 bg-yellow-600/30 rounded w-3/4" />
                              <div className="h-2 bg-yellow-600/20 rounded w-full" />
                              <div className="h-2 bg-yellow-600/20 rounded w-2/3" />
                            </div>
                          </motion.div>

                          <motion.div
                            className="absolute top-24 right-16 w-32 h-24 bg-blue-200/30 border-2 border-blue-400/50 rounded-xl rotate-[8deg] shadow-lg p-4"
                            initial={{ opacity: 0, y: 20, rotate: 8 }}
                            animate={stepInView ? { opacity: 1, y: 0, rotate: 8 } : { opacity: 0, y: 20, rotate: 8 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                          >
                            <div className="space-y-2">
                              <div className="h-2 bg-blue-600/30 rounded w-2/3" />
                              <div className="h-2 bg-blue-600/20 rounded w-full" />
                            </div>
                          </motion.div>

                          <motion.div
                            className="absolute bottom-16 left-20 w-32 h-24 bg-green-200/30 border-2 border-green-400/50 rounded-xl rotate-[3deg] shadow-lg p-4"
                            initial={{ opacity: 0, y: 20, rotate: 3 }}
                            animate={stepInView ? { opacity: 1, y: 0, rotate: 3 } : { opacity: 0, y: 20, rotate: 3 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                          >
                            <div className="space-y-2">
                              <div className="h-2 bg-green-600/30 rounded w-full" />
                              <div className="h-2 bg-green-600/20 rounded w-3/4" />
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {index === 1 && (
                        <div className="p-12 h-full flex items-center justify-center">
                          {/* Stacked slides */}
                          <div className="relative w-full max-w-sm">
                            <motion.div
                              className="absolute inset-0 bg-white rounded-2xl border-2 border-[#D4E5D4] shadow-md"
                              initial={{ opacity: 0, x: -10, y: 10 }}
                              animate={stepInView ? { opacity: 1, x: -10, y: 10 } : { opacity: 0, x: -10, y: 10 }}
                              transition={{ delay: 0.7, duration: 0.5 }}
                            />
                            <motion.div
                              className="absolute inset-0 bg-white rounded-2xl border-2 border-[#D4E5D4] shadow-lg"
                              initial={{ opacity: 0, x: -5, y: 5 }}
                              animate={stepInView ? { opacity: 1, x: -5, y: 5 } : { opacity: 0, x: -5, y: 5 }}
                              transition={{ delay: 0.8, duration: 0.5 }}
                            />
                            <motion.div
                              className="relative bg-white rounded-2xl border-2 border-[#6B8E6B] shadow-xl p-8"
                              initial={{ opacity: 0 }}
                              animate={stepInView ? { opacity: 1 } : { opacity: 0 }}
                              transition={{ delay: 0.9, duration: 0.5 }}
                            >
                              <div className="space-y-4">
                                <div className="h-4 bg-[#6B8E6B] rounded w-2/3" />
                                <div className="h-2 bg-[#D4E5D4] rounded w-full" />
                                <div className="h-2 bg-[#D4E5D4] rounded w-5/6" />
                                <div className="h-2 bg-[#D4E5D4] rounded w-4/5" />
                                <div className="mt-6 h-32 bg-[#6B8E6B]/10 rounded-xl" />
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {index === 2 && (
                        <div className="p-8 h-full flex items-center justify-center">
                          {/* Polished slide with sparkles */}
                          <motion.div
                            className="relative w-full max-w-md aspect-[16/10] bg-gradient-to-br from-[#6B8E6B] to-[#5A7A5A] rounded-2xl shadow-2xl p-8"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={stepInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                          >
                            <div className="h-full flex flex-col justify-between text-white">
                              <div className="space-y-3">
                                <div className="h-6 bg-white/90 rounded w-2/3" />
                                <div className="h-3 bg-white/60 rounded w-1/2" />
                              </div>
                              <div className="h-24 bg-white/20 rounded-xl backdrop-blur-sm" />
                            </div>

                            {/* Sparkle effects */}
                            <motion.div
                              className="absolute -top-3 -right-3 w-8 h-8 text-[#FBBF24]"
                              animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Sparkles className="w-full h-full" />
                            </motion.div>
                            <motion.div
                              className="absolute -bottom-2 -left-2 w-6 h-6 text-[#FBBF24]"
                              animate={{ rotate: [360, 180, 0], scale: [1, 1.3, 1] }}
                              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                            >
                              <Sparkles className="w-full h-full" />
                            </motion.div>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </FullScreenSection>
  );
};
