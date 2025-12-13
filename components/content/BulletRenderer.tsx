import React from 'react';
import { Check, ChevronRight, Minus } from 'lucide-react';
import type { Theme, ContentType, BulletStyle, ThemeContentStyle } from '@/types';
import { DEFAULT_CONTENT_STYLE } from '@/config/contentStyles';

interface BulletRendererProps {
  theme: Theme;
  contentType: ContentType;
  index: number;
  size?: number;
}

/**
 * Resolves a color reference to an actual color value.
 */
function resolveColor(
  colorRef: ThemeContentStyle['bulletColor'] | undefined,
  theme: Theme
): string {
  switch (colorRef) {
    case 'accent':
      return theme.colors.accent;
    case 'text':
      return theme.colors.text;
    case 'secondary':
      return theme.colors.secondary;
    default:
      return theme.colors.accent;
  }
}

/**
 * Converts an index to a numbered format.
 */
function formatNumber(
  index: number,
  prefix: 'number' | 'letter' | 'roman' = 'number',
  suffix: string = '.'
): string {
  let value: string;

  switch (prefix) {
    case 'letter':
      value = String.fromCharCode(65 + index); // A, B, C...
      break;
    case 'roman':
      const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
      value = romanNumerals[index] || String(index + 1);
      break;
    default:
      value = String(index + 1);
  }

  return `${value}${suffix}`;
}

/**
 * Renders the bullet marker based on theme style and content type.
 */
export const BulletRenderer: React.FC<BulletRendererProps> = ({
  theme,
  contentType,
  index,
  size: sizeOverride,
}) => {
  const style = theme.contentStyle || DEFAULT_CONTENT_STYLE;
  const size = sizeOverride ?? style.bulletSize ?? 8;
  const color = resolveColor(style.bulletColor, theme);

  // Content type overrides theme bullet style
  const effectiveBulletStyle = getEffectiveBulletStyle(contentType, style.bulletStyle);

  // Don't render if no bullet needed
  if (effectiveBulletStyle === 'none') {
    return null;
  }

  return (
    <span
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: effectiveBulletStyle === 'number' ? 'auto' : size,
        height: size,
        color,
        marginTop: effectiveBulletStyle === 'number' ? 0 : 6,
      }}
    >
      {renderBullet(effectiveBulletStyle, size, color, index, style.numberedSuffix)}
    </span>
  );
};

/**
 * Determines the effective bullet style based on content type.
 */
function getEffectiveBulletStyle(contentType: ContentType, themeBulletStyle: BulletStyle): BulletStyle {
  switch (contentType) {
    case 'numbered':
      return 'number';
    case 'checkmarks':
      return 'check';
    case 'quotes':
    case 'plain':
      return 'none';
    case 'bullets':
    default:
      return themeBulletStyle;
  }
}

/**
 * Renders the actual bullet element.
 */
function renderBullet(
  bulletStyle: BulletStyle,
  size: number,
  color: string,
  index: number,
  suffix?: '.' | ')' | ''
): React.ReactNode {
  switch (bulletStyle) {
    case 'dot':
      return (
        <span
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            opacity: 0.8,
          }}
        />
      );

    case 'square':
      return (
        <span
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            opacity: 0.8,
          }}
        />
      );

    case 'circle':
      return (
        <span
          className="rounded-full"
          style={{
            width: size,
            height: size,
            border: `2px solid ${color}`,
            opacity: 0.8,
          }}
        />
      );

    case 'diamond':
      return (
        <span
          style={{
            width: size * 0.7,
            height: size * 0.7,
            backgroundColor: color,
            transform: 'rotate(45deg)',
            opacity: 0.8,
          }}
        />
      );

    case 'dash':
      return (
        <Minus
          size={size}
          strokeWidth={2.5}
          style={{ color, opacity: 0.8 }}
        />
      );

    case 'arrow':
      return (
        <ChevronRight
          size={size}
          strokeWidth={2.5}
          style={{ color, opacity: 0.9 }}
        />
      );

    case 'check':
      return (
        <Check
          size={size}
          strokeWidth={2.5}
          style={{ color }}
        />
      );

    case 'number':
      return (
        <span
          className="font-medium tabular-nums"
          style={{
            fontSize: size * 1.2,
            color,
            lineHeight: 1,
            minWidth: size * 1.5,
          }}
        >
          {formatNumber(index, 'number', suffix ?? '.')}
        </span>
      );

    case 'none':
    default:
      return null;
  }
}

export default BulletRenderer;
