/**
 * Atelier Light Homepage Variation
 *
 * Bright, airy minimalism with expansive whitespace.
 * Inspired by design studio portfolios and architectural minimalism.
 * Professional, refined, studio-quality feel.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

export default function AtelierLight() {
  return (
    <div
      className="min-h-screen bg-white text-[#4a4a4a]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Navigation - Ultra minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="text-lg tracking-tight text-[#1a1a1a]">
              {brand.name}
            </Link>

            <div className="hidden md:flex items-center gap-12">
              <a href="#features" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Features</a>
              <a href="#process" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Process</a>
              <Link to="/themes" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Themes</Link>
              <Link to="/pricing" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-[#1a1a1a] text-white text-sm hover:bg-[#333] transition-colors"
              >
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Massive whitespace */}
      <section className="min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-32">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a35a] mb-8">
              {hero.badge}
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight text-[#1a1a1a] mb-8">
              {hero.headline}
            </h1>

            <p className="text-xl text-[#666] max-w-xl leading-relaxed mb-12">
              {hero.subheadline}
            </p>

            <div className="flex items-center gap-8">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a1a] text-white text-sm hover:bg-[#c4a35a] transition-colors"
              >
                {hero.primaryCTA}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#process"
                className="inline-flex items-center gap-2 text-[#888] hover:text-[#1a1a1a] transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                {hero.secondaryCTA}
              </a>
            </div>
          </div>

          {/* Minimal stat display */}
          <div className="mt-32 pt-16 border-t border-[#eee]">
            <div className="flex items-baseline gap-4">
              <span className="text-7xl font-extralight text-[#1a1a1a]">{hero.stats.archetypes}</span>
              <span className="text-sm text-[#888] uppercase tracking-[0.2em]">{hero.stats.archetypesLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean grid */}
      <section id="features" className="py-32 border-t border-[#eee]">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="mb-24">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a35a] mb-4">
              {features.sectionLabel}
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a]">
              {features.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div key={index} className="group">
                  <div className="flex items-start gap-6">
                    {Icon && (
                      <div className="w-12 h-12 border border-[#eee] flex items-center justify-center flex-shrink-0 group-hover:border-[#c4a35a] transition-colors">
                        <Icon className="w-5 h-5 text-[#888] group-hover:text-[#c4a35a] transition-colors" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl text-[#1a1a1a] mb-3">{feature.headline}</h3>
                      <p className="text-[#666] leading-relaxed mb-4">{feature.copy}</p>
                      <p className="text-sm text-[#999]">{feature.benefit}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="mb-24">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a35a] mb-4">
              {howItWorks.sectionLabel}
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a]">
              {howItWorks.headline}
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              return (
                <div key={index}>
                  <div className="text-8xl font-extralight text-[#eee] mb-8">
                    {step.number}
                  </div>
                  {Icon && (
                    <div className="w-14 h-14 bg-white border border-[#eee] flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-[#c4a35a]" />
                    </div>
                  )}
                  <h3 className="text-xl text-[#1a1a1a] mb-4">{step.title}</h3>
                  <p className="text-[#666] leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Minimal */}
      <section className="py-32 border-t border-[#eee]">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="mb-24">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4a35a] mb-4">
              {testimonials.sectionLabel}
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a]">
              {testimonials.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {testimonials.items.map((testimonial, index) => (
              <div key={index}>
                <blockquote className="text-lg text-[#1a1a1a] leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#fafafa] flex items-center justify-center text-sm text-[#888]">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a1a]">{testimonial.author}</p>
                    <p className="text-xs text-[#888]">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Clean and confident */}
      <section className="py-32 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-[#c4a35a] rounded-full animate-pulse" />
            <span className="text-sm text-white/60">{cta.badge}</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
            {cta.headline}
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#c4a35a] mb-8">
            {cta.headlineAccent}
          </h2>

          <p className="text-xl text-white/60 mb-12 max-w-xl">
            {cta.subheadline}
          </p>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1a1a1a] text-sm hover:bg-[#c4a35a] hover:text-white transition-colors"
          >
            {cta.buttonText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-16 text-sm text-white/40">
            {cta.tagline}
          </p>
        </div>
      </section>

      {/* Footer - Ultra minimal */}
      <footer className="bg-white border-t border-[#eee]">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <span className="text-lg tracking-tight text-[#1a1a1a] block mb-4">{brand.name}</span>
              <p className="text-sm text-[#888] mb-6 max-w-xs">
                {footer.tagline}
              </p>
              <div className="flex items-center gap-4">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="text-[#ccc] hover:text-[#c4a35a] transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footer.links).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#999] mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.disabled ? (
                        <span className="text-sm text-[#ddd]">
                          {link.label}
                        </span>
                      ) : (
                        <Link to={link.href} className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#eee] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#999]">{footer.copyright}</p>
            <p className="text-sm text-[#ccc]">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
