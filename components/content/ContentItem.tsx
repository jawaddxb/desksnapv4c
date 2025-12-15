import React from 'react';
import type { Theme, ContentType, ContentItemVisualPreset } from '@/types';
import { getPresetStyle, presetShowsBullet, getEffectivePreset } from '@/config/contentItemStyles';
import { BulletRenderer } from './BulletRenderer';

interface ContentItemProps {
  children: React.ReactNode;
  theme: Theme;
  contentType: ContentType;
  index: number;
  isStatement?: boolean;
  visualPreset?: ContentItemVisualPreset;
}

/**
 * Content item wrapper with preset-based styling.
 *
 * Single responsibility: Apply visual preset styling to content items.
 * Styling logic lives in contentItemStyles.ts (DRY).
 */
export const ContentItem: React.FC<ContentItemProps> = ({
  children,
  theme,
  contentType,
  index,
  isStatement = false,
  visualPreset,
}) => {
  // Resolve preset: slide > theme.contentStyle > layout default
  const preset = getEffectivePreset(
    visualPreset,
    theme.contentStyle,
    isStatement
  );

  // Get styles and bullet visibility from preset
  const containerStyle = getPresetStyle(preset, theme);
  const showBullet = presetShowsBullet(preset) && contentType !== 'plain';

  return (
    <div className="flex items-start gap-3 w-full shrink-0">
      {showBullet && (
        <BulletRenderer
          theme={theme}
          contentType={contentType}
          index={index}
        />
      )}
      <div
        className="flex-1 relative"
        style={{
          ...containerStyle,
          transition: 'background-color 0.15s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ContentItem;
