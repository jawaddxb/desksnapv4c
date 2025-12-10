/**
 * PricingPage Component
 *
 * Pricing tiers with Wabi-Sabi aesthetic.
 * 3-tier structure with FAQ section.
 */

import React from 'react';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fafaf8]">
      <LandingNavbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-24 md:pt-32">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a1a2e] mb-6">
            Simple Pricing.{' '}
            <span className="text-[#6b6b6b]">No Surprises.</span>
          </h1>
          <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto">
            Start free. Upgrade when you need to. No credit card required.
          </p>
        </section>

        {/* Pricing Tiers */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 mb-24">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 transition-all duration-500 ${
                  tier.highlighted
                    ? 'bg-[#1a1a2e] text-white border-2 border-[#d4af37] scale-105 shadow-xl'
                    : 'bg-white border border-[#e5e2dd] hover:border-[#d4af37]/30 hover:shadow-lg'
                }`}
              >
                {/* Popular Badge */}
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#d4af37] text-[#1a1a2e] text-xs font-bold uppercase tracking-widest rounded-full">
                    Most Popular
                  </div>
                )}

                {/* Tier Header */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-2 ${
                    tier.highlighted ? 'text-white' : 'text-[#1a1a2e]'
                  }`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm ${
                    tier.highlighted ? 'text-white/60' : 'text-[#6b6b6b]'
                  }`}>
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${
                    tier.highlighted ? 'text-white' : 'text-[#1a1a2e]'
                  }`}>
                    {tier.price}
                  </span>
                  <span className={tier.highlighted ? 'text-white/60' : 'text-[#6b6b6b]'}>
                    {tier.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        tier.highlighted ? 'bg-[#d4af37]/20' : 'bg-[#d4af37]/10'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          tier.highlighted ? 'text-[#d4af37]' : 'text-[#d4af37]'
                        }`} />
                      </div>
                      <span className={tier.highlighted ? 'text-white/80' : 'text-[#6b6b6b]'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => onAuth('register')}
                  className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${
                    tier.highlighted
                      ? 'bg-[#d4af37] text-[#1a1a2e] hover:bg-[#e5c348]'
                      : 'bg-[#1a1a2e] text-white hover:bg-[#2a2a3e]'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-[#f5f3ef]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4 block">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e]">
                Common Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-[#e5e2dd]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a1a2e] mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-[#6b6b6b]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-[#fafaf8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-[#6b6b6b] mb-8">
              We're here to help. Reach out anytime.
            </p>
            <a
              href="mailto:hello@decksnap.com"
              className="inline-flex items-center gap-2 text-[#1a1a2e] font-medium hover:text-[#d4af37] transition-colors duration-300 group"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default PricingPage;
