/**
 * Gallery Section - Editorial Variant
 * Grid of SVG presentation theme previews
 * Showcases design variety with mini illustrations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, ArrowRight } from 'lucide-react';
import { tw, variants } from '../shared/tokens';
import { ThemePreview } from './illustrations';
import { Button } from '../shared/CommonComponents';

const themes = [
  { name: 'Minimal', color: '#1E2E1E', variant: 'minimal' as const },
  { name: 'Bold Impact', color: '#DC2626', variant: 'bold' as const },
  { name: 'Elegant', color: '#8B5CF6', variant: 'elegant' as const },
  { name: 'Modern Tech', color: '#3B82F6', variant: 'modern' as const },
  { name: 'Organic', color: '#10B981', variant: 'organic' as const },
  { name: 'Corporate', color: '#6366F1', variant: 'tech' as const },
  { name: 'Vibrant', color: '#F59E0B', variant: 'bold' as const },
  { name: 'Classic', color: '#6B8E6B', variant: 'elegant' as const },
  { name: 'Playful', color: '#EC4899', variant: 'modern' as const },
  { name: 'Professional', color: '#0F172A', variant: 'minimal' as const },
  { name: 'Creative', color: '#8B5CF6', variant: 'organic' as const },
  { name: 'Startup', color: '#06B6D4', variant: 'tech' as const },
];

export const Gallery: React.FC = () => {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #D4E5D4 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={variants.stagger}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B8E6B]/10 border border-[#6B8E6B]/20 mb-6"
            variants={variants.fadeIn}
          >
            <Palette size={16} className="text-[#6B8E6B]" />
            <span className="text-sm font-medium text-[#4A5D4A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Visual Themes
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl lg:text-6xl font-bold text-[#1E2E1E] leading-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            variants={variants.fadeInUp}
          >
            Designs that make
            <span className="block text-[#6B8E6B]">your content shine</span>
          </motion.h2>

          <motion.p
            className="text-xl text-[#4A5D4A] leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
            variants={variants.fadeInUp}
          >
            Choose from 30+ professionally crafted themes. Each one is thoughtfully designed with typography, color harmony, and visual hierarchy in mind.
          </motion.p>
        </motion.div>

        {/* Theme grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={variants.staggerFast}
        >
          {themes.map((theme, index) => (
            <motion.div
              key={theme.name}
              className="group"
              variants={variants.scaleIn}
              whileHover={{ y: -8 }}
            >
              <motion.div
                className="relative bg-white rounded-2xl border-2 border-[#D4E5D4] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#6B8E6B] hover:shadow-[0_12px_40px_rgba(107,142,107,0.15)]"
                whileHover={{ scale: 1.02 }}
              >
                {/* Theme preview */}
                <div className="aspect-square p-3 bg-[#FAFBF8]">
                  <ThemePreview
                    accentColor={theme.color}
                    variant={theme.variant}
                    className="w-full h-full"
                  />
                </div>

                {/* Theme name */}
                <div className="p-4 bg-white border-t border-[#D4E5D4]">
                  <h3
                    className="text-sm font-semibold text-[#1E2E1E] mb-1 group-hover:text-[#6B8E6B] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {theme.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="text-xs text-[#8FA58F]">Preview</span>
                  </div>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#6B8E6B]/90 to-[#4A5D4A]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                >
                  <div className="text-center text-white p-4">
                    <Palette size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">View Theme</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants.stagger}
        >
          <HighlightCard
            number="30+"
            title="Curated Themes"
            description="Each theme is professionally designed with balanced typography and color palettes"
          />
          <HighlightCard
            number="60+"
            title="Layout Archetypes"
            description="From minimal to bold, find the perfect layout for every slide type"
          />
          <HighlightCard
            number="∞"
            title="Customization"
            description="Fine-tune colors, fonts, and layouts to match your brand perfectly"
          />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants.fadeInUp}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-br from-[#F5FAF7] to-[#EDF5F0] border border-[#D4E5D4]">
            <span className="text-lg text-[#4A5D4A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Want to see more?
            </span>
            <Button variant="primary" size="md">
              Explore All Themes
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Helper component for highlight cards
const HighlightCard: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <motion.div
    className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-[#FAFBF8] border border-[#D4E5D4]"
    variants={variants.fadeInUp}
    whileHover={{ y: -4, shadow: '0 12px 40px rgba(107, 142, 107, 0.12)' }}
  >
    <div
      className="text-5xl font-bold text-[#6B8E6B] mb-3"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      {number}
    </div>
    <h3
      className="text-xl font-semibold text-[#1E2E1E] mb-2"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {title}
    </h3>
    <p
      className="text-sm text-[#4A5D4A] leading-relaxed"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {description}
    </p>
  </motion.div>
);

export default Gallery;
