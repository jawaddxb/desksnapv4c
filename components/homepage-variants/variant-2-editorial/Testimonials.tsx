/**
 * Testimonials Section - Editorial Variant
 * Cards with abstract avatar illustrations
 * Magazine-style layout with pull quotes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { tw, variants } from '../shared/tokens';

const testimonials = [
  {
    quote: "DeckSnap transformed how our team creates presentations. What used to take hours now takes minutes. The AI really understands design.",
    author: "Sarah Chen",
    role: "Head of Product",
    company: "Linear",
    initials: "SC",
    color: '#6B8E6B',
    rating: 5,
  },
  {
    quote: "The AI understands context in a way that's genuinely helpful. It's like having a design partner who knows what you're trying to say.",
    author: "Marcus Rodriguez",
    role: "Creative Director",
    company: "Figma",
    initials: "MR",
    color: '#3B82F6',
    rating: 5,
  },
  {
    quote: "Finally, a presentation tool that doesn't feel like a chore. My students are more engaged than ever with visually compelling content.",
    author: "Dr. Emily Park",
    role: "Professor of Design",
    company: "Stanford University",
    initials: "EP",
    color: '#8B5CF6',
    rating: 5,
  },
  {
    quote: "The rough draft feature is brilliant. It lets me focus on the story before getting lost in styling details. Game changer for founders.",
    author: "James Wilson",
    role: "Startup Founder",
    company: "Y Combinator",
    initials: "JW",
    color: '#F59E0B',
    rating: 5,
  },
  {
    quote: "We've adopted DeckSnap across our entire sales org. The consistency and quality of presentations has improved dramatically.",
    author: "Lisa Thompson",
    role: "VP of Sales",
    company: "Stripe",
    initials: "LT",
    color: '#EC4899',
    rating: 5,
  },
  {
    quote: "As a consultant, I create dozens of decks every month. DeckSnap saves me countless hours while making my work look more professional.",
    author: "David Kim",
    role: "Strategy Consultant",
    company: "McKinsey",
    initials: "DK",
    color: '#10B981',
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="relative py-32 bg-[#FAFBF8] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#6B8E6B]/5"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={variants.stagger}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B8E6B]/10 border border-[#6B8E6B]/20 mb-6"
            variants={variants.fadeIn}
          >
            <Star size={16} className="text-[#6B8E6B] fill-[#6B8E6B]" />
            <span className="text-sm font-medium text-[#4A5D4A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Trusted by creators
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl lg:text-6xl font-bold text-[#1E2E1E] leading-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            variants={variants.fadeInUp}
          >
            Loved by teams
            <span className="block text-[#6B8E6B]">around the world</span>
          </motion.h2>

          <motion.p
            className="text-xl text-[#4A5D4A] leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
            variants={variants.fadeInUp}
          >
            Join thousands of professionals who've transformed their presentation workflow
          </motion.p>
        </motion.div>

        {/* Testimonial grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={variants.staggerFast}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-20 grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants.stagger}
        >
          <StatCard number="10,000+" label="Active Users" />
          <StatCard number="50,000+" label="Presentations Created" />
          <StatCard number="4.9/5" label="Average Rating" />
        </motion.div>
      </div>
    </section>
  );
};

// Testimonial card component
const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  color: string;
  rating: number;
}> = ({ quote, author, role, company, initials, color, rating }) => (
  <motion.div
    className="group relative bg-white rounded-3xl p-8 border-2 border-[#D4E5D4] hover:border-[#6B8E6B] transition-all duration-300"
    variants={variants.fadeInUp}
    whileHover={{ y: -8, shadow: '0 20px 60px rgba(107, 142, 107, 0.15)' }}
  >
    {/* Quote icon background */}
    <div className="absolute top-8 right-8 opacity-5 pointer-events-none">
      <Quote size={80} className="text-[#6B8E6B]" />
    </div>

    {/* Content */}
    <div className="relative z-10">
      {/* Rating stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className="text-[#FBBF24] fill-[#FBBF24]"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote
        className="text-lg text-[#1E2E1E] leading-relaxed mb-6"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        "{quote}"
      </blockquote>

      {/* Author info */}
      <div className="flex items-center gap-4 pt-6 border-t border-[#D4E5D4]">
        {/* Avatar with abstract illustration */}
        <motion.div
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {/* Avatar background with gradient */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
              fontFamily: 'Playfair Display, serif',
            }}
          >
            {initials}
          </div>

          {/* Decorative ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: color }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Text info */}
        <div>
          <div
            className="font-semibold text-[#1E2E1E]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {author}
          </div>
          <div className="text-sm text-[#4A5D4A]">
            {role}
          </div>
          <div className="text-xs text-[#8FA58F]">
            {company}
          </div>
        </div>
      </div>
    </div>

    {/* Hover accent */}
    <motion.div
      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      style={{
        background: `linear-gradient(135deg, ${color}05 0%, transparent 100%)`,
      }}
    />
  </motion.div>
);

// Stat card component
const StatCard: React.FC<{
  number: string;
  label: string;
}> = ({ number, label }) => (
  <motion.div
    className="text-center p-8 rounded-2xl bg-white border border-[#D4E5D4]"
    variants={variants.scaleIn}
    whileHover={{ y: -4 }}
  >
    <div
      className="text-5xl font-bold text-[#6B8E6B] mb-2"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      {number}
    </div>
    <div
      className="text-sm text-[#4A5D4A] uppercase tracking-wider"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {label}
    </div>
  </motion.div>
);

export default Testimonials;
