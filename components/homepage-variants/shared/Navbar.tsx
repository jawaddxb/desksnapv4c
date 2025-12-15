/**
 * Shared Navbar Component
 * Used across all marketing pages (Features, Pricing, About, etc.)
 * Matches the Immersive/Bento Matcha design system
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from './CommonComponents';

interface NavbarProps {
  onLogin?: () => void;
  onSignup?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogin, onSignup }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/features', label: 'Features' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/themes', label: 'Themes' },
    { path: '/about', label: 'About' },
  ];

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#D4E5D4]/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/">
          <Logo variant="dark" size="md" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium transition-colors ${
                isActive(path)
                  ? 'text-[#1E2E1E]'
                  : 'text-[#4A5D4A] hover:text-[#1E2E1E]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            className="px-4 py-2 text-[#4A5D4A] text-sm font-medium hover:text-[#1E2E1E] transition-colors"
            onClick={onLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </motion.button>
          <motion.button
            className="px-6 py-2.5 bg-[#6B8E6B] text-white rounded-xl text-sm font-semibold hover:bg-[#5A7A5A] transition-all shadow-md"
            onClick={onSignup}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
