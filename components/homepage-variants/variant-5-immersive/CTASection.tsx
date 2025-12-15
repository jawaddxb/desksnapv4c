/**
 * CTASection - Final full-screen CTA with floating decorative elements
 */

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FullScreenSection } from './FullScreenSection';
import { Button } from '../shared/CommonComponents';
import { ArrowRight, Sparkles, Zap, Palette } from 'lucide-react';

export const CTASection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <FullScreenSection id="cta" backgroundColor="#6B8E6B">
      <div ref={ref} className="relative w-full h-full max-w-7xl mx-auto px-8 flex items-center">
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 left-20 w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm rotate-12"
          animate={{
            y: [0, -30, 0],
            rotate: [12, 20, 12],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white/50" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-40 right-32 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm -rotate-6"
          animate={{
            y: [0, 20, 0],
            rotate: [-6, 6, -6],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Zap className="w-10 h-10 text-white/50" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-40 w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -15, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="w-14 h-14 text-white/50" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-20 w-32 h-32 rounded-3xl bg-white/5 backdrop-blur-sm rotate-45"
          animate={{
            rotate: [45, 60, 45],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />

        {/* Large background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-white/5"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        {/* Main Content */}
        <div className="relative w-full text-center space-y-12">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Start Creating Today</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-[7rem] font-bold leading-[0.95] tracking-tight text-white max-w-5xl mx-auto">
              Ready to transform
              <br />
              your presentations?
            </h2>

            <p className="text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who've discovered a better way to create presentations.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.button
              className="px-10 py-5 bg-white text-[#6B8E6B] rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
              onClick={onGetStarted}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl text-lg font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center pt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((feature, index) => (
              <motion.div
                key={index}
                className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="pt-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {/* Avatars */}
            <div className="flex justify-center -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-[#6B8E6B] flex items-center justify-center text-white font-semibold"
                  style={{ zIndex: 6 - i }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border-2 border-[#6B8E6B] flex items-center justify-center text-white text-sm font-semibold">
                +5k
              </div>
            </div>

            <p className="text-white/70 text-sm">
              Join 10,000+ creators who've made the switch
            </p>
          </motion.div>
        </div>
      </div>
    </FullScreenSection>
  );
};
