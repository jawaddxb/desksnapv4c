/**
 * LandingNavbar Component
 *
 * Fixed top navigation for the landing page.
 * Studio Noir aesthetic - black, white, gold.
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
    { label: 'Product', href: '/#how-it-works', isAnchor: true },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-black font-bold text-sm">D</span>
            </div>
            <span className="font-medium text-white tracking-tight">
              DeckSnap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <button
                  key={link.href}
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onLogin}
              className="text-sm text-white/60 hover:text-white transition-colors duration-150"
            >
              Sign In
            </button>
            <button
              onClick={onSignup}
              className="px-5 py-2.5 bg-white text-black text-sm font-medium hover:bg-[#c5a47e] transition-colors duration-150"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            link.isAnchor ? (
              <button
                key={link.href}
                onClick={() => scrollToSection('how-it-works')}
                className="block text-base text-white/60 hover:text-white transition-colors text-left w-full"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
          <hr className="border-white/10" />
          <button
            onClick={() => {
              onLogin();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-base text-white/60 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              onSignup();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full px-5 py-3 bg-white text-black text-base font-medium text-center hover:bg-[#c5a47e] transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
