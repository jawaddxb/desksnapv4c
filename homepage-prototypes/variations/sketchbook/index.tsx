/**
 * Sketchbook Homepage Variation
 *
 * Hand-drawn, personal feel with illustrated elements.
 * Inspired by artist notebooks and the hand-drawn design trend.
 * Cream paper, pencil gray, watercolor washes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send, Twitter, Linkedin, Github } from 'lucide-react';
import { HOMEPAGE_CONTENT } from '../../shared/content';

const { brand, hero, features, howItWorks, testimonials, cta, footer } = HOMEPAGE_CONTENT;

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Palette, Image, RefreshCw, MessageSquare, Layers, Send
};

// Hand-drawn underline SVG
const HandDrawnUnderline = ({ className, color = '#e8a87c' }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 8C30 4 60 6 90 5C120 4 150 7 198 3"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.6 }}
    />
  </svg>
);

// Hand-drawn circle
const HandDrawnCircle = ({ className, color = '#87b8c4' }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 5C70 3 95 20 97 50C99 80 75 97 50 95C25 93 3 75 5 50C7 25 30 7 50 5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill={color}
      fillOpacity="0.1"
    />
  </svg>
);

// Watercolor blob
const WatercolorBlob = ({ className, color }: { className?: string; color: string }) => (
  <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="watercolor" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <ellipse cx="100" cy="100" rx="80" ry="60" fill={color} filter="url(#watercolor)" opacity="0.3" />
  </svg>
);

export default function Sketchbook() {
  return (
    <div
      className="min-h-screen text-[#444] relative"
      style={{
        fontFamily: "'Caveat', 'DM Sans', sans-serif",
        backgroundColor: '#fdf6e8',
        backgroundImage: `
          radial-gradient(circle, #ddd 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Decorative watercolor blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <WatercolorBlob className="absolute top-20 right-20 w-64 h-64" color="#e8a87c" />
        <WatercolorBlob className="absolute bottom-40 left-10 w-48 h-48" color="#87b8c4" />
        <WatercolorBlob className="absolute top-1/2 right-1/3 w-56 h-56" color="#c9a0dc" />
      </div>

      {/* Navigation - Notebook style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdf6e8]/95 backdrop-blur-sm border-b-2 border-dashed border-[#ccc]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <HandDrawnCircle className="w-10 h-10" color="#e8a87c" />
              <span className="text-2xl font-bold text-[#333]" style={{ fontFamily: "'Caveat', cursive" }}>
                {brand.name}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-base text-[#666] hover:text-[#e8a87c] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Features</a>
              <a href="#process" className="text-base text-[#666] hover:text-[#e8a87c] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Process</a>
              <Link to="/themes" className="text-base text-[#666] hover:text-[#e8a87c] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Themes</Link>
              <Link to="/pricing" className="text-base text-[#666] hover:text-[#e8a87c] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-base text-[#666] hover:text-[#333] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-[#333] text-[#fdf6e8] text-sm rounded-full hover:bg-[#e8a87c] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border-2 border-dashed border-[#ccc]">
                <span className="text-xl">✨</span>
                <span className="text-sm text-[#666]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{hero.badge}</span>
              </div>

              <div className="relative">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-[#333]" style={{ fontFamily: "'Caveat', cursive" }}>
                  {hero.headline}
                </h1>
                <HandDrawnUnderline className="w-48 h-4 mt-2" color="#e8a87c" />
              </div>

              <p className="text-lg text-[#666] max-w-md leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {hero.subheadline}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#333] text-[#fdf6e8] rounded-full hover:bg-[#e8a87c] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {hero.primaryCTA}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#process"
                  className="inline-flex items-center gap-2 text-[#666] hover:text-[#e8a87c] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Play className="w-4 h-4" />
                  {hero.secondaryCTA}
                </a>
              </div>

              <div className="pt-8 border-t-2 border-dashed border-[#ddd]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#999] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {hero.socialProof.label}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {hero.socialProof.companies.map((company) => (
                    <span key={company} className="text-sm text-[#888]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual - Notebook page style */}
            <div className="relative">
              <div
                className="relative bg-white rounded-lg p-8 shadow-xl transform rotate-2"
                style={{
                  backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e8e8e8 31px, #e8e8e8 32px)`,
                  backgroundPosition: '0 24px',
                }}
              >
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#f5c4c4]" />
                <div className="pl-8 space-y-4">
                  <p className="text-4xl font-bold text-[#333]" style={{ fontFamily: "'Caveat', cursive" }}>
                    {hero.stats.archetypes}
                  </p>
                  <p className="text-lg text-[#666]" style={{ fontFamily: "'Caveat', cursive" }}>
                    {hero.stats.archetypesLabel}
                  </p>
                  <div className="flex gap-2 mt-4">
                    {['#e8a87c', '#87b8c4', '#c9a0dc'].map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color, opacity: 0.6 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Decorative tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#f5e6a3] opacity-70 transform -rotate-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Index card style */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xl">📝</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333] mt-4" style={{ fontFamily: "'Caveat', cursive" }}>
              {features.headline}
            </h2>
            <HandDrawnUnderline className="w-32 h-4 mx-auto mt-2" color="#87b8c4" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.items.map((feature, index) => {
              const Icon = iconMap[feature.iconName];
              const rotations = ['-rotate-1', 'rotate-1', 'rotate-0', '-rotate-2', 'rotate-2', '-rotate-1'];
              const colors = ['#e8a87c', '#87b8c4', '#c9a0dc', '#a8d5a2', '#f5c4c4', '#f5e6a3'];
              return (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-sm shadow-md transform ${rotations[index % rotations.length]} hover:rotate-0 transition-transform`}
                  style={{
                    backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, #f0f0f0 27px, #f0f0f0 28px)`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {Icon && (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors[index % colors.length], opacity: 0.3 }}
                      >
                        <Icon className="w-6 h-6" style={{ color: colors[index % colors.length] }} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-[#333] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                        {feature.headline}
                      </h3>
                      <p className="text-[#666] leading-relaxed mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {feature.copy}
                      </p>
                      <p className="text-sm italic text-[#999]" style={{ fontFamily: "'Caveat', cursive" }}>
                        → {feature.benefit}
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
      <section id="process" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xl">🎨</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333] mt-4" style={{ fontFamily: "'Caveat', cursive" }}>
              {howItWorks.headline}
            </h2>
            <HandDrawnUnderline className="w-32 h-4 mx-auto mt-2" color="#c9a0dc" />
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {howItWorks.steps.map((step, index) => {
              const Icon = iconMap[step.iconName];
              return (
                <div key={index} className="text-center relative">
                  {/* Hand-drawn number */}
                  <div
                    className="text-8xl font-bold text-[#333] opacity-10 absolute -top-4 left-1/2 -translate-x-1/2"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {step.number}
                  </div>
                  <div className="relative">
                    {Icon && (
                      <HandDrawnCircle className="w-20 h-20 mx-auto mb-4" color={['#e8a87c', '#87b8c4', '#c9a0dc'][index % 3]} />
                    )}
                    {Icon && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%]">
                        <Icon className="w-8 h-8 text-[#444]" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-[#333] mb-4 mt-6" style={{ fontFamily: "'Caveat', cursive" }}>
                    {step.title}
                  </h3>
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
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xl">💬</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333] mt-4" style={{ fontFamily: "'Caveat', cursive" }}>
              {testimonials.headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.items.map((testimonial, index) => {
              const rotations = ['rotate-1', '-rotate-1', 'rotate-2'];
              const tapeColors = ['#f5e6a3', '#f5c4c4', '#c4e8c4'];
              return (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-sm shadow-md relative transform ${rotations[index % rotations.length]}`}
                >
                  {/* Decorative tape */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-5 opacity-70 transform rotate-3"
                    style={{ backgroundColor: tapeColors[index % tapeColors.length] }}
                  />
                  <blockquote className="text-lg text-[#444] leading-relaxed mb-6 italic" style={{ fontFamily: "'Caveat', cursive" }}>
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center text-lg" style={{ fontFamily: "'Caveat', cursive" }}>
                      {testimonial.author.charAt(0)}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <p className="font-medium text-[#333]">{testimonial.author}</p>
                      <p className="text-sm text-[#888]">
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

      {/* CTA Section - Notebook page */}
      <section className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="bg-white rounded-lg p-12 shadow-xl relative transform -rotate-1"
            style={{
              backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e8e8e8 31px, #e8e8e8 32px)`,
              backgroundPosition: '0 24px',
            }}
          >
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#f5c4c4]" />

            {/* Decorative tape */}
            <div className="absolute -top-3 right-8 w-16 h-6 bg-[#f5e6a3] opacity-70 transform rotate-6" />
            <div className="absolute -top-3 left-8 w-16 h-6 bg-[#c4e8c4] opacity-70 transform -rotate-3" />

            <div className="pl-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf6e8] rounded-full border-2 border-dashed border-[#ccc] mb-6">
                <span className="w-2 h-2 bg-[#e8a87c] rounded-full animate-pulse" />
                <span className="text-sm text-[#666]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{cta.badge}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-[#333] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                {cta.headline}
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold text-[#e8a87c] mb-6" style={{ fontFamily: "'Caveat', cursive" }}>
                {cta.headlineAccent}
              </h2>

              <p className="text-lg text-[#666] mb-8 max-w-md mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {cta.subheadline}
              </p>

              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-[#333] text-[#fdf6e8] rounded-full hover:bg-[#e8a87c] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {cta.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="mt-8 text-sm text-[#999] italic" style={{ fontFamily: "'Caveat', cursive" }}>
                {cta.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fdf6e8] border-t-2 border-dashed border-[#ddd] relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <HandDrawnCircle className="w-10 h-10" color="#e8a87c" />
                <span className="text-2xl font-bold text-[#333]" style={{ fontFamily: "'Caveat', cursive" }}>
                  {brand.name}
                </span>
              </div>
              <p className="text-sm text-[#666] mb-6 max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {footer.tagline}
              </p>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#666] hover:text-[#e8a87c] transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footer.links).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-bold text-[#333] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
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
                        <Link to={link.href} className="text-sm text-[#666] hover:text-[#e8a87c] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-dashed border-[#ddd] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{footer.copyright}</p>
            <p className="text-sm text-[#999] italic" style={{ fontFamily: "'Caveat', cursive" }}>{footer.bottomTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
