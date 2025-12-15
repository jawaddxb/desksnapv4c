/**
 * Testimonial Cards - Bento Grid
 * Customer testimonials in asymmetric grid layout
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../shared/CommonComponents';

export const TestimonialCards: React.FC = () => {
  return (
    <section className="bg-[#F5FAF7] px-8 py-32">
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-[#1E2E1E] mb-6">
            Loved by Teams Worldwide
          </h2>
          <p className="text-xl text-[#4A5D4A] max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their
            presentation workflow.
          </p>
        </motion.div>

        {/* Testimonial Grid - Bento Layout */}
        <div className="grid grid-cols-4 gap-6 auto-rows-[240px]">
          {/* Large testimonial - 2x2 */}
          <motion.div
            className="col-span-2 row-span-2 bg-[#6B8E6B] text-white rounded-3xl p-10 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#5A7A5A] flex flex-col justify-between relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{
              y: -4,
              boxShadow: '0 12px 48px rgba(107, 142, 107, 0.16)',
              transition: { duration: 0.2 },
            }}
          >
            {/* Quote icon */}
            <Quote className="w-16 h-16 text-white/20 mb-6" />

            <div className="flex-grow">
              <p className="text-2xl leading-relaxed mb-8">
                "{testimonials[0].quote}"
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                {testimonials[0].avatar}
              </div>
              <div>
                <div className="font-semibold text-lg">
                  {testimonials[0].author}
                </div>
                <div className="text-white/80 text-sm">
                  {testimonials[0].role} at {testimonials[0].company}
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="absolute top-10 right-10 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-white/30 text-white/30"
                />
              ))}
            </div>

            {/* Decorative blob */}
            <motion.div
              className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Medium testimonial - 1x2 */}
          <motion.div
            className="col-span-1 row-span-2 bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex flex-col justify-between"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            whileHover={{
              y: -4,
              boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
              transition: { duration: 0.2 },
            }}
          >
            <Quote className="w-12 h-12 text-[#6B8E6B]/20 mb-4" />

            <div className="flex-grow">
              <p className="text-lg text-[#1E2E1E] leading-relaxed mb-6">
                "{testimonials[1].quote}"
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-[#6B8E6B]/10 flex items-center justify-center text-sm font-bold text-[#6B8E6B] mb-3">
                {testimonials[1].avatar}
              </div>
              <div className="font-semibold text-[#1E2E1E]">
                {testimonials[1].author}
              </div>
              <div className="text-[#4A5D4A] text-sm">
                {testimonials[1].role}
              </div>
            </div>

            {/* Stars */}
            <div className="absolute top-8 right-8 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-[#6B8E6B]/30 text-[#6B8E6B]/30"
                />
              ))}
            </div>
          </motion.div>

          {/* Small testimonial - 1x1 */}
          <motion.div
            className="col-span-1 row-span-1 bg-[#EDF5F0] rounded-3xl p-6 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex flex-col justify-between relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            whileHover={{
              y: -4,
              boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
              transition: { duration: 0.2 },
            }}
          >
            <p className="text-sm text-[#1E2E1E] leading-relaxed mb-4">
              "{testimonials[2].quote.slice(0, 80)}..."
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6B8E6B] flex items-center justify-center text-xs font-bold text-white">
                {testimonials[2].avatar}
              </div>
              <div>
                <div className="font-semibold text-sm text-[#1E2E1E]">
                  {testimonials[2].author}
                </div>
                <div className="text-[#4A5D4A] text-xs">
                  {testimonials[2].company}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats card - 1x1 */}
          <motion.div
            className="col-span-1 row-span-1 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex flex-col justify-center items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.3 }}
            whileHover={{
              y: -4,
              boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
              transition: { duration: 0.2 },
            }}
          >
            <div className="text-5xl font-bold text-[#6B8E6B] mb-2">4.9</div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-[#6B8E6B] text-[#6B8E6B]"
                />
              ))}
            </div>
            <p className="text-sm text-[#4A5D4A]">Average rating</p>
            <p className="text-xs text-[#8FA58F] mt-1">from 2,500+ reviews</p>
          </motion.div>

          {/* Wide testimonial - 2x1 */}
          <motion.div
            className="col-span-2 row-span-1 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex items-center gap-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.4 }}
            whileHover={{
              y: -4,
              boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
              transition: { duration: 0.2 },
            }}
          >
            <Quote className="w-10 h-10 text-[#6B8E6B]/20 flex-shrink-0" />

            <div className="flex-grow">
              <p className="text-base text-[#1E2E1E] leading-relaxed mb-3">
                "{testimonials[3].quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6B8E6B]/10 flex items-center justify-center text-xs font-bold text-[#6B8E6B]">
                  {testimonials[3].avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1E2E1E]">
                    {testimonials[3].author}
                  </div>
                  <div className="text-[#4A5D4A] text-xs">
                    {testimonials[3].role}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <motion.div
              className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#6B8E6B]/5"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Logo cloud card - 2x1 */}
          <motion.div
            className="col-span-2 row-span-1 bg-[#EDF5F0] rounded-3xl p-6 shadow-[0_4px_24px_rgba(107,142,107,0.08)] border border-[#D4E5D4] flex flex-col justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.5 }}
            whileHover={{
              y: -4,
              boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
              transition: { duration: 0.2 },
            }}
          >
            <p className="text-sm text-[#8FA58F] text-center mb-4">
              Trusted by teams at
            </p>
            <div className="flex items-center justify-around">
              {['Linear', 'Figma', 'Stanford', 'Y Combinator'].map(
                (company) => (
                  <div
                    key={company}
                    className="text-[#6B8E6B] font-semibold text-sm"
                  >
                    {company}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
