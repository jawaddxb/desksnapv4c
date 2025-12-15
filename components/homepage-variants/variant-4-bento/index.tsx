/**
 * Variant 4: Bento Grid Layout Homepage
 * Modern bento box grid with interactive cards and playful depth
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { ProcessSection } from './ProcessSection';
import { TestimonialCards } from './TestimonialCards';
import { CTASection } from './CTASection';
import { Logo } from '../shared/CommonComponents';
import { Menu } from 'lucide-react';

interface Variant4BentoProps {
  onGetStarted: () => void;
}

export default function Variant4Bento({ onGetStarted }: Variant4BentoProps) {
  return (
    <div className="min-h-screen bg-[#F5FAF7]">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#D4E5D4]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
      >
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Logo variant="dark" size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-[#4A5D4A] hover:text-[#1E2E1E] transition-colors text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#process"
              className="text-[#4A5D4A] hover:text-[#1E2E1E] transition-colors text-sm font-medium"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-[#4A5D4A] hover:text-[#1E2E1E] transition-colors text-sm font-medium"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-[#4A5D4A] hover:text-[#1E2E1E] transition-colors text-sm font-medium"
            >
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              className="text-[#4A5D4A] hover:text-[#1E2E1E] text-sm font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
            <motion.button
              className="px-6 py-2.5 bg-[#6B8E6B] text-white rounded-xl text-sm font-medium shadow-[0_4px_24px_rgba(107,142,107,0.2)] hover:bg-[#5A7A5A] transition-colors"
              onClick={onGetStarted}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-[#4A5D4A]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection onGetStarted={onGetStarted} />

        {/* Process Section */}
        <div id="process">
          <ProcessSection />
        </div>

        {/* Testimonials Section */}
        <div id="testimonials">
          <TestimonialCards />
        </div>

        {/* CTA Section */}
        <div id="pricing">
          <CTASection onGetStarted={onGetStarted} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1E2E1E] text-white px-8 py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <Logo variant="light" size="md" />
              <p className="mt-4 text-white/60 text-sm leading-relaxed">
                AI-powered presentations that help you tell better stories.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2025 DeckSnap. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
