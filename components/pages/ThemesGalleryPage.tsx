/**
 * ThemesGalleryPage Component
 *
 * Full theme gallery with category filtering.
 * Studio Noir aesthetic - black, white, gold.
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
    <div className="min-h-screen bg-black text-white">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-32">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              Theme Gallery
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
              60+ Ways to Tell Your Story
            </h1>
            <p className="text-xl text-white/60">
              Not templates. Design systems. Each archetype adapts to your content
              while maintaining visual coherence.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-sm transition-colors ${
                activeCategory === null
                  ? 'bg-white text-black'
                  : 'text-white/60 border border-white/20 hover:border-[#c5a47e] hover:text-[#c5a47e]'
              }`}
            >
              All Themes
            </button>
            {themeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-sm transition-colors ${
                  activeCategory === category.id
                    ? 'bg-white text-black'
                    : 'text-white/60 border border-white/20 hover:border-[#c5a47e] hover:text-[#c5a47e]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Theme Categories */}
        {filteredCategories.map((category) => (
          <section key={category.id} className="py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="text-3xl font-light mb-2">
                  {category.name}
                </h2>
                <p className="text-white/40">{category.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
                {category.themes.map((theme) => (
                  <div
                    key={theme.id}
                    className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
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
                          className="w-12 h-1 mb-2"
                          style={{ backgroundColor: theme.colors[1] }}
                        />
                        <div
                          className="w-16 h-2"
                          style={{ backgroundColor: `${theme.colors[1]}40` }}
                        />
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/90 flex flex-col justify-center items-center p-4 transition-opacity duration-150 ${
                        hoveredTheme === theme.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <h3 className="text-lg font-light mb-3">
                        {theme.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {theme.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 border border-white/20"
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
        <section className="py-24 bg-[#111111]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Find Your Visual Voice
            </h2>
            <p className="text-xl text-white/60 mb-10">
              Try any archetype free. No credit card required.
            </p>
            <button
              onClick={() => onAuth('register')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#c5a47e] text-black font-medium hover:bg-white transition-colors group"
            >
              Start Creating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default ThemesGalleryPage;
