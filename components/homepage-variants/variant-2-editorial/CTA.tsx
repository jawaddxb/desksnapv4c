/**
 * CTA Section - Editorial Variant
 * Full-width with decorative SVG background
 * Strong editorial typography with compelling call-to-action
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { tw, variants } from '../shared/tokens';
import { Button } from '../shared/CommonComponents';
import { CTABackgroundPattern } from './illustrations';

interface CTAProps {
  onGetStarted: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onGetStarted }) => {
  const benefits = [
    'No credit card required',
    'Free forever plan',
    'Setup in under 60 seconds',
    '30+ themes included',
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5FAF7] via-white to-[#EDF5F0]" />

      {/* Decorative SVG background pattern */}
      <div className="absolute inset-0 opacity-100">
        <CTABackgroundPattern className="w-full h-full" />
      </div>

      {/* Floating decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-[#6B8E6B]/10"
          style={{ top: '10%', left: '5%' }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#6B8E6B]/8"
          style={{ bottom: '5%', right: '10%' }}
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-[#6B8E6B]/5"
          style={{ top: '50%', right: '20%' }}
          animate={{
            x: [0, -20, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-8 relative z-10">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants.stagger}
        >
          {/* Sparkle badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[#6B8E6B]/20 shadow-[0_8px_24px_rgba(107,142,107,0.12)] mb-8"
            variants={variants.scaleIn}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={18} className="text-[#6B8E6B]" />
            </motion.div>
            <span className="text-sm font-semibold text-[#4A5D4A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Start your first presentation today
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h2
            className="text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1E2E1E] leading-[0.95] mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
            variants={variants.fadeInUp}
          >
            Ready to create
            <span className="block text-[#6B8E6B] mt-3">something</span>
            <span className="block mt-3">beautiful?</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            className="text-2xl lg:text-3xl text-[#4A5D4A] leading-relaxed mb-12 max-w-3xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
            variants={variants.fadeInUp}
          >
            Join thousands of creators who've discovered a better way to make presentations
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={variants.fadeInUp}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onGetStarted}
              icon={<ArrowRight size={22} />}
              className="text-xl px-12 py-6 shadow-[0_12px_48px_rgba(107,142,107,0.25)]"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-xl px-12 py-6"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Benefits list */}
          <motion.div
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12"
            variants={variants.fadeIn}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <CheckCircle2 size={18} className="text-[#6B8E6B] flex-shrink-0" />
                <span className="text-base text-[#4A5D4A]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {benefit}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="inline-flex items-center gap-6 px-8 py-5 rounded-2xl bg-white border border-[#D4E5D4] shadow-[0_8px_32px_rgba(107,142,107,0.08)]"
            variants={variants.scaleIn}
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B8E6B] to-[#4A5D4A] border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                >
                  {String.fromCharCode(64 + i)}
                </motion.div>
              ))}
            </div>
            <div className="text-left">
              <div className="font-bold text-[#1E2E1E] text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                10,000+ creators
              </div>
              <div className="text-sm text-[#4A5D4A]">
                have started using DeckSnap
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          className="w-full h-24 text-white opacity-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,40 Q300,60 600,40 T1200,40 L1200,120 L0,120 Z"
            fill="currentColor"
            animate={{
              d: [
                "M0,40 Q300,60 600,40 T1200,40 L1200,120 L0,120 Z",
                "M0,50 Q300,30 600,50 T1200,50 L1200,120 L0,120 Z",
                "M0,40 Q300,60 600,40 T1200,40 L1200,120 L0,120 Z",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </section>
  );
};

export default CTA;
