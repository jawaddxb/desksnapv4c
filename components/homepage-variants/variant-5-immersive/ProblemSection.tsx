/**
 * ProblemSection - Dark problem statement with dramatic white text
 */

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FullScreenSection } from './FullScreenSection';
import { Clock, Frown, TrendingDown } from 'lucide-react';

const problems = [
  {
    icon: Clock,
    stat: '8 hours',
    description: 'Average time spent creating a single presentation',
  },
  {
    icon: Frown,
    stat: '73%',
    description: 'Of professionals find presentation design frustrating',
  },
  {
    icon: TrendingDown,
    stat: '60%',
    description: 'Of presentations are recycled due to time constraints',
  },
];

export const ProblemSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <FullScreenSection id="problem" backgroundColor="#1E2E1E">
      <div ref={ref} className="relative w-full h-full max-w-7xl mx-auto px-8 flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative w-full space-y-20">
          {/* Headline */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-medium text-white/80">The Problem</span>
            </motion.div>

            <motion.h2
              className="text-[6.5rem] font-bold leading-[0.95] tracking-tight text-white max-w-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Creating presentations
              <br />
              <span className="text-white/50">shouldn't be this hard</span>
            </motion.h2>

            <motion.p
              className="text-2xl text-white/70 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Most professionals waste countless hours wrestling with design tools instead of focusing on their message.
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            {problems.map((item, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-8 h-8 text-white/80" />
                  </motion.div>

                  {/* Stat */}
                  <div>
                    <motion.div
                      className="text-6xl font-bold text-white mb-3"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    >
                      {item.stat}
                    </motion.div>
                    <p className="text-lg text-white/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Decorative line */}
                <motion.div
                  className="mt-6 h-1 bg-gradient-to-r from-white/20 to-transparent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                  style={{ transformOrigin: 'left' }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Closing statement */}
          <motion.div
            className="text-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <p className="text-2xl text-white/50 font-light italic">
              There has to be a better way...
            </p>
          </motion.div>
        </div>
      </div>
    </FullScreenSection>
  );
};
