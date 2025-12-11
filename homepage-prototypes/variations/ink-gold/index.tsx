/**
 * Ink & Gold Homepage Variation
 *
 * Dark elegant, gold foil accents, serif sophistication.
 * Inspired by luxury editorial, fine stationery.
 * Sophisticated, premium, like an invitation.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Quote, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

export default function InkGold() {
  return (
    <div
      className="min-h-screen bg-[#0f172a] text-[#faf5eb]"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      {/* Decorative gold lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0 300 Q300 200 500 300 T1000 200" stroke="#c5a47e" strokeWidth="1" fill="none" />
          <path d="M0 600 Q400 500 600 600 T1000 500" stroke="#c5a47e" strokeWidth="0.5" fill="none" />
          <path d="M0 800 Q200 700 400 800 T1000 700" stroke="#c5a47e" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm border-b border-[#c5a47e]/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#c5a47e] flex items-center justify-center">
                <span className="text-[#c5a47e] font-semibold">{brand.logoLetter}</span>
              </div>
              <span className="text-xl tracking-wide text-[#faf5eb]">{brand.name}</span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-sm text-[#faf5eb]/60 hover:text-[#c5a47e] transition-colors tracking-wide">Features</a>
              <a href="#how-it-works" className="text-sm text-[#faf5eb]/60 hover:text-[#c5a47e] transition-colors tracking-wide">Process</a>
              <Link to="/themes" className="text-sm text-[#faf5eb]/60 hover:text-[#c5a47e] transition-colors tracking-wide">Themes</Link>
              <Link to="/pricing" className="text-sm text-[#faf5eb]/60 hover:text-[#c5a47e] transition-colors tracking-wide">Pricing</Link>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm text-[#faf5eb]/60 hover:text-[#c5a47e] transition-colors tracking-wide">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 border border-[#c5a47e] text-[#c5a47e] text-sm tracking-wide hover:bg-[#c5a47e] hover:text-[#0f172a] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 relative">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 border border-[#c5a47e]/30">
              <span className="w-6 h-px bg-[#c5a47e]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#c5a47e]">
                {hero.badge}
              </span>
              <span className="w-6 h-px bg-[#c5a47e]" />
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight">
              {hero.headline.split(' ').slice(0, 2).join(' ')}<br />
              <span className="italic text-[#c5a47e]">{hero.headline.split(' ').slice(2).join(' ')}</span>
            </h1>

            <p className="text-xl text-[#faf5eb]/60 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-[#c5a47e] text-[#0f172a] font-medium tracking-wide hover:bg-[#d4b68e] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {hero.primaryCTA}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-3 text-[#faf5eb]/60 hover:text-[#c5a47e] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <div className="w-12 h-12 border border-[#c5a47e]/30 flex items-center justify-center">
                  <Play className="w-5 h-5 ml-1 text-[#c5a47e]" />
                </div>
                {hero.secondaryCTA}
              </a>
            </div>

            <div className="pt-16 flex flex-col items-center">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#c5a47e]/30 to-transparent mb-6" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#faf5eb]/40 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {hero.socialProof.label}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {hero.socialProof.companies.map((company, i) => (
                  <React.Fragment key={company}>
                    <span className="text-sm text-[#faf5eb]/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {company}
                    </span>
                    {i < hero.socialProof.companies.length - 1 && (
                      <span className="w-1 h-1 bg-[#c5a47e]/30 rounded-full" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative stat */}
        <div className="absolute bottom-12 right-12 text-right hidden lg:block">
          <span className="text-6xl font-light text-[#c5a47e]">{hero.stats.archetypes}</span>
          <p className="text-xs uppercase tracking-[0.2em] text-[#faf5eb]/40 mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {hero.stats.archetypesLabel}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 border-t border-[#c5a47e]/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-[#c5a47e] mb-6 block">
              {features.sectionLabel}
            </span>
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              {features.headline}
            </h2>
            <p className="text-lg text-[#faf5eb]/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {features.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div
                  key={index}
                  className="group p-10 border border-[#c5a47e]/10 hover:border-[#c5a47e]/30 transition-colors"
                >
                  {Icon && (
                    <div className="w-14 h-14 border border-[#c5a47e]/30 flex items-center justify-center mb-8 group-hover:bg-[#c5a47e]/10 transition-colors">
                      <Icon className="w-7 h-7 text-[#c5a47e]" />
                    </div>
                  )}
                  <h3 className="text-2xl mb-4 italic">{feature.headline}</h3>
                  <p className="text-[#faf5eb]/60 leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {feature.copy}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-[#c5a47e]">
                    <span className="w-4 h-px bg-[#c5a47e]" />
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{feature.benefit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-[#faf5eb] text-[#0f172a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-[#c5a47e] mb-6 block">
              {howItWorks.sectionLabel}
            </span>
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              {howItWorks.headline}
            </h2>
            <p className="text-lg text-[#0f172a]/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {howItWorks.subheadline}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              return (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="text-8xl font-light text-[#c5a47e]/20 absolute -top-4 left-1/2 -translate-x-1/2">
                      {step.number}
                    </div>
                    {Icon && (
                      <div className="relative w-20 h-20 border-2 border-[#0f172a] flex items-center justify-center mx-auto">
                        <Icon className="w-10 h-10 text-[#0f172a]" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl mb-4 italic">{step.title}</h3>
                  <p className="text-[#0f172a]/60 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 border-t border-[#c5a47e]/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-[#c5a47e] mb-6 block">
              {testimonials.sectionLabel}
            </span>
            <h2 className="text-5xl md:text-6xl font-light">
              {testimonials.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.items.map((testimonial, index) => (
              <div key={index} className="p-8 border border-[#c5a47e]/10">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#c5a47e]">&#9733;</span>
                  ))}
                </div>
                <blockquote className="text-lg leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-[#c5a47e]/30 flex items-center justify-center text-lg">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-[#faf5eb]/60">
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1a2540] to-[#0f172a]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-3 px-5 py-2 border border-[#c5a47e]/30 mb-10">
            <span className="w-2 h-2 bg-[#c5a47e] rounded-full animate-pulse" />
            <span className="text-sm text-[#faf5eb]/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>{cta.badge}</span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
            {cta.headline}<br />
            <span className="italic text-[#c5a47e]">{cta.headlineAccent}</span>
          </h2>

          <p className="text-xl text-[#faf5eb]/60 mb-12 max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {cta.subheadline}
          </p>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-[#c5a47e] text-[#0f172a] font-medium tracking-wide hover:bg-[#d4b68e] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {cta.buttonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-16 text-sm text-[#faf5eb]/40 italic">
            {cta.tagline}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1020] border-t border-[#c5a47e]/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-[#c5a47e] flex items-center justify-center">
                  <span className="text-[#c5a47e] font-semibold">{brand.logoLetter}</span>
                </div>
                <span className="text-xl tracking-wide">{brand.name}</span>
              </div>
              <p className="text-sm text-[#faf5eb]/40 mb-6 max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {footer.tagline}
              </p>
              <div className="flex items-center gap-4">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-[#c5a47e]/20 flex items-center justify-center text-[#faf5eb]/40 hover:text-[#c5a47e] hover:border-[#c5a47e]/40 transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footer.links).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a47e]/60 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.disabled ? (
                        <span className="text-sm text-[#faf5eb]/20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {link.label} <span className="text-xs">(soon)</span>
                        </span>
                      ) : (
                        <Link to={link.href} className="text-sm text-[#faf5eb]/40 hover:text-[#c5a47e] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#c5a47e]/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#faf5eb]/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>{footer.copyright}</p>
            <p className="text-sm text-[#faf5eb]/30 italic">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
