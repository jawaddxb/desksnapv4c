/**
 * ThemesGalleryPage Component
 *
 * Full theme gallery with category filtering.
 */

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { FooterSection } from '../landing/FooterSection';

interface ThemesGalleryPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

const themeCategories = [
  {
    id: 'wabi-sabi',
    name: 'Wabi-Sabi',
    description: 'Inspired by Japanese philosophy',
    themes: [
      { id: 'kintsugi', name: 'Kintsugi', colors: ['#1a1a2e', '#d4af37', '#f5f3ef'] },
      { id: 'hygge', name: 'Hygge', colors: ['#f5f3ef', '#8b7355', '#d4c5b0'] },
      { id: 'terrazzo', name: 'Terrazzo', colors: ['#f8f5f2', '#c4a484', '#d4af37'] },
      { id: 'kinfolk', name: 'Kinfolk', colors: ['#faf8f5', '#3d3d3d', '#a89f91'] },
      { id: 'sumi-e', name: 'Sumi-e', colors: ['#f5f5f0', '#1a1a1a', '#8b8b8b'] },
      { id: 'monolith', name: 'Monolith', colors: ['#1a1a1a', '#ffffff', '#4a4a4a'] },
      { id: 'herbarium', name: 'Herbarium', colors: ['#f5f3e7', '#4a5d4a', '#8b7355'] },
      { id: 'coastal', name: 'Coastal', colors: ['#f8f9fa', '#5d7a8c', '#d4c5b0'] },
      { id: 'atelier', name: 'Atelier', colors: ['#f5f3ef', '#2c2c2c', '#c4a484'] },
      { id: 'mediterranean', name: 'Mediterranean', colors: ['#f8f5f2', '#3d6b99', '#d4af37'] },
    ],
  },
  {
    id: 'design-movements',
    name: 'Design Movements',
    description: 'Pay homage to the masters',
    themes: [
      { id: 'bauhaus', name: 'Bauhaus', colors: ['#e53935', '#fdd835', '#1e88e5'] },
      { id: 'swiss', name: 'Swiss', colors: ['#ffffff', '#ff0000', '#000000'] },
      { id: 'memphis', name: 'Memphis', colors: ['#ff6b6b', '#4ecdc4', '#ffd93d'] },
      { id: 'deco', name: 'Art Deco', colors: ['#1a1a2e', '#d4af37', '#2c3e50'] },
      { id: 'constructivist', name: 'Constructivist', colors: ['#c41e3a', '#1a1a1a', '#ffffff'] },
      { id: 'postmodern', name: 'PostModern', colors: ['#ff69b4', '#00ced1', '#ffd700'] },
      { id: 'retro', name: 'Retro', colors: ['#f4a460', '#2f4f4f', '#daa520'] },
      { id: 'neue', name: 'Neue', colors: ['#ffffff', '#000000', '#ff3366'] },
    ],
  },
  {
    id: 'tech',
    name: 'Tech & Digital',
    description: 'For the modern age',
    themes: [
      { id: 'bento', name: 'Bento', colors: ['#ffffff', '#1a1a1a', '#f5f5f5'] },
      { id: 'glass', name: 'Glass', colors: ['#e0e7ff', '#4338ca', '#818cf8'] },
      { id: 'terminal', name: 'Terminal', colors: ['#0d1117', '#58a6ff', '#238636'] },
      { id: 'neon', name: 'Neon', colors: ['#0a0a0a', '#ff00ff', '#00ffff'] },
      { id: 'aurora', name: 'Aurora', colors: ['#1a1a2e', '#7c3aed', '#06b6d4'] },
      { id: 'mesh', name: 'Mesh', colors: ['#fdf4ff', '#c026d3', '#9333ea'] },
      { id: 'cyberdeck', name: 'CyberDeck', colors: ['#0f0f0f', '#00ff41', '#ff0080'] },
      { id: 'y2k', name: 'Y2K', colors: ['#c0c0c0', '#0066ff', '#ff00ff'] },
      { id: 'vaporwave', name: 'Vaporwave', colors: ['#ff71ce', '#01cdfe', '#05ffa1'] },
    ],
  },
  {
    id: 'cultural',
    name: 'Cultural & Regional',
    description: 'From around the world',
    themes: [
      { id: 'tokyo', name: 'Tokyo', colors: ['#1a1a2e', '#ff6b9d', '#00d4ff'] },
      { id: 'seoul', name: 'Seoul', colors: ['#ffffff', '#ff4d6d', '#4cc9f0'] },
      { id: 'paris', name: 'Paris', colors: ['#f8f5f2', '#1a1a2e', '#d4af37'] },
      { id: 'milano', name: 'Milano', colors: ['#ffffff', '#c41e3a', '#1a1a1a'] },
      { id: 'brooklyn', name: 'Brooklyn', colors: ['#faf8f5', '#ff6b35', '#2d3436'] },
      { id: 'nordic', name: 'Nordic', colors: ['#f8f9fa', '#4a5568', '#b8c4ce'] },
      { id: 'havana', name: 'Havana', colors: ['#f5e6d3', '#ff6b35', '#00a896'] },
      { id: 'marrakech', name: 'Marrakech', colors: ['#f5e6d3', '#c41e3a', '#d4af37'] },
    ],
  },
  {
    id: 'natural',
    name: 'Natural & Organic',
    description: 'Earth-inspired',
    themes: [
      { id: 'terra', name: 'Terra', colors: ['#f5e6d3', '#8b4513', '#2f4f4f'] },
      { id: 'forest', name: 'Forest', colors: ['#f5f5f0', '#228b22', '#1a1a1a'] },
      { id: 'stone', name: 'Stone', colors: ['#d3d3d3', '#696969', '#1a1a1a'] },
      { id: 'bloom', name: 'Bloom', colors: ['#fff5f5', '#ff69b4', '#228b22'] },
      { id: 'desert', name: 'Desert', colors: ['#f5e6d3', '#cd853f', '#8b4513'] },
      { id: 'frost', name: 'Frost', colors: ['#f0f8ff', '#4682b4', '#1a1a2e'] },
      { id: 'ember', name: 'Ember', colors: ['#1a1a1a', '#ff4500', '#ffd700'] },
      { id: 'mist', name: 'Mist', colors: ['#f5f5f5', '#778899', '#2f4f4f'] },
    ],
  },
];

