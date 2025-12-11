import { Variants, Transition } from 'framer-motion';

// Spring physics presets
export const springs = {
  gentle: { type: 'spring', stiffness: 100, damping: 15 } as Transition,
  bouncy: { type: 'spring', stiffness: 300, damping: 10 } as Transition,
  snappy: { type: 'spring', stiffness: 400, damping: 25 } as Transition,
  slow: { type: 'spring', stiffness: 50, damping: 20 } as Transition,
};

// Easing presets
export const easings = {
  smooth: [0.25, 0.1, 0.25, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
};

// Fade variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: easings.smooth }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easings.easeOut }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easings.easeOut }
  }
};

// Scale variants
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easings.easeOut }
  }
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.bouncy
  }
};

// Slide variants
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easings.easeOut }
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easings.easeOut }
  }
};

// Stagger container variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  }
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    }
  }
};

// Draw line variant (for SVG paths)
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, ease: easings.easeOut }
  }
};

// Pulse animation (for looping)
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }
};

// Glow pulse (for gold accent elements)
export const glowPulse = {
  boxShadow: [
    '0 0 0 0 rgba(197, 164, 126, 0)',
    '0 0 20px 5px rgba(197, 164, 126, 0.3)',
    '0 0 0 0 rgba(197, 164, 126, 0)',
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }
};

// Float animation (for floating elements)
export const float = (delay: number = 0) => ({
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
    delay,
  }
});

// Rotate animation
export const rotate = (duration: number = 10) => ({
  rotate: 360,
  transition: {
    duration,
    repeat: Infinity,
    ease: 'linear',
  }
});

// Particle animation for data flow
export const particle = (delay: number = 0) => ({
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: [0, 1, 1, 0],
    scale: [0.5, 1, 1, 0.5],
    transition: {
      duration: 2,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
});

// Morphing blob border-radius values
export const blobMorph = {
  animate: {
    borderRadius: [
      '60% 40% 55% 45% / 55% 45% 60% 40%',
      '40% 60% 45% 55% / 45% 55% 40% 60%',
      '55% 45% 60% 40% / 60% 40% 55% 45%',
      '45% 55% 40% 60% / 40% 60% 45% 55%',
      '60% 40% 55% 45% / 55% 45% 60% 40%',
    ],
    scale: [1, 1.02, 1, 0.98, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

// Typing cursor blink
export const cursorBlink = {
  opacity: [1, 1, 0, 0],
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'steps(1)',
  }
};

// Check mark animation
export const checkMark: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.3, ease: 'easeOut' },
      opacity: { duration: 0.1 }
    }
  }
};

// Shake animation (for errors or attention)
export const shake = {
  x: [0, -5, 5, -5, 5, 0],
  transition: {
    duration: 0.4,
  }
};

// Hover lift effect
export const hoverLift = {
  y: -4,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  transition: { duration: 0.2 }
};

// Card hover
export const cardHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

// Icon spin on hover
export const spinOnHover = {
  rotate: 360,
  transition: { duration: 0.5 }
};

// Shimmer effect for text/pills
export const shimmer = {
  backgroundPosition: ['200% 0', '-200% 0'],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'linear',
  }
};

// Lightning/zap animation
export const lightning = {
  opacity: [1, 0.5, 1, 0.8, 1],
  scale: [1, 1.1, 1, 1.05, 1],
  transition: {
    duration: 0.5,
    repeat: Infinity,
    repeatDelay: 2,
  }
};

// Ping animation (for status indicators)
export const ping = {
  scale: [1, 1.5, 1.5],
  opacity: [0.75, 0, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
  }
};

// Utility: Create staggered delay
export const staggerDelay = (index: number, baseDelay: number = 0.1) => ({
  transition: { delay: index * baseDelay }
});

// Utility: Viewport animation options
export const viewportOnce = { once: true, margin: '-100px' };
export const viewportRepeat = { once: false, margin: '-100px' };
