/**
 * Common Components for Homepage Variants
 * Shared buttons, logos, and decorative elements
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { tokens, tw } from './tokens';

// ============================================================================
// BUTTONS
// ============================================================================

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all';

  const variants = {
    primary: 'bg-[#6B8E6B] text-white hover:bg-[#5A7A5A] shadow-[0_4px_24px_rgba(107,142,107,0.2)]',
    secondary: 'bg-white text-[#1E2E1E] border border-[#D4E5D4] hover:bg-[#EDF5F0] hover:border-[#C0D6C0]',
    ghost: 'text-[#4A5D4A] hover:text-[#1E2E1E] hover:bg-[#EDF5F0]',
    outline: 'border-2 border-[#6B8E6B] text-[#6B8E6B] hover:bg-[#6B8E6B] hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </motion.button>
  );
};

// ============================================================================
// LOGO
// ============================================================================

interface LogoProps {
  variant?: 'dark' | 'light' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const colors = {
    dark: '#1E2E1E',
    light: '#FFFFFF',
    accent: '#6B8E6B',
  };

  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 ${sizes[size]}`}>
      <motion.div
        className="relative"
        whileHover={{ rotate: 5 }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="24" height="24" rx="6" fill={colors[variant]} fillOpacity="0.1" />
          <rect x="5" y="8" width="18" height="12" rx="2" stroke={colors[variant]} strokeWidth="2" />
          <rect x="8" y="11" width="6" height="3" rx="1" fill={colors[variant]} />
          <rect x="8" y="15" width="12" height="2" rx="1" fill={colors[variant]} fillOpacity="0.5" />
        </svg>
      </motion.div>
      <span className="font-semibold tracking-tight" style={{ color: colors[variant] }}>
        DeckSnap
      </span>
    </div>
  );
};

// ============================================================================
// SVG ILLUSTRATIONS
// ============================================================================

// Abstract presentation mockup
export const PresentationIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main slide frame */}
    <motion.rect
      x="40" y="30" width="320" height="200" rx="12"
      fill="#FFFFFF"
      stroke="#D4E5D4"
      strokeWidth="2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    {/* Content blocks */}
    <motion.rect
      x="60" y="60" width="120" height="12" rx="4"
      fill="#6B8E6B"
      initial={{ width: 0 }}
      animate={{ width: 120 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    />
    <motion.rect
      x="60" y="85" width="200" height="8" rx="4"
      fill="#D4E5D4"
      initial={{ width: 0 }}
      animate={{ width: 200 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    />
    <motion.rect
      x="60" y="100" width="160" height="8" rx="4"
      fill="#EDF5F0"
      initial={{ width: 0 }}
      animate={{ width: 160 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    />
    {/* Image placeholder */}
    <motion.rect
      x="60" y="130" width="140" height="80" rx="8"
      fill="#6B8E6B"
      fillOpacity="0.1"
      stroke="#6B8E6B"
      strokeWidth="1"
      strokeDasharray="4 4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    />
    {/* Decorative elements */}
    <motion.circle
      cx="300" cy="180" r="30"
      fill="#6B8E6B"
      fillOpacity="0.2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    />
    {/* Slide indicators */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x="170" y="250" width="20" height="6" rx="3" fill="#6B8E6B" />
      <rect x="195" y="250" width="20" height="6" rx="3" fill="#D4E5D4" />
      <rect x="220" y="250" width="20" height="6" rx="3" fill="#D4E5D4" />
    </motion.g>
  </svg>
);

// Workflow illustration (Ideate -> Draft -> Polish)
export const WorkflowIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Step 1: Ideate - Sticky notes */}
    <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
      <rect x="30" y="50" width="140" height="100" rx="12" fill="#F5FAF7" stroke="#D4E5D4" strokeWidth="2" />
      {/* Sticky notes */}
      <rect x="50" y="70" width="40" height="30" rx="4" fill="#FBBF24" fillOpacity="0.3" stroke="#FBBF24" strokeOpacity="0.5" />
      <rect x="95" y="75" width="40" height="30" rx="4" fill="#60A5FA" fillOpacity="0.3" stroke="#60A5FA" strokeOpacity="0.5" />
      <rect x="60" y="105" width="40" height="30" rx="4" fill="#4ADE80" fillOpacity="0.3" stroke="#4ADE80" strokeOpacity="0.5" />
      <rect x="105" y="110" width="40" height="30" rx="4" fill="#F472B6" fillOpacity="0.3" stroke="#F472B6" strokeOpacity="0.5" />
      <text x="100" y="175" textAnchor="middle" className="text-xs fill-[#8FA58F]" fontFamily="Inter">Ideate</text>
    </motion.g>

    {/* Arrow 1 */}
    <motion.path
      d="M180 100 L220 100"
      stroke="#6B8E6B"
      strokeWidth="2"
      strokeDasharray="4 4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    />
    <motion.polygon
      points="220,96 228,100 220,104"
      fill="#6B8E6B"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    />

    {/* Step 2: Draft - Slides */}
    <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <rect x="230" y="50" width="140" height="100" rx="12" fill="#FFFFFF" stroke="#D4E5D4" strokeWidth="2" />
      {/* Draft slides */}
      <rect x="250" y="65" width="50" height="35" rx="4" fill="#EDF5F0" stroke="#D4E5D4" />
      <rect x="265" y="80" width="50" height="35" rx="4" fill="#EDF5F0" stroke="#D4E5D4" />
      <rect x="280" y="95" width="50" height="35" rx="4" fill="#FFFFFF" stroke="#6B8E6B" strokeWidth="1.5" />
      <text x="300" y="175" textAnchor="middle" className="text-xs fill-[#8FA58F]" fontFamily="Inter">Draft</text>
    </motion.g>

    {/* Arrow 2 */}
    <motion.path
      d="M380 100 L420 100"
      stroke="#6B8E6B"
      strokeWidth="2"
      strokeDasharray="4 4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    />
    <motion.polygon
      points="420,96 428,100 420,104"
      fill="#6B8E6B"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
    />

    {/* Step 3: Polish - Final deck */}
    <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <rect x="430" y="50" width="140" height="100" rx="12" fill="#6B8E6B" fillOpacity="0.1" stroke="#6B8E6B" strokeWidth="2" />
      {/* Polished slide */}
      <rect x="450" y="65" width="100" height="70" rx="6" fill="#FFFFFF" stroke="#6B8E6B" />
      <rect x="460" y="75" width="40" height="6" rx="3" fill="#6B8E6B" />
      <rect x="460" y="85" width="60" height="4" rx="2" fill="#D4E5D4" />
      <rect x="460" y="95" width="50" height="4" rx="2" fill="#EDF5F0" />
      <circle cx="520" cy="115" r="12" fill="#6B8E6B" fillOpacity="0.2" />
      <text x="500" y="175" textAnchor="middle" className="text-xs fill-[#8FA58F]" fontFamily="Inter">Polish</text>
    </motion.g>
  </svg>
);

// Decorative blob shape
export const BlobShape: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#6B8E6B',
}) => (
  <motion.svg
    className={className}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    animate={{
      borderRadius: [
        '60% 40% 55% 45% / 55% 45% 60% 40%',
        '40% 60% 45% 55% / 45% 55% 40% 60%',
        '55% 45% 60% 40% / 60% 40% 55% 45%',
        '45% 55% 40% 60% / 40% 60% 45% 55%',
        '60% 40% 55% 45% / 55% 45% 60% 40%',
      ],
    }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
  >
    <motion.path
      fill={color}
      fillOpacity="0.15"
      d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-1C87,14.4,81.4,28.7,73.2,41.8C65,54.9,54.2,66.8,41.1,74.5C28,82.2,12.6,85.7,-2.4,89.6C-17.4,93.5,-34.8,97.8,-48.5,90.4C-62.2,83,-72.2,63.9,-79.6,44.5C-87,25.1,-91.8,5.4,-89.6,-13.1C-87.4,-31.6,-78.2,-48.9,-65,-61.5C-51.8,-74.1,-34.6,-82,-18.1,-82.9C-1.6,-83.8,14.2,-77.7,30.6,-82.3C47,-86.9,64,-83.6,44.7,-76.4Z"
      transform="translate(100 100)"
      animate={{
        d: [
          'M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-1C87,14.4,81.4,28.7,73.2,41.8C65,54.9,54.2,66.8,41.1,74.5C28,82.2,12.6,85.7,-2.4,89.6C-17.4,93.5,-34.8,97.8,-48.5,90.4C-62.2,83,-72.2,63.9,-79.6,44.5C-87,25.1,-91.8,5.4,-89.6,-13.1C-87.4,-31.6,-78.2,-48.9,-65,-61.5C-51.8,-74.1,-34.6,-82,-18.1,-82.9C-1.6,-83.8,14.2,-77.7,30.6,-82.3C47,-86.9,64,-83.6,44.7,-76.4Z',
          'M39.9,-67.4C53.1,-61.4,66,-52.6,74.3,-40.6C82.6,-28.5,86.3,-14.3,85.2,-0.6C84.2,13,78.4,26.1,70.4,37.7C62.3,49.3,52,59.5,39.6,66.5C27.2,73.5,12.8,77.3,-1.9,80.1C-16.6,82.9,-33.2,84.7,-46.4,78.1C-59.6,71.5,-69.4,56.5,-76.2,40.5C-83,24.5,-86.8,7.5,-84.8,-8.7C-82.8,-24.9,-75,-40.3,-63.4,-50.2C-51.8,-60.1,-36.4,-64.5,-22.3,-67.5C-8.2,-70.5,4.6,-72.1,17.2,-70.8C29.8,-69.5,42.2,-65.3,39.9,-67.4Z',
          'M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-1C87,14.4,81.4,28.7,73.2,41.8C65,54.9,54.2,66.8,41.1,74.5C28,82.2,12.6,85.7,-2.4,89.6C-17.4,93.5,-34.8,97.8,-48.5,90.4C-62.2,83,-72.2,63.9,-79.6,44.5C-87,25.1,-91.8,5.4,-89.6,-13.1C-87.4,-31.6,-78.2,-48.9,-65,-61.5C-51.8,-74.1,-34.6,-82,-18.1,-82.9C-1.6,-83.8,14.2,-77.7,30.6,-82.3C47,-86.9,64,-83.6,44.7,-76.4Z',
        ],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.svg>
);

// Floating decorative shapes
export const FloatingShapes: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <motion.div
      className="absolute w-64 h-64 rounded-full bg-[#6B8E6B]/5"
      style={{ top: '10%', right: '-5%' }}
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute w-48 h-48 rounded-full bg-[#6B8E6B]/10"
      style={{ bottom: '15%', left: '-3%' }}
      animate={{ y: [0, 15, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
    <motion.div
      className="absolute w-32 h-32 rounded-xl bg-[#D4E5D4]/30 rotate-12"
      style={{ top: '30%', left: '10%' }}
      animate={{ rotate: [12, 20, 12] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

// ============================================================================
// TESTIMONIAL DATA
// ============================================================================

export const testimonials = [
  {
    quote: "DeckSnap transformed how our team creates presentations. What used to take hours now takes minutes.",
    author: "Sarah Chen",
    role: "Head of Product",
    company: "Linear",
    avatar: "SC",
  },
  {
    quote: "The AI understands context in a way that's genuinely helpful. It's like having a design partner.",
    author: "Marcus Rodriguez",
    role: "Creative Director",
    company: "Figma",
    avatar: "MR",
  },
  {
    quote: "Finally, a presentation tool that doesn't feel like a chore. My students are more engaged than ever.",
    author: "Dr. Emily Park",
    role: "Professor",
    company: "Stanford",
    avatar: "EP",
  },
  {
    quote: "The rough draft feature is brilliant. It lets me focus on the story before getting lost in styling.",
    author: "James Wilson",
    role: "Startup Founder",
    company: "Y Combinator",
    avatar: "JW",
  },
];

// ============================================================================
// FEATURE DATA
// ============================================================================

export const features = [
  {
    title: "Ideate with AI",
    description: "Start with sticky notes and let AI help you brainstorm. No blank page anxiety.",
    icon: "lightbulb",
  },
  {
    title: "Draft Mode",
    description: "Focus on your story structure before committing to design details.",
    icon: "edit",
  },
  {
    title: "60+ Archetypes",
    description: "Professional layouts that adapt to your content, not the other way around.",
    icon: "layout",
  },
  {
    title: "AI Image Generation",
    description: "Generate contextual images that match your presentation's theme and message.",
    icon: "image",
  },
  {
    title: "Theme System",
    description: "30+ curated themes with typography, colors, and visual styles that work together.",
    icon: "palette",
  },
  {
    title: "Real-time Collaboration",
    description: "Work together with your team, with changes synced instantly.",
    icon: "users",
  },
];

export default {
  Button,
  Logo,
  PresentationIllustration,
  WorkflowIllustration,
  BlobShape,
  FloatingShapes,
  testimonials,
  features,
};
