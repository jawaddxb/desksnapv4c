/**
 * TestimonialsSection Component
 *
 * Customer testimonials with Studio Noir aesthetic and reveal animations.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
  springs,
} from './animations';

const testimonials = [
  {
    quote: 'DeckSnap changed how I think about presentation prep. The ideation stage alone is worth it.',
    author: 'Sarah Chen',
    role: 'Product Designer',
    company: 'TechStartup',
  },
  {
    quote: 'Finally, an AI tool that doesn\'t skip the process. My decks are better because my thinking is better.',
    author: 'Dr. Marcus Rodriguez',
    role: 'Professor of Design',
    company: 'RISD',
  },
  {
    quote: 'The design quality is unreal. And Neutron remembering my past research? Game-changer.',
    author: 'Priya Sharma',
    role: 'Founder',
    company: 'SeedStage',
  },
];

// Testimonial card with staggered reveal
const TestimonialCard: React.FC<{
  testimonial: typeof testimonials[0];
  index: number;
}> = ({ testimonial, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="bg-[#111111] p-10 cursor-pointer"
      variants={fadeInUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
      }}
    >
      {/* Quote mark with scale animation */}
      <motion.span
        className="text-5xl text-[#c5a47e] leading-none block"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        viewport={viewportOnce}
        transition={{
          ...springs.bouncy,
          delay: index * 0.1,
        }}
      >
        "
      </motion.span>

      {/* Quote with fade in */}
      <motion.blockquote
        className="text-lg text-white/80 leading-relaxed mt-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      >
        {testimonial.quote}
      </motion.blockquote>

      {/* Author with slide up */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
      >
        <motion.div
          className="w-10 h-10 border border-white/20 flex items-center justify-center"
          animate={{
            borderColor: isHovered ? 'rgba(197, 164, 126, 0.5)' : 'rgba(255, 255, 255, 0.2)',
            boxShadow: isHovered ? '0 0 15px rgba(197, 164, 126, 0.2)' : 'none',
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="text-sm font-medium"
            animate={{
              color: isHovered ? 'rgba(197, 164, 126, 1)' : 'rgba(255, 255, 255, 1)',
            }}
          >
            {testimonial.author.charAt(0)}
          </motion.span>
        </motion.div>
        <div>
          <motion.p
            className="text-white font-medium"
            animate={{
              color: isHovered ? 'rgba(197, 164, 126, 1)' : 'rgba(255, 255, 255, 1)',
            }}
            transition={{ duration: 0.3 }}
          >
            {testimonial.author}
          </motion.p>
          <p className="text-sm text-white/40">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.span
            variants={fadeInUp}
            className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block"
          >
            Testimonials
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-light mb-6"
          >
            Hear from early users.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-white/60"
          >
            Founders, designers, and educators who've discovered a better process.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-px bg-white/10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
