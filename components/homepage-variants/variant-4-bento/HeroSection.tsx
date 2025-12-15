/**
 * Hero Section - Bento Grid Layout
 * Large hero card + surrounding feature cards
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Zap, LayoutGrid, Image } from 'lucide-react';
import { BentoCard, ColoredBentoCard } from './BentoGrid';
import { Button } from '../shared/CommonComponents';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="min-h-screen bg-[#F5FAF7] px-8 py-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Bento Grid */}
        <div className="grid grid-cols-4 gap-6 auto-rows-[280px]">
          {/* Large Hero Card - 2x2 */}
          <BentoCard
            colSpan={2}
            rowSpan={2}
            className="flex flex-col justify-between"
            interactive={false}
          >
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B8E6B]/10 text-[#6B8E6B] text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Presentations
              </motion.div>

              <motion.h1
                className="text-6xl font-bold text-[#1E2E1E] mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Create Stunning
                <br />
                Decks in
                <span className="text-[#6B8E6B]"> Minutes</span>
              </motion.h1>

              <motion.p
                className="text-xl text-[#4A5D4A] mb-8 max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                From idea to polished presentation. Let AI handle the heavy
                lifting while you focus on your story.
              </motion.p>
            </div>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started Free
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<Play className="w-5 h-5" />}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Decorative animated blob */}
            <motion.div
              className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#6B8E6B]/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </BentoCard>

          {/* Feature 1 - AI Magic - 1x1 */}
          <ColoredBentoCard color="green" colSpan={1} rowSpan={1}>
            <div className="h-full flex flex-col justify-between">
              <motion.div
                className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-2">AI Magic</h3>
                <p className="text-white/80 text-sm">
                  Generate content and layouts instantly
                </p>
              </div>
            </div>
          </ColoredBentoCard>

          {/* Feature 2 - Fast Creation - 1x1 */}
          <BentoCard colSpan={1} rowSpan={1}>
            <div className="h-full flex flex-col justify-between">
              <motion.div
                className="w-12 h-12 rounded-xl bg-[#6B8E6B]/10 flex items-center justify-center mb-4"
                whileHover={{ rotate: -10, scale: 1.1 }}
              >
                <Zap className="w-6 h-6 text-[#6B8E6B]" />
              </motion.div>
              <div>
                <div className="text-4xl font-bold text-[#6B8E6B] mb-2">5 min</div>
                <p className="text-[#4A5D4A] text-sm">Average creation time</p>
              </div>
            </div>
          </BentoCard>

          {/* Feature 3 - Themes Preview - 1x2 */}
          <BentoCard colSpan={1} rowSpan={2}>
            <div className="h-full flex flex-col justify-between">
              <div>
                <motion.div
                  className="w-12 h-12 rounded-xl bg-[#6B8E6B]/10 flex items-center justify-center mb-6"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <LayoutGrid className="w-6 h-6 text-[#6B8E6B]" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#1E2E1E] mb-3">
                  60+ Layouts
                </h3>
                <p className="text-[#4A5D4A] text-sm mb-6">
                  Professional archetypes for every need
                </p>
              </div>

              {/* Mini theme preview */}
              <div className="space-y-2">
                <motion.div
                  className="h-12 rounded-lg bg-gradient-to-r from-[#6B8E6B] to-[#5A7A5A]"
                  whileHover={{ scale: 1.02 }}
                />
                <motion.div
                  className="h-12 rounded-lg bg-gradient-to-r from-[#EDF5F0] to-[#D4E5D4]"
                  whileHover={{ scale: 1.02 }}
                />
                <motion.div
                  className="h-12 rounded-lg bg-gradient-to-r from-[#FAFBF8] to-[#EDF5F0]"
                  whileHover={{ scale: 1.02 }}
                />
              </div>
            </div>
          </BentoCard>

          {/* Feature 4 - User Count - 1x1 */}
          <ColoredBentoCard color="sage" colSpan={1} rowSpan={1}>
            <div className="h-full flex flex-col justify-between">
              <div className="text-5xl font-bold text-[#6B8E6B] mb-2">10K+</div>
              <div>
                <p className="text-[#4A5D4A] text-sm font-medium">
                  Presentations created
                </p>
                <div className="flex -space-x-2 mt-3">
                  {['SC', 'MR', 'EP', 'JW'].map((avatar, i) => (
                    <motion.div
                      key={avatar}
                      className="w-8 h-8 rounded-full bg-[#6B8E6B] text-white text-xs flex items-center justify-center border-2 border-white font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {avatar}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ColoredBentoCard>

          {/* Feature 5 - AI Images - 1x1 */}
          <BentoCard colSpan={1} rowSpan={1}>
            <div className="h-full flex flex-col justify-between">
              <motion.div
                className="w-12 h-12 rounded-xl bg-[#6B8E6B]/10 flex items-center justify-center mb-4"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Image className="w-6 h-6 text-[#6B8E6B]" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-[#1E2E1E] mb-2">
                  AI Images
                </h3>
                <p className="text-[#4A5D4A] text-xs">
                  Contextual visuals generated on demand
                </p>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};
