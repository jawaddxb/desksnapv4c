/**
 * LandingNavbar Component
 *
 * Fixed top navigation for the landing page.
 * Wabi-Sabi aesthetic with organic transitions.
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface LandingNavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLogin, onSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Themes', href: '/themes' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate there first
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#fafaf8]/95 backdrop-blur-md border-b border-[#e5e2dd]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-[#1a1a2e] rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <span className="text-[#d4af37] font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-[#1a1a2e] text-lg tracking-tight">
              DeckSnap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a2e] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onLogin}
              className="text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a2e] transition-colors duration-300"
            >
              Sign In
            </button>
            <button
              onClick={onSignup}
              className="px-5 py-2.5 bg-[#1a1a2e] text-white text-sm font-medium rounded-full hover:bg-[#2a2a3e] transition-all duration-300 hover:scale-[1.02]"
            >
              Start Creating Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1a1a2e]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#fafaf8] border-b border-[#e5e2dd] transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium text-[#6b6b6b] hover:text-[#1a1a2e] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-[#e5e2dd]" />
          <button
            onClick={() => {
              onLogin();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-base font-medium text-[#6b6b6b] hover:text-[#1a1a2e] transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              onSignup();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full px-5 py-3 bg-[#1a1a2e] text-white text-base font-medium rounded-full text-center"
          >
            Start Creating Free
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
