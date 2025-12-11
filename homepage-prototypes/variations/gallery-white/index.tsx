/**
 * Gallery White Homepage Variation
 *
 * Museum-quality clean, content-focused, artwork presentation.
 * Inspired by gallery and museum websites.
 * Ultra-clean with minimal accents, content is the star.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

export default function GalleryWhite() {
  return (
    <div
      className="min-h-screen bg-white text-[#1a1a1a]"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
    >
      {/* Navigation - Museum-like simplicity */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-sm font-medium tracking-tight">
              {brand.name}
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-xs uppercase tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors">Features</a>
              <a href="#process" className="text-xs uppercase tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors">Process</a>
              <Link to="/themes" className="text-xs uppercase tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors">Themes</Link>
              <Link to="/pricing" className="text-xs uppercase tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/login" className="text-xs uppercase tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs uppercase tracking-[0.15em] text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:text-[#666] hover:border-[#666] transition-colors"
              >
                Start
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Gallery wall aesthetic */}
      <section className="min-h-screen flex items-center pt-14">
        <div className="max-w-7xl mx-auto px-8 py-24 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left: Content */}
            <div className="lg:col-span-7 space-y-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#999]">
                {hero.badge}
              </p>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight">
                {hero.headline}
              </h1>

              <p className="text-lg text-[#666] max-w-md leading-relaxed">
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-8 pt-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 text-sm border-b border-[#1a1a1a] pb-1 hover:text-[#666] hover:border-[#666] transition-colors"
                >
                  {hero.primaryCTA}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#process"
                  className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-[#1a1a1a] transition-colors"
                >
                  <Play className="w-3 h-3" />
                  {hero.secondaryCTA}
                </a>
              </div>
            </div>

            {/* Right: Visual - Framed artwork style */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Frame */}
                <div className="border border-[#e5e5e5] p-4">
                  <div className="aspect-[4/3] bg-[#fafafa] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-7xl font-extralight text-[#1a1a1a]">{hero.stats.archetypes}</p>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#999] mt-4">{hero.stats.archetypesLabel}</p>
                    </div>
                  </div>
                </div>
                {/* Caption */}
                <p className="text-[10px] text-[#999] mt-3 text-center">
                  Fig. 1 — Design archetypes available
                </p>
              </div>
            </div>
          </div>

          {/* Social proof - Minimal */}
          <div className="mt-32 pt-8 border-t border-[#e5e5e5]">
            <div className="flex items-center gap-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#999]">
                {hero.socialProof.label}
              </p>
              <div className="flex items-center gap-8">
                {hero.socialProof.companies.map((company) => (
                  <span key={company} className="text-xs text-[#ccc]">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Grid gallery */}
      <section id="features" className="py-32 border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#999] mb-4">
              {features.sectionLabel}
            </p>
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              {features.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5]">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div
                  key={index}
                  className="bg-white p-10 group hover:bg-[#fafafa] transition-colors"
                >
                  {Icon && (
                    <Icon className="w-5 h-5 text-[#ccc] mb-8 group-hover:text-[#1a1a1a] transition-colors" />
                  )}
                  <h3 className="text-lg font-medium mb-3">{feature.headline}</h3>
                  <p className="text-sm text-[#666] leading-relaxed mb-4">{feature.copy}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#999]">{feature.benefit}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#999] mb-4">
              {howItWorks.sectionLabel}
            </p>
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              {howItWorks.headline}
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              return (
                <div key={index}>
                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="text-6xl font-extralight text-[#e5e5e5]">{step.number}</span>
                  </div>
                  {Icon && (
                    <Icon className="w-5 h-5 text-[#999] mb-6" />
                  )}
                  <h3 className="text-lg font-medium mb-4">{step.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Quote gallery */}
      <section className="py-32 border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#999] mb-4">
              {testimonials.sectionLabel}
            </p>
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              {testimonials.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[#e5e5e5]">
            {testimonials.items.map((testimonial, index) => (
              <div key={index} className="bg-white p-10">
                <blockquote className="text-lg leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="text-sm font-medium">{testimonial.author}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] mt-1">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal statement */}
      <section className="py-32 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-8">
            {cta.badge}
          </p>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-4">
            {cta.headline}
          </h2>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white/40 mb-12">
            {cta.headlineAccent}
          </h2>

          <p className="text-lg text-white/60 mb-12 max-w-md mx-auto">
            {cta.subheadline}
          </p>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 text-sm border-b border-white pb-1 hover:text-white/60 hover:border-white/60 transition-colors"
          >
            {cta.buttonText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-16 text-[10px] uppercase tracking-[0.3em] text-white/30">
            {cta.tagline}
          </p>
        </div>
      </section>

      {/* Footer - Museum style */}
      <footer className="bg-white border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <span className="text-sm font-medium tracking-tight block mb-4">{brand.name}</span>
              <p className="text-xs text-[#666] mb-6 max-w-xs leading-relaxed">
                {footer.tagline}
              </p>
              <div className="flex items-center gap-4">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="text-[#ccc] hover:text-[#1a1a1a] transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footer.links).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#999] mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.disabled ? (
                        <span className="text-xs text-[#ddd]">
                          {link.label}
                        </span>
                      ) : (
                        <Link to={link.href} className="text-xs text-[#666] hover:text-[#1a1a1a] transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#e5e5e5] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-[#999]">{footer.copyright}</p>
            <p className="text-[10px] text-[#ccc]">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
