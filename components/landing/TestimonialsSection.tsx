/**
 * TestimonialsSection Component
 *
 * Customer testimonials with Studio Noir aesthetic.
 */

import React from 'react';

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
            Hear from early users.
          </h2>
          <p className="text-xl text-white/60">
            Founders, designers, and educators who've discovered a better process.
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
