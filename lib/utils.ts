/**
 * Utility Functions
 *
 * Shared utilities used across the application.
 * PRNG is now in a separate module but re-exported here for backward compatibility.
 */

// Re-export PRNG from dedicated module
export { PRNG } from './prng';

// Import centralized colors
import { COLORS } from '../config/colors';

// Brand color for Tailwind classes (extracted for DRY)
const BRAND = COLORS.brand; // #c5a47e

/**
 * Utility for conditionally joining class names together.
 * Filters out falsy values and joins with spaces.
 *
 * @example
 * cn('base-class', isActive && 'active', className)
 * // Returns: 'base-class active my-custom-class'
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generates button class names based on variant and size.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'white' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: `bg-[${BRAND}] hover:bg-white text-black`,
  secondary: 'bg-black hover:bg-white/5 text-white border border-white/20 hover:border-white/40',
  ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/5',
  white: `bg-white hover:bg-[${BRAND}] text-black`,
  danger: 'bg-red-600 hover:bg-red-500 text-white',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
};

export function buttonClass(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  additionalClasses?: string
): string {
  return cn(
    'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide transition-all duration-150',
    buttonVariants[variant],
    buttonSizes[size],
    additionalClasses
  );
}

/**
 * Generates input class names based on variant.
 */
export type InputVariant = 'default' | 'search' | 'minimal';

const inputVariants: Record<InputVariant, string> = {
  default: `bg-black border border-white/20 focus:border-[${BRAND}]`,
  search: 'bg-white/5 border border-transparent focus:border-white/20',
  minimal: `bg-transparent border-b border-white/20 focus:border-[${BRAND}] rounded-none px-0`,
};

export function inputClass(
  variant: InputVariant = 'default',
  additionalClasses?: string
): string {
  return cn(
    'p-3 text-sm font-bold text-white outline-none transition-all duration-150 placeholder:text-white/40 w-full',
    inputVariants[variant],
    additionalClasses
  );
}

/**
 * Generates card class names based on variant.
 */
export type CardVariant = 'default' | 'interactive' | 'selected' | 'ghost';

const cardVariants: Record<CardVariant, string> = {
  default: 'bg-[#1a1a1a] border border-white/10',
  interactive: `bg-[#1a1a1a] border border-white/10 hover:border-[${BRAND}]/50 cursor-pointer`,
  selected: `bg-[#1a1a1a] border border-[${BRAND}] ring-2 ring-[${BRAND}]/20`,
  ghost: 'bg-transparent border border-white/10 hover:border-white/20',
};

export function cardClass(
  variant: CardVariant = 'default',
  additionalClasses?: string
): string {
  return cn(
    'transition-all duration-150 overflow-hidden',
    cardVariants[variant],
    additionalClasses
  );
}
