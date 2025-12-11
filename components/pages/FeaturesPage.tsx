/**
 * FeaturesPage Component
 *
 * Detailed features breakdown organized by stage.
 * Ideate → Rough Draft → Final Polish
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  FileEdit,
  Sparkles,
  StickyNote,
  Mic,
  Search,
  Brain,
  Eye,
  Check,
  RefreshCw,
  BookOpen,
  Palette,
  LayoutGrid,
  Layers,
  Download,
  Monitor,
  Image,
  ArrowRight,
} from 'lucide-react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { FooterSection } from '../landing/FooterSection';

interface FeaturesPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

const stages = [
  {
    id: 'ideate',
    stageIcon: Lightbulb,
    stageLabel: 'Stage 1',
    stageName: 'Ideate',
    headline: 'Think before you build.',
    description: 'Our ideation canvas works like a digital whiteboard—sticky notes, clusters, free-form organization. But with an AI co-pilot that populates sections, suggests structures, and helps you see the shape of your argument before you commit to slides.',
    features: [
      {
        icon: StickyNote,
        title: '5-Column Swimlane Canvas',
        description: 'Organize ideas across Hook, Problem, Solution, Proof, and CTA columns. Drag and drop notes to structure your narrative.',
      },
      {
        icon: Mic,
        title: 'Voice Input',
        description: 'Speak your ideas, we\'ll capture them. Voice-to-note for quick brainstorming sessions when typing feels too slow.',
      },
      {
        icon: Search,
        title: 'Research Co-Pilot',
        description: 'Real-time web and X/Twitter search powered by Grok. Findings become sticky notes with automatic citations.',
      },
      {
        icon: Brain,
        title: 'AI Co-Pilot',
        description: 'Conversational AI that asks clarifying questions, suggests structure, and helps develop your thinking—not just your slides.',
      },
    ],
  },
  {
    id: 'draft',
    stageIcon: FileEdit,
    stageLabel: 'Stage 2',
    stageName: 'Rough Draft',
    headline: 'See the deck before it\'s done.',
    description: 'Preview AI-generated images. Explore theme variations. Test different visual directions without locking in. The rough draft stage is your playground—change anything, regenerate what doesn\'t work, move forward when it feels right.',
    features: [
      {
        icon: Eye,
        title: 'Preview Before Committing',
        description: 'See how your ideas translate to slides before finalizing. Storyboard view shows the full narrative arc.',
      },
      {
        icon: Check,
        title: 'Per-Slide Approval',
        description: 'Approve, modify, or regenerate individual slides. Build your deck one decision at a time.',
      },
      {
        icon: RefreshCw,
        title: 'Regenerate Anything',
        description: 'Don\'t like an image or slide? Regenerate until it feels right. No commitment until you\'re satisfied.',
      },
      {
        icon: BookOpen,
        title: 'Creative Journal',
        description: 'See the AI\'s thinking process. Understand why it made the choices it did. Learn and iterate faster.',
      },
    ],
  },
  {
    id: 'polish',
    stageIcon: Sparkles,
    stageLabel: 'Stage 3',
    stageName: 'Final Polish',
    headline: 'Precision when it counts.',
    description: 'Your finished deck deserves a proper editor. Move elements, adjust text, swap images. Our design engine respects your changes while maintaining visual coherence. No fighting the tool—just refining your vision.',
    features: [
      {
        icon: Palette,
        title: '60+ Design Archetypes',
        description: 'From Wabi-Sabi organic layouts to Swiss precision. Each archetype is a complete design system, not just a template.',
      },
      {
        icon: LayoutGrid,
        title: 'Flexible Layouts',
        description: 'Split, full-bleed, statement, gallery—layouts adapt to your content. Fine-tune positioning and spacing.',
      },
      {
        icon: Layers,
        title: 'Wabi-Sabi Mode',
        description: 'Embrace beautiful imperfection. Asymmetric layouts, organic shapes, breathing whitespace.',
      },
      {
        icon: Download,
        title: 'Export Everywhere',
        description: 'PowerPoint, PDF, Keynote. Export in the format you need, with layouts preserved.',
      },
    ],
  },
];

const crossCuttingFeatures = [
  {
    icon: Image,
    title: 'AI-Generated Images',
    description: '20+ image style presets. Theme-aware generation. Custom visuals for every slide.',
  },
  {
    icon: Monitor,
    title: 'Presentation Mode',
    description: 'Browser-based presenting with keyboard navigation. No software needed.',
  },
  {
    icon: Brain,
    title: 'Neutron Integration',
    description: 'Connect to your knowledge base. Research persists across sessions.',
  },
];

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-32">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              Features
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8">
              Everything you need to build decks that matter.
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Ideation tools, research agents, an adaptive design system, and a knowledge layer that grows with you.
            </p>
          </div>
        </section>

        {/* Stage Sections */}
        {stages.map((stage, stageIndex) => {
          const StageIcon = stage.stageIcon;

          return (
            <section
              key={stage.id}
              id={stage.id}
              className={`py-24 ${stageIndex % 2 === 0 ? 'bg-black' : 'bg-[#111111]'}`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Stage Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2 px-3 py-1 border border-[#c5a47e]/30 bg-[#c5a47e]/10">
                    <StageIcon className="w-4 h-4 text-[#c5a47e]" />
                    <span className="text-xs uppercase tracking-[0.15em] text-[#c5a47e]">
                      {stage.stageLabel}: {stage.stageName}
                    </span>
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-light mb-6">
                  {stage.headline}
                </h2>

                <p className="text-xl text-white/60 leading-relaxed mb-16 max-w-3xl">
                  {stage.description}
                </p>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 gap-px bg-white/10">
                  {stage.features.map((feature, i) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div
                        key={i}
                        className={`p-8 ${stageIndex % 2 === 0 ? 'bg-black' : 'bg-[#111111]'} hover:bg-white/5 transition-colors`}
                      >
                        <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-6">
                          <FeatureIcon className="w-5 h-5 text-[#c5a47e]" />
                        </div>
                        <h3 className="text-xl font-light mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-white/60 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}

        {/* Cross-Cutting Features */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
                Across All Stages
              </span>
              <h2 className="text-4xl md:text-5xl font-light">
                Built-in everywhere.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {crossCuttingFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="p-8 border border-white/10">
                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-[#c5a47e]" />
                    </div>
                    <h3 className="text-xl font-light mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Philosophy Callout */}
        <section className="py-24 bg-[#111111]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-2xl md:text-3xl text-white/80 leading-relaxed italic mb-8">
              "Done beats perfect. But thinking beats rushing."
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#c5a47e] hover:text-white transition-colors group"
            >
              Learn about our philosophy
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to think differently?
            </h2>
            <p className="text-xl text-white/60 mb-10">
              Start with ideation. End with a deck you believe in.
            </p>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-[#c5a47e] transition-colors"
            >
              Start creating
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default FeaturesPage;
