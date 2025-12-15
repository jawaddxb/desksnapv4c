/**
 * Process Section - Ideate, Draft, Polish
 * Three interactive process cards with animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, FileEdit, Sparkles, ArrowRight } from 'lucide-react';

const processSteps = [
  {
    number: '01',
    title: 'Ideate',
    description:
      'Start with sticky notes and brainstorm freely. AI helps organize your thoughts into a clear structure.',
    icon: Lightbulb,
    color: '#FBBF24',
    bgColor: 'rgba(251, 191, 36, 0.1)',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <motion.rect
          x="20"
          y="30"
          width="70"
          height="50"
          rx="8"
          fill="rgba(251, 191, 36, 0.2)"
          stroke="#FBBF24"
          strokeWidth="2"
          initial={{ opacity: 0, rotate: -5 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2 }}
        />
        <motion.rect
          x="110"
          y="40"
          width="70"
          height="50"
          rx="8"
          fill="rgba(96, 165, 250, 0.2)"
          stroke="#60A5FA"
          strokeWidth="2"
          initial={{ opacity: 0, rotate: 5 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3 }}
        />
        <motion.rect
          x="30"
          y="100"
          width="70"
          height="50"
          rx="8"
          fill="rgba(74, 222, 128, 0.2)"
          stroke="#4ADE80"
          strokeWidth="2"
          initial={{ opacity: 0, rotate: 3 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.4 }}
        />
        <motion.rect
          x="120"
          y="110"
          width="70"
          height="50"
          rx="8"
          fill="rgba(244, 114, 182, 0.2)"
          stroke="#F472B6"
          strokeWidth="2"
          initial={{ opacity: 0, rotate: -3 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.5 }}
        />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Draft',
    description:
      'Focus on your story with a simple layout. Edit content, rearrange slides, and refine your message.',
    icon: FileEdit,
    color: '#60A5FA',
    bgColor: 'rgba(96, 165, 250, 0.1)',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <rect x="30" y="30" width="80" height="60" rx="6" fill="#EDF5F0" stroke="#D4E5D4" strokeWidth="2" />
          <rect x="40" y="45" width="40" height="8" rx="4" fill="#6B8E6B" />
          <rect x="40" y="60" width="60" height="4" rx="2" fill="#D4E5D4" />
          <rect x="40" y="70" width="50" height="4" rx="2" fill="#EDF5F0" />
        </motion.g>
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <rect x="60" y="60" width="80" height="60" rx="6" fill="#EDF5F0" stroke="#D4E5D4" strokeWidth="2" />
          <rect x="70" y="75" width="40" height="8" rx="4" fill="#6B8E6B" />
          <rect x="70" y="90" width="60" height="4" rx="2" fill="#D4E5D4" />
          <rect x="70" y="100" width="50" height="4" rx="2" fill="#EDF5F0" />
        </motion.g>
        <motion.g
          initial={{ opacity: 0, x: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <rect x="90" y="90" width="80" height="60" rx="6" fill="white" stroke="#6B8E6B" strokeWidth="2" />
          <rect x="100" y="105" width="40" height="8" rx="4" fill="#6B8E6B" />
          <rect x="100" y="120" width="60" height="4" rx="2" fill="#D4E5D4" />
          <rect x="100" y="130" width="50" height="4" rx="2" fill="#EDF5F0" />
        </motion.g>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Polish',
    description:
      'Apply professional themes, generate AI images, and add the finishing touches that make your deck shine.',
    icon: Sparkles,
    color: '#6B8E6B',
    bgColor: 'rgba(107, 142, 107, 0.1)',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <motion.rect
          x="40"
          y="40"
          width="120"
          height="90"
          rx="8"
          fill="white"
          stroke="#6B8E6B"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        />
        <motion.rect
          x="55"
          y="55"
          width="50"
          height="10"
          rx="5"
          fill="#6B8E6B"
          initial={{ width: 0 }}
          whileInView={{ width: 50 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        />
        <motion.rect
          x="55"
          y="75"
          width="70"
          height="6"
          rx="3"
          fill="#D4E5D4"
          initial={{ width: 0 }}
          whileInView={{ width: 70 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        />
        <motion.rect
          x="55"
          y="88"
          width="60"
          height="6"
          rx="3"
          fill="#EDF5F0"
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
        <motion.circle
          cx="130"
          cy="95"
          r="20"
          fill="#6B8E6B"
          fillOpacity="0.2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.6 }}
        />
        <motion.path
          d="M130 85 l-5 8 l12-3 l-12-3 l5 8z"
          fill="#6B8E6B"
          initial={{ opacity: 0, rotate: 0 }}
          whileInView={{ opacity: 1, rotate: 360 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        />
      </svg>
    ),
  },
];

export const ProcessSection: React.FC = () => {
  return (
    <section className="bg-white px-8 py-32">
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-[#1E2E1E] mb-6">
            Three Steps to Perfect Decks
          </h2>
          <p className="text-xl text-[#4A5D4A] max-w-2xl mx-auto">
            Our workflow helps you move from scattered ideas to polished
            presentations with confidence.
          </p>
        </motion.div>

        {/* Process cards */}
        <div className="grid grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 border border-[#D4E5D4] shadow-[0_4px_24px_rgba(107,142,107,0.08)] h-full flex flex-col"
                whileHover={{
                  y: -8,
                  boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
                  transition: { duration: 0.3 },
                }}
              >
                {/* Number badge */}
                <div
                  className="inline-flex w-12 h-12 rounded-xl items-center justify-center mb-6 font-bold text-lg"
                  style={{ backgroundColor: step.bgColor, color: step.color }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: step.bgColor }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-[#1E2E1E] mb-4">
                  {step.title}
                </h3>
                <p className="text-[#4A5D4A] leading-relaxed mb-8 flex-grow">
                  {step.description}
                </p>

                {/* Illustration */}
                <div className="h-48 rounded-2xl overflow-hidden bg-[#F5FAF7] p-4">
                  {step.illustration}
                </div>

                {/* Hover arrow */}
                <motion.div
                  className="absolute top-8 right-8"
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                >
                  <ArrowRight className="w-6 h-6 text-[#6B8E6B]" />
                </motion.div>

                {/* Connecting arrow (except for last card) */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    className="absolute -right-6 top-1/2 transform -translate-y-1/2 hidden lg:block"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                  >
                    <ArrowRight className="w-8 h-8 text-[#D4E5D4]" />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
