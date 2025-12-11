/**
 * NeutronSection Component
 *
 * Highlights the Neutron integration for persistent memory.
 * "Meet Neutron. Your knowledge layer."
 * Studio Noir aesthetic.
 */

import React from 'react';
import { Brain, Database, RefreshCw, ExternalLink, Lock } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Persistent Memory',
    description: 'Every piece of research you surface gets stored. Next time you build a deck on a similar topic, Neutron surfaces what you\'ve already learned.',
  },
  {
    icon: Brain,
    title: 'Smart Recall',
    description: 'Starting a new investor pitch? Neutron pulls relevant data points, competitive insights, and messaging from your previous decks.',
  },
  {
    icon: RefreshCw,
    title: 'Delta Updates',
    description: 'Markets move. Data changes. Neutron tracks what\'s shifted since your last session and highlights updates you might want to incorporate.',
  },
];

export const NeutronSection: React.FC = () => {
  return (
    <section className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e]">
              Integration
            </span>
            <span className="px-2 py-0.5 text-xs border border-[#c5a47e]/30 bg-[#c5a47e]/10 text-[#c5a47e]">
              New
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Meet Neutron.{' '}
            <span className="text-white/40">Your knowledge layer.</span>
          </h2>

          <p className="text-xl text-white/60 leading-relaxed">
            The best presentations build on what you already know. Neutron is an integrated
            knowledge base—a second brain that remembers your research, your past decks,
            and the context that matters.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-px bg-white/10 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-8 bg-[#111111]"
              >
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-[#c5a47e]" />
                </div>

                <h3 className="text-xl font-light mb-3">
                  {feature.title}
                </h3>

                <p className="text-white/60 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-light">Neutron</div>
              <div className="text-sm text-white/40">External knowledge base integration</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Lock className="w-4 h-4" />
              <span>Private & encrypted</span>
            </div>

            <a
              href="https://myneutron.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#c5a47e] text-[#c5a47e] hover:bg-[#c5a47e] hover:text-black transition-colors"
            >
              Learn more
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeutronSection;
