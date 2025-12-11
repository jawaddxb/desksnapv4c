/**
 * AboutPage Component
 *
 * Company story and philosophy.
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { FooterSection } from '../landing/FooterSection';

interface AboutPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

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
            We Believe Perfect{' '}
            <span className="text-[#c5a47e]">Is Overrated</span>
          </h1>
        </section>

        {/* Origin Story */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-32">
          <div className="space-y-8">
            <p className="text-2xl text-white/80 leading-relaxed">
              DeckSnap started with a simple frustration: why does creating a presentation
              feel like fighting software?
            </p>

            <p className="text-lg text-white/60 leading-relaxed">
              We spent hours choosing templates that never quite fit. We hunted through stock
              photo libraries for images that were "close enough." We obsessed over alignment,
              consistency, perfection—and our presentations still felt... forgettable.
            </p>

            <p className="text-lg text-white/60 leading-relaxed">
              Then we discovered Wabi-Sabi.
            </p>

            <p className="text-lg text-white/60 leading-relaxed">
              Wabi-Sabi is a 500-year-old Japanese philosophy that finds beauty in imperfection,
              impermanence, and incompleteness. It taught us that a cracked bowl, repaired with
              gold, is more beautiful than a perfect one.
            </p>

            <p className="text-lg text-white/60 leading-relaxed">
              What if presentations worked the same way?
            </p>

            <p className="text-2xl text-white leading-relaxed">
              DeckSnap is built on that question. We use AI to handle the tedious parts—structure,
              content, imagery—so you can focus on what matters: your ideas, your story, your
              authentic voice.
            </p>

            <p className="text-2xl text-white leading-relaxed">
              We don't help you make perfect presentations. We help you make presentations that are true.
            </p>
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
