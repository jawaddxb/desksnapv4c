/**
 * FeaturesPage Component
 *
 * Detailed features breakdown page.
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Palette,
  Image,
  Monitor,
  Layers,
  ArrowRight,
  Check
} from 'lucide-react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { FooterSection } from '../landing/FooterSection';

interface FeaturesPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

const features = [
  {
    id: 'ai-generation',
    icon: Sparkles,
    label: 'AI Content',
    headline: 'From Topic to Structure in Seconds',
    description: 'Describe your presentation in natural language. Our AI creates a logical slide structure, writes clear content, and suggests speaker notes—all before you touch a single design element.',
    points: [
      'Multiple generation modes: Concise (5-8 slides), Balanced (~12), Detailed (15+)',
      'Tone adjustment: Professional, Casual, Technical, Persuasive',
      'Speaker notes generated automatically',
      'Context-aware content that flows naturally',
    ],
  },
  {
    id: 'archetypes',
    icon: Palette,
    label: '60+ Archetypes',
    headline: 'Design Systems, Not Templates',
    description: 'Templates fight you. Archetypes work with you. Each of our 60+ visual systems includes typography, color, layout rules, and image style—all coherent, all adaptable.',
    points: [
      'Wabi-Sabi: Kintsugi, Hygge, Terrazzo, Kinfolk, and more',
      'Design Movements: Bauhaus, Swiss, Memphis, Deco, Constructivist',
      'Tech: Bento, Glass, Terminal, Neon, Aurora',
      'Cultural: Tokyo, Nordic, Paris, Brooklyn, Marrakech',
    ],
  },
  {
    id: 'images',
    icon: Image,
    label: 'AI Images',
    headline: 'Custom Visuals. Zero Stock Photos.',
    description: 'Every slide can have a unique, AI-generated image that matches your theme and content. No more hunting through stock libraries for something "close enough."',
    points: [
      '20+ image style presets (Cinematic, Abstract 3D, Watercolor, etc.)',
      'Theme-aware generation (images match your archetype)',
      'Regenerate until it\'s right',
      'Cohesive visual language across all slides',
    ],
  },
  {
    id: 'present-export',
    icon: Monitor,
    label: 'Present & Export',
    headline: 'Present Anywhere. Export Everywhere.',
    description: 'Full-screen presentation mode with keyboard navigation. Export to PowerPoint when you need to. Share a link when you don\'t.',
    points: [
      'Browser-based presenting with keyboard shortcuts',
      'PowerPoint export (preserves layouts)',
      'Print-ready PDF export',
      'Analytics on presentation engagement (coming soon)',
    ],
  },
  {
    id: 'wabi-sabi',
    icon: Layers,
    label: 'Wabi-Sabi Mode',
    headline: 'Embrace Beautiful Imperfection',
    description: 'Switch to Wabi-Sabi mode for layouts that breathe. Asymmetry, organic spacing, intentional imperfection—inspired by Japanese philosophy, designed for modern storytelling.',
    points: [
      'Organic, asymmetric layouts',
      'Hand-drawn decorative elements',
      'Breathing whitespace',
      'Intentional imperfection as a design feature',
    ],
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
              Everything You Need.{' '}
              <span className="text-white/40">Nothing You Don't.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              DeckSnap is intentionally simple. We believe the best tools get out of your way
              and let you focus on what matters: your ideas.
            </p>
          </div>
        </section>

        {/* Feature Sections */}
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isEven = index % 2 === 0;

          return (
            <section
              key={feature.id}
              id={feature.id}
              className={`py-24 ${isEven ? 'bg-black' : 'bg-[#111111]'}`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Content */}
                  <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 mb-8">
                      <Icon className="w-4 h-4 text-[#c5a47e]" />
                      <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e]">
                        {feature.label}
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-light mb-6">
                      {feature.headline}
                    </h2>

                    <p className="text-lg text-white/60 leading-relaxed mb-10">
                      {feature.description}
                    </p>

                    <ul className="space-y-4">
                      {feature.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-[#c5a47e]" />
                          </div>
                          <span className="text-white/60">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                    <div className="aspect-[4/3] bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className="w-20 h-20 text-[#c5a47e] opacity-30" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* Philosophy Callout */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-2xl md:text-3xl text-white/80 leading-relaxed italic mb-8">
              "Wabi-Sabi teaches that imperfection and impermanence are beautiful.
              Your presentations don't need to be perfect. They need to be true."
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
        <section className="py-24 bg-[#111111]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to Create?
            </h2>
            <p className="text-xl text-white/60 mb-10">
              Start building your first presentation for free.
            </p>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-[#c5a47e] transition-colors"
            >
              Start Creating Free
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
