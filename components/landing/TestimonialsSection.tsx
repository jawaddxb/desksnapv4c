/**
 * TestimonialsSection Component
 *
 * Customer testimonials with Wabi-Sabi aesthetic.
 * Placeholder content for now.
 */

import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'DeckSnap gave me permission to stop obsessing over pixel perfection. My presentations are better because they\'re more honest.',
    author: 'Sarah Chen',
    role: 'Product Designer',
    company: 'TechStartup',
    avatar: null,
  },
  {
    quote: 'My students actually engage with my slides now. The Wabi-Sabi aesthetic invites discussion instead of passive consumption.',
    author: 'Dr. Marcus Rodriguez',
    role: 'Professor of Design',
    company: 'RISD',
    avatar: null,
  },
  {
    quote: 'We closed our Series A with a DeckSnap presentation. Investors said it looked "refreshingly authentic."',
    author: 'Priya Sharma',
    role: 'Founder',
    company: 'SeedStage',
    avatar: null,
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#f5f3ef]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a2e] mb-4">
            Loved by Creators
          </h2>
          <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto">
            Join thousands of designers, educators, and founders who've discovered a better way to present.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-[#e5e2dd] hover:border-[#d4af37]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#d4af37]/5"
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 text-[#d4af37]" />
              </div>

              {/* Quote */}
              <blockquote className="text-[#1a1a2e] leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-[#f5f3ef] flex items-center justify-center">
                  <span className="text-lg font-semibold text-[#1a1a2e]">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[#1a1a2e]">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-[#6b6b6b]">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
