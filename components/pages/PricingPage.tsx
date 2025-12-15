/**
 * PricingPage Component
 *
 * Pricing tiers with Bento Matcha aesthetic.
 */

import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Navbar, Footer } from '../homepage-variants/shared';

interface PricingPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

const pricingTiers = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'Try the full ideation-to-deck workflow',
    features: [
      '3 decks per month',
      'All three stages (ideate, draft, polish)',
      'Basic design patterns',
      'Web research (limited)',
      'Community support',
    ],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For professionals who build decks regularly',
    features: [
      'Unlimited decks',
      'Full design system access',
      'Research agents (web + X)',
      'Neutron knowledge layer',
      'Priority support',
      'Export to PPT, PDF, Keynote',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/user/month',
    description: 'For teams that need shared knowledge and brand consistency',
    features: [
      'Everything in Pro',
      'Team workspaces',
      'Shared Neutron knowledge base',
      'Brand kits and custom themes',
      'Admin controls',
      'Dedicated support',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'Can I try Pro before committing?',
    answer: 'Yes. Every Pro plan starts with a 14-day free trial. No credit card required.',
  },
  {
    question: 'What happens to my decks if I downgrade?',
    answer: 'Your decks remain accessible. You\'ll retain read access to everything you\'ve created.',
  },
  {
    question: 'Does Neutron store my data securely?',
    answer: 'Absolutely. All data is encrypted at rest and in transit. We never train models on your content.',
  },
  {
    question: 'Can I export to PowerPoint?',
    answer: 'Yes. Pro and Team plans support export to PPT, PDF, and Keynote formats.',
  },
];

export const PricingPage: React.FC<PricingPageProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-[#F5FAF7] text-[#1E2E1E]">
      <Navbar onLogin={() => onAuth('login')} onSignup={() => onAuth('register')} />

      <main className="pt-32">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#6B8E6B] mb-4 block">
            Pricing
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
            Simple pricing.{' '}
            <span className="text-[#8FA58F]">Start free.</span>
          </h1>
          <p className="text-xl text-[#4A5D4A] max-w-2xl mx-auto">
            Build better decks without the complexity of enterprise pricing.
          </p>
        </section>

        {/* Pricing Tiers */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 mb-32">
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-10 rounded-lg ${
                  tier.highlighted
                    ? 'bg-[#EDF5F0] border-t-2 border-[#6B8E6B] shadow-[0_4px_24px_rgba(107,142,107,0.08)]'
                    : 'bg-white shadow-[0_4px_24px_rgba(107,142,107,0.08)]'
                }`}
              >
                {/* Popular Badge */}
                {tier.highlighted && (
                  <div className="absolute -top-3 left-10 px-3 py-1 bg-[#6B8E6B] text-white text-xs uppercase tracking-[0.1em] rounded">
                    Popular
                  </div>
                )}

                {/* Tier Header */}
                <div className="mb-8">
                  <h3 className="text-xl font-light mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-[#8FA58F]">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-light">
                    {tier.price}
                  </span>
                  <span className="text-[#8FA58F] ml-1">
                    {tier.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-4 h-4 border border-[#D4E5D4] flex items-center justify-center flex-shrink-0 mt-0.5 rounded-sm">
                        <Check className="w-2.5 h-2.5 text-[#6B8E6B]" />
                      </div>
                      <span className="text-sm text-[#4A5D4A]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => onAuth('register')}
                  className={`w-full py-3 font-medium transition-colors rounded ${
                    tier.highlighted
                      ? 'bg-[#6B8E6B] text-white hover:bg-[#5A7A5A]'
                      : 'bg-[#1E2E1E] text-white hover:bg-[#6B8E6B]'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-[#EDF5F0]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#6B8E6B] mb-4 block">
                FAQ
              </span>
              <h2 className="text-4xl md:text-5xl font-light">
                Common Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-[0_4px_24px_rgba(107,142,107,0.08)]"
                >
                  <h3 className="text-lg font-light mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-[#4A5D4A]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-t border-[#D4E5D4]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-light mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-[#4A5D4A] mb-8">
              We're here to help. Reach out anytime.
            </p>
            <a
              href="mailto:hello@decksnap.com"
              className="inline-flex items-center gap-2 text-[#1E2E1E] hover:text-[#6B8E6B] transition-colors group"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
