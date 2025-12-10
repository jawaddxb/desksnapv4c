/**
 * ThemesPreview Component
 *
 * Interactive theme gallery preview for homepage.
 * Shows a selection of archetypes with hover effects.
 */

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const previewThemes = [
  {
    id: 'kintsugi',
    name: 'Kintsugi',
    category: 'Wabi-Sabi',
    colors: ['#1a1a2e', '#d4af37', '#f5f3ef'],
    description: 'Gold-repaired imperfection',
  },
  {
    id: 'bauhaus',
    name: 'Bauhaus',
    category: 'Design Movement',
    colors: ['#e53935', '#fdd835', '#1e88e5'],
    description: 'Form follows function',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'Tech',
    colors: ['#0d1117', '#58a6ff', '#238636'],
    description: 'Code-inspired minimalism',
  },
  {
    id: 'nordic',
    name: 'Nordic',
    category: 'Cultural',
    colors: ['#f8f9fa', '#4a5568', '#b8c4ce'],
    description: 'Scandinavian serenity',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    category: 'Editorial',
    colors: ['#ffffff', '#1a1a1a', '#e5e5e5'],
    description: 'Magazine-inspired layouts',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    category: 'Cultural',
    colors: ['#1a1a2e', '#ff6b9d', '#00d4ff'],
    description: 'Neon-lit urbanism',
  },
];

export const ThemesPreview: React.FC = () => {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  return (
    <section id="themes" className="py-24 md:py-32 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
              Archetypes
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a2e] mb-4">
              60+ Ways to Tell Your Story
            </h2>
            <p className="text-xl text-[#6b6b6b] max-w-xl">
              Not templates. Design systems. Each archetype adapts to your content while maintaining visual coherence.
            </p>
          </div>
          <Link
            to="/themes"
            className="inline-flex items-center gap-2 text-[#1a1a2e] font-medium hover:text-[#d4af37] transition-colors duration-300 group"
          >
            Explore All Themes
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {previewThemes.map((theme) => (
            <div
              key={theme.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-[#e5e2dd] hover:border-[#d4af37]/30 transition-all duration-500"
              onMouseEnter={() => setHoveredTheme(theme.id)}
              onMouseLeave={() => setHoveredTheme(null)}
              style={{
                background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[0]} 100%)`,
              }}
            >
              {/* Theme Preview Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Mock slide elements */}
                <div>
                  <div
                    className="w-16 h-1 rounded mb-3"
                    style={{ backgroundColor: theme.colors[1] }}
                  />
                  <div
                    className="w-24 h-3 rounded mb-1"
                    style={{ backgroundColor: `${theme.colors[1]}40` }}
                  />
                  <div
                    className="w-20 h-3 rounded"
                    style={{ backgroundColor: `${theme.colors[1]}20` }}
                  />
                </div>

                {/* Decorative shape */}
                <div
                  className="absolute bottom-6 right-6 w-16 h-16 rounded-xl opacity-30"
                  style={{
                    backgroundColor: theme.colors[1],
                    borderRadius: '40% 60% 55% 45% / 45% 55% 50% 50%',
                  }}
                />
              </div>

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-[#1a1a2e]/90 flex flex-col justify-center items-center p-6 transition-opacity duration-300 ${
                  hoveredTheme === theme.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-2">
                  {theme.category}
                </span>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {theme.name}
                </h3>
                <p className="text-sm text-white/60">
                  {theme.description}
                </p>

                {/* Color swatches */}
                <div className="flex items-center gap-2 mt-4">
                  {theme.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {['Wabi-Sabi', 'Design Movements', 'Tech', 'Cultural', 'Natural', 'Editorial'].map(
            (category) => (
              <span
                key={category}
                className="px-4 py-2 bg-white rounded-full text-sm text-[#6b6b6b] border border-[#e5e2dd]"
              >
                {category}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ThemesPreview;
