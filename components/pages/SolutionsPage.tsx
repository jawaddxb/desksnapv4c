/**
 * SolutionsPage Component
 *
 * Dynamic solutions page for different audiences.
 * Routes: /solutions/startups, /solutions/educators, /solutions/designers, /solutions/teams
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

  // Validate route
  if (!solutionId || !solutionsData[solutionId as keyof typeof solutionsData]) {
    return <Navigate to="/solutions/startups" replace />;
  }

  const solution = solutionsData[solutionId as keyof typeof solutionsData];
  const Icon = solution.icon;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 md:mb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/10 rounded-full mb-6">
                <Icon className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                  For {solutionId.charAt(0).toUpperCase() + solutionId.slice(1)}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a1a2e] mb-6 leading-tight">
                {solution.headline}
              </h1>

              <p className="text-xl text-[#6b6b6b] mb-8">
                {solution.subheadline}
              </p>

              <button
                onClick={() => onAuth('register')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a2e] text-white font-medium rounded-full hover:bg-[#2a2a3e] transition-all duration-500 group"
              >
                {solution.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Visual */}
            <div className="relative">
              <div
                className="absolute -inset-4 bg-gradient-to-br from-[#d4af37]/5 to-transparent rounded-3xl"
                style={{
                  borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
                }}
              />
              <div className="relative aspect-[4/3] bg-white rounded-2xl border border-[#e5e2dd] shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2a2a3e] flex items-center justify-center">
                  <Icon className="w-24 h-24 text-[#d4af37]/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 md:py-24 bg-[#f5f3ef]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
                Sound Familiar?
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e]">
                We've Been There Too
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {solution.painPoints.map((painPoint, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-[#e5e2dd]"
                >
                  <p className="text-[#6b6b6b] italic">"{painPoint}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-16 md:py-24 bg-[#fafaf8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
              The Solution
            </span>
            <p className="text-2xl md:text-3xl text-[#1a1a2e] leading-relaxed mb-8">
              {solution.solution}
            </p>
            <p className="text-lg text-[#d4af37] font-medium">
              {solution.socialProof}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-[#f5f3ef]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
                Features
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e]">
                What You Get
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {solution.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white rounded-xl p-6 border border-[#e5e2dd]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <span className="text-[#6b6b6b]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Create your first presentation in minutes. Free forever for basic use.
            </p>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#d4af37] text-[#1a1a2e] font-semibold rounded-full hover:bg-[#e5c348] transition-all duration-500 group"
            >
              {solution.cta}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default SolutionsPage;
