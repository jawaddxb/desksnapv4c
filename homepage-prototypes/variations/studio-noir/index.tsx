/**
 * Studio Noir Homepage Variation
 *
 * High-contrast B&W gallery aesthetic inspired by &Walsh and Pentagram.
 * Pure black background, white text, single gold accent used sparingly.
 * Confident, curated, gallery-like feel.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Quote, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

// Icon mapping
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

export default function StudioNoir() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">{brand.logoLetter}</span>
              </div>
              <span className="font-medium text-white tracking-tight">{brand.name}</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</a>
              <Link to="/themes" className="text-sm text-white/60 hover:text-white transition-colors">Themes</Link>
              <Link to="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20">
                <span className="w-1.5 h-1.5 bg-[#c5a47e]" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {hero.badge}
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight">
                {hero.headline.split(' ').map((word, i) => (
                  <span key={i} className={i === 2 ? 'text-[#c5a47e]' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <p className="text-xl text-white/60 max-w-md leading-relaxed">
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-6">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium hover:bg-[#c5a47e] transition-colors"
                >
                  {hero.primaryCTA}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <Play className="w-4 h-4" />
                  {hero.secondaryCTA}
                </a>
              </div>

              <div className="pt-8 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                  {hero.socialProof.label}
                </p>
                <div className="flex items-center gap-8">
                  {hero.socialProof.companies.map((company) => (
                    <span key={company} className="text-sm text-white/40 font-medium">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="aspect-[4/3] bg-white/5 border border-white/10 relative overflow-hidden">
                {/* Mock slide preview */}
                <div className="absolute inset-4 bg-gradient-to-br from-white/10 to-transparent">
                  <div className="p-8">
                    <div className="w-16 h-1 bg-[#c5a47e] mb-6" />
                    <div className="w-48 h-6 bg-white/20 mb-3" />
                    <div className="w-36 h-6 bg-white/20" />
                  </div>
                </div>

                {/* Floating stats */}
                <div className="absolute bottom-4 left-4 px-4 py-3 bg-black border border-white/20">
                  <span className="text-3xl font-light">{hero.stats.archetypes}</span>
                  <span className="text-xs text-white/60 ml-2">{hero.stats.archetypesLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-20">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              {features.sectionLabel}
            </span>
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              {features.headline}
            </h2>
            <p className="text-xl text-white/60">
              {features.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/10">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div
                  key={index}
                  className="bg-black p-12 hover:bg-white/5 transition-colors group"
                >
                  {Icon && (
                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8 group-hover:border-[#c5a47e] transition-colors">
                      <Icon className="w-6 h-6 text-white/60 group-hover:text-[#c5a47e] transition-colors" />
                    </div>
                  )}
                  <h3 className="text-2xl font-light mb-4">{feature.headline}</h3>
                  <p className="text-white/60 leading-relaxed mb-6">{feature.copy}</p>
                  <div className="inline-flex items-center gap-2 text-sm text-white/40">
                    <span className="w-1 h-1 bg-[#c5a47e]" />
                    {feature.benefit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              {howItWorks.sectionLabel}
            </span>
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              {howItWorks.headline}
            </h2>
            <p className="text-xl text-black/60">
              {howItWorks.subheadline}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              return (
                <div key={index} className="relative">
                  <div className="text-8xl font-light text-black/10 absolute -top-8 -left-4">
                    {step.number}
                  </div>
                  <div className="relative pt-12">
                    {Icon && (
                      <div className="w-16 h-16 bg-black flex items-center justify-center mb-8">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <h3 className="text-2xl font-light mb-4">{step.title}</h3>
                    <p className="text-black/60 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-20">
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              {testimonials.sectionLabel}
            </span>
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              {testimonials.headline}
            </h2>
            <p className="text-xl text-white/60">
              {testimonials.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {testimonials.items.map((testimonial, index) => (
              <div key={index} className="bg-black p-12 group">
                <Quote className="w-8 h-8 text-[#c5a47e] mb-8" />
                <blockquote className="text-lg leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-xl font-light">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-white/60">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#c5a47e] text-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/10 mb-8">
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span className="text-sm">{cta.badge}</span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
            {cta.headline}<br />
            <span className="italic">{cta.headlineAccent}</span>
          </h2>

          <p className="text-xl text-black/70 mb-10 max-w-2xl mx-auto">
            {cta.subheadline}
          </p>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-black text-white font-medium hover:bg-black/80 transition-colors"
          >
            {cta.buttonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-12 text-sm text-black/50 italic">
            {cta.tagline}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <span className="text-black font-bold text-sm">{brand.logoLetter}</span>
                </div>
                <span className="font-medium text-white">{brand.name}</span>
              </Link>
              <p className="text-sm text-white/60 mb-6 max-w-xs">
                {footer.tagline}
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footer.links).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.disabled ? (
                        <span className="text-sm text-white/30">
                          {link.label} <span className="text-xs">(soon)</span>
                        </span>
                      ) : (
                        <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">{footer.copyright}</p>
            <p className="text-sm text-white/40 italic">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
