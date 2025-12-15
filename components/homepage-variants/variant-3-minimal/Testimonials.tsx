/**
 * Testimonials Section - Variant 3: Minimalist Statement
 * Single quote per view, minimal design with elegant transitions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../shared/tokens';
import { testimonials } from '../shared/CommonComponents';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate testimonials
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-32 md:py-40 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Quote mark decoration */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <svg
            width="80"
            height="60"
            viewBox="0 0 80 60"
            fill="none"
            className="mx-auto"
            style={{ opacity: 0.1 }}
          >
            <path
              d="M0 30.4C0 19.2 4.8 10.4 14.4 4C24 -2.4 35.2 -0.8 37.6 2.4L33.6 6.4C27.2 4 21.6 5.6 16.8 11.2C12 16.8 9.6 23.2 9.6 30.4C9.6 37.6 12 44 16.8 49.6C21.6 55.2 27.2 56.8 33.6 54.4L37.6 58.4C35.2 61.6 24 63.2 14.4 56.8C4.8 50.4 0 41.6 0 30.4Z"
              fill={tokens.colors.accent}
            />
            <path
              d="M42.4 30.4C42.4 19.2 47.2 10.4 56.8 4C66.4 -2.4 77.6 -0.8 80 2.4L76 6.4C69.6 4 64 5.6 59.2 11.2C54.4 16.8 52 23.2 52 30.4C52 37.6 54.4 44 59.2 49.6C64 55.2 69.6 56.8 76 54.4L80 58.4C77.6 61.6 66.4 63.2 56.8 56.8C47.2 50.4 42.4 41.6 42.4 30.4Z"
              fill={tokens.colors.accent}
            />
          </svg>
        </motion.div>

        {/* Testimonial content with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Quote */}
            <blockquote
              className="text-[clamp(28px,4vw,42px)] font-light leading-[1.4] italic mb-12 max-w-3xl mx-auto"
              style={{
                fontFamily: tokens.fonts.display,
                color: tokens.colors.text,
              }}
            >
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author info */}
            <div className="flex flex-col items-center gap-3">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium"
                style={{
                  background: tokens.colors.accentLight,
                  color: tokens.colors.accent,
                  fontFamily: tokens.fonts.body,
                }}
              >
                {currentTestimonial.avatar}
              </div>

              {/* Name and role */}
              <div>
                <p
                  className="text-lg font-medium mb-1"
                  style={{
                    fontFamily: tokens.fonts.body,
                    color: tokens.colors.text,
                  }}
                >
                  {currentTestimonial.author}
                </p>
                <p
                  className="text-base"
                  style={{
                    fontFamily: tokens.fonts.body,
                    color: tokens.colors.textMuted,
                  }}
                >
                  {currentTestimonial.role}, {currentTestimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className="group p-2"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <motion.div
                className="rounded-full transition-all duration-300"
                style={{
                  width: currentIndex === index ? 32 : 8,
                  height: 8,
                  background:
                    currentIndex === index
                      ? tokens.colors.accent
                      : tokens.colors.border,
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
