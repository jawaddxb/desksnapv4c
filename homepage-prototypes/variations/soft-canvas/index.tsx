/**
 * Soft Canvas Homepage Variation
 *
 * Soft pastels, organic shapes, joyful and calming.
 * Inspired by Amie, MyMind - joyful creative tools.
 * Calming, inviting, like opening a fresh notebook.
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

// Soft accent colors
const accents = ['#f8e1d9', '#d4e4d1', '#e8e0f0', '#d4e8f0'];

export default function SoftCanvas() {
  return (
    <div className="min-h-screen bg-[#fefbf6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, #f8e1d9 0%, transparent 70%)',
            borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
          }}
        />
        <div
          className="absolute top-1/2 -left-48 w-80 h-80 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, #d4e4d1 0%, transparent 70%)',
            borderRadius: '40% 60% 45% 55% / 55% 45% 55% 45%',
          }}
        />
        <div
          className="absolute bottom-32 right-1/4 w-64 h-64 opacity-25"
          style={{
            background: 'radial-gradient(ellipse at center, #e8e0f0 0%, transparent 70%)',
            borderRadius: '50% 50% 45% 55% / 45% 55% 50% 50%',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fefbf6]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#f8e1d9] rounded-xl flex items-center justify-center">
                <span className="text-[#333] font-semibold text-sm">{brand.logoLetter}</span>
              </div>
              <span className="font-semibold text-[#333] text-lg">{brand.name}</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#666] hover:text-[#333] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-[#666] hover:text-[#333] transition-colors">How It Works</a>
              <Link to="/themes" className="text-sm text-[#666] hover:text-[#333] transition-colors">Themes</Link>
              <Link to="/pricing" className="text-sm text-[#666] hover:text-[#333] transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-[#666] hover:text-[#333] transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-[#333] text-white text-sm font-medium rounded-full hover:bg-[#444] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 relative">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#e5e2dd]">
                <span className="w-2 h-2 bg-[#d4e4d1] rounded-full" />
                <span className="text-sm text-[#666]">
                  {hero.badge}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-semibold text-[#333] leading-[1.1]">
                {hero.headline.split(' ').slice(0, 2).join(' ')}{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">{hero.headline.split(' ').slice(2).join(' ')}</span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-3 text-[#f8e1d9]"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 6 Q25 2 50 6 T100 6"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-[#666] max-w-md leading-relaxed">
                {hero.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2 px-7 py-4 bg-[#333] text-white font-medium rounded-full hover:bg-[#444] transition-all hover:scale-[1.02]"
                >
                  {hero.primaryCTA}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-4 text-[#666] hover:text-[#333] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#e5e2dd] flex items-center justify-center">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                  {hero.secondaryCTA}
                </a>
              </div>

              <div className="pt-8">
                <p className="text-sm text-[#999] mb-3">
                  {hero.socialProof.label}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {hero.socialProof.companies.map((company) => (
                    <span key={company} className="text-sm text-[#666] font-medium">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#e5e2dd] overflow-hidden">
                {/* Mock slide preview */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[#fefbf6] to-[#f8e1d9]/30 p-8">
                  <div className="space-y-4">
                    <div className="w-20 h-1.5 bg-[#d4e4d1] rounded-full" />
                    <div className="w-56 h-5 bg-[#333]/10 rounded-lg" />
                    <div className="w-44 h-5 bg-[#333]/10 rounded-lg" />
                  </div>

                  <div className="mt-12 flex gap-4">
                    <div className="w-24 h-24 bg-[#f8e1d9] rounded-2xl" style={{ borderRadius: '40% 60% 55% 45% / 45% 55% 50% 50%' }} />
                    <div className="w-24 h-24 bg-[#d4e4d1] rounded-2xl" style={{ borderRadius: '55% 45% 50% 50% / 40% 60% 45% 55%' }} />
                    <div className="w-24 h-24 bg-[#e8e0f0] rounded-2xl" style={{ borderRadius: '45% 55% 45% 55% / 55% 45% 55% 45%' }} />
                  </div>
                </div>

                <div className="px-6 py-4 bg-white border-t border-[#e5e2dd] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#f8e1d9]" />
                    <span className="text-sm font-medium text-[#333]">Soft Canvas Theme</span>
                  </div>
                  <div className="flex gap-2">
                    {accents.map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 px-5 py-3 bg-white rounded-2xl shadow-lg border border-[#e5e2dd] flex items-center gap-3">
                <span className="text-3xl font-semibold text-[#333]">{hero.stats.archetypes}</span>
                <span className="text-xs text-[#666] leading-tight">{hero.stats.archetypesLabel.split(' ').join('<br/>')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4e4d1]/30 rounded-full text-sm text-[#666] mb-6">
              {features.sectionLabel}
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#333] mb-4">
              {features.headline}
            </h2>
            <p className="text-lg text-[#666]">
              {features.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              const accentColor = accents[index % accents.length];
              return (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-8 border border-[#e5e2dd] hover:border-[#d4e4d1] transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1"
                >
                  {Icon && (
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Icon className="w-7 h-7 text-[#333]" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-[#333] mb-3">{feature.headline}</h3>
                  <p className="text-[#666] leading-relaxed mb-4">{feature.copy}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fefbf6] rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    <span className="text-sm text-[#666]">{feature.benefit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#f8e1d9]/30 rounded-full text-sm text-[#666] mb-6">
              {howItWorks.sectionLabel}
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#333] mb-4">
              {howItWorks.headline}
            </h2>
            <p className="text-lg text-[#666]">
              {howItWorks.subheadline}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              const accentColor = accents[index % accents.length];
              return (
                <div key={index} className="relative text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
                    style={{ backgroundColor: accentColor }}
                  >
                    {Icon && <Icon className="w-8 h-8 text-[#333]" />}
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-full text-6xl font-bold text-[#f0f0f0]">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-[#333] mb-3">{step.title}</h3>
                  <p className="text-[#666] leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8e0f0]/30 rounded-full text-sm text-[#666] mb-6">
              {testimonials.sectionLabel}
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#333] mb-4">
              {testimonials.headline}
            </h2>
            <p className="text-lg text-[#666]">
              {testimonials.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.items.map((testimonial, index) => {
              const accentColor = accents[index % accents.length];
              return (
                <div key={index} className="bg-white rounded-3xl p-8 border border-[#e5e2dd]">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${accentColor}50` }}
                  >
                    <Quote className="w-5 h-5" style={{ color: '#666' }} />
                  </div>
                  <blockquote className="text-[#333] leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                      style={{ backgroundColor: accentColor }}
                    >
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[#333]">{testimonial.author}</p>
                      <p className="text-sm text-[#666]">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(135deg, #f8e1d9 0%, #d4e4d1 50%, #e8e0f0 100%)',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-8">
            <span className="w-2 h-2 bg-[#d4e4d1] rounded-full animate-pulse" />
            <span className="text-sm text-[#666]">{cta.badge}</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#333] mb-6 leading-tight">
            {cta.headline}<br />
            <span className="italic">{cta.headlineAccent}</span>
          </h2>

          <p className="text-lg text-[#666] mb-10 max-w-xl mx-auto">
            {cta.subheadline}
          </p>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#333] text-white font-medium rounded-full hover:bg-[#444] transition-all hover:scale-[1.02]"
          >
            {cta.buttonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-12 text-sm text-[#666] italic">
            {cta.tagline}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5e2dd]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-[#f8e1d9] rounded-xl flex items-center justify-center">
                  <span className="text-[#333] font-semibold text-sm">{brand.logoLetter}</span>
                </div>
                <span className="font-semibold text-[#333] text-lg">{brand.name}</span>
              </Link>
              <p className="text-sm text-[#666] mb-6 max-w-xs">
                {footer.tagline}
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-[#fefbf6] flex items-center justify-center text-[#666] hover:text-[#333] hover:bg-[#f8e1d9]/50 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footer.links).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.disabled ? (
                        <span className="text-sm text-[#ccc]">
                          {link.label} <span className="text-xs">(soon)</span>
                        </span>
                      ) : (
                        <Link to={link.href} className="text-sm text-[#666] hover:text-[#333] transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#e5e2dd] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#999]">{footer.copyright}</p>
            <p className="text-sm text-[#999] italic">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
