/**
 * LandingPage Component
 *
 * Main container for the marketing landing page.
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { FeaturesPreview } from './FeaturesPreview';
import { HowItWorks } from './HowItWorks';
import { ThemesPreview } from './ThemesPreview';
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
        <HeroSection onGetStarted={handleSignup} />
        <FeaturesPreview />
        <HowItWorks />
        <ThemesPreview />
        <TestimonialsSection />
        <CTASection onGetStarted={handleSignup} />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
