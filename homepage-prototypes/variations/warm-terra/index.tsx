/**
 * Warm Terra Homepage Variation
 *
 * Mediterranean warmth with earthy terracotta tones.
 * Sun-kissed, warm neutrals, relaxed and inviting.
 * Sand, terracotta, olive color palette.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Quote, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

export default function WarmTerra() {
  return (
    <div
      className="min-h-screen text-[#3d3d3d]"
      style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        backgroundColor: '#f5ebe0',
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5ebe0]/95 backdrop-blur-sm border-b border-[#d5c4a1]/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#c66b3d] flex items-center justify-center">
                <span className="text-[#f5ebe0] font-bold text-sm">{brand.logoLetter}</span>
              </div>
              <span className="font-semibold text-[#3d3d3d]">{brand.name}</span>
            </Link>

            <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <a href="#features" className="text-sm text-[#666] hover:text-[#c66b3d] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-[#666] hover:text-[#c66b3d] transition-colors">Process</a>
              <Link to="/themes" className="text-sm text-[#666] hover:text-[#c66b3d] transition-colors">Themes</Link>
              <Link to="/pricing" className="text-sm text-[#666] hover:text-[#c66b3d] transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Link to="/login" className="text-sm text-[#666] hover:text-[#3d3d3d] transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-[#c66b3d] text-[#f5ebe0] text-sm rounded-full hover:bg-[#a85a30] transition-colors"
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
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#606c38]/10 rounded-full">
                <span className="w-2 h-2 bg-[#606c38] rounded-full" />
                <span className="text-sm text-[#606c38]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {hero.badge}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-[#3d3d3d]">
                {hero.headline.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? 'text-[#c66b3d] italic' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <p className="text-xl text-[#666] max-w-md leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#c66b3d] text-[#f5ebe0] rounded-full hover:bg-[#a85a30] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {hero.primaryCTA}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-[#666] hover:text-[#c66b3d] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Play className="w-4 h-4" />
                  {hero.secondaryCTA}
                </a>
              </div>

              <div className="pt-12 border-t border-[#d5c4a1]/50">
                <p className="text-xs uppercase tracking-[0.2em] text-[#999] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {hero.socialProof.label}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {hero.socialProof.companies.map((company) => (
                    <span key={company} className="text-sm text-[#a98467]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual - Warm terracotta card */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#f5ebe0] to-[#e9dcc9] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Decorative sun rays */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1 h-32 bg-[#c66b3d] origin-bottom"
                        style={{ transform: `rotate(${i * 30}deg)` }}
                      />
                    ))}
                  </div>
                  <div className="relative text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[#c66b3d] flex items-center justify-center">
                      <span className="text-3xl font-light text-[#f5ebe0]">{hero.stats.archetypes}</span>
                    </div>
                    <p className="text-sm text-[#666] uppercase tracking-[0.2em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {hero.stats.archetypesLabel}
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative olive branch */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20">
                <svg viewBox="0 0 100 100" fill="none">
                  <path d="M10 90 Q50 50 90 10" stroke="#606c38" strokeWidth="2" />
                  <ellipse cx="30" cy="70" rx="8" ry="12" fill="#606c38" transform="rotate(-45 30 70)" />
                  <ellipse cx="50" cy="50" rx="8" ry="12" fill="#606c38" transform="rotate(-45 50 50)" />
                  <ellipse cx="70" cy="30" rx="8" ry="12" fill="#606c38" transform="rotate(-45 70 30)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#606c38]/10 rounded-full mb-6">
              <span className="text-sm text-[#606c38]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {features.sectionLabel}
              </span>
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#3d3d3d]">
              {features.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div
                  key={index}
                  className="bg-[#f5ebe0] rounded-2xl p-8 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-start gap-6">
                    {Icon && (
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#c66b3d] transition-colors">
                        <Icon className="w-6 h-6 text-[#c66b3d] group-hover:text-white transition-colors" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl text-[#3d3d3d] mb-3">{feature.headline}</h3>
                      <p className="text-[#666] leading-relaxed mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {feature.copy}
                      </p>
                      <p className="text-sm text-[#a98467]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {feature.benefit}
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
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#c66b3d]/10 rounded-full mb-6">
              <span className="text-sm text-[#c66b3d]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {howItWorks.sectionLabel}
              </span>
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#3d3d3d]">
              {howItWorks.headline}
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              const colors = ['#c66b3d', '#606c38', '#a98467'];
              return (
                <div key={index} className="text-center">
                  <div
                    className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-[#f5ebe0] text-3xl font-light"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  >
                    {step.number}
                  </div>
                  {Icon && (
                    <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
                      <Icon className="w-6 h-6" style={{ color: colors[index % colors.length] }} />
                    </div>
                  )}
                  <h3 className="text-xl text-[#3d3d3d] mb-4">{step.title}</h3>
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
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#a98467]/10 rounded-full mb-6">
              <span className="text-sm text-[#a98467]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {testimonials.sectionLabel}
              </span>
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#3d3d3d]">
              {testimonials.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#f5ebe0] rounded-2xl p-8"
              >
                <Quote className="w-8 h-8 text-[#c66b3d]/30 mb-4" />
                <blockquote className="text-lg text-[#3d3d3d] leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#c66b3d] flex items-center justify-center text-[#f5ebe0] font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <p className="font-medium text-[#3d3d3d]">{testimonial.author}</p>
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
      <section className="py-24 bg-[#c66b3d] text-[#f5ebe0]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{cta.badge}</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            {cta.headline}
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 opacity-70 italic">
            {cta.headlineAccent}
          </h2>

          <p className="text-xl text-[#f5ebe0]/80 mb-10 max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {cta.subheadline}
          </p>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#f5ebe0] text-[#c66b3d] font-semibold rounded-full hover:bg-white transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {cta.buttonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-12 text-sm text-[#f5ebe0]/60 italic">
            {cta.tagline}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5ebe0] border-t border-[#d5c4a1]/30">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#c66b3d] flex items-center justify-center">
                  <span className="text-[#f5ebe0] font-bold text-sm">{brand.logoLetter}</span>
                </div>
                <span className="font-semibold text-[#3d3d3d]">{brand.name}</span>
              </div>
              <p className="text-sm text-[#666] mb-6 max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {footer.tagline}
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#666] hover:text-[#c66b3d] transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footer.links).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#a98467] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                        <Link to={link.href} className="text-sm text-[#666] hover:text-[#c66b3d] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#d5c4a1]/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{footer.copyright}</p>
            <p className="text-sm text-[#a98467] italic">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
