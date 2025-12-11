/**
 * ProblemSection Component
 *
 * Positioning section that highlights what's wrong with other AI deck tools.
 * "Most AI deck tools skip the thinking."
 * Studio Noir aesthetic with animated flow comparison.
 */

import React, { useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lightbulb, FileEdit, Sparkles, AlertCircle } from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
  springs,
} from './animations';

// Animated arrow that draws itself
const AnimatedArrow: React.FC<{ delay: number; color?: string }> = ({ delay, color = 'rgba(255,255,255,0.2)' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <ArrowRight className="w-4 h-4" style={{ color }} />
    </motion.div>
  );
};

// Particle trail effect
const ParticleTrail: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-[#c5a47e]"
      style={{ boxShadow: '0 0 8px rgba(197, 164, 126, 0.8)' }}
      initial={{ x: 0, opacity: 0 }}
      animate={{
        x: [0, 280],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 5,
        ease: 'easeInOut',
      }}
    />
  );
};

// Glitch effect component for "Other Tools"
const GlitchBox: React.FC<{ children: React.ReactNode; isActive: boolean }> = ({ children, isActive }) => {
  return (
    <motion.div
      className="relative"
      animate={isActive ? {
        x: [0, -2, 2, -1, 1, 0],
        opacity: [1, 0.8, 1, 0.9, 1],
      } : {}}
      transition={{
        duration: 0.3,
        repeat: isActive ? 2 : 0,
      }}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-red-500/20 mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
};

export const ProblemSection: React.FC = () => {
  const leftRef = React.useRef(null);
  const rightRef = React.useRef(null);
  const isLeftInView = useInView(leftRef, { once: false, margin: '-100px' });
  const isRightInView = useInView(rightRef, { once: false, margin: '-100px' });

  // Animation state for the comparison
  const [leftStep, setLeftStep] = useState(0);
  const [rightStep, setRightStep] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);

  // Left side animation (fast - completes in ~1s)
  useEffect(() => {
    if (!isLeftInView) {
      setLeftStep(0);
      setShowGlitch(false);
      return;
    }

    const sequence = async () => {
      await new Promise(r => setTimeout(r, 500));
      setLeftStep(1); // Topic glows
      await new Promise(r => setTimeout(r, 300));
      setLeftStep(2); // Arrow shoots
      await new Promise(r => setTimeout(r, 200));
      setLeftStep(3); // Slides appear
      await new Promise(r => setTimeout(r, 300));
      setShowGlitch(true); // Glitch effect
      await new Promise(r => setTimeout(r, 500));
      setShowGlitch(false);

      // Loop
      await new Promise(r => setTimeout(r, 6000));
      setLeftStep(0);
    };

    sequence();
    const interval = setInterval(sequence, 8000);
    return () => clearInterval(interval);
  }, [isLeftInView]);

  // Right side animation (thoughtful - takes ~4s)
  useEffect(() => {
    if (!isRightInView) {
      setRightStep(0);
      return;
    }

    const sequence = async () => {
      await new Promise(r => setTimeout(r, 500));
      setRightStep(1); // Topic glows
      await new Promise(r => setTimeout(r, 600));
      setRightStep(2); // Arrow to Ideate
      await new Promise(r => setTimeout(r, 400));
      setRightStep(3); // Ideate processes
      await new Promise(r => setTimeout(r, 800));
      setRightStep(4); // Arrow to Draft
      await new Promise(r => setTimeout(r, 400));
      setRightStep(5); // Draft processes
      await new Promise(r => setTimeout(r, 800));
      setRightStep(6); // Arrow to Polish
      await new Promise(r => setTimeout(r, 400));
      setRightStep(7); // Polish sparkles

      // Loop
      await new Promise(r => setTimeout(r, 4000));
      setRightStep(0);
    };

    sequence();
    const interval = setInterval(sequence, 8000);
    return () => clearInterval(interval);
  }, [isRightInView]);

  return (
    <section className="py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main positioning statement */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-8"
          >
            Most AI deck tools{' '}
            <span className="text-white/40">skip the thinking.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto"
          >
            They take your prompt and hand you a finished product. Fast, yes. But also flat.
            No room for exploration. No space to develop your ideas.
          </motion.p>
        </motion.div>

        {/* Visual comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Other tools - Linear approach (fast, glitchy) */}
          <motion.div
            ref={leftRef}
            className="p-8 bg-white/5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                Other AI Tools
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 py-8 relative">
              {/* Topic box */}
              <motion.div
                className="text-center"
                animate={{
                  scale: leftStep >= 1 ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2"
                  animate={{
                    borderColor: leftStep >= 1 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                    boxShadow: leftStep >= 1 ? '0 0 15px rgba(255,255,255,0.2)' : 'none',
                  }}
                >
                  <span className="text-white/40 text-sm">Topic</span>
                </motion.div>
              </motion.div>

              {/* Fast arrow */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: leftStep >= 2 ? 1 : 0,
                  x: leftStep >= 2 ? 0 : -10,
                }}
                transition={{ duration: 0.15 }}
              >
                <ArrowRight className="w-6 h-6 text-white/20" />
              </motion.div>

              {/* Slides box with glitch */}
              <GlitchBox isActive={showGlitch}>
                <motion.div
                  className="text-center"
                  animate={{
                    opacity: leftStep >= 3 ? 1 : 0.3,
                    scale: leftStep >= 3 ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-24 h-16 bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 relative">
                    <span className="text-white/40 text-sm">Slides</span>
                    {showGlitch && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={springs.bouncy}
                      >
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </GlitchBox>
            </div>

            <motion.p
              className="text-white/40 text-center text-sm"
              animate={{
                color: showGlitch ? 'rgba(248, 113, 113, 0.6)' : 'rgba(255,255,255,0.4)',
              }}
            >
              Straight to output. No thinking involved.
            </motion.p>
          </motion.div>

          {/* DeckSnap - Process approach (thoughtful) */}
          <motion.div
            ref={rightRef}
            className="p-8 bg-[#c5a47e]/5 border border-[#c5a47e]/20 relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e]">
                DeckSnap
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 py-8 relative">
              {/* Particle trail */}
              {rightStep >= 2 && <ParticleTrail delay={0} />}

              {/* Topic */}
              <motion.div
                className="text-center"
                animate={{
                  scale: rightStep === 1 ? [1, 1.1, 1] : 1,
                }}
              >
                <motion.div
                  className="w-14 h-14 bg-[#c5a47e]/10 border border-[#c5a47e]/30 flex items-center justify-center mx-auto mb-2"
                  animate={{
                    borderColor: rightStep >= 1 ? 'rgba(197,164,126,0.6)' : 'rgba(197,164,126,0.3)',
                    boxShadow: rightStep === 1 ? '0 0 20px rgba(197,164,126,0.3)' : 'none',
                  }}
                >
                  <span className="text-[#c5a47e]/60 text-xs">Topic</span>
                </motion.div>
              </motion.div>

              {/* Arrow 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: rightStep >= 2 ? 1 : 0,
                  scale: rightStep >= 2 ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-4 h-4 text-[#c5a47e]/40" />
              </motion.div>

              {/* Ideate */}
              <motion.div
                className="text-center"
                animate={{
                  scale: rightStep === 3 ? [1, 1.1, 1] : 1,
                }}
              >
                <motion.div
                  className="w-14 h-14 bg-[#c5a47e]/20 border border-[#c5a47e]/40 flex items-center justify-center mx-auto mb-2"
                  animate={{
                    opacity: rightStep >= 2 ? 1 : 0.5,
                    boxShadow: rightStep === 3 ? '0 0 20px rgba(197,164,126,0.4)' : 'none',
                  }}
                >
                  <motion.div
                    animate={rightStep === 3 ? { rotate: [0, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Lightbulb className="w-5 h-5 text-[#c5a47e]" />
                  </motion.div>
                </motion.div>
                <span className="text-[#c5a47e]/60 text-xs">Ideate</span>
              </motion.div>

              {/* Arrow 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: rightStep >= 4 ? 1 : 0,
                  scale: rightStep >= 4 ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-4 h-4 text-[#c5a47e]/40" />
              </motion.div>

              {/* Draft */}
              <motion.div
                className="text-center"
                animate={{
                  scale: rightStep === 5 ? [1, 1.1, 1] : 1,
                }}
              >
                <motion.div
                  className="w-14 h-14 bg-[#c5a47e]/20 border border-[#c5a47e]/40 flex items-center justify-center mx-auto mb-2"
                  animate={{
                    opacity: rightStep >= 4 ? 1 : 0.5,
                    boxShadow: rightStep === 5 ? '0 0 20px rgba(197,164,126,0.4)' : 'none',
                  }}
                >
                  <motion.div
                    animate={rightStep === 5 ? { y: [0, -3, 0] } : {}}
                    transition={{ duration: 0.4, repeat: 2 }}
                  >
                    <FileEdit className="w-5 h-5 text-[#c5a47e]" />
                  </motion.div>
                </motion.div>
                <span className="text-[#c5a47e]/60 text-xs">Draft</span>
              </motion.div>

              {/* Arrow 3 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: rightStep >= 6 ? 1 : 0,
                  scale: rightStep >= 6 ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-4 h-4 text-[#c5a47e]/40" />
              </motion.div>

              {/* Polish */}
              <motion.div
                className="text-center"
                animate={{
                  scale: rightStep === 7 ? [1, 1.15, 1] : 1,
                }}
              >
                <motion.div
                  className="w-14 h-14 bg-[#c5a47e]/20 border border-[#c5a47e]/40 flex items-center justify-center mx-auto mb-2 relative"
                  animate={{
                    opacity: rightStep >= 6 ? 1 : 0.5,
                    boxShadow: rightStep === 7 ? '0 0 30px rgba(197,164,126,0.5)' : 'none',
                  }}
                >
                  <motion.div
                    animate={rightStep === 7 ? { rotate: 360 } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <Sparkles className="w-5 h-5 text-[#c5a47e]" />
                  </motion.div>
                  {/* Sparkle particles */}
                  <AnimatePresence>
                    {rightStep === 7 && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-[#c5a47e] rounded-full"
                            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: Math.cos((i * 60 * Math.PI) / 180) * 25,
                              y: Math.sin((i * 60 * Math.PI) / 180) * 25,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.05,
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className="text-[#c5a47e]/60 text-xs">Polish</span>
              </motion.div>
            </div>

            <motion.p
              className="text-[#c5a47e] text-center text-sm"
              animate={{
                opacity: rightStep === 7 ? 1 : 0.7,
              }}
            >
              A creative process, not just a generator.
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom statement */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-2xl md:text-3xl text-white font-light leading-relaxed">
            DeckSnap is different. We built a creative process—not just a generator.{' '}
            <motion.span
              className="text-[#c5a47e]"
              initial={{ opacity: 0.6 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Because your best ideas don't arrive fully formed. They emerge.
            </motion.span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
