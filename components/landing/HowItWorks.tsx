/**
 * HowItWorks Component
 *
 * 3-step process visualization.
 * Wabi-Sabi aesthetic with organic connections.
 */

import React from 'react';
import { MessageSquare, Layers, Send } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Describe Your Idea',
    description: 'Start with a topic, a rough outline, or even just a question. Our AI handles the structure.',
  },
  {
    number: '02',
    icon: Layers,
    title: 'Choose Your Character',
    description: 'Select from 60+ visual archetypes. Each one is a complete design system—not a template you\'ll fight with.',
  },
  {
    number: '03',
    icon: Send,
    title: 'Refine & Present',
    description: 'Edit content, adjust layouts, regenerate visuals. When it feels right, present or export.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#f5f3ef]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a2e] mb-4">
            Three Steps to Beautiful
          </h2>
          <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto">
            No design skills required. No learning curve. Just describe what you need.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative bg-white rounded-2xl p-8 border border-[#e5e2dd] hover:border-[#d4af37]/30 transition-all duration-500"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 px-3 py-1 bg-[#1a1a2e] text-white text-xs font-bold rounded-full">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f3ef] flex items-center justify-center mb-6 mt-2">
                    <Icon className="w-8 h-8 text-[#d4af37]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#6b6b6b] leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative element */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center z-10">
                      <div className="w-3 h-3 bg-[#d4af37] rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
