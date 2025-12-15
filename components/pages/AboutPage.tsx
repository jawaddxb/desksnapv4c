/**
 * AboutPage Component
 *
 * Company story, principles, and philosophy.
 * Bento Matcha aesthetic - fresh green, cream, natural tones.
 */

import React from 'react';
import { ArrowRight, Lightbulb, Palette, Brain, Sparkles } from 'lucide-react';
import { Navbar, Footer } from '../homepage-variants/shared';

interface AboutPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

const ourPrinciples = [
  {
    icon: Lightbulb,
    title: 'Process over output',
    description: 'Great decks come from great thinking. We built a tool that supports the full journey—ideation, refinement, polish—not just the endpoint.',
  },
  {
    icon: Palette,
    title: 'Design that serves',
    description: 'We reject the template treadmill. Our design system adapts to content, not the other way around. Every deck should feel intentional.',
  },
  {
    icon: Brain,
    title: 'Memory that compounds',
    description: 'Knowledge shouldn\'t evaporate between sessions. Neutron ensures that every insight you surface becomes part of your working memory.',
  },
  {
    icon: Sparkles,
    title: 'Craft matters',
    description: 'The details matter. We obsess over the small things—type, spacing, transitions—so you can focus on the big things.',
  },
];

const philosophyPrinciples = [
  {
    japanese: 'Fukinsei',
    english: 'Imperfection',
    application: 'Asymmetric layouts, organic shapes, hand-drawn elements',
  },
  {
    japanese: 'Kanso',
    english: 'Simplicity',
    application: 'Minimal interface, essential features only',
  },
  {
    japanese: 'Koko',
    english: 'Incompleteness',
    application: 'Presentations as unfinished conversations',
  },
  {
    japanese: 'Mujō',
    english: 'Impermanence',
    application: 'Iteration celebrated, drafts encouraged',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-[#F5FAF7] text-[#1E2E1E]">
      <Navbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-32">
        {/* Page Header */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-24 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#6B8E6B] mb-4 block">
            About
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light">
            We're building the deck tool{' '}
            <span className="text-[#6B8E6B]">we always wanted.</span>
          </h1>
        </section>

        {/* Our Story */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-32">
          <div className="space-y-8">
            <p className="text-2xl text-[#1E2E1E] leading-relaxed">
              We've spent years making presentations. Pitching investors. Aligning teams.
              Trying to make complex ideas clear.
            </p>

            <p className="text-lg text-[#4A5D4A] leading-relaxed">
              And we've watched AI deck tools promise to help—then deliver generic outputs
              that skip the thinking entirely. Fast, but forgettable.
            </p>

            <p className="text-2xl text-[#1E2E1E] leading-relaxed">
              So we built DeckSnap. A tool that respects the creative process. That gives
              ideas room to develop. That produces decks worth presenting.
            </p>

            <p className="text-lg text-[#4A5D4A] leading-relaxed">
              We believe the best presentations come from better thinking. And better
              thinking needs the right environment.
            </p>
          </div>
        </section>

        {/* Our Principles */}
        <section className="py-24 bg-[#EDF5F0]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#6B8E6B] mb-4 block">
                Our Principles
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-[#1E2E1E]">
                What we believe.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {ourPrinciples.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={index}
                    className="bg-white border border-[#D4E5D4] p-10 shadow-[0_4px_24px_rgba(107,142,107,0.08)]"
                  >
                    <div className="w-10 h-10 bg-[#6B8E6B]/10 flex items-center justify-center mb-6 rounded">
                      <Icon className="w-5 h-5 text-[#6B8E6B]" />
                    </div>
                    <h3 className="text-2xl font-light mb-4 text-[#1E2E1E]">
                      {principle.title}
                    </h3>
                    <p className="text-[#4A5D4A] leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#6B8E6B] mb-4 block">
                Philosophy
              </span>
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-[#1E2E1E]">
                Wabi-Sabi Principles in DeckSnap
              </h2>
              <p className="text-xl text-[#4A5D4A]">
                How ancient Japanese wisdom shapes modern presentation design.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {philosophyPrinciples.map((principle) => (
                <div
                  key={principle.japanese}
                  className="bg-white border border-[#D4E5D4] p-10 shadow-[0_4px_24px_rgba(107,142,107,0.08)]"
                >
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-3xl font-light text-[#6B8E6B]">
                      {principle.japanese}
                    </span>
                    <span className="text-[#8FA58F]">
                      ({principle.english})
                    </span>
                  </div>
                  <p className="text-[#4A5D4A]">
                    {principle.application}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kintsugi Visual */}
        <section className="py-24 border-t border-[#D4E5D4]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-[#1E2E1E]">
              The Art of <span className="text-[#6B8E6B]">Kintsugi</span>
            </h2>
            <p className="text-xl text-[#4A5D4A] leading-relaxed mb-6">
              In Japanese culture, Kintsugi is the art of repairing broken pottery with gold.
              Rather than hiding the cracks, it celebrates them—making the piece more valuable
              than before it was broken.
            </p>
            <p className="text-xl text-[#4A5D4A] leading-relaxed">
              Your presentations don't need to hide their imperfections. They need to embrace them.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24 bg-[#EDF5F0]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6B8E6B] mb-4 block">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-light mb-10 leading-relaxed text-[#1E2E1E]">
              Make beautiful presentation design accessible to everyone—without
              sacrificing authenticity for polish.
            </h2>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#6B8E6B] text-white font-medium hover:bg-[#5A7A5A] transition-colors group rounded"
            >
              Start Creating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
