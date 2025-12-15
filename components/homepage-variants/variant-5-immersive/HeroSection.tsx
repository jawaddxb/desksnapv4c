/**
 * HeroSection - Full-screen hero with animated presentation preview
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo, Button } from '../shared/CommonComponents';
import { FullScreenSection } from './FullScreenSection';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <FullScreenSection id="hero" backgroundColor="#F5FAF7">
      <div className="relative w-full h-full max-w-7xl mx-auto px-8 flex items-center">
        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[#6B8E6B]/5"
          animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-[#6B8E6B]/10"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left: Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#D4E5D4]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-[#6B8E6B]" />
              <span className="text-sm font-medium text-[#4A5D4A]">AI-Powered Presentations</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[5.5rem] font-bold leading-[0.95] tracking-tight text-[#1E2E1E]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Presentations
              <br />
              that tell
              <br />
              <span className="text-[#6B8E6B]">your story</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-[#4A5D4A] max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              From rough ideas to polished decks in minutes. Let AI handle the heavy lifting while you focus on what matters.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started Free
              </Button>
              <Button variant="secondary" size="lg">
                See Examples
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div>
                <div className="text-3xl font-bold text-[#1E2E1E]">10k+</div>
                <div className="text-sm text-[#8FA58F]">Presentations created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1E2E1E]">30+</div>
                <div className="text-sm text-[#8FA58F]">Professional themes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1E2E1E]">5min</div>
                <div className="text-sm text-[#8FA58F]">Average creation time</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Animated Presentation Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main slide preview */}
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#D4E5D4]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Slide content */}
              <div className="aspect-[16/10] p-12 bg-gradient-to-br from-white to-[#F5FAF7]">
                <motion.div
                  className="h-full flex flex-col justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {/* Title */}
                  <div className="space-y-4">
                    <motion.div
                      className="h-8 bg-[#6B8E6B] rounded-lg w-2/3"
                      initial={{ width: 0 }}
                      animate={{ width: '66%' }}
                      transition={{ delay: 1, duration: 0.8 }}
                    />
                    <motion.div
                      className="h-4 bg-[#D4E5D4] rounded w-1/2"
                      initial={{ width: 0 }}
                      animate={{ width: '50%' }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    />
                    <motion.div
                      className="h-4 bg-[#EDF5F0] rounded w-3/5"
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                    />
                  </div>

                  {/* Image placeholder */}
                  <motion.div
                    className="flex-1 mt-8 bg-gradient-to-br from-[#6B8E6B]/20 to-[#6B8E6B]/5 rounded-2xl flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                  >
                    <Sparkles className="w-16 h-16 text-[#6B8E6B]/30" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Slide indicator dots */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                <div className="w-2 h-2 rounded-full bg-[#6B8E6B]" />
                <div className="w-2 h-2 rounded-full bg-[#D4E5D4]" />
                <div className="w-2 h-2 rounded-full bg-[#D4E5D4]" />
                <div className="w-2 h-2 rounded-full bg-[#D4E5D4]" />
              </motion.div>
            </motion.div>

            {/* Floating cards */}
            <motion.div
              className="absolute -right-8 top-12 bg-white p-4 rounded-2xl shadow-xl border border-[#D4E5D4] w-48"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6B8E6B]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#6B8E6B]" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#1E2E1E]">AI Generated</div>
                  <div className="text-xs text-[#8FA58F]">Just now</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-8 bottom-20 bg-white p-3 rounded-xl shadow-lg border border-[#D4E5D4]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6B8E6B] flex items-center justify-center text-white text-xs font-bold">
                  30
                </div>
                <div className="text-xs font-medium text-[#4A5D4A]">Themes</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <span className="text-xs text-[#8FA58F] font-medium">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 border-2 border-[#D4E5D4] rounded-full flex items-start justify-center p-1.5"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-2 bg-[#6B8E6B] rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </FullScreenSection>
  );
};
