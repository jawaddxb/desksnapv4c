/**
 * AboutPage Component
 *
 * Company story and Wabi-Sabi philosophy explanation.
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
    <div className="min-h-screen bg-[#fafaf8]">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-24 md:pt-32">
        {/* Page Header */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-16 md:mb-24 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
            About
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a1a2e] mb-6">
            We Believe Perfect{' '}
            <span className="relative">
              Is Overrated
              <svg
                className="absolute -bottom-2 left-0 w-full h-4 text-[#d4af37]/30"
                viewBox="0 0 200 16"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q50 2 100 8 T200 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </span>
          </h1>
        </section>

        {/* Origin Story */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-24">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[#6b6b6b] leading-relaxed mb-8">
              DeckSnap started with a simple frustration: why does creating a presentation
              feel like fighting software?
            </p>

            <p className="text-[#6b6b6b] leading-relaxed mb-6">
              We spent hours choosing templates that never quite fit. We hunted through stock
              photo libraries for images that were "close enough." We obsessed over alignment,
              consistency, perfection—and our presentations still felt... forgettable.
            </p>

            <p className="text-[#6b6b6b] leading-relaxed mb-6">
              Then we discovered Wabi-Sabi.
            </p>

            <p className="text-[#6b6b6b] leading-relaxed mb-6">
              Wabi-Sabi is a 500-year-old Japanese philosophy that finds beauty in imperfection,
              impermanence, and incompleteness. It taught us that a cracked bowl, repaired with
              gold, is more beautiful than a perfect one.
            </p>

            <p className="text-[#6b6b6b] leading-relaxed mb-6">
              What if presentations worked the same way?
            </p>

            <p className="text-xl text-[#1a1a2e] leading-relaxed font-medium">
              DeckSnap is built on that question. We use AI to handle the tedious parts—structure,
              content, imagery—so you can focus on what matters: your ideas, your story, your
              authentic voice.
            </p>

            <p className="text-xl text-[#1a1a2e] leading-relaxed font-medium mt-8">
              We don't help you make perfect presentations. We help you make presentations that are true.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 md:py-24 bg-[#f5f3ef]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
                Philosophy
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-4">
                Wabi-Sabi Principles in DeckSnap
              </h2>
              <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto">
                How ancient Japanese wisdom shapes modern presentation design.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {philosophyPrinciples.map((principle) => (
                <div
                  key={principle.japanese}
                  className="bg-white rounded-2xl p-8 border border-[#e5e2dd]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-bold text-[#d4af37]">
                      {principle.japanese}
                    </span>
                    <span className="text-[#6b6b6b]">
                      ({principle.english})
                    </span>
                  </div>
                  <p className="text-[#6b6b6b]">
                    {principle.application}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kintsugi Visual */}
        <section className="py-16 md:py-24 bg-[#1a1a2e] relative overflow-hidden">
          {/* Gold crack pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 800 400"
            preserveAspectRatio="none"
          >
            <path
              d="M0 200 Q100 150 200 200 T400 180 T600 220 T800 200"
              stroke="#d4af37"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M200 0 Q180 100 220 200 T200 400"
              stroke="#d4af37"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M600 0 Q620 150 580 250 T620 400"
              stroke="#d4af37"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
              The Art of Kintsugi
            </h2>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              In Japanese culture, Kintsugi is the art of repairing broken pottery with gold.
              Rather than hiding the cracks, it celebrates them—making the piece more valuable
              than before it was broken.
            </p>
            <p className="text-xl text-white/70 leading-relaxed">
              Your presentations don't need to hide their imperfections. They need to embrace them.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 md:py-24 bg-[#fafaf8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-6">
              Make beautiful presentation design accessible to everyone—without
              sacrificing authenticity for polish.
            </h2>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a2e] text-white font-medium rounded-full hover:bg-[#2a2a3e] transition-all duration-500 group"
            >
              Start Creating
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
