/**
 * Paper Texture Homepage Variation
 *
 * Tactile, layered paper, editorial warmth.
 * Inspired by Kinfolk, Cereal magazine.
 * Literary, thoughtful, tactile feel.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Quote, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

export default function PaperTexture() {
  return (
    <div
      className="min-h-screen text-[#333]"
      style={{
        fontFamily: "'Newsreader', Georgia, serif",
        backgroundColor: '#faf6f1',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundBlendMode: 'soft-light',
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf6f1]/95 backdrop-blur-sm border-b border-[#e5ddd3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-light tracking-tight text-[#333]">{brand.name}</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#666] hover:text-[#333] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-[#666] hover:text-[#333] transition-colors">Process</a>
              <Link to="/themes" className="text-sm text-[#666] hover:text-[#333] transition-colors">Themes</Link>
              <Link to="/pricing" className="text-sm text-[#666] hover:text-[#333] transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-[#666] hover:text-[#333] transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-[#333] text-[#faf6f1] text-sm hover:bg-[#444] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Content */}
            <div className="lg:col-span-7 space-y-8">
              <span className="text-xs uppercase tracking-[0.3em] text-[#bc6c4c]">
                {hero.badge}
              </span>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-[#333]">
                <span className="italic">{hero.headline.split(' ').slice(0, 1).join(' ')}</span>{' '}
                {hero.headline.split(' ').slice(1).join(' ')}
              </h1>

              <p className="text-xl text-[#666] max-w-lg leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#333] text-[#faf6f1] hover:bg-[#bc6c4c] transition-colors"
                >
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{hero.primaryCTA}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-[#666] hover:text-[#bc6c4c] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Play className="w-4 h-4" />
                  {hero.secondaryCTA}
                </a>
              </div>

              <div className="pt-12 border-t border-[#e5ddd3]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#999] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {hero.socialProof.label}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {hero.socialProof.companies.map((company) => (
                    <span key={company} className="text-sm text-[#666]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* Layered paper effect */}
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#e5ddd3] transform rotate-2" />
                <div className="absolute -bottom-2 -right-2 w-full h-full bg-[#ebe4db] transform rotate-1" />
                <div className="relative bg-white border border-[#e5ddd3] shadow-lg p-8">
                  <div className="aspect-[4/3] bg-[#faf6f1] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-1 bg-[#bc6c4c] mx-auto" />
                      <p className="text-4xl italic text-[#333]">"{hero.stats.archetypes}"</p>
                      <p className="text-sm text-[#666] uppercase tracking-[0.2em]">{hero.stats.archetypesLabel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#bc6c4c] mb-4 block">
                {features.sectionLabel}
              </span>
              <h2 className="text-4xl md:text-5xl font-light mb-4 italic">
                {features.headline}
              </h2>
            </div>
            <div className="lg:col-span-8 lg:pt-12">
              <p className="text-xl text-[#666] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {features.subheadline}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div
                  key={index}
                  className="relative bg-[#faf6f1] p-8 border-l-2 border-[#bc6c4c] hover:bg-[#f5efe8] transition-colors"
                >
                  <div className="flex items-start gap-6">
                    {Icon && (
                      <div className="w-12 h-12 border border-[#e5ddd3] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-[#bc6c4c]" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl mb-3 italic">{feature.headline}</h3>
                      <p className="text-[#666] leading-relaxed mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {feature.copy}
                      </p>
                      <p className="text-sm text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <span className="text-[#bc6c4c]">—</span> {feature.benefit}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#bc6c4c] mb-4 block">
              {howItWorks.sectionLabel}
            </span>
            <h2 className="text-4xl md:text-5xl font-light italic mb-4">
              {howItWorks.headline}
            </h2>
            <p className="text-xl text-[#666] max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {howItWorks.subheadline}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              return (
                <div key={index} className="text-center">
                  <div className="text-6xl font-light text-[#e5ddd3] mb-6">{step.number}</div>
                  {Icon && (
                    <div className="w-16 h-16 mx-auto mb-6 border border-[#e5ddd3] flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#bc6c4c]" />
                    </div>
                  )}
                  <h3 className="text-2xl mb-4 italic">{step.title}</h3>
                  <p className="text-[#666] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#bc6c4c] mb-4 block">
              {testimonials.sectionLabel}
            </span>
            <h2 className="text-4xl md:text-5xl font-light italic">
              {testimonials.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.items.map((testimonial, index) => (
              <div key={index} className="border-t border-[#e5ddd3] pt-8">
                <Quote className="w-8 h-8 text-[#e5ddd3] mb-4" />
                <blockquote className="text-lg leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#faf6f1] flex items-center justify-center text-lg">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <p className="font-medium text-[#333]">{testimonial.author}</p>
                    <p className="text-sm text-[#666]">
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
      <section className="py-24 bg-[#333] text-[#faf6f1]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 mb-8 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="w-2 h-2 bg-[#bc6c4c] rounded-full animate-pulse" />
            {cta.badge}
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
            <span className="italic">{cta.headline}</span><br />
            {cta.headlineAccent}
          </h2>

          <p className="text-xl text-[#faf6f1]/70 mb-10 max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {cta.subheadline}
          </p>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#bc6c4c] text-[#faf6f1] hover:bg-[#a55d3f] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {cta.buttonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-12 text-sm text-[#faf6f1]/50 italic">
            {cta.tagline}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#faf6f1] border-t border-[#e5ddd3]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <span className="text-2xl font-light tracking-tight text-[#333] block mb-4">{brand.name}</span>
              <p className="text-sm text-[#666] mb-6 max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {footer.tagline}
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-[#e5ddd3] flex items-center justify-center text-[#666] hover:text-[#bc6c4c] hover:border-[#bc6c4c] transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footer.links).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#999] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.disabled ? (
                        <span className="text-sm text-[#ccc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {link.label} <span className="text-xs">(soon)</span>
                        </span>
                      ) : (
                        <Link to={link.href} className="text-sm text-[#666] hover:text-[#bc6c4c] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#e5ddd3] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{footer.copyright}</p>
            <p className="text-sm text-[#999] italic">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
