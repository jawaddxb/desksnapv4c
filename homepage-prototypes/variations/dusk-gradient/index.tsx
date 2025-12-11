/**
 * Dusk Gradient Homepage Variation
 *
 * Atmospheric twilight colors with dreamy depth.
 * Deep purple to rose gradients, soft orange accents.
 * Inspired by creative tools and atmospheric design.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Quote, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

export default function DuskGradient() {
  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: 'linear-gradient(135deg, #2d1b4e 0%, #4a2c6e 30%, #7b4a8e 60%, #e8b4bc 100%)',
      }}
    >
      {/* Ambient gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(244, 162, 97, 0.2) 0%, transparent 50%)',
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2d1b4e]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f4a261] to-[#e8b4bc] flex items-center justify-center">
                <span className="text-[#2d1b4e] font-bold text-sm">{brand.logoLetter}</span>
              </div>
              <span className="font-semibold text-white">{brand.name}</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">Process</a>
              <Link to="/themes" className="text-sm text-white/60 hover:text-white transition-colors">Themes</Link>
              <Link to="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-[#f4a261] text-[#2d1b4e] text-sm font-semibold rounded-lg hover:bg-[#e8b4bc] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="w-2 h-2 bg-[#f4a261] rounded-full animate-pulse" />
                <span className="text-sm text-white/80">{hero.badge}</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
                {hero.headline.split(' ').map((word, i) => (
                  <span
                    key={i}
                    className={i === 1 ? 'bg-gradient-to-r from-[#f4a261] via-[#e8b4bc] to-[#f4a261] bg-clip-text text-transparent' : ''}
                  >
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <p className="text-xl text-white/70 max-w-md leading-relaxed">
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#f4a261] text-[#2d1b4e] font-semibold rounded-lg hover:bg-[#e8b4bc] transition-colors"
                >
                  {hero.primaryCTA}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Play className="w-4 h-4" />
                  </div>
                  {hero.secondaryCTA}
                </a>
              </div>

              <div className="pt-12 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                  {hero.socialProof.label}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {hero.socialProof.companies.map((company) => (
                    <span key={company} className="text-sm text-white/40">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#4a2c6e]/50 to-[#7b4a8e]/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Decorative gradient orbs */}
                  <div className="absolute top-4 right-4 w-32 h-32 bg-[#f4a261]/30 rounded-full blur-3xl" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-[#e8b4bc]/30 rounded-full blur-2xl" />

                  <div className="relative text-center space-y-4">
                    <div className="text-7xl font-bold bg-gradient-to-r from-[#f4a261] to-[#e8b4bc] bg-clip-text text-transparent">
                      {hero.stats.archetypes}
                    </div>
                    <p className="text-sm text-white/60 uppercase tracking-[0.2em]">{hero.stats.archetypesLabel}</p>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#f4a261]/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#e8b4bc]/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm text-[#f4a261]">{features.sectionLabel}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {features.headline}
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {features.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-start gap-6">
                    {Icon && (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f4a261] to-[#e8b4bc] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-[#2d1b4e]" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{feature.headline}</h3>
                      <p className="text-white/60 leading-relaxed mb-4">{feature.copy}</p>
                      <p className="text-sm text-[#f4a261]">{feature.benefit}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(45, 27, 78, 0.5) 50%, transparent 100%)',
          }}
        />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm text-[#e8b4bc]">{howItWorks.sectionLabel}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {howItWorks.headline}
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {howItWorks.subheadline}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              return (
                <div key={index} className="text-center relative">
                  {/* Connector line */}
                  {index < howItWorks.steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}

                  <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#f4a261] to-[#e8b4bc] flex items-center justify-center text-[#2d1b4e] text-3xl font-bold">
                    {step.number}
                  </div>
                  {Icon && (
                    <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#f4a261]" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-sm text-[#f4a261]">{testimonials.sectionLabel}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              {testimonials.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <Quote className="w-8 h-8 text-[#f4a261]/50 mb-4" />
                <blockquote className="text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f4a261] to-[#e8b4bc] flex items-center justify-center text-[#2d1b4e] font-bold">
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
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#f4a261] via-[#e8b4bc] to-[#f4a261] rounded-[40px] p-12 md:p-16 text-center text-[#2d1b4e] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2d1b4e]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d1b4e]/10 rounded-full mb-8">
                <span className="w-2 h-2 bg-[#2d1b4e] rounded-full animate-pulse" />
                <span className="text-sm font-medium">{cta.badge}</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {cta.headline}
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 opacity-70">
                {cta.headlineAccent}
              </h2>

              <p className="text-xl text-[#2d1b4e]/80 mb-10 max-w-xl mx-auto">
                {cta.subheadline}
              </p>

              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-[#2d1b4e] text-white font-semibold rounded-xl hover:bg-[#4a2c6e] transition-colors"
              >
                {cta.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="mt-12 text-sm text-[#2d1b4e]/60">
                {cta.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d1b4e]/50 backdrop-blur-xl border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f4a261] to-[#e8b4bc] flex items-center justify-center">
                  <span className="text-[#2d1b4e] font-bold text-sm">{brand.logoLetter}</span>
                </div>
                <span className="font-semibold text-white">{brand.name}</span>
              </div>
              <p className="text-sm text-white/60 mb-6 max-w-xs">
                {footer.tagline}
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-[#f4a261] hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

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
                        <Link to={link.href} className="text-sm text-white/60 hover:text-[#f4a261] transition-colors">
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
            <p className="text-sm text-white/40">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
