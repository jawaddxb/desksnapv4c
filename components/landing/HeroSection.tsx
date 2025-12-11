/**
 * HeroSection Component
 *
 * Main hero section with Studio Noir aesthetic.
 * New narrative: "Decks that think with you"
 * Emphasizes the 3-stage creative process.
 */

import React from 'react';
import { ArrowRight, Play, Lightbulb, FileEdit, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const workflowSteps = [
  { label: 'Ideate', icon: Lightbulb },
  { label: 'Draft', icon: FileEdit },
  { label: 'Polish', icon: Sparkles },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20">
              <span className="w-1.5 h-1.5 bg-[#c5a47e]" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                A New Way to Build Presentations
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight">
              Decks that{' '}
              <span className="text-[#c5a47e]">think</span>{' '}
              with you.
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-white/60 max-w-lg leading-relaxed">
              Ideate with AI, refine in rough draft, polish to perfection. Beautiful decks deserve a beautiful process.
            </p>

            {/* 3-Step Workflow Indicator */}
            <div className="flex items-center gap-4">
              {workflowSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={step.label}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#c5a47e]" />
                      </div>
                      <span className="text-sm text-white/60">{step.label}</span>
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <div className="w-8 h-px bg-white/20" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-6">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-[#c5a47e] transition-colors duration-150"
              >
                Start creating
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-150"
              >
                <Play className="w-4 h-4" />
                See how it works
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                Trusted by creators at
              </p>
              <div className="flex items-center gap-8">
                {['Stanford', 'RISD', 'Figma', 'Linear', 'Notion'].map((name) => (
                  <span
                    key={name}
                    className="text-sm text-white/40 font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="relative">
            {/* Three-stage visual */}
            <div className="space-y-4">
              {/* Stage 1: Ideate */}
              <div className="bg-white/5 border border-white/10 p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-[#c5a47e]/20 flex items-center justify-center">
                    <Lightbulb className="w-3 h-3 text-[#c5a47e]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Ideate</span>
                </div>
                <div className="flex gap-2">
                  {/* Sticky note mockups */}
                  <div className="w-16 h-12 bg-yellow-400/20 border border-yellow-400/30 rounded-sm" />
                  <div className="w-16 h-12 bg-blue-400/20 border border-blue-400/30 rounded-sm" />
                  <div className="w-16 h-12 bg-green-400/20 border border-green-400/30 rounded-sm" />
                  <div className="w-16 h-12 bg-pink-400/20 border border-pink-400/30 rounded-sm" />
                </div>
              </div>

              {/* Stage 2: Draft */}
              <div className="bg-white/5 border border-white/10 p-6 relative overflow-hidden ml-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-[#c5a47e]/20 flex items-center justify-center">
                    <FileEdit className="w-3 h-3 text-[#c5a47e]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Draft</span>
                </div>
                <div className="flex gap-2">
                  {/* Slide preview mockups */}
                  <div className="w-20 h-14 bg-white/10 border border-white/20" />
                  <div className="w-20 h-14 bg-white/10 border border-white/20" />
                  <div className="w-20 h-14 bg-white/10 border border-white/20" />
                </div>
              </div>

              {/* Stage 3: Polish */}
              <div className="bg-white/5 border border-white/10 p-6 relative overflow-hidden ml-16">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-[#c5a47e]/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#c5a47e]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Polish</span>
                </div>
                <div className="aspect-video bg-gradient-to-br from-[#c5a47e]/20 to-transparent border border-[#c5a47e]/30">
                  <div className="p-4">
                    <div className="w-12 h-1 bg-[#c5a47e] mb-3" />
                    <div className="w-32 h-3 bg-white/20 mb-2" />
                    <div className="w-24 h-3 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 px-4 py-3 bg-black border border-white/20">
              <span className="text-3xl font-light">3</span>
              <span className="text-xs text-white/60 ml-2">Stage Process</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
