/**
 * AudienceSection Component
 *
 * "Who It's For" section highlighting target audiences.
 * Studio Noir aesthetic.
 */

import React from 'react';
import {
  Rocket,
  Briefcase,
  Mic2,
  Users
} from 'lucide-react';

const audiences = [
  {
    icon: Rocket,
    title: 'Founders & Investors',
    description: 'Pitch decks need iteration, not just generation. Ideation helps structure the narrative before committing to slides.',
    highlight: 'Iterate on your story',
  },
  {
    icon: Briefcase,
    title: 'Consultants & Strategists',
    description: 'Research-heavy presentations need evidence. Research Co-Pilot finds and cites sources automatically.',
    highlight: 'Backed by research',
  },
  {
    icon: Mic2,
    title: 'Thought Leaders & Speakers',
    description: 'Ideas are rough, they need a refinement process. Turn rough ideas into polished keynotes.',
    highlight: 'From idea to keynote',
  },
  {
    icon: Users,
    title: 'Teams & Executives',
    description: 'Brainstorming and deliverables live in different tools. Turn whiteboard sessions into boardroom decks.',
    highlight: 'Brainstorm to boardroom',
  },
];

export const AudienceSection: React.FC = () => {
  return (
    <section className="py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
            Who It's For
          </span>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Built for people who present.
          </h2>
          <p className="text-xl text-white/60">
            If you spend real time building decks—and care about the outcome—DeckSnap was built for you.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-2 gap-px bg-white/10">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <div
                key={index}
                className="p-10 bg-black hover:bg-white/5 transition-colors group"
              >
                {/* Icon */}
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6 group-hover:border-[#c5a47e] transition-colors">
                  <Icon className="w-6 h-6 text-[#c5a47e]" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-light mb-4">
                  {audience.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 leading-relaxed mb-6">
                  {audience.description}
                </p>

                {/* Highlight pill */}
                <div className="inline-flex items-center px-3 py-1 border border-[#c5a47e]/30 bg-[#c5a47e]/10">
                  <span className="text-sm text-[#c5a47e]">{audience.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
