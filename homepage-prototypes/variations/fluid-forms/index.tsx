/**
 * Fluid Forms Homepage Variation
 *
 * Flowing gradients, organic blob shapes, nature-meets-digital.
 * Inspired by the Organic Matter design trend.
 * Natural, flowing, like water - soft and inviting.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

// Organic blob shapes as SVG
const BlobShape = ({ className, color }: { className?: string; color: string }) => (
  <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path
      fill={color}
      d="M45.3,-51.2C58.3,-42.1,68.5,-26.9,71.1,-10.4C73.7,6.1,68.8,23.8,58.4,36.7C48,49.6,32.1,57.6,15.4,61.8C-1.4,66,-19,66.4,-33.5,59.6C-48,52.9,-59.5,39,-65.5,22.7C-71.5,6.4,-72,-12.3,-64.7,-27.1C-57.4,-41.9,-42.2,-52.8,-26.8,-60.9C-11.4,-69,4.2,-74.2,18.7,-70.8C33.2,-67.4,46.6,-55.3,45.3,-51.2Z"
      transform="translate(100 100)"
    />
  </svg>
);

export default function FluidForms() {
  return (
    <div
      className="min-h-screen text-[#2d3748] relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: 'linear-gradient(135deg, #f0f9f4 0%, #e8f4fc 50%, #f5f0fa 100%)',
      }}
    >
      {/* Floating organic blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <BlobShape
          className="absolute -top-32 -right-32 w-[500px] h-[500px] opacity-30 animate-pulse"
          color="#9cb686"
        />
        <BlobShape
          className="absolute top-1/3 -left-48 w-[400px] h-[400px] opacity-20"
          color="#87ceeb"
        />
        <BlobShape
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] opacity-20"
          color="#b4a7d6"
        />
      </div>

      {/* Navigation - Frosted glass */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9cb686] to-[#87ceeb] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{brand.logoLetter}</span>
              </div>
              <span className="font-medium text-[#2d3748]">{brand.name}</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#666] hover:text-[#9cb686] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-[#666] hover:text-[#9cb686] transition-colors">How It Works</a>
              <Link to="/themes" className="text-sm text-[#666] hover:text-[#9cb686] transition-colors">Themes</Link>
              <Link to="/pricing" className="text-sm text-[#666] hover:text-[#9cb686] transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-[#666] hover:text-[#2d3748] transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-gradient-to-r from-[#9cb686] to-[#87ceeb] text-white text-sm rounded-full hover:shadow-lg hover:shadow-[#9cb686]/30 transition-all"
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50">
                <span className="w-2 h-2 bg-[#9cb686] rounded-full animate-pulse" />
                <span className="text-sm text-[#666]">{hero.badge}</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-[#2d3748]">
                {hero.headline.split(' ').map((word, i) => (
                  <span
                    key={i}
                    className={i === 1 ? 'bg-gradient-to-r from-[#9cb686] via-[#87ceeb] to-[#b4a7d6] bg-clip-text text-transparent' : ''}
                  >
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <p className="text-xl text-[#666] max-w-md leading-relaxed">
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#9cb686] to-[#87ceeb] text-white rounded-full hover:shadow-xl hover:shadow-[#9cb686]/30 transition-all"
                >
                  {hero.primaryCTA}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-[#666] hover:text-[#9cb686] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center border border-white/50">
                    <Play className="w-4 h-4" />
                  </div>
                  {hero.secondaryCTA}
                </a>
              </div>

              <div className="pt-12">
                <p className="text-xs uppercase tracking-[0.2em] text-[#999] mb-4">
                  {hero.socialProof.label}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {hero.socialProof.companies.map((company) => (
                    <span key={company} className="text-sm text-[#888]">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl shadow-[#9cb686]/10">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#f0f9f4] to-[#f5f0fa] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <BlobShape
                    className="absolute top-0 right-0 w-48 h-48 opacity-40"
                    color="#87ceeb"
                  />
                  <div className="relative text-center space-y-4 p-8">
                    <div className="text-6xl font-bold bg-gradient-to-r from-[#9cb686] via-[#87ceeb] to-[#b4a7d6] bg-clip-text text-transparent">
                      {hero.stats.archetypes}
                    </div>
                    <p className="text-sm text-[#666] uppercase tracking-[0.2em]">{hero.stats.archetypesLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 mb-6">
              <span className="text-sm text-[#9cb686]">{features.sectionLabel}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#2d3748] mb-4">
              {features.headline}
            </h2>
            <p className="text-xl text-[#666] max-w-2xl mx-auto">
              {features.subheadline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              const gradients = [
                'from-[#9cb686]/20 to-transparent',
                'from-[#87ceeb]/20 to-transparent',
                'from-[#b4a7d6]/20 to-transparent',
                'from-[#9cb686]/20 to-transparent',
                'from-[#87ceeb]/20 to-transparent',
                'from-[#b4a7d6]/20 to-transparent',
              ];
              return (
                <div
                  key={index}
                  className={`bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/50 hover:bg-white/70 transition-all group bg-gradient-to-br ${gradients[index % gradients.length]}`}
                >
                  {Icon && (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9cb686] to-[#87ceeb] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-[#2d3748] mb-3">{feature.headline}</h3>
                  <p className="text-[#666] leading-relaxed mb-4">{feature.copy}</p>
                  <p className="text-sm text-[#9cb686]">{feature.benefit}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 mb-6">
              <span className="text-sm text-[#87ceeb]">{howItWorks.sectionLabel}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#2d3748] mb-4">
              {howItWorks.headline}
            </h2>
            <p className="text-xl text-[#666] max-w-2xl mx-auto">
              {howItWorks.subheadline}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              const colors = ['#9cb686', '#87ceeb', '#b4a7d6'];
              return (
                <div key={index} className="text-center">
                  <div
                    className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  >
                    {step.number}
                  </div>
                  {Icon && (
                    <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                      <Icon className="w-7 h-7" style={{ color: colors[index % colors.length] }} />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-[#2d3748] mb-4">{step.title}</h3>
                  <p className="text-[#666] leading-relaxed">{step.description}</p>
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
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 mb-6">
              <span className="text-sm text-[#b4a7d6]">{testimonials.sectionLabel}</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#2d3748]">
              {testimonials.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/50"
              >
                <blockquote className="text-lg text-[#2d3748] leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9cb686] to-[#87ceeb] flex items-center justify-center text-white font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[#2d3748]">{testimonial.author}</p>
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
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#9cb686] via-[#87ceeb] to-[#b4a7d6] rounded-[40px] p-12 md:p-16 text-center text-white relative overflow-hidden">
            <BlobShape
              className="absolute -top-24 -right-24 w-64 h-64 opacity-20"
              color="#ffffff"
            />
            <BlobShape
              className="absolute -bottom-24 -left-24 w-64 h-64 opacity-20"
              color="#ffffff"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm">{cta.badge}</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
                {cta.headline}
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 opacity-80">
                {cta.headlineAccent}
              </h2>

              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                {cta.subheadline}
              </p>

              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-[#2d3748] font-semibold rounded-full hover:shadow-2xl transition-all"
              >
                {cta.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="mt-12 text-sm text-white/60">
                {cta.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-xl border-t border-white/50 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9cb686] to-[#87ceeb] flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{brand.logoLetter}</span>
                </div>
                <span className="font-medium text-[#2d3748]">{brand.name}</span>
              </div>
              <p className="text-sm text-[#666] mb-6 max-w-xs">
                {footer.tagline}
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-[#666] hover:text-[#9cb686] hover:bg-white transition-colors"
                  >
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
                        <span className="text-sm text-[#ccc]">
                          {link.label} <span className="text-xs">(soon)</span>
                        </span>
                      ) : (
                        <Link to={link.href} className="text-sm text-[#666] hover:text-[#9cb686] transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#999]">{footer.copyright}</p>
            <p className="text-sm text-[#999]">{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
