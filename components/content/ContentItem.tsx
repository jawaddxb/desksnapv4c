import React from 'react';
import type { Theme, ContentType, ContentItemVisualPreset } from '@/types';
import {
  resolveContentItemStyle,
  getEffectivePreset,
  presetHasVisibleContainer,
} from '@/config/contentItemStyles';
import { BulletRenderer } from './BulletRenderer';

interface ContentItemProps {
  children: React.ReactNode;
  theme: Theme;
  contentType: ContentType;
  index: number;
  isStatement?: boolean;
  /** Slide-level override for visual preset */
  visualPreset?: ContentItemVisualPreset;
}

/**
 * Wraps each content item with theme-appropriate styling.
 *
 * Uses the Content Item Visual Preset system for styling:
 * - Priority: slide override > theme default > layout-based fallback
 * - Presets: pill, card, sharp, glass, underline, solid, minimal
 */
export const ContentItem: React.FC<ContentItemProps> = ({
  children,
  theme,
  contentType,
  index,
  isStatement = false,
  visualPreset,
}) => {
  // Resolve effective preset: slide > theme > fallback
  const effectivePreset = getEffectivePreset(
    visualPreset,
    theme.contentItemVisualPreset,
    isStatement
  );

  // Get resolved CSS styles for the preset
  const containerStyle = resolveContentItemStyle(effectivePreset, theme);

  // Quotes always get left border accent (override preset)
  const isQuotes = contentType === 'quotes';
  if (isQuotes && !containerStyle.borderLeft) {
    containerStyle.borderLeft = `3px solid ${theme.colors.accent}`;
    // Ensure some background for quotes
    if (containerStyle.backgroundColor === 'transparent') {
      containerStyle.backgroundColor = `${theme.colors.accent}08`;
    }
  }

  // Hide bullets when container has visible styling (pill, card, etc.)
  // or when explicitly plain content type
  const hasVisibleContainer = presetHasVisibleContainer(effectivePreset);
  const showBullet = !hasVisibleContainer && contentType !== 'plain';

  return (
    <div
      className="flex items-start gap-3 group w-full shrink-0"
      style={{
        marginBottom: 0, // Spacing handled by parent gap
      }}
    >
      {/* Bullet marker */}
      {showBullet && (
        <BulletRenderer
          theme={theme}
          contentType={contentType}
          index={index}
        />
      )}

      {/* Content wrapper with preset styling */}
      <div
        className="flex-1 relative"
        style={{
          ...containerStyle,
          // Smooth transition for hover states
          transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ContentItem;
