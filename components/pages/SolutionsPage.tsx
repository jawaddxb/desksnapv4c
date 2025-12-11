/**
 * SolutionsPage Component
 *
 * Dynamic solutions page for different audiences.
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowRight, Check, Rocket, GraduationCap, Palette, Users } from 'lucide-react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { FooterSection } from '../landing/FooterSection';

interface SolutionsPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

const solutionsData = {
  startups: {
    icon: Rocket,
    headline: 'Pitch Decks That Actually Close',
    subheadline: 'Stop looking like every other startup. Start looking like you mean it.',
    painPoints: [
      'We spent $15K on a deck design agency and still lost the deal',
      'Our pitch looks exactly like 1,000 other YC decks',
      'We don\'t have time to become designers',
    ],
    solution: 'DeckSnap helps founders create distinctive pitch decks in minutes. AI handles structure. 60+ archetypes ensure you stand out. Your story does the rest.',
    socialProof: 'Founders have raised over $10M with DeckSnap presentations',
    features: [
      'AI structures your narrative flow',
      'Investor-ready themes (Venture, Keynote, Signal)',
      'Custom imagery that matches your brand',
      'Export to PowerPoint for sharing',
    ],
    cta: 'Build Your Pitch Deck — Free',
  },
  educators: {
    icon: GraduationCap,
    headline: 'Lectures They\'ll Actually Remember',
    subheadline: 'Transform course material into visual stories that engage.',
    painPoints: [
      'My slides are walls of text—and I hate them too',
      'I don\'t have time to design every lecture',
      'Students zone out after slide 3',
    ],
    solution: 'DeckSnap turns your course content into visually distinctive presentations. AI writes speaker notes while you focus on teaching. The Wabi-Sabi aesthetic invites discussion, not passive consumption.',
    socialProof: 'Used by educators at leading universities',
    features: [
      'Convert lecture notes to slides instantly',
      'Educational themes that enhance learning',
      'Automatic speaker notes for your reference',
      '50% discount for educators and students',
    ],
    cta: 'Create Your First Lecture — Free',
  },
  designers: {
    icon: Palette,
    headline: 'Design Presentations for People Who Actually Design',
    subheadline: 'Finally—a presentation tool that respects your taste.',
    painPoints: [
      'PowerPoint and Keynote are design prisons',
      'I spend more time fighting templates than creating',
      'Client presentations should look as good as my portfolio',
    ],
    solution: 'DeckSnap gives designers 60+ curated visual archetypes—from Bauhaus to Brutalist to Wabi-Sabi. AI handles content structure so you can focus on what matters: making it beautiful on your terms.',
    socialProof: 'Trusted by design teams at agencies worldwide',
    features: [
      '60+ archetypes from design history',
      'Full control over typography and color',
      'AI respects your aesthetic choices',
      'Export with pixel-perfect fidelity',
    ],
    cta: 'Start Designing — Free',
  },
  teams: {
    icon: Users,
    headline: 'Team Presentations Without the Chaos',
    subheadline: 'One tool. One aesthetic. Everyone aligned.',
    painPoints: [
      'Every team member\'s slides look different',
      'We waste hours on version control',
      'Consistency is impossible without a designer',
    ],
    solution: 'DeckSnap\'s archetypes enforce visual consistency automatically. AI helps everyone write better content. Cloud storage means no more v2_final_FINAL.pptx.',
    socialProof: 'Teams save an average of 5 hours per presentation',
    features: [
      'Shared theme library for brand consistency',
      'Real-time collaboration (coming soon)',
      'Cloud storage and sync',
      'Team analytics and insights',
    ],
    cta: 'Get Your Team Started — Free',
  },
};

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onAuth }) => {
  const { solutionId } = useParams<{ solutionId: string }>();

  if (!solutionId || !solutionsData[solutionId as keyof typeof solutionsData]) {
    return <Navigate to="/solutions/startups" replace />;
  }

  const solution = solutionsData[solutionId as keyof typeof solutionsData];
  const Icon = solution.icon;

  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 mb-8">
                <Icon className="w-4 h-4 text-[#c5a47e]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e]">
                  For {solutionId.charAt(0).toUpperCase() + solutionId.slice(1)}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-light mb-6 leading-[0.95]">
                {solution.headline}
              </h1>

              <p className="text-xl text-white/60 mb-10">
                {solution.subheadline}
              </p>

              <button
                onClick={() => onAuth('register')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-[#c5a47e] transition-colors group"
              >
                {solution.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Visual */}
            <div className="aspect-[4/3] bg-white/5 border border-white/10 flex items-center justify-center">
              <Icon className="w-24 h-24 text-[#c5a47e] opacity-30" />
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-24 bg-[#111111]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
                Sound Familiar?
              </span>
              <h2 className="text-4xl md:text-5xl font-light">
                We've Been There Too
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-white/10">
              {solution.painPoints.map((painPoint, index) => (
                <div
                  key={index}
                  className="bg-[#111111] p-8"
                >
                  <p className="text-white/60 italic">"{painPoint}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              The Solution
            </span>
            <p className="text-2xl md:text-3xl text-white/80 leading-relaxed mb-8">
              {solution.solution}
            </p>
            <p className="text-lg text-[#c5a47e]">
              {solution.socialProof}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-[#111111]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-light">
                What You Get
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-white/10 max-w-3xl">
              {solution.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-[#111111] p-8"
                >
                  <div className="w-5 h-5 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#c5a47e]" />
                  </div>
                  <span className="text-white/60">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/60 mb-10">
              Create your first presentation in minutes. Free forever for basic use.
            </p>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#c5a47e] text-black font-medium hover:bg-white transition-colors group"
            >
              {solution.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default SolutionsPage;
