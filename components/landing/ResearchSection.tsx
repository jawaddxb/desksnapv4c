/**
 * ResearchSection Component
 *
 * Highlights the research integration with Grok.
 * "Research that actually helps."
 * Studio Noir aesthetic with animated mind map visualization.
 */

import React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Search,
  Globe,
  Twitter,
  FileText,
  Quote,
  Zap,
  Network
} from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
  popIn,
  viewportOnce,
  lightning,
  springs,
} from './animations';

const capabilities = [
  { icon: Globe, label: 'Web search' },
  { icon: Twitter, label: 'X/Twitter semantic search' },
  { icon: Zap, label: 'Live synthesis' },
  { icon: Quote, label: 'Automatic citations' },
  { icon: Network, label: 'Research mind map' },
];

const nodes = [
  { angle: 0, label: 'Market Data', color: 'blue' },
  { angle: 72, label: 'Trends', color: 'green' },
  { angle: 144, label: 'Competitors', color: 'pink' },
  { angle: 216, label: 'Expert Quotes', color: 'purple' },
  { angle: 288, label: 'Case Studies', color: 'yellow' },
];

const getNodeColors = (color: string) => ({
  bg: color === 'blue' ? 'rgba(96, 165, 250, 0.1)' :
      color === 'green' ? 'rgba(74, 222, 128, 0.1)' :
      color === 'pink' ? 'rgba(244, 114, 182, 0.1)' :
      color === 'purple' ? 'rgba(167, 139, 250, 0.1)' :
      'rgba(250, 204, 21, 0.1)',
  border: color === 'blue' ? 'rgba(96, 165, 250, 0.3)' :
          color === 'green' ? 'rgba(74, 222, 128, 0.3)' :
          color === 'pink' ? 'rgba(244, 114, 182, 0.3)' :
          color === 'purple' ? 'rgba(167, 139, 250, 0.3)' :
          'rgba(250, 204, 21, 0.3)',
  text: color === 'blue' ? 'rgba(96, 165, 250, 0.8)' :
        color === 'green' ? 'rgba(74, 222, 128, 0.8)' :
        color === 'pink' ? 'rgba(244, 114, 182, 0.8)' :
        color === 'purple' ? 'rgba(167, 139, 250, 0.8)' :
        'rgba(250, 204, 21, 0.8)',
  particle: color === 'blue' ? 'rgba(96, 165, 250, 1)' :
            color === 'green' ? 'rgba(74, 222, 128, 1)' :
            color === 'pink' ? 'rgba(244, 114, 182, 1)' :
            color === 'purple' ? 'rgba(167, 139, 250, 1)' :
            'rgba(250, 204, 21, 1)',
});

// Animated particle component that travels along connection line
const DataParticle: React.FC<{ angle: number; color: string; delay: number }> = ({ angle, color, delay }) => {
  const colors = getNodeColors(color);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
      style={{
        backgroundColor: colors.particle,
        boxShadow: `0 0 8px ${colors.particle}`,
      }}
      initial={{
        x: Math.cos((angle * Math.PI) / 180) * 120 - 4,
        y: Math.sin((angle * Math.PI) / 180) * 120 - 4,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        x: [
          Math.cos((angle * Math.PI) / 180) * 120 - 4,
          Math.cos((angle * Math.PI) / 180) * 60 - 4,
          -4,
        ],
        y: [
          Math.sin((angle * Math.PI) / 180) * 120 - 4,
          Math.sin((angle * Math.PI) / 180) * 60 - 4,
          -4,
        ],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: 'easeInOut',
      }}
    />
  );
};

// Animated connection line that draws itself
const ConnectionLine: React.FC<{ angle: number; delay: number; radius: number }> = ({ angle, delay, radius }) => {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 h-px bg-white/20 origin-left"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        transformOrigin: 'left center',
      }}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: radius, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: 'easeOut',
      }}
    />
  );
};

// Animated branch node
const BranchNode: React.FC<{ node: typeof nodes[0]; index: number; radius: number }> = ({ node, index, radius }) => {
  const colors = getNodeColors(node.color);
  const x = Math.cos((node.angle * Math.PI) / 180) * radius;
  const y = Math.sin((node.angle * Math.PI) / 180) * radius;

  return (
    <motion.div
      className="absolute"
      style={{
        top: `calc(50% + ${y}px)`,
        left: `calc(50% + ${x}px)`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        ...springs.bouncy,
        delay: 0.3 + index * 0.15,
      }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="px-3 py-2 border text-xs whitespace-nowrap cursor-pointer"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
          color: colors.text,
        }}
        whileHover={{
          boxShadow: `0 0 20px ${colors.border}`,
        }}
      >
        {node.label}
      </motion.div>
    </motion.div>
  );
};

export const ResearchSection: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <section className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.span
              variants={fadeInUp}
              className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block"
            >
              Research Integration
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-light mb-6"
            >
              Research that actually helps.
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/60 leading-relaxed mb-8"
            >
              Skip the tab-switching and copy-pasting. DeckSnap's research agents pull real-time
              data from across the web and X, synthesize findings into your ideation space,
              and cite every source.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 leading-relaxed mb-10"
            >
              Paste your content or start from scratch—we'll help you find what you need
              to make your case.
            </motion.p>

            {/* Capabilities */}
            <motion.div
              variants={staggerContainer}
              className="flex flex-wrap gap-3"
            >
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={i}
                    variants={popIn}
                    whileHover={{
                      scale: 1.05,
                      borderColor: 'rgba(197, 164, 126, 0.5)',
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 cursor-pointer transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#c5a47e]" />
                    <span className="text-sm text-white/60">{cap.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Visual - Animated Research Mind Map */}
          <div className="relative" ref={ref}>
            <motion.div
              className="aspect-square bg-white/5 border border-white/10 p-8 relative overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5 }}
            >
              {/* Central node with pulse animation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="w-20 h-20 bg-[#c5a47e]/20 border border-[#c5a47e]/40 rounded-full flex items-center justify-center relative"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={springs.bouncy}
                >
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#c5a47e]/30"
                    animate={isInView ? {
                      scale: [1, 1.5, 1.5],
                      opacity: [0.5, 0, 0],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                  <motion.div
                    animate={isInView ? {
                      rotate: [0, 360],
                    } : {}}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Search className="w-8 h-8 text-[#c5a47e]" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Connection lines - draw on scroll */}
              {isInView && nodes.map((node, i) => (
                <ConnectionLine
                  key={`line-${i}`}
                  angle={node.angle}
                  delay={0.1 + i * 0.1}
                  radius={120}
                />
              ))}

              {/* Branch nodes - pop in after lines */}
              {isInView && nodes.map((node, i) => (
                <BranchNode
                  key={`node-${i}`}
                  node={node}
                  index={i}
                  radius={120}
                />
              ))}

              {/* Data particles flowing to center */}
              {isInView && nodes.map((node, i) => (
                <DataParticle
                  key={`particle-${i}`}
                  angle={node.angle}
                  color={node.color}
                  delay={1 + i * 0.5}
                />
              ))}

              {/* Powered by badge with lightning animation */}
              <motion.div
                className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/80 border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: 1.5, duration: 0.4 }}
              >
                <motion.div
                  animate={lightning}
                >
                  <Zap className="w-4 h-4 text-[#c5a47e]" />
                </motion.div>
                <span className="text-xs text-white/60">Powered by Grok</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
