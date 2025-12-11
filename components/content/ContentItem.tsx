import React from 'react';
import type { Theme, ContentType, ThemeContentStyle } from '../../types';
import { DEFAULT_CONTENT_STYLE } from '../../config/contentStyles';
import { BulletRenderer } from './BulletRenderer';

interface ContentItemProps {
  children: React.ReactNode;
  theme: Theme;
  contentType: ContentType;
  index: number;
  isStatement?: boolean;
}

/**
 * Resolves background color based on theme settings.
 */
function resolveBackground(
  style: ThemeContentStyle,
  theme: Theme,
  contentType: ContentType,
  isStatement: boolean
): string {
  // Quotes get a special subtle background
  if (contentType === 'quotes') {
    return `${theme.colors.accent}10`; // 10% opacity accent
  }

  // Statement layout or explicit accent background
  if (isStatement || style.itemBackground === 'accent') {
    return `${theme.colors.accent}15`; // 15% opacity accent
  }

  return 'transparent';
}

/**
 * Resolves border radius based on style settings.
 */
function resolveBorderRadius(
  style: ThemeContentStyle,
  contentType: ContentType,
  isStatement: boolean
): string {
  if (style.itemBorderRadius) {
    return style.itemBorderRadius === 'full' ? '9999px' : style.itemBorderRadius;
  }

  // Statement layout defaults to pill shape
  if (isStatement) {
    return '9999px';
  }

  // Quotes get subtle rounded corners
  if (contentType === 'quotes') {
    return '8px';
  }

  return '0';
}

/**
 * Resolves padding based on style settings and content type.
 */
function resolvePadding(
  style: ThemeContentStyle,
  contentType: ContentType,
  isStatement: boolean
): string {
  if (style.itemPadding) {
    return style.itemPadding;
  }

  // Statement layout has pill padding
  if (isStatement) {
    return '12px 24px';
  }

  // Quotes have left padding for the border
  if (contentType === 'quotes') {
    return '8px 16px';
  }

  return '0';
}

/**
 * Wraps each content item with theme-appropriate styling.
 * Handles backgrounds, padding, borders, and bullet rendering.
 */
export const ContentItem: React.FC<ContentItemProps> = ({
  children,
  theme,
  contentType,
  index,
  isStatement = false,
}) => {
  const style = theme.contentStyle || DEFAULT_CONTENT_STYLE;

  const background = resolveBackground(style, theme, contentType, isStatement);
  const borderRadius = resolveBorderRadius(style, contentType, isStatement);
  const padding = resolvePadding(style, contentType, isStatement);

  // Determine if we should show a left accent border
  const showLeftBorder = style.leftAccentBorder || contentType === 'quotes';
  const leftBorderWidth = style.leftBorderWidth ?? 3;

  // For statement layout with accent background, don't show separate bullets
  const showBullet = !isStatement && contentType !== 'plain' && style.bulletStyle !== 'none';

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

      {/* Content wrapper with styling */}
      <div
        className="flex-1 relative"
        style={{
          backgroundColor: background,
          borderRadius,
          padding,
          borderLeft: showLeftBorder ? `${leftBorderWidth}px solid ${theme.colors.accent}` : undefined,
          // Smooth transition for hover states (if added later)
          transition: 'background-color 0.15s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ContentItem;
