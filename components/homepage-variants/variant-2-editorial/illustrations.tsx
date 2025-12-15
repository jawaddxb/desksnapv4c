/**
 * Custom SVG Illustrations for Editorial Variant
 * Magazine-style editorial illustrations with abstract, artistic styling
 */

import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// HERO: Large Presentation Mockup Illustration
// ============================================================================

export const HeroPresentationMockup: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background decorative shapes */}
    <motion.circle
      cx="650" cy="100" r="120"
      fill="#6B8E6B"
      fillOpacity="0.08"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1 }}
    />
    <motion.circle
      cx="120" cy="480" r="80"
      fill="#6B8E6B"
      fillOpacity="0.05"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    />

    {/* Main presentation frame */}
    <motion.g
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Shadow layer */}
      <rect x="130" y="165" width="540" height="340" rx="20" fill="#1E2E1E" fillOpacity="0.04" />

      {/* Main slide */}
      <rect x="120" y="150" width="540" height="340" rx="20" fill="#FFFFFF" stroke="#D4E5D4" strokeWidth="3" />

      {/* Header bar */}
      <rect x="120" y="150" width="540" height="50" rx="20" fill="#6B8E6B" fillOpacity="0.05" />
      <circle cx="145" cy="175" r="6" fill="#6B8E6B" fillOpacity="0.3" />
      <circle cx="165" cy="175" r="6" fill="#6B8E6B" fillOpacity="0.3" />
      <circle cx="185" cy="175" r="6" fill="#6B8E6B" fillOpacity="0.3" />
    </motion.g>

    {/* Content inside slide */}
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Title */}
      <motion.rect
        x="160" y="240" width="260" height="24" rx="6"
        fill="#6B8E6B"
        initial={{ width: 0 }}
        animate={{ width: 260 }}
        transition={{ duration: 0.7, delay: 0.7 }}
      />

      {/* Subtitle lines */}
      <motion.rect
        x="160" y="280" width="400" height="12" rx="4"
        fill="#D4E5D4"
        initial={{ width: 0 }}
        animate={{ width: 400 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      <motion.rect
        x="160" y="300" width="320" height="12" rx="4"
        fill="#EDF5F0"
        initial={{ width: 0 }}
        animate={{ width: 320 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />

      {/* Image placeholder with artistic pattern */}
      <motion.g
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <rect x="160" y="340" width="220" height="120" rx="12" fill="#F5FAF7" stroke="#6B8E6B" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="270" cy="380" r="30" fill="#6B8E6B" fillOpacity="0.15" />
        <circle cx="240" cy="410" r="20" fill="#6B8E6B" fillOpacity="0.1" />
        <circle cx="300" cy="420" r="25" fill="#6B8E6B" fillOpacity="0.12" />
      </motion.g>

      {/* Decorative accent circle */}
      <motion.circle
        cx="550" cy="380" r="60"
        fill="#6B8E6B"
        fillOpacity="0.1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      />
      <motion.circle
        cx="550" cy="380" r="35"
        fill="#6B8E6B"
        fillOpacity="0.15"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      />
    </motion.g>

    {/* Floating accent shapes */}
    <motion.rect
      x="80" y="280" width="20" height="20" rx="4"
      fill="#6B8E6B"
      fillOpacity="0.2"
      animate={{ y: [280, 270, 280], rotate: [0, 5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="690" cy="340" r="12"
      fill="#6B8E6B"
      fillOpacity="0.25"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </svg>
);

// ============================================================================
// FEATURES: Abstract Workflow Illustrations
// ============================================================================

export const IdeateIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lightbulb abstract */}
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Bulb glow */}
      <circle cx="160" cy="120" r="80" fill="#6B8E6B" fillOpacity="0.08" />
      <circle cx="160" cy="120" r="60" fill="#6B8E6B" fillOpacity="0.12" />

      {/* Bulb shape */}
      <motion.circle
        cx="160" cy="120" r="45"
        fill="#FFFFFF"
        stroke="#6B8E6B"
        strokeWidth="3"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />

      {/* Filament lines */}
      <motion.path
        d="M 145 105 Q 160 115 175 105"
        stroke="#6B8E6B"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
      />
      <motion.path
        d="M 150 120 L 170 120"
        stroke="#6B8E6B"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />

      {/* Base */}
      <rect x="145" y="165" width="30" height="15" rx="3" fill="#4A5D4A" />
      <rect x="150" y="180" width="20" height="8" rx="2" fill="#4A5D4A" />
    </motion.g>

    {/* Idea sparks */}
    <motion.g
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
    >
      <motion.circle cx="105" cy="75" r="4" fill="#FBBF24" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="215" cy="85" r="3" fill="#FBBF24" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
      <motion.circle cx="190" cy="50" r="5" fill="#FBBF24" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
      <motion.circle cx="130" cy="60" r="3" fill="#FBBF24" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.9 }} />
    </motion.g>

    {/* Floating notes */}
    <motion.rect
      x="60" y="200" width="60" height="50" rx="6"
      fill="#FBBF24" fillOpacity="0.15"
      stroke="#FBBF24" strokeOpacity="0.4" strokeWidth="2"
      animate={{ y: [200, 195, 200], rotate: [-2, 0, -2] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.rect
      x="200" y="210" width="60" height="50" rx="6"
      fill="#4ADE80" fillOpacity="0.15"
      stroke="#4ADE80" strokeOpacity="0.4" strokeWidth="2"
      animate={{ y: [210, 205, 210], rotate: [2, 0, 2] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </svg>
);

export const DraftIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stacked slides */}
    <motion.g
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Back slides */}
      <rect x="80" y="95" width="180" height="120" rx="10" fill="#EDF5F0" stroke="#D4E5D4" strokeWidth="2" />
      <rect x="90" y="105" width="180" height="120" rx="10" fill="#F5FAF7" stroke="#D4E5D4" strokeWidth="2" />

      {/* Front slide */}
      <motion.rect
        x="100" y="115" width="180" height="120" rx="10"
        fill="#FFFFFF"
        stroke="#6B8E6B"
        strokeWidth="2.5"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />

      {/* Content lines */}
      <motion.rect
        x="115" y="135" width="80" height="8" rx="4"
        fill="#6B8E6B"
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      />
      <motion.rect
        x="115" y="155" width="120" height="6" rx="3"
        fill="#D4E5D4"
        initial={{ width: 0 }}
        whileInView={{ width: 120 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      <motion.rect
        x="115" y="168" width="100" height="6" rx="3"
        fill="#EDF5F0"
        initial={{ width: 0 }}
        whileInView={{ width: 100 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />

      {/* Image placeholder */}
      <rect x="115" y="190" width="70" height="30" rx="6" fill="#6B8E6B" fillOpacity="0.1" stroke="#6B8E6B" strokeDasharray="4 4" />
      <circle cx="220" cy="205" r="20" fill="#6B8E6B" fillOpacity="0.15" />
    </motion.g>

    {/* Edit cursor */}
    <motion.g
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.7 }}
    >
      <path d="M 50 50 L 50 70 L 60 60 Z" fill="#4A5D4A" />
      <motion.rect
        x="62" y="52" width="40" height="3" rx="1.5"
        fill="#4A5D4A"
        animate={{ width: [40, 45, 40] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.g>
  </svg>
);

export const PolishIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sparkle effect background */}
    <motion.g
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <circle cx="160" cy="140" r="100" fill="#6B8E6B" fillOpacity="0.05" />
      <circle cx="160" cy="140" r="70" fill="#6B8E6B" fillOpacity="0.08" />
    </motion.g>

    {/* Polished slide */}
    <motion.g
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <rect x="90" y="80" width="200" height="140" rx="12" fill="#FFFFFF" stroke="#6B8E6B" strokeWidth="3" />

      {/* Premium content */}
      <rect x="110" y="100" width="100" height="12" rx="6" fill="#6B8E6B" />
      <rect x="110" y="125" width="140" height="8" rx="4" fill="#D4E5D4" />
      <rect x="110" y="140" width="120" height="8" rx="4" fill="#EDF5F0" />

      {/* Image with gradient */}
      <defs>
        <linearGradient id="polish-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B8E6B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6B8E6B" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="110" y="165" width="80" height="40" rx="8" fill="url(#polish-gradient)" stroke="#6B8E6B" />

      {/* Accent circle */}
      <circle cx="240" cy="185" r="25" fill="#6B8E6B" fillOpacity="0.15" />
    </motion.g>

    {/* Sparkles */}
    <motion.g
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    >
      <motion.path
        d="M 70 100 L 74 104 L 70 108 L 66 104 Z"
        fill="#FBBF24"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M 250 120 L 254 124 L 250 128 L 246 124 Z"
        fill="#FBBF24"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
      />
      <motion.path
        d="M 100 210 L 103 213 L 100 216 L 97 213 Z"
        fill="#FBBF24"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
      />
      <motion.path
        d="M 270 180 L 273 183 L 270 186 L 267 183 Z"
        fill="#FBBF24"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
      />
    </motion.g>
  </svg>
);

// ============================================================================
// GALLERY: Theme Preview Illustrations
// ============================================================================

export const ThemePreview: React.FC<{
  className?: string;
  accentColor: string;
  variant: 'minimal' | 'bold' | 'elegant' | 'modern' | 'organic' | 'tech';
}> = ({ className = '', accentColor, variant }) => {
  const layouts = {
    minimal: (
      <>
        <rect x="20" y="30" width="60" height="6" rx="3" fill={accentColor} />
        <rect x="20" y="45" width="90" height="4" rx="2" fill={accentColor} fillOpacity="0.3" />
        <rect x="20" y="55" width="70" height="4" rx="2" fill={accentColor} fillOpacity="0.2" />
        <rect x="20" y="75" width="50" height="30" rx="4" fill={accentColor} fillOpacity="0.1" />
      </>
    ),
    bold: (
      <>
        <rect x="10" y="20" width="100" height="15" rx="3" fill={accentColor} />
        <rect x="10" y="40" width="100" height="70" rx="6" fill={accentColor} fillOpacity="0.15" />
        <circle cx="95" cy="95" r="15" fill={accentColor} fillOpacity="0.2" />
      </>
    ),
    elegant: (
      <>
        <rect x="30" y="25" width="50" height="8" rx="4" fill={accentColor} fillOpacity="0.8" />
        <rect x="25" y="45" width="60" height="3" rx="1.5" fill={accentColor} fillOpacity="0.3" />
        <rect x="30" y="55" width="50" height="3" rx="1.5" fill={accentColor} fillOpacity="0.2" />
        <circle cx="60" cy="85" r="20" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeOpacity="0.3" />
      </>
    ),
    modern: (
      <>
        <rect x="15" y="25" width="40" height="40" rx="8" fill={accentColor} fillOpacity="0.15" />
        <rect x="60" y="25" width="40" height="18" rx="4" fill={accentColor} />
        <rect x="60" y="47" width="40" height="18" rx="4" fill={accentColor} fillOpacity="0.3" />
        <rect x="15" y="75" width="85" height="30" rx="6" fill={accentColor} fillOpacity="0.1" />
      </>
    ),
    organic: (
      <>
        <circle cx="35" cy="40" r="18" fill={accentColor} fillOpacity="0.2" />
        <circle cx="75" cy="35" r="22" fill={accentColor} fillOpacity="0.15" />
        <circle cx="55" cy="75" r="25" fill={accentColor} fillOpacity="0.1" />
        <path d="M 20 95 Q 60 85 100 95" stroke={accentColor} strokeWidth="3" fill="none" />
      </>
    ),
    tech: (
      <>
        <rect x="15" y="25" width="30" height="30" rx="2" fill={accentColor} fillOpacity="0.2" />
        <rect x="50" y="25" width="50" height="8" rx="2" fill={accentColor} />
        <rect x="50" y="38" width="40" height="5" rx="2" fill={accentColor} fillOpacity="0.4" />
        <rect x="50" y="47" width="35" height="5" rx="2" fill={accentColor} fillOpacity="0.3" />
        <rect x="15" y="65" width="85" height="40" rx="4" fill={accentColor} fillOpacity="0.1" />
        <line x1="15" y1="65" x2="100" y2="105" stroke={accentColor} strokeOpacity="0.2" strokeWidth="1" />
        <line x1="100" y1="65" x2="15" y2="105" stroke={accentColor} strokeOpacity="0.2" strokeWidth="1" />
      </>
    ),
  };

  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="12" fill="#FFFFFF" />
      {layouts[variant]}
    </svg>
  );
};

// ============================================================================
// CTA: Decorative Background Pattern
// ============================================================================

export const CTABackgroundPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    {/* Organic flowing shapes */}
    <motion.path
      d="M 0 200 Q 300 150 600 200 T 1200 200 L 1200 400 L 0 400 Z"
      fill="#6B8E6B"
      fillOpacity="0.05"
      animate={{ d: [
        "M 0 200 Q 300 150 600 200 T 1200 200 L 1200 400 L 0 400 Z",
        "M 0 220 Q 300 170 600 220 T 1200 220 L 1200 400 L 0 400 Z",
        "M 0 200 Q 300 150 600 200 T 1200 200 L 1200 400 L 0 400 Z",
      ]}}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.path
      d="M 0 250 Q 400 220 800 250 T 1200 250 L 1200 400 L 0 400 Z"
      fill="#6B8E6B"
      fillOpacity="0.03"
      animate={{ d: [
        "M 0 250 Q 400 220 800 250 T 1200 250 L 1200 400 L 0 400 Z",
        "M 0 270 Q 400 240 800 270 T 1200 270 L 1200 400 L 0 400 Z",
        "M 0 250 Q 400 220 800 250 T 1200 250 L 1200 400 L 0 400 Z",
      ]}}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />

    {/* Decorative circles */}
    <motion.circle
      cx="200" cy="150" r="80"
      fill="#6B8E6B"
      fillOpacity="0.04"
      animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="1000" cy="200" r="100"
      fill="#6B8E6B"
      fillOpacity="0.06"
      animate={{ y: [0, 10, 0], scale: [1, 0.95, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </svg>
);
