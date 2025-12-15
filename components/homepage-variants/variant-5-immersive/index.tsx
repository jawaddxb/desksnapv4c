/**
 * Variant 5: Immersive Full-Bleed Homepage
 *
 * Features full-screen sections with dramatic visual impact and smooth scroll-snap navigation.
 * Each section fills the viewport with bold color transitions and cinematic typography.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../shared/CommonComponents';
import { ScrollIndicator } from './ScrollIndicator';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { ProcessSection } from './ProcessSection';
import { TestimonialsSection } from './TestimonialsSection';
import { CTASection } from './CTASection';

interface Variant5ImmersiveProps {
  onAuth?: (mode: 'login' | 'register') => void;
  onGetStarted?: () => void;
}

export default function Variant5Immersive({ onAuth, onGetStarted }: Variant5ImmersiveProps) {
  const handleLogin = () => onAuth?.('login');
  const handleSignup = () => onAuth?.('register') ?? onGetStarted?.();
  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="relative bg-white">
      {/* Fixed Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#D4E5D4]/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Logo variant="dark" size="md" />

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/features"
              className="text-sm font-medium text-[#4A5D4A] hover:text-[#1E2E1E] transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-[#4A5D4A] hover:text-[#1E2E1E] transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/themes"
              className="text-sm font-medium text-[#4A5D4A] hover:text-[#1E2E1E] transition-colors"
            >
              Themes
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-[#4A5D4A] hover:text-[#1E2E1E] transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              className="px-4 py-2 text-[#4A5D4A] text-sm font-medium hover:text-[#1E2E1E] transition-colors"
              onClick={handleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Log In
            </motion.button>
            <motion.button
              className="px-6 py-2.5 bg-[#6B8E6B] text-white rounded-xl text-sm font-semibold hover:bg-[#5A7A5A] transition-all shadow-md"
              onClick={handleSignup}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Scroll Indicator Navigation */}
      <ScrollIndicator />

      {/* Main Content - Scroll Snap Container */}
      <main className="snap-y snap-mandatory h-screen overflow-y-scroll">
        <HeroSection onGetStarted={handleSignup} />
        <ProblemSection />
        <ProcessSection />
        <TestimonialsSection />
        <CTASection onGetStarted={handleSignup} />
      </main>

      {/* Footer (not full-screen, appears after scroll) */}
      <footer className="bg-[#1E2E1E] text-white py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <Logo variant="light" size="md" />
              <p className="text-sm text-white/60 leading-relaxed">
                AI-powered presentation creation that adapts to your workflow.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Themes</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">
              2024 DeckSnap. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                GitHub
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Named export for use as main landing page
export { Variant5Immersive as ImmersiveLandingPage };
