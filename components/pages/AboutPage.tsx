/**
 * AboutPage Component
 *
 * Company story, principles, and philosophy.
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { ArrowRight, Lightbulb, Palette, Brain, Sparkles } from 'lucide-react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { FooterSection } from '../landing/FooterSection';

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
    <div className="min-h-screen bg-black text-white">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-32">
        {/* Page Header */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-24 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
            About
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light">
            We're building the deck tool{' '}
            <span className="text-[#c5a47e]">we always wanted.</span>
          </h1>
        </section>

        {/* Our Story */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-32">
          <div className="space-y-8">
            <p className="text-2xl text-white/80 leading-relaxed">
              We've spent years making presentations. Pitching investors. Aligning teams.
              Trying to make complex ideas clear.
            </p>

            <p className="text-lg text-white/60 leading-relaxed">
              And we've watched AI deck tools promise to help—then deliver generic outputs
              that skip the thinking entirely. Fast, but forgettable.
            </p>

            <p className="text-2xl text-white leading-relaxed">
              So we built DeckSnap. A tool that respects the creative process. That gives
              ideas room to develop. That produces decks worth presenting.
            </p>

            <p className="text-lg text-white/60 leading-relaxed">
              We believe the best presentations come from better thinking. And better
              thinking needs the right environment.
            </p>
          </div>
        </section>

        {/* Our Principles */}
        <section className="py-24 bg-[#111111]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
                Our Principles
              </span>
              <h2 className="text-4xl md:text-5xl font-light">
                What we believe.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-white/10">
              {ourPrinciples.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={index}
                    className="bg-[#111111] p-10"
                  >
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-[#c5a47e]" />
                    </div>
                    <h3 className="text-2xl font-light mb-4">
                      {principle.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 bg-[#111111]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
                Philosophy
              </span>
              <h2 className="text-4xl md:text-5xl font-light mb-6">
                Wabi-Sabi Principles in DeckSnap
              </h2>
              <p className="text-xl text-white/60">
                How ancient Japanese wisdom shapes modern presentation design.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-white/10">
              {philosophyPrinciples.map((principle) => (
                <div
                  key={principle.japanese}
                  className="bg-[#111111] p-10"
                >
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-3xl font-light text-[#c5a47e]">
                      {principle.japanese}
                    </span>
                    <span className="text-white/40">
                      ({principle.english})
                    </span>
                  </div>
                  <p className="text-white/60">
                    {principle.application}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kintsugi Visual */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8">
              The Art of <span className="text-[#c5a47e]">Kintsugi</span>
            </h2>
            <p className="text-xl text-white/60 leading-relaxed mb-6">
              In Japanese culture, Kintsugi is the art of repairing broken pottery with gold.
              Rather than hiding the cracks, it celebrates them—making the piece more valuable
              than before it was broken.
            </p>
            <p className="text-xl text-white/60 leading-relaxed">
              Your presentations don't need to hide their imperfections. They need to embrace them.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24 bg-[#111111]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-light mb-10 leading-relaxed">
              Make beautiful presentation design accessible to everyone—without
              sacrificing authenticity for polish.
            </h2>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-[#c5a47e] transition-colors group"
            >
              Start Creating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
