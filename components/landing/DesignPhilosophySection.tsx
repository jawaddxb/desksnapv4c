/**
 * DesignPhilosophySection Component
 *
 * Wabi-Sabi philosophy teaser for the homepage.
 * "Design that breathes."
 * Studio Noir aesthetic with morphing blob and floating shapes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Hexagon, Circle, Triangle } from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
  blobMorph,
  viewportOnce,
} from './animations';

// Floating shape with orbital animation
const FloatingShape: React.FC<{
  icon: 'hexagon' | 'circle' | 'triangle';
  className: string;
  delay?: number;
  duration?: number;
  radius?: number;
}> = ({ icon, className, delay = 0, duration = 8, radius = 15 }) => {
  const Icon = icon === 'hexagon' ? Hexagon : icon === 'circle' ? Circle : Triangle;

  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -radius, 0, radius, 0],
        x: [0, radius * 0.5, 0, -radius * 0.5, 0],
        rotate: icon === 'hexagon' ? [0, 360] : [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Icon className={`w-${icon === 'hexagon' ? 6 : icon === 'circle' ? 4 : 3} h-${icon === 'hexagon' ? 6 : icon === 'circle' ? 4 : 3} ${
        icon === 'hexagon' ? 'text-[#c5a47e]/30' :
        icon === 'circle' ? 'text-white/20' :
        'text-[#c5a47e]/20'
      }`} />
    </motion.div>
  );
};

// Morphing blob component
const MorphingBlob: React.FC = () => {
  return (
    <motion.div
      className="w-32 h-40 bg-[#c5a47e]/20 border border-[#c5a47e]/30"
      style={{
        borderRadius: '60% 40% 55% 45% / 55% 45% 60% 40%',
      }}
      animate={blobMorph.animate}
    />
  );
};

// Animated structured side with stacking elements
const StructuredSide: React.FC = () => {
  return (
    <motion.div
      className="h-full flex flex-col justify-center space-y-4"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <motion.div
        className="w-8 h-1 bg-[#c5a47e]"
        initial={{ width: 0 }}
        whileInView={{ width: 32 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.div
        className="w-full h-6 bg-white/10"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
      <motion.div
        className="w-3/4 h-6 bg-white/10"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.4, delay: 0.4 }}
      />
      <motion.div
        className="w-1/2 h-6 bg-white/10"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
    </motion.div>
  );
};

export const DesignPhilosophySection: React.FC = () => {
  // Mouse tracking for subtle parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / 20);
    mouseY.set((e.clientY - centerY) / 20);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual - Organic shapes */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="aspect-[4/3] bg-white/5 border border-white/10 relative overflow-hidden">
              {/* Organic asymmetric layout preview */}
              <div className="absolute inset-6">
                {/* Structured side */}
                <div className="absolute left-0 top-0 w-1/2 h-full pr-4">
                  <StructuredSide />
                </div>

                {/* Organic side */}
                <div className="absolute right-0 top-0 w-1/2 h-full pl-4">
                  <motion.div
                    className="h-full flex items-center justify-center relative"
                    style={{
                      x: springX,
                      y: springY,
                    }}
                  >
                    {/* Organic blob shape */}
                    <MorphingBlob />

                    {/* Floating accents with orbital animations */}
                    <FloatingShape
                      icon="hexagon"
                      className="top-8 right-8"
                      delay={0}
                      duration={10}
                      radius={12}
                    />
                    <FloatingShape
                      icon="circle"
                      className="bottom-12 left-4"
                      delay={1}
                      duration={8}
                      radius={8}
                    />
                    <FloatingShape
                      icon="triangle"
                      className="top-1/3 right-4"
                      delay={2}
                      duration={12}
                      radius={10}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Labels */}
              <motion.div
                className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/80 border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: 0.6 }}
              >
                <span className="text-xs text-white/60">Structured</span>
                <motion.span
                  className="text-white/20"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +
                </motion.span>
                <span className="text-xs text-[#c5a47e]">Organic</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="order-1 lg:order-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.span
              variants={fadeInUp}
              className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block"
            >
              Design Philosophy
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-light mb-6"
            >
              Design that breathes.
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/60 leading-relaxed mb-6"
            >
              We built DeckSnap on the principle of wabi-sabi—the Japanese philosophy of
              finding beauty in imperfection and transience.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 leading-relaxed mb-8"
            >
              Our design system offers hundreds of patterns that balance precision with
              organic flow. Structured when you need authority. Natural when you need warmth.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-white mb-10"
            >
              Your decks won't look like everyone else's.{' '}
              <motion.span
                className="text-[#c5a47e]"
                initial={{ opacity: 0.6 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                They'll look like yours.
              </motion.span>
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#c5a47e] hover:text-white transition-colors group"
              >
                Learn about our philosophy
                <motion.span
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DesignPhilosophySection;
