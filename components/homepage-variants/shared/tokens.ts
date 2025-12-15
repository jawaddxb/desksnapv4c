/**
 * Shared Design Tokens for Homepage Variants
 * Based on Bento Matcha design system
 */

export const tokens = {
  colors: {
    // Core palette
    background: '#F5FAF7',
    backgroundAlt: '#EDF5F0',
    surface: '#FFFFFF',
    surfaceHover: '#EDF5F0',

    // Accent colors
    accent: '#6B8E6B',
    accentHover: '#5A7A5A',
    accentLight: 'rgba(107, 142, 107, 0.1)',
    accentMedium: 'rgba(107, 142, 107, 0.2)',

    // Text colors
    text: '#1E2E1E',
    textSecondary: '#4A5D4A',
    textMuted: '#8FA58F',
    textOnAccent: '#FFFFFF',

    // Border colors
    border: '#D4E5D4',
    borderHover: '#C0D6C0',
    borderAccent: '#6B8E6B',

    // Special
    overlay: 'rgba(30, 46, 30, 0.8)',
    cream: '#FAFBF8',
    sage: '#F5FAF7',
  },

  shadows: {
    sm: '0 2px 8px rgba(107, 142, 107, 0.06)',
    md: '0 4px 24px rgba(107, 142, 107, 0.08)',
    lg: '0 12px 48px rgba(107, 142, 107, 0.12)',
    xl: '0 20px 60px rgba(107, 142, 107, 0.16)',
    glow: '0 0 30px rgba(107, 142, 107, 0.2)',
  },

  radius: {
    none: '0px',
    sm: '6px',
    md: '12px',
    lg: '20px',
    xl: '32px',
    full: '9999px',
  },

  fonts: {
    display: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    serif: "'Playfair Display', serif",
    mono: "'JetBrains Mono', monospace",
  },

  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  spacing: {
    container: '1280px',
    section: '120px',
    content: '64px',
  },
} as const;

// Tailwind-compatible class strings
export const tw = {
  // Backgrounds
  bgPrimary: 'bg-[#F5FAF7]',
  bgSecondary: 'bg-white',
  bgTertiary: 'bg-[#EDF5F0]',
  bgAccent: 'bg-[#6B8E6B]',
  bgAccentLight: 'bg-[#6B8E6B]/10',
  bgCream: 'bg-[#FAFBF8]',

  // Text
  textPrimary: 'text-[#1E2E1E]',
  textSecondary: 'text-[#4A5D4A]',
  textMuted: 'text-[#8FA58F]',
  textAccent: 'text-[#6B8E6B]',
  textOnAccent: 'text-white',

  // Borders
  border: 'border-[#D4E5D4]',
  borderHover: 'hover:border-[#C0D6C0]',
  borderAccent: 'border-[#6B8E6B]',

  // Shadows
  shadow: 'shadow-[0_4px_24px_rgba(107,142,107,0.08)]',
  shadowHover: 'shadow-[0_12px_48px_rgba(107,142,107,0.12)]',
  shadowGlow: 'shadow-[0_0_30px_rgba(107,142,107,0.2)]',

  // Interactive
  hoverBg: 'hover:bg-[#EDF5F0]',
  hoverAccent: 'hover:bg-[#5A7A5A]',
  focusRing: 'focus:ring-2 focus:ring-[#6B8E6B]/30 focus:ring-offset-2',

  // Transitions
  transition: 'transition-all duration-200 ease-out',
  transitionFast: 'transition-all duration-150 ease-out',
} as const;

// Animation variants for Framer Motion
export const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  },
  staggerFast: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  },
};

export type Tokens = typeof tokens;
export type TailwindClasses = typeof tw;
