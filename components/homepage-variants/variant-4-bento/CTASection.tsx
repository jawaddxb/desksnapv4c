/**
 * CTA Section - Final Call to Action
 * Large CTA card with surrounding decorative elements
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Check } from 'lucide-react';
import { Button } from '../shared/CommonComponents';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  const features = [
    'Free to start, upgrade anytime',
    'No credit card required',
    '60+ professional layouts',
    'AI-generated images included',
  ];

  return (
    <section className="bg-white px-8 py-32">
      <div className="max-w-[1400px] mx-auto">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-4 gap-6 auto-rows-[200px]">
          {/* Decorative card - top left */}
          <motion.div
            className="col-span-1 row-span-1 bg-[#EDF5F0] rounded-3xl p-6 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{
              rotate: 5,
              transition: { duration: 0.2 },
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Sparkles className="w-16 h-16 text-[#6B8E6B]" />
            </motion.div>
          </motion.div>

          {/* Large CTA Card - 2x2 */}
          <motion.div
            className="col-span-2 row-span-2 bg-gradient-to-br from-[#6B8E6B] to-[#5A7A5A] text-white rounded-3xl p-12 shadow-[0_12px_48px_rgba(107,142,107,0.2)] border border-[#5A7A5A] flex flex-col justify-between relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{
              y: -4,
              boxShadow: '0 20px 60px rgba(107, 142, 107, 0.24)',
              transition: { duration: 0.3 },
            }}
          >
            {/* Background decoration */}
            <motion.div
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/5"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Zap className="w-4 h-4" />
                Limited Time Offer
              </motion.div>

              <motion.h2
                className="text-5xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Ready to Transform
                <br />
                Your Presentations?
              </motion.h2>

              <motion.p
                className="text-xl text-white/90 mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Join thousands of professionals creating stunning decks in
                minutes, not hours.
              </motion.p>

              {/* Features checklist */}
              <motion.div
                className="space-y-3 mb-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  className="px-8 py-4 bg-white text-[#6B8E6B] rounded-xl font-semibold text-lg shadow-[0_4px_24px_rgba(0,0,0,0.1)] inline-flex items-center gap-2"
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Creating Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg border-2 border-white/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Pricing
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative card - top right */}
          <motion.div
            className="col-span-1 row-span-1 bg-[#6B8E6B]/10 rounded-3xl p-6 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{
              rotate: -5,
              transition: { duration: 0.2 },
            }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-[#6B8E6B] mb-1">10K+</div>
              <div className="text-sm text-[#4A5D4A]">Users</div>
            </div>
          </motion.div>

          {/* Decorative card - bottom left */}
          <motion.div
            className="col-span-1 row-span-1 bg-gradient-to-br from-[#EDF5F0] to-[#D4E5D4] rounded-3xl p-6 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <motion.div
              className="text-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Zap className="w-12 h-12 text-[#6B8E6B] mx-auto" />
              <div className="text-xs text-[#4A5D4A] mt-2">Lightning Fast</div>
            </motion.div>
          </motion.div>

          {/* Social proof card - bottom right */}
          <motion.div
            className="col-span-1 row-span-1 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex flex-col justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{
              y: -4,
              boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
              transition: { duration: 0.2 },
            }}
          >
            <div className="flex -space-x-2 mb-3">
              {['SC', 'MR', 'EP', 'JW', '+'].map((avatar, i) => (
                <motion.div
                  key={i}
                  className="w-10 h-10 rounded-full bg-[#6B8E6B] text-white text-xs flex items-center justify-center border-2 border-white font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  {avatar}
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-[#4A5D4A] text-center">
              Join 10,000+ creators
            </p>
          </motion.div>
        </div>

        {/* Footer text */}
        <motion.p
          className="text-center text-[#8FA58F] text-sm mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          Start for free. No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
};
