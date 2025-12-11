/**
 * LandingPage Component
 *
 * Main container for the marketing landing page.
 * New narrative: "Decks that think with you"
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { HowItWorks } from './HowItWorks';
import { DesignPhilosophySection } from './DesignPhilosophySection';
import { ResearchSection } from './ResearchSection';
import { NeutronSection } from './NeutronSection';
import { AudienceSection } from './AudienceSection';
import { TestimonialsSection } from './TestimonialsSection';
import { CTASection } from './CTASection';
import { FooterSection } from './FooterSection';

interface LandingPageProps {
  onAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  const handleLogin = () => onAuth('login');
  const handleSignup = () => onAuth('register');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <LandingNavbar onLogin={handleLogin} onSignup={handleSignup} />

      {/* Main Content */}
      <main>
        {/* Hero: "Decks that think with you" */}
        <HeroSection onGetStarted={handleSignup} />

        {/* Problem: "Most AI deck tools skip the thinking" */}
        <ProblemSection />

        {/* How It Works: Three stages - Ideate, Draft, Polish */}
        <HowItWorks />

        {/* Design Philosophy: Wabi-sabi teaser */}
        <DesignPhilosophySection />

        {/* Research Integration: Grok-powered research */}
        <ResearchSection />

        {/* Neutron: Knowledge layer integration */}
        <NeutronSection />

        {/* Who It's For: Target audiences */}
        <AudienceSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA */}
        <CTASection onGetStarted={handleSignup} />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
