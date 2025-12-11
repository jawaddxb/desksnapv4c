/**
 * TestimonialsSection Component
 *
 * Customer testimonials with Studio Noir aesthetic.
 */

import React from 'react';

const testimonials = [
  {
    quote: 'DeckSnap gave me permission to stop obsessing over pixel perfection. My presentations are better because they\'re more honest.',
    author: 'Sarah Chen',
    role: 'Product Designer',
    company: 'TechStartup',
  },
  {
    quote: 'My students actually engage with my slides now. The aesthetic invites discussion instead of passive consumption.',
    author: 'Dr. Marcus Rodriguez',
    role: 'Professor of Design',
    company: 'RISD',
  },
  {
    quote: 'We closed our Series A with a DeckSnap presentation. Investors said it looked "refreshingly authentic."',
    author: 'Priya Sharma',
    role: 'Founder',
    company: 'SeedStage',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
            Testimonials
          </span>
          <h2 className="text-5xl md:text-6xl font-light mb-6">
            Loved by Creators
          </h2>
          <p className="text-xl text-white/60">
            Join thousands of designers, educators, and founders who've discovered a better way to present.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-px bg-white/10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#111111] p-10"
            >
              {/* Quote mark */}
              <span className="text-5xl text-[#c5a47e] opacity-30 leading-none">"</span>

              {/* Quote */}
              <blockquote className="text-lg text-white/80 leading-relaxed mt-4 mb-8">
                {testimonial.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-white/40">
                    {testimonial.role}, {testimonial.company}
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