export const ThemesGalleryPage: React.FC<ThemesGalleryPageProps> = ({ onAuth }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const filteredCategories = activeCategory
    ? themeCategories.filter((cat) => cat.id === activeCategory)
    : themeCategories;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-24 md:pt-32">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
              Theme Gallery
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a1a2e] mb-6">
              60+ Ways to Tell Your Story
            </h1>
            <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto">
              Not templates. Design systems. Each archetype adapts to your content
              while maintaining visual coherence.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === null
                  ? 'bg-[#1a1a2e] text-white'
                  : 'bg-white text-[#6b6b6b] border border-[#e5e2dd] hover:border-[#d4af37]/30'
              }`}
            >
              All Themes
            </button>
            {themeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-[#1a1a2e] text-white'
                    : 'bg-white text-[#6b6b6b] border border-[#e5e2dd] hover:border-[#d4af37]/30'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Theme Categories */}
        {filteredCategories.map((category) => (
          <section key={category.id} className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1a1a2e] mb-2">
                  {category.name}
                </h2>
                <p className="text-[#6b6b6b]">{category.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {category.themes.map((theme) => (
                  <div
                    key={theme.id}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-[#e5e2dd] hover:border-[#d4af37]/30 transition-all duration-500"
                    onMouseEnter={() => setHoveredTheme(theme.id)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[0]} 100%)`,
                    }}
                  >
                    {/* Theme Preview */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div>
                        <div
                          className="w-12 h-1 rounded mb-2"
                          style={{ backgroundColor: theme.colors[1] }}
                        />
                        <div
                          className="w-16 h-2 rounded"
                          style={{ backgroundColor: `${theme.colors[1]}40` }}
                        />
                      </div>
                      <div
                        className="w-10 h-10 rounded-lg opacity-30"
                        style={{
                          backgroundColor: theme.colors[1],
                          borderRadius: '40% 60% 55% 45% / 45% 55% 50% 50%',
                        }}
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-[#1a1a2e]/90 flex flex-col justify-center items-center p-4 transition-opacity duration-300 ${
                        hoveredTheme === theme.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {theme.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {theme.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-16 md:py-24 bg-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Find Your Visual Voice
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Try any archetype free. No credit card required.
            </p>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#d4af37] text-[#1a1a2e] font-semibold rounded-full hover:bg-[#e5c348] transition-all duration-500 group"
            >
              Start Creating Free
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default ThemesGalleryPage;
