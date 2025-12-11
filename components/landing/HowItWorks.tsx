/**
 * HowItWorks Component
 *
 * 3-step process visualization.
 * Studio Noir aesthetic - black, white, gold.
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
    <section id="how-it-works" className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
            How It Works
          </span>
          <h2 className="text-5xl md:text-6xl font-light mb-6">
            Three Steps to Beautiful
          </h2>
          <p className="text-xl text-white/60">
            No design skills required. No learning curve. Just describe what you need.
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative p-8 border border-white/10 hover:border-white/20 transition-colors group"
              >
                {/* Step Number */}
                <span className="text-6xl font-light text-[#c5a47e] opacity-20 absolute top-4 right-4">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8 group-hover:border-[#c5a47e] transition-colors">
                  <Icon className="w-6 h-6 text-[#c5a47e]" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-light mb-4">
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
