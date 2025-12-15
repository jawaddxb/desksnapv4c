/**
 * Desk Squad Section Constants
 *
 * Card positions and animation configurations for the playing card showcase.
 * Simplified: No 3D flips, focus on fan-out and hover interactions.
 */

import { Variants } from 'framer-motion';

// Card positions for fanned layout (arc formation)
export const FANNED_POSITIONS = [
  { x: -240, y: 20, rotation: -12 },
  { x: -120, y: 5, rotation: -6 },
  { x: 0, y: 0, rotation: 0 },
  { x: 120, y: 5, rotation: 6 },
  { x: 240, y: 20, rotation: 12 },
];

// Card dimensions
export const CARD_WIDTH = 200;
export const CARD_HEIGHT = 280;

// Framer-motion spring config
export const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};

// Card animation variants - simplified, no 3D
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },

  stacked: (index: number) => ({
    x: index * 3,
    y: index * 3,
    rotate: (index - 2) * 1.5,
    scale: 1,
    opacity: 1,
    zIndex: 5 - index,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  }),

  fanned: (index: number) => ({
    x: FANNED_POSITIONS[index].x,
    y: FANNED_POSITIONS[index].y,
    rotate: FANNED_POSITIONS[index].rotation,
    scale: 1,
    opacity: 1,
    zIndex: 10 + index,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      delay: index * 0.1,
    },
  }),

  idle: (index: number) => ({
    x: FANNED_POSITIONS[index].x,
    y: FANNED_POSITIONS[index].y,
    rotate: FANNED_POSITIONS[index].rotation,
    scale: 1,
    opacity: 1,
    zIndex: 10 + index,
  }),
};

// Hover animation - lift and scale
export const hoverAnimation = {
  y: -20,
  scale: 1.05,
  zIndex: 50,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
};

// Idle floating animation config - MUST include all position properties
export const getIdleAnimation = (index: number, baseY: number) => ({
  x: FANNED_POSITIONS[index].x,
  y: [baseY, baseY - 6, baseY, baseY + 4, baseY],
  rotate: FANNED_POSITIONS[index].rotation,
  scale: 1,
  opacity: 1,
  zIndex: 10 + index,
  transition: {
    y: {
      duration: 3.5 + index * 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});
