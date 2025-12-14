/**
 * MobileSlideView Component
 *
 * Renders a single slide optimized for mobile portrait viewing.
 * Applies mobile layout configuration from mobileLayoutRegistry.
 *
 * KISS: Simple component, reuses existing ImageContainer and ContentBlockRenderer.
 * DRY: Shared AccentDivider, merged StackedLayout for top/bottom variants.
 */

import React from 'react';
import { Slide, Theme } from '@/types';
import { ImageContainer } from '@/components/StandardLayouts';
import { ContentBlockRenderer, hasContentBlocks } from '@/components/content-blocks';
import { getMobileLayoutConfig, MobileLayoutConfig } from '@/lib/mobileLayoutRegistry';
import { applyFontScale } from '@/lib/textPresets';
import { DEFAULT_CONTENT_STYLE } from '@/config/contentStyles';

interface MobileSlideViewProps {
  slide: Slide;
  theme: Theme;
}

// Shared props interface for layout components
interface LayoutProps {
  slide: Slide;
  theme: Theme;
  config: MobileLayoutConfig;
}

/**
 * AccentDivider - Shared divider component
 * DRY: Extracted from repeated usage across layouts
 */
const AccentDivider: React.FC<{ theme: Theme; marginBottom?: string }> = ({
  theme,
  marginBottom = 'mb-4',
}) => (
  <div
    className={`w-12 h-1 rounded-full ${marginBottom}`}
    style={{ backgroundColor: theme.colors.accent }}
  />
);

/**
 * Renders title for mobile (simplified, no editing)
 */
const MobileTitle: React.FC<{
  title: string;
  theme: Theme;
  slide: Slide;
  config: MobileLayoutConfig;
}> = ({ title, theme, slide, config }) => {
  const titleStyle = slide.textStyles?.title;
  const isOverlay = config.textOverlay !== 'none';
  const fontSize = applyFontScale(slide.titleFontSize ?? 36, slide.fontScale);

  return (
    <h1
      className={`font-bold leading-tight ${isOverlay ? 'drop-shadow-lg' : ''}`}
      style={{
        fontFamily: theme.fonts.heading,
        color: theme.colors.text,
        fontSize: `${fontSize}px`,
        textTransform: theme.layout.headingTransform as React.CSSProperties['textTransform'],
        fontWeight: titleStyle?.fontWeight ?? (parseInt(theme.layout.headingWeight) || 700),
        textAlign: config.textAlign || 'left',
      }}
    >
      {title}
    </h1>
  );
};

/**
 * Renders content for mobile (bullets or content blocks)
 */
const MobileContent: React.FC<LayoutProps> = ({ slide, theme, config }) => {
  // Use ContentBlockRenderer if contentBlocks exist
  if (hasContentBlocks(slide)) {
    return (
      <ContentBlockRenderer
        blocks={slide.contentBlocks!}
        theme={theme}
        readOnly={true}
        gap="sm"
      />
    );
  }

  // Fallback to legacy bullet content
  const contentFontSize = applyFontScale(slide.contentFontSize ?? 16, slide.fontScale, 12, 32);
  const contentStyle = slide.textStyles?.content;

  return (
    <div
      className="flex flex-col"
      style={{ gap: theme.contentStyle?.itemSpacing ?? DEFAULT_CONTENT_STYLE.itemSpacing ?? 10 }}
    >
      {slide.content.map((point, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <span
            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
            style={{ backgroundColor: theme.colors.accent }}
          />
          <p
            style={{
              fontFamily: theme.fonts.body,
              color: theme.colors.secondary,
              fontSize: `${contentFontSize}px`,
              lineHeight: 1.4,
              fontWeight: contentStyle?.fontWeight,
              textAlign: config.textAlign || 'left',
            }}
          >
            {point}
          </p>
        </div>
      ))}
    </div>
  );
};

/**
 * Image section component
 */
const ImageSection: React.FC<{ slide: Slide; theme: Theme; height: string }> = ({
  slide,
  theme,
  height,
}) => (
  <div
    className="relative shrink-0 w-full"
    style={{ height }}
  >
    <ImageContainer slide={slide} theme={theme} />
  </div>
);

/**
 * Content section component
 */
