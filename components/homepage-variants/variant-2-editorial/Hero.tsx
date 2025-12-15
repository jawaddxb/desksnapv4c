/**
 * Hero Section - Editorial Variant
 * Split layout: 60% large SVG illustration + 40% headline text
 * Magazine-style editorial design with oversized serif typography
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { tw, variants } from '../shared/tokens';
import { Button } from '../shared/CommonComponents';
import { HeroPresentationMockup } from './illustrations';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#6B8E6B]/5"
          style={{ top: '15%', left: '-10%' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-[#6B8E6B]/8"
          style={{ bottom: '10%', right: '5%' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-[40%_60%] gap-16 items-center">
          {/* Left: Headline Text (40%) */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={variants.stagger}
          >
            {/* Eyebrow */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B8E6B]/10 border border-[#6B8E6B]/20"
              variants={variants.fadeIn}
            >
              <div className="w-2 h-2 rounded-full bg-[#6B8E6B] animate-pulse" />
              <span className="text-sm font-medium text-[#4A5D4A]" style={{ fontFamily: 'Inter, sans-serif' }}>
                AI-Powered Presentations
              </span>
            </motion.div>

            {/* Main headline - Editorial serif typography */}
            <motion.h1
              className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] text-[#1E2E1E] tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
              variants={variants.fadeInUp}
            >
              Create
              <span className="block text-[#6B8E6B] mt-2">Beautiful</span>
              <span className="block mt-2">Decks in</span>
              <span className="block mt-2">Minutes</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl lg:text-2xl text-[#4A5D4A] leading-relaxed max-w-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
              variants={variants.fadeInUp}
            >
              Transform your ideas into stunning presentations with AI that understands design, storytelling, and your unique voice.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={variants.fadeInUp}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                icon={<ArrowRight size={20} />}
                className="text-lg px-10 py-5"
              >
                Start Creating Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-5"
              >
                View Examples
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center gap-6 pt-8 border-t border-[#D4E5D4]"
              variants={variants.fadeIn}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B8E6B] to-[#4A5D4A] border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-[#1E2E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  10,000+ creators
                </div>
                <div className="text-[#8FA58F]">
                  making presentations effortless
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Large SVG Illustration (60%) */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Decorative accent behind illustration */}
            <motion.div
              className="absolute -inset-8 bg-gradient-to-br from-[#F5FAF7] to-[#EDF5F0] rounded-3xl -z-10"
              animate={{ rotate: [0, 1, 0, -1, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Main illustration */}
            <HeroPresentationMockup className="w-full h-auto drop-shadow-2xl" />

            {/* Floating stat badges */}
            <motion.div
              className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-[0_8px_32px_rgba(107,142,107,0.15)] p-6 border border-[#D4E5D4]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold text-[#6B8E6B]" style={{ fontFamily: 'Playfair Display, serif' }}>
                60+
              </div>
              <div className="text-sm text-[#4A5D4A] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Layout Archetypes
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-6 bottom-1/4 bg-white rounded-2xl shadow-[0_8px_32px_rgba(107,142,107,0.15)] p-6 border border-[#D4E5D4]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold text-[#6B8E6B]" style={{ fontFamily: 'Playfair Display, serif' }}>
                30+
              </div>
              <div className="text-sm text-[#4A5D4A] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Visual Themes
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-[#6B8E6B]/30 flex justify-center pt-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-1.5 h-3 rounded-full bg-[#6B8E6B]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
