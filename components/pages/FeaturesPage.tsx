/**
 * FeaturesPage Component
 *
 * Detailed features breakdown page.
 * Long-form content with Wabi-Sabi aesthetic.
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
    <div className="min-h-screen bg-[#fafaf8]">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-24 md:pt-32">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 md:mb-24">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
              Features
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a1a2e] mb-6">
              Everything You Need.{' '}
              <span className="text-[#6b6b6b]">Nothing You Don't.</span>
            </h1>
            <p className="text-xl text-[#6b6b6b] leading-relaxed">
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
              className={`py-16 md:py-24 ${isEven ? 'bg-[#fafaf8]' : 'bg-[#f5f3ef]'}`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Content */}
                  <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/10 rounded-full mb-6">
                      <Icon className="w-4 h-4 text-[#d4af37]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                        {feature.label}
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-4">
                      {feature.headline}
                    </h2>

                    <p className="text-lg text-[#6b6b6b] leading-relaxed mb-8">
                      {feature.description}
                    </p>

                    <ul className="space-y-4">
                      {feature.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#d4af37]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-[#d4af37]" />
                          </div>
                          <span className="text-[#6b6b6b]">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                    <div className="relative">
                      <div
                        className="absolute -inset-4 bg-gradient-to-br from-[#d4af37]/5 to-transparent rounded-3xl"
                        style={{
                          borderRadius: isEven
                            ? '60% 40% 55% 45% / 45% 55% 45% 55%'
                            : '40% 60% 45% 55% / 55% 45% 55% 45%',
                        }}
                      />
                      <div className="relative aspect-[4/3] bg-white rounded-2xl border border-[#e5e2dd] shadow-lg overflow-hidden">
                        {/* Placeholder visual */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2a2a3e] flex items-center justify-center">
                          <Icon className="w-16 h-16 text-[#d4af37]/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* Philosophy Callout */}
        <section className="py-16 md:py-24 bg-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-2xl md:text-3xl text-white/80 leading-relaxed italic mb-8">
              "Wabi-Sabi teaches that imperfection and impermanence are beautiful.
              Your presentations don't need to be perfect. They need to be true."
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#d4af37] font-medium hover:text-[#e5c348] transition-colors duration-300 group"
            >
              Learn about our philosophy
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-[#f5f3ef]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-4">
              Ready to Create?
            </h2>
            <p className="text-xl text-[#6b6b6b] mb-8">
              Start building your first presentation for free.
            </p>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a2e] text-white font-medium rounded-full hover:bg-[#2a2a3e] transition-all duration-500"
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
