/**
 * Variant 1: Refined Current - Testimonials Section
 * Customer quotes on sage background
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { tokens, tw, variants } from '../shared/tokens';
import { testimonials } from '../shared/CommonComponents';

export const Testimonials: React.FC = () => {
  return (
    <section className={`relative py-32 ${tw.bgPrimary} overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${tokens.colors.accent} 0%, transparent 70%)`,
            top: '10%',
            right: '-10%',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${tokens.colors.accent} 0%, transparent 70%)`,
            bottom: '20%',
            left: '-5%',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={variants.stagger}
          className="text-center mb-16"
        >
          <motion.span
            variants={variants.fadeInUp}
            className={`inline-block ${tw.textAccent} text-sm font-semibold uppercase tracking-wider mb-4`}
          >
            Testimonials
          </motion.span>
          <motion.h2
            variants={variants.fadeInUp}
            className={`text-5xl lg:text-6xl font-bold ${tw.textPrimary} mb-6`}
            style={{ fontFamily: tokens.fonts.display }}
          >
            Loved by creators
            <br />
            worldwide
          </motion.h2>
          <motion.p
            variants={variants.fadeInUp}
            className={`text-xl ${tw.textSecondary} max-w-2xl mx-auto`}
          >
            Join thousands of professionals who've transformed their presentation workflow with
            DeckSnap.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative ${tw.bgSecondary} rounded-2xl p-6 ${tw.shadow} ${tw.transition} hover:${tw.shadowHover} border ${tw.border}`}
            >
              {/* Quote icon */}
              <div
                className={`w-10 h-10 rounded-xl ${tw.bgAccent} ${tw.bgAccentLight} flex items-center justify-center mb-4`}
              >
                <Quote className={`w-5 h-5 ${tw.textAccent}`} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${tw.textAccent} fill-current`} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className={`${tw.textPrimary} text-sm leading-relaxed mb-6`}>
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#D4E5D4]">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full ${tw.bgAccent} flex items-center justify-center text-white text-xs font-semibold`}
                >
                  {testimonial.avatar}
                </div>

                {/* Author info */}
                <div>
                  <div className={`${tw.textPrimary} text-sm font-semibold`}>
                    {testimonial.author}
                  </div>
                  <div className={`${tw.textMuted} text-xs`}>
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div
                className="absolute top-0 right-0 w-20 h-20 opacity-5 rounded-br-2xl"
                style={{
                  background: `radial-gradient(circle at top right, ${tokens.colors.accent} 0%, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-16 ${tw.bgSecondary} rounded-2xl p-8 ${tw.shadow} border ${tw.border}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2,500+', label: 'Presentations Created' },
              { value: '50K+', label: 'Slides Generated' },
              { value: '1,200+', label: 'Active Users' },
              { value: '4.9/5', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`text-3xl md:text-4xl font-bold ${tw.textAccent} mb-2`}
                  style={{ fontFamily: tokens.fonts.display }}
                >
                  {stat.value}
                </div>
                <div className={`${tw.textSecondary} text-sm`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className={`${tw.textMuted} text-sm mb-6`}>Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {['Linear', 'Figma', 'Stanford', 'Y Combinator', 'Stripe', 'Notion'].map(
              (company, i) => (
                <div
                  key={i}
                  className={`text-lg font-semibold ${tw.textSecondary}`}
                  style={{ fontFamily: tokens.fonts.display }}
                >
                  {company}
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
