/**
 * NeutronSection Component
 *
 * Highlights the Neutron integration for persistent memory.
 * "Meet Neutron. Your knowledge layer."
 * Studio Noir aesthetic with animated icon interactions.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, RefreshCw, ExternalLink, Lock } from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
  popIn,
  viewportOnce,
  ping,
} from './animations';

const features = [
  {
    icon: Database,
    title: 'Persistent Memory',
    description: 'Every piece of research you surface gets stored. Next time you build a deck on a similar topic, Neutron surfaces what you\'ve already learned.',
    iconAnimation: 'stack',
  },
  {
    icon: Brain,
    title: 'Smart Recall',
    description: 'Starting a new investor pitch? Neutron pulls relevant data points, competitive insights, and messaging from your previous decks.',
    iconAnimation: 'pulse',
  },
  {
    icon: RefreshCw,
    title: 'Delta Updates',
    description: 'Markets move. Data changes. Neutron tracks what\'s shifted since your last session and highlights updates you might want to incorporate.',
    iconAnimation: 'spin',
  },
];

// Animated icon based on type
const AnimatedIcon: React.FC<{
  icon: typeof Database;
  animation: string;
  isHovered: boolean;
}> = ({ icon: Icon, animation, isHovered }) => {
  const getAnimation = () => {
    switch (animation) {
      case 'stack':
        return isHovered ? { y: [0, -3, 0, -3, 0] } : {};
      case 'pulse':
        return isHovered ? {
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        } : {};
      case 'spin':
        return isHovered ? { rotate: 360 } : {};
      default:
        return {};
    }
  };

  return (
    <motion.div animate={getAnimation()} transition={{ duration: 0.5 }}>
      <Icon className="w-5 h-5 text-[#c5a47e]" />
    </motion.div>
  );
};

// Feature card component
const FeatureCard: React.FC<{
  feature: typeof features[0];
  index: number;
}> = ({ feature, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      className="p-8 bg-[#111111] cursor-pointer"
      variants={fadeInUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
      }}
    >
      <motion.div
        className="w-10 h-10 border border-white/20 flex items-center justify-center mb-6"
        animate={{
          borderColor: isHovered ? 'rgba(197, 164, 126, 0.5)' : 'rgba(255, 255, 255, 0.2)',
          boxShadow: isHovered ? '0 0 20px rgba(197, 164, 126, 0.2)' : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedIcon
          icon={Icon}
          animation={feature.iconAnimation}
          isHovered={isHovered}
        />
      </motion.div>

      <motion.h3
        className="text-xl font-light mb-3"
        animate={{
          color: isHovered ? 'rgba(197, 164, 126, 1)' : 'rgba(255, 255, 255, 1)',
        }}
        transition={{ duration: 0.3 }}
      >
        {feature.title}
      </motion.h3>

      <p className="text-white/60 leading-relaxed text-sm">
        {feature.description}
      </p>
    </motion.div>
  );
};

export const NeutronSection: React.FC = () => {
  return (
    <section className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-4"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e]">
              Integration
            </span>
            <motion.span
              className="px-2 py-0.5 text-xs border border-[#c5a47e]/30 bg-[#c5a47e]/10 text-[#c5a47e]"
              animate={{
                boxShadow: ['0 0 0 0 rgba(197, 164, 126, 0)', '0 0 10px 2px rgba(197, 164, 126, 0.3)', '0 0 0 0 rgba(197, 164, 126, 0)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              New
            </motion.span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Meet Neutron.{' '}
            <span className="text-white/40">Your knowledge layer.</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-white/60 leading-relaxed"
          >
            The best presentations build on what you already know. Neutron is an integrated
            knowledge base—a second brain that remembers your research, your past decks,
            and the context that matters.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-px bg-white/10 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border border-white/10 bg-white/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center relative"
              whileHover={{
                borderColor: 'rgba(168, 85, 247, 0.6)',
                boxShadow: '0 0 25px rgba(168, 85, 247, 0.3)',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-6 h-6 text-purple-400" />
              </motion.div>
              {/* Ping effect */}
              <motion.div
                className="absolute inset-0 border border-purple-500/50 rounded-none"
                animate={ping}
              />
            </motion.div>
            <div>
              <div className="text-lg font-light">Neutron</div>
              <div className="text-sm text-white/40">External knowledge base integration</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <motion.div
              className="flex items-center gap-2 text-sm text-white/40"
              whileHover={{ color: 'rgba(74, 222, 128, 0.8)' }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Lock className="w-4 h-4" />
              </motion.div>
              <span>Private & encrypted</span>
            </motion.div>

            <motion.a
              href="https://myneutron.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#c5a47e] text-[#c5a47e] hover:bg-[#c5a47e] hover:text-black transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn more
              <motion.span
                whileHover={{ x: 2, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NeutronSection;
