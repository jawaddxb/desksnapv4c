/**
 * TestimonialsSection - Full-screen testimonial carousel
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FullScreenSection } from './FullScreenSection';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../shared/CommonComponents';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <FullScreenSection id="testimonials" backgroundColor="#EDF5F0">
      <div ref={ref} className="relative w-full h-full max-w-7xl mx-auto px-8 flex items-center">
        {/* Background decoration */}
        <motion.div
          className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#6B8E6B]/5"
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-64 h-64 rounded-full bg-white/50"
          animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="relative w-full">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-white rounded-full shadow-sm mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-medium text-[#6B8E6B]">Testimonials</span>
            </motion.div>

            <motion.h2
              className="text-[5rem] font-bold leading-[0.95] tracking-tight text-[#1E2E1E]"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Loved by
              <br />
              <span className="text-[#6B8E6B]">creative professionals</span>
            </motion.h2>
          </motion.div>

          {/* Testimonial Card */}
          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="bg-white rounded-3xl shadow-2xl p-16 relative overflow-hidden"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Quote decoration */}
                <motion.div
                  className="absolute -top-6 -left-6 w-32 h-32 text-[#6B8E6B]/10"
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Quote className="w-full h-full" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 space-y-10">
                  {/* Quote */}
                  <motion.p
                    className="text-4xl font-light leading-relaxed text-[#1E2E1E] text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    "{currentTestimonial.quote}"
                  </motion.p>

                  {/* Author */}
                  <motion.div
                    className="flex items-center justify-center gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6B8E6B] to-[#5A7A5A] flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                      {currentTestimonial.avatar}
                    </div>

                    {/* Details */}
                    <div className="text-left">
                      <div className="text-xl font-semibold text-[#1E2E1E]">
                        {currentTestimonial.author}
                      </div>
                      <div className="text-base text-[#8FA58F]">
                        {currentTestimonial.role} • {currentTestimonial.company}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative gradient */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#6B8E6B]/5 to-transparent rounded-tl-full pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-8 mt-12">
              {/* Previous button */}
              <motion.button
                onClick={goToPrevious}
                className="w-14 h-14 rounded-full bg-white border-2 border-[#D4E5D4] flex items-center justify-center hover:border-[#6B8E6B] hover:bg-[#6B8E6B] hover:text-white transition-all shadow-md group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-6 h-6 text-[#4A5D4A] group-hover:text-white transition-colors" />
              </motion.button>

              {/* Dots */}
              <div className="flex gap-3">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-12 bg-[#6B8E6B]'
                        : 'w-3 bg-[#D4E5D4] hover:bg-[#6B8E6B]/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              {/* Next button */}
              <motion.button
                onClick={goToNext}
                className="w-14 h-14 rounded-full bg-white border-2 border-[#D4E5D4] flex items-center justify-center hover:border-[#6B8E6B] hover:bg-[#6B8E6B] hover:text-white transition-all shadow-md group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-6 h-6 text-[#4A5D4A] group-hover:text-white transition-colors" />
              </motion.button>
            </div>
          </div>

          {/* Counter */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-lg text-[#8FA58F] font-medium">
              {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
          </motion.div>
        </div>
      </div>
    </FullScreenSection>
  );
};