const ContentSection: React.FC<LayoutProps & { showDivider?: boolean }> = ({
  slide,
  theme,
  config,
  showDivider = true,
}) => (
  <div
    className="flex-1 overflow-y-auto"
    style={{
      padding: config.contentPadding || '1.5rem',
      backgroundColor: theme.colors.background,
    }}
  >
    <div className="mb-4">
      <MobileTitle title={slide.title} theme={theme} slide={slide} config={config} />
    </div>
    {showDivider && <AccentDivider theme={theme} />}
    <MobileContent slide={slide} theme={theme} config={config} />
  </div>
);

/**
 * StackedLayout - Unified layout for image top/bottom variants
 * DRY: Merged TopImageLayout and BottomImageLayout into single component
 */
const StackedLayout: React.FC<LayoutProps & { imageFirst: boolean }> = ({
  slide,
  theme,
  config,
  imageFirst,
}) => {
  const imageHeight = config.imageHeight || '40vh';

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {imageFirst ? (
        <>
          <ImageSection slide={slide} theme={theme} height={imageHeight} />
          <ContentSection slide={slide} theme={theme} config={config} />
        </>
      ) : (
        <>
          <ContentSection slide={slide} theme={theme} config={config} />
          <ImageSection slide={slide} theme={theme} height={imageHeight} />
        </>
      )}
    </div>
  );
};

/**
 * Mobile layout with full background image and text overlay
 */
const BackgroundImageLayout: React.FC<LayoutProps> = ({ slide, theme, config }) => {
  const overlayPosition = config.textOverlay || 'bottom';

  // Gradient direction based on overlay position
  const gradientDirection = overlayPosition === 'top'
    ? 'to bottom'
    : overlayPosition === 'center'
    ? 'to bottom'
    : 'to top';

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{ opacity: config.backgroundOpacity ?? 1 }}
      >
        <ImageContainer slide={slide} theme={theme} />
      </div>

      {/* Gradient overlay */}
      {config.useGradientOverlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${gradientDirection}, transparent 0%, ${theme.colors.surface}E6 70%, ${theme.colors.surface}F2 100%)`,
          }}
        />
      )}

      {/* Content overlay */}
      <div
        className={`
          absolute inset-x-0 z-10 flex flex-col
          ${overlayPosition === 'top' ? 'top-0' : ''}
          ${overlayPosition === 'center' ? 'top-1/2 -translate-y-1/2' : ''}
          ${overlayPosition === 'bottom' ? 'bottom-0' : ''}
        `}
        style={{
          padding: config.contentPadding || '2rem',
          maxHeight: overlayPosition === 'center' ? '80%' : '60%',
        }}
      >
        <div className="mb-3">
          <MobileTitle title={slide.title} theme={theme} slide={slide} config={config} />
        </div>
        <div
          className={`overflow-y-auto ${overlayPosition === 'center' ? 'text-center' : ''}`}
        >
          <MobileContent slide={slide} theme={theme} config={config} />
        </div>
      </div>
    </div>
  );
};

/**
 * Mobile layout with no image (text only)
 */
const NoImageLayout: React.FC<LayoutProps> = ({ slide, theme, config }) => (
  <div
    className="w-full h-full overflow-y-auto flex flex-col justify-center"
    style={{
      padding: config.contentPadding || '2rem',
      backgroundColor: theme.colors.background,
    }}
  >
    <div className="mb-4">
      <MobileTitle title={slide.title} theme={theme} slide={slide} config={config} />
    </div>
    <AccentDivider theme={theme} marginBottom="mb-6" />
    <MobileContent slide={slide} theme={theme} config={config} />
  </div>
);

/**
 * MobileSlideView
 *
 * Main component that selects the appropriate mobile layout
 * based on the slide's desktop layout type.
 */
export const MobileSlideView: React.FC<MobileSlideViewProps> = ({ slide, theme }) => {
  const config = getMobileLayoutConfig(slide.layoutType);

  // Select layout based on image position configuration
  switch (config.imagePosition) {
    case 'top':
      return <StackedLayout slide={slide} theme={theme} config={config} imageFirst={true} />;
    case 'bottom':
      return <StackedLayout slide={slide} theme={theme} config={config} imageFirst={false} />;
    case 'background':
      return <BackgroundImageLayout slide={slide} theme={theme} config={config} />;
    case 'none':
    default:
      return <NoImageLayout slide={slide} theme={theme} config={config} />;
  }
};

export default MobileSlideView;
