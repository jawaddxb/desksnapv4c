/**
 * MobileProgressIndicator Component
 *
 * Navigation dots for mobile presentation view.
 * Shows current slide position and allows jumping to any slide.
 *
 * KISS: Simple dot indicator, no complex animations.
 * A11y: Touch targets meet 44px minimum, proper ARIA attributes.
 */

import React from 'react';
import { Theme } from '@/types';

interface MobileProgressIndicatorProps {
  /** Currently active slide index (0-based) */
  currentSlide: number;
  /** Total number of slides */
  totalSlides: number;
  /** Callback when a dot is tapped */
  onDotClick: (index: number) => void;
  /** Theme for styling */
  theme: Theme;
  /** Whether to show slide numbers (default: false) */
  showNumbers?: boolean;
}

/**
 * MobileProgressIndicator
 *
 * Renders a horizontal row of dots at the bottom of the screen.
 * Active dot is highlighted with the theme's accent color.
 */
export const MobileProgressIndicator: React.FC<MobileProgressIndicatorProps> = ({
  currentSlide,
  totalSlides,
  onDotClick,
  theme,
  showNumbers = false,
}) => {
  // For many slides, show a condensed version
  const maxVisibleDots = 9;
  const showCondensed = totalSlides > maxVisibleDots;

  // Calculate which dots to show in condensed mode
  const getVisibleDots = (): number[] => {
    if (!showCondensed) {
      return Array.from({ length: totalSlides }, (_, i) => i);
    }

    // Always show first, last, and dots around current
    const visible = new Set<number>();
    visible.add(0); // First
    visible.add(totalSlides - 1); // Last

    // Add surrounding dots (2 before and 2 after current)
    for (let i = Math.max(0, currentSlide - 2); i <= Math.min(totalSlides - 1, currentSlide + 2); i++) {
      visible.add(i);
    }

    return Array.from(visible).sort((a, b) => a - b);
  };

  const visibleDots = getVisibleDots();

  return (
    <nav
      className="flex items-center justify-center gap-1 px-4 py-3 backdrop-blur-md rounded-full"
      style={{
        backgroundColor: `${theme.colors.surface}CC`,
      }}
      role="tablist"
      aria-label={`Slide navigation: ${currentSlide + 1} of ${totalSlides}`}
    >
      {showNumbers && (
        <span
          className="text-xs font-medium mr-2 tabular-nums"
          style={{ color: theme.colors.text }}
          aria-hidden="true"
        >
          {currentSlide + 1}/{totalSlides}
        </span>
      )}

      {visibleDots.map((index, arrayIndex) => {
        const isActive = index === currentSlide;
        const prevIndex = visibleDots[arrayIndex - 1];
        const showEllipsis = prevIndex !== undefined && index - prevIndex > 1;

        return (
          <React.Fragment key={index}>
            {/* Ellipsis for gaps in condensed mode */}
            {showEllipsis && (
              <span
                className="text-xs mx-0.5"
                style={{ color: theme.colors.secondary }}
                aria-hidden="true"
              >
                ...
              </span>
            )}

            {/* Dot button - uses padding for 44px touch target with smaller visual dot */}
            <button
              onClick={() => onDotClick(index)}
              className="relative flex items-center justify-center min-w-[44px] min-h-[44px] -mx-3 focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                // @ts-ignore - focusRingColor is used by Tailwind
                '--tw-ring-color': theme.colors.accent,
              } as React.CSSProperties}
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={isActive}
              aria-current={isActive ? 'step' : undefined}
              tabIndex={isActive ? 0 : -1}
            >
              {/* Visual dot */}
              <span
                className={`
                  transition-all duration-200 ease-out rounded-full
                  ${isActive ? 'w-6 h-2' : 'w-2 h-2'}
                `}
                style={{
                  backgroundColor: isActive ? theme.colors.accent : `${theme.colors.secondary}60`,
                }}
              />
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default MobileProgressIndicator;
