/**
 * PricingPage Component
 *
 * Pricing tiers with Studio Noir aesthetic.
 */

import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { FooterSection } from '../landing/FooterSection';

interface PricingPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

const pricingTiers = [
  {
    name: 'Sketcher',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out DeckSnap',
    features: [
      '5 presentations',
      'All 60+ archetypes',
      'AI content generation',
      'Basic image generation',
      'Export to PowerPoint',
      'Community support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Creator',
    price: '$19',
    period: '/month',
    description: 'For individuals who present regularly',
    features: [
      'Unlimited presentations',
      'All 60+ archetypes',
      'Priority AI generation',
      'Advanced image styles (20+)',
      'Cloud storage & sync',
      'Presentation analytics',
      'Priority support',
    ],
    cta: 'Start 14-Day Free Trial',
    highlighted: true,
  },
  {
    name: 'Studio',
    price: '$49',
    period: '/month',
    description: 'For teams that create together',
    features: [
      'Everything in Creator',
      'Team collaboration (up to 10)',
      'Shared theme library',
      'Brand customization',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, absolutely. No contracts, no hidden fees. Cancel whenever you want.',
  },
  {
    question: 'What happens to my presentations if I downgrade?',
    answer: 'Your presentations are yours forever. If you downgrade, you\'ll keep access to everything you\'ve created.',
  },
  {
    question: 'Do you offer education or nonprofit discounts?',
    answer: 'Yes! We offer 50% off Creator plans for educators, students, and nonprofits. Contact us to apply.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. All data is encrypted at rest and in transit. We never share your content with third parties.',
  },
  {
    question: 'Can I try Creator features before committing?',
    answer: 'Yes! Our 14-day free trial gives you full access to all Creator features. No credit card required.',
  },
];

export const PricingPage: React.FC<PricingPageProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-32">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
            Pricing
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
            Simple Pricing.{' '}
            <span className="text-white/40">No Surprises.</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Start free. Upgrade when you need to. No credit card required.
          </p>
        </section>

        {/* Pricing Tiers */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 mb-32">
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-10 ${
                  tier.highlighted
                    ? 'bg-[#111111] border-t-2 border-[#c5a47e]'
                    : 'bg-black'
                }`}
              >
                {/* Popular Badge */}
                {tier.highlighted && (
                  <div className="absolute -top-3 left-10 px-3 py-1 bg-[#c5a47e] text-black text-xs uppercase tracking-[0.1em]">
                    Popular
                  </div>
                )}

                {/* Tier Header */}
                <div className="mb-8">
                  <h3 className="text-xl font-light mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-white/40">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-light">
                    {tier.price}
                  </span>
                  <span className="text-white/40 ml-1">
                    {tier.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-4 h-4 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#c5a47e]" />
                      </div>
                      <span className="text-sm text-white/60">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => onAuth('register')}
                  className={`w-full py-3 font-medium transition-colors ${
                    tier.highlighted
                      ? 'bg-[#c5a47e] text-black hover:bg-white'
                      : 'bg-white text-black hover:bg-[#c5a47e]'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-[#111111]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
                FAQ
              </span>
              <h2 className="text-4xl md:text-5xl font-light">
                Common Questions
              </h2>
            </div>

            <div className="space-y-px bg-white/10">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#111111] p-8"
                >
                  <h3 className="text-lg font-light mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-white/60">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-light mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              We're here to help. Reach out anytime.
            </p>
            <a
              href="mailto:hello@decksnap.com"
              className="inline-flex items-center gap-2 text-white hover:text-[#c5a47e] transition-colors group"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default PricingPage;
