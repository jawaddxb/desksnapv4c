/**
 * Variant 1: Refined Current - CTA Section
 * Final call-to-action with forest green gradient
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { tokens, tw, variants } from '../shared/tokens';
import { Button } from '../shared/CommonComponents';

interface CTAProps {
  onGetStarted: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onGetStarted }) => {
  const benefits = [
    'No credit card required',
    'Free forever plan',
    'AI image generation included',
    'Export to PDF',
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, ${tokens.colors.accentHover} 100%)`,
          }}
        />

        {/* Overlay pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating shapes */}
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            top: '-10%',
            right: '-5%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            bottom: '-10%',
            left: '10%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={variants.stagger}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={variants.fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Start Creating Today
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={variants.fadeInUp}
            className="text-5xl lg:text-6xl font-bold text-white leading-[1.1]"
            style={{ fontFamily: tokens.fonts.display }}
          >
            Ready to transform
            <br />
            your presentations?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={variants.fadeInUp}
            className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of creators who've discovered a better way to build presentations. Start
            for free, no credit card required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={variants.fadeInUp} className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={onGetStarted}
              icon={<ArrowRight className="w-5 h-5" />}
              className="shadow-xl"
            >
              Start Creating Free
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 border-2 border-white/30"
            >
              Schedule a Demo
            </Button>
          </motion.div>

          {/* Benefits */}
          <motion.div
            variants={variants.fadeInUp}
            className="flex flex-wrap items-center justify-center gap-6 pt-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 text-white/90"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={variants.fadeInUp}
            className="pt-8 flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  'rgba(255,255,255,0.9)',
                  'rgba(255,255,255,0.7)',
                  'rgba(255,255,255,0.5)',
                  'rgba(255,255,255,0.3)',
                ].map((color, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white/30 backdrop-blur-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-white/90 text-sm">
                Join <strong className="font-semibold">2,500+</strong> creators
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/90">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm">
                <strong className="font-semibold">4.9/5</strong> from 500+ reviews
              </span>
            </div>
          </motion.div>

          {/* Decorative animated elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Floating icons */}
            {[
              { Icon: Sparkles, delay: 0, x: '10%', y: '20%' },
              { Icon: ArrowRight, delay: 1, x: '85%', y: '30%' },
              { Icon: Check, delay: 2, x: '15%', y: '70%' },
              { Icon: Sparkles, delay: 1.5, x: '90%', y: '75%' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: item.x, top: item.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0, 1, 0],
                  y: [0, -20, -40],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: item.delay,
                  ease: 'easeOut',
                }}
              >
                <item.Icon className="w-6 h-6 text-white" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16"
          style={{ fill: tokens.colors.background }}
        >
          <path d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};
