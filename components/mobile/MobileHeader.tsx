/**
 * MobileHeader Component
 *
 * Minimal header for mobile presentation view.
 * Contains deck title and exit button.
 *
 * KISS: Simple header, no complex features.
 * A11y: Touch targets meet 44px minimum.
 */

import React from 'react';
import { X, Share2 } from 'lucide-react';
import { Theme } from '@/types';

interface MobileHeaderProps {
  /** Deck/presentation title */
  title: string;
  /** Theme for styling */
  theme: Theme;
  /** Callback when exit button is clicked */
  onExit: () => void;
  /** Optional callback for share button */
  onShare?: () => void;
  /** Whether the header is visible (for auto-hide behavior) */
  visible?: boolean;
}

/**
 * MobileHeader
 *
 * Fixed header at top of mobile presentation view.
 * Includes exit button and optional share button.
 */
export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  theme,
  onExit,
  onShare,
  visible = true,
}) => {
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-2 py-1
        backdrop-blur-md
        transition-transform duration-300 ease-out
        ${visible ? 'translate-y-0' : '-translate-y-full'}
      `}
      style={{
        backgroundColor: `${theme.colors.surface}E6`,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
      role="banner"
    >
      {/* Exit button - 44px minimum touch target */}
      <button
        onClick={onExit}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-colors duration-150 hover:bg-black/5"
        style={{
          color: theme.colors.text,
        }}
        aria-label="Exit mobile view"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Title */}
      <h1
        className="flex-1 text-center text-sm font-medium truncate px-2"
        style={{
          fontFamily: theme.fonts.body,
          color: theme.colors.text,
        }}
      >
        {title}
      </h1>

      {/* Share button (optional) - 44px minimum touch target */}
      {onShare ? (
        <button
          onClick={onShare}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-colors duration-150 hover:bg-black/5"
          style={{
            color: theme.colors.text,
          }}
          aria-label="Share presentation"
        >
          <Share2 className="w-5 h-5" />
        </button>
      ) : (
        // Placeholder for symmetry
        <div className="min-w-[44px] min-h-[44px]" />
      )}
    </header>
  );
};

export default MobileHeader;
