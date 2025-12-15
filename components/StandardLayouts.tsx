/**
 * Standard Layouts
 *
 * Consolidated layout system using a configuration-driven approach.
 * All 7 layout types share common infrastructure via the Layout component.
 */

import React, { useCallback, useRef } from 'react';
import { Slide, Theme, ImageStyleOverride } from '@/types';
import { BlockPosition } from '@/types/contentBlocks';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Rnd } from 'react-rnd';
import { useSelectionSafe } from '@/contexts/SelectionContext';

// ============ Types ============

interface LayoutProps {
  slide: Slide;
  theme: Theme;
  children: React.ReactNode;
  printMode?: boolean;
  imageToolbar?: React.ReactNode;
}

type LayoutType = 'split' | 'full-bleed' | 'statement' | 'gallery' | 'card' | 'horizontal' | 'magazine';

// ============ Shared Utilities ============

const getImageFilterStyle = (imageStyles?: ImageStyleOverride): React.CSSProperties => {
  if (!imageStyles) return {};

  const filters: string[] = [];
  if (imageStyles.brightness !== undefined && imageStyles.brightness !== 1) {
    filters.push(`brightness(${imageStyles.brightness})`);
  }
  if (imageStyles.contrast !== undefined && imageStyles.contrast !== 1) {
    filters.push(`contrast(${imageStyles.contrast})`);
  }
  if (imageStyles.saturation !== undefined && imageStyles.saturation !== 1) {
    filters.push(`saturate(${imageStyles.saturation})`);
  }

  return filters.length > 0 ? { filter: filters.join(' ') } : {};
};

// ============ Image Container (Shared Component) ============

interface ImageContainerProps {
  slide: Slide;
  theme: Theme;
  className?: string;
  style?: React.CSSProperties;
  toolbar?: React.ReactNode;
  readOnly?: boolean;
  onImagePositionChange?: (position: BlockPosition) => void;
}

export const ImageContainer = ({
  slide,
  theme,
  className = "",
  style = {},
  toolbar,
  readOnly = true,
  onImagePositionChange,
}: ImageContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectionContext = useSelectionSafe();
  const imageStyles = slide.imageStyles;
  const opacity = imageStyles?.opacity ?? 1;
  const objectFit = imageStyles?.objectFit ?? 'cover';
  const filterStyle = getImageFilterStyle(imageStyles);
  const imagePosition = slide.imagePosition;

  const isSelected =
    selectionContext?.selection.type === 'image' &&
    selectionContext?.selection.elementId === slide.id;

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      if (readOnly) return;
      e.stopPropagation();
      selectionContext?.setSelection('image', slide.id);
    },
    [readOnly, selectionContext, slide.id]
  );

  const handleDragStop = useCallback(
    (_e: unknown, d: { x: number; y: number }) => {
      const container = containerRef.current;
      if (!container || !onImagePositionChange || !imagePosition) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      onImagePositionChange({
        ...imagePosition,
        x: (d.x / containerWidth) * 100,
        y: (d.y / containerHeight) * 100,
      });
    },
    [imagePosition, onImagePositionChange]
  );

  const handleResizeStop = useCallback(
    (
      _e: unknown,
      _direction: unknown,
      ref: HTMLElement,
      _delta: unknown,
      pos: { x: number; y: number }
    ) => {
      const container = containerRef.current;
      if (!container || !onImagePositionChange) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      onImagePositionChange({
        x: (pos.x / containerWidth) * 100,
        y: (pos.y / containerHeight) * 100,
        width: (ref.offsetWidth / containerWidth) * 100,
        height: (ref.offsetHeight / containerHeight) * 100,
      });
    },
    [onImagePositionChange]
  );

  // Render draggable image if position is set
  const renderImage = () => {
    if (!slide.imageUrl) {
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: theme.colors.surface, opacity: 0.1 }}
        >
          <ImageIcon className="w-12 h-12" />
        </div>
      );
    }

    const imgElement = (
      <img
        src={slide.imageUrl}
        alt="Slide visual"
        className="w-full h-full"
        style={{
          objectFit: imagePosition ? 'cover' : objectFit,
          opacity,
          ...filterStyle,
        }}
      />
    );

    // If image has custom position, make it draggable
    if (imagePosition && !readOnly) {
      const container = containerRef.current;
      const containerWidth = container?.offsetWidth || 400;
      const containerHeight = container?.offsetHeight || 300;

      return (
        <Rnd
          position={{
            x: (imagePosition.x / 100) * containerWidth,
            y: (imagePosition.y / 100) * containerHeight,
          }}
          size={{
            width: (imagePosition.width / 100) * containerWidth,
            height: (imagePosition.height / 100) * containerHeight,
          }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          minWidth={80}
          minHeight={80}
          bounds="parent"
          disableDragging={!isSelected}
          enableResizing={isSelected}
          onClick={handleSelect}
          style={{
            outline: isSelected ? `2px solid ${theme.colors.accent}` : 'none',
            outlineOffset: '2px',
            cursor: readOnly ? 'default' : isSelected ? 'move' : 'pointer',
            overflow: 'hidden',
            borderRadius: theme.layout.radius,
          }}
        >
          {imgElement}
        </Rnd>
      );
    }

    // Default: full-size image with hover effect
    return (
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out hover:scale-105"
        onClick={!readOnly ? handleSelect : undefined}
        style={{ cursor: !readOnly ? 'pointer' : 'default' }}
      >
        {imgElement}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full bg-zinc-100 ${className}`}
      style={style}
    >
      {slide.isImageLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center" style={{ background: theme.colors.surface }}>
          <div className="relative mb-4">
            <div className="absolute inset-0 blur-xl opacity-20 animate-pulse" style={{ backgroundColor: theme.colors.accent }} />
            <Loader2 className="relative z-10 w-8 h-8 animate-spin" strokeWidth={2.5} style={{ color: theme.colors.text }} />
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: theme.colors.text }}>Generative Fill</div>
        </div>
      ) : (
        renderImage()
      )}

      {theme.colors.backgroundPattern && !slide.isImageLoading && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{ backgroundImage: theme.colors.backgroundPattern }}
        />
      )}

      {toolbar}
    </div>
  );
};

// ============ Layout Implementations ============

const SplitLayoutImpl: React.FC<LayoutProps> = ({ slide, theme, children, imageToolbar }) => {
  const isRightAligned = slide.alignment === 'right';
  const radiusVal = parseInt(theme.layout.radius) || 0;
  const isOrganic = radiusVal > 8;

  return (
    <div className="flex flex-col md:flex-row w-full h-full p-6 md:p-8 gap-6 md:gap-12 overflow-hidden">
      <div className={`flex-1 flex flex-col justify-center relative z-20 min-h-0 overflow-hidden shrink-0 ${isRightAligned ? 'md:order-2' : 'md:order-1'}`}>
        {children}
      </div>
      <div className={`md:w-1/2 relative h-64 md:h-full shrink-0 group ${isRightAligned ? 'md:order-1' : 'md:order-2'}`}>
        <ImageContainer
          slide={slide}
          theme={theme}
          className="shadow-sm h-full"
          style={{ borderRadius: isOrganic ? theme.layout.radius : '0px' }}
          toolbar={imageToolbar}
        />
      </div>
    </div>
  );
};

// Helper to generate gradient based on overlay style
// IMPORTANT: For full-bleed with images, we ALWAYS use dark overlays.
// This ensures white text is readable regardless of image content.
// Theme-tinted overlays don't work because images have unpredictable luminance.
const getOverlayGradient = (
  overlayStyle: 'standard' | 'soft' | 'none' | undefined,
  isCenter: boolean,
  isRight: boolean,
  hasImage: boolean
): string | undefined => {
  const style = overlayStyle ?? 'standard';
  if (style === 'none') return undefined;

  const direction = isCenter ? 'to top' : `to ${isRight ? 'left' : 'right'}`;

  // Always use dark overlay for image-backed layouts
  // This creates a predictable dark surface for white text
  const base = hasImage ? '#000000' : '#000000';

  if (style === 'soft') {
    // Softer fade (50% coverage) - still dark but more transparent
    return isCenter
      ? `linear-gradient(${direction}, ${base}CC 0%, ${base}66 60%, transparent 100%)`
      : `linear-gradient(${direction}, ${base}CC 0%, ${base}80 50%, transparent 100%)`;
  }

  // Standard: deeper dark fade (70% coverage)
  return isCenter
    ? `linear-gradient(${direction}, ${base}E6 0%, ${base}B3 35%, ${base}66 60%, transparent 100%)`
    : `linear-gradient(${direction}, ${base}E6 0%, ${base}B3 40%, ${base}66 65%, transparent 100%)`;
};

const FullBleedLayoutImpl: React.FC<LayoutProps> = ({ slide, theme, children, imageToolbar }) => {
  const isCenter = slide.alignment === 'center';
  const isRight = slide.alignment === 'right';
  const hasImage = !!slide.imageUrl;
  const overlayGradient = getOverlayGradient(slide.overlayStyle, isCenter, isRight, hasImage);

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <div className="absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-transform duration-1000">
        <ImageContainer slide={slide} theme={theme} toolbar={imageToolbar} />
      </div>
      {overlayGradient && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: overlayGradient }}
        />
      )}
      <div className={`
        relative z-20 p-8 md:p-12 flex flex-col justify-center h-full overflow-hidden min-h-0 shrink-0 w-full
        ${isCenter ? 'items-center text-center mx-auto' : isRight ? 'items-end text-right ml-auto' : 'items-start text-left'}
      `}>
        <div className={`w-full ${isCenter ? 'max-w-5xl' : 'max-w-[85%]'} flex flex-col h-full justify-center`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const StatementLayoutImpl: React.FC<LayoutProps> = ({ slide, theme, children, imageToolbar }) => (
  <div className="relative w-full h-full flex flex-col overflow-hidden">
    <div className="flex-[3] p-8 md:p-12 flex flex-col justify-end items-center text-center relative z-20 bg-opacity-50 min-h-0 overflow-hidden shrink-0 pb-6">
      {children}
    </div>
    <div className="flex-[2] relative border-t-2 min-h-[35%] shrink-0 group" style={{ borderColor: theme.colors.border }}>
      <ImageContainer slide={slide} theme={theme} toolbar={imageToolbar} />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/5 pointer-events-none" />
    </div>
  </div>
);

const GalleryLayoutImpl: React.FC<LayoutProps> = ({ slide, theme, children, imageToolbar }) => (
  <div className="w-full h-full p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
    <div
      className="flex-[3] relative overflow-hidden shadow-inner min-h-[40%] shrink-0 group"
      style={{
        borderRadius: `calc(${theme.layout.radius} - 4px)`,
        border: `${theme.layout.borderWidth} solid ${theme.colors.border}`
      }}
    >
      <ImageContainer slide={slide} theme={theme} toolbar={imageToolbar} />
    </div>
    <div className="flex-1 min-h-0 flex items-center justify-between gap-12 px-2 overflow-hidden shrink-0">
      {children}
    </div>
  </div>
);

const CardLayoutImpl: React.FC<LayoutProps> = ({ slide, theme, children, imageToolbar }) => {
  const isRight = slide.alignment === 'right';
  const isCenter = slide.alignment === 'center';

  return (
    <div className="relative w-full h-full flex items-center p-8 md:p-12 overflow-hidden group">
      <div className="absolute inset-0 z-0">
        <ImageContainer slide={slide} theme={theme} toolbar={imageToolbar} />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div
        className={`
          relative z-10 p-8 md:p-12 w-full max-w-2xl max-h-[90%] backdrop-blur-md shadow-2xl border flex flex-col justify-center overflow-hidden min-h-0 shrink-0
          ${isCenter ? 'mx-auto text-center' : isRight ? 'ml-auto text-left' : 'mr-auto text-left'}
        `}
        style={{
          backgroundColor: `${theme.colors.surface}E6`,
          borderRadius: theme.layout.radius,
          borderColor: theme.colors.border
        }}
      >
        {children}
      </div>
    </div>
  );
};

const HorizontalLayoutImpl: React.FC<LayoutProps> = ({ slide, theme, children, imageToolbar }) => (
  <div className="flex flex-col w-full h-full overflow-hidden">
    <div className="h-[45%] relative border-b shrink-0 group" style={{ borderColor: theme.colors.border }}>
      <ImageContainer slide={slide} theme={theme} toolbar={imageToolbar} />
    </div>
    <div className="h-[55%] p-8 md:p-12 flex flex-col justify-center relative z-10 min-h-0 overflow-hidden shrink-0" style={{ background: theme.colors.background }}>
      {children}
    </div>
  </div>
);

const MagazineLayoutImpl: React.FC<LayoutProps> = ({ slide, theme, children, imageToolbar }) => {
  const isRight = slide.alignment === 'right';

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className={`w-[35%] relative h-full shrink-0 group ${isRight ? 'order-2' : 'order-1'}`}>
        <ImageContainer slide={slide} theme={theme} toolbar={imageToolbar} />
        <div className={`absolute top-0 bottom-0 w-px bg-white/20 z-10 ${isRight ? 'left-0' : 'right-0'}`} />
      </div>

      <div className={`w-[65%] p-8 md:p-16 flex flex-col justify-center min-h-0 overflow-hidden shrink-0 ${isRight ? 'order-1' : 'order-2'}`}>
        {children}
      </div>
    </div>
  );
};

// ============ Layout Registry ============

const LAYOUT_COMPONENTS: Record<LayoutType, React.FC<LayoutProps>> = {
  'split': SplitLayoutImpl,
  'full-bleed': FullBleedLayoutImpl,
  'statement': StatementLayoutImpl,
  'gallery': GalleryLayoutImpl,
  'card': CardLayoutImpl,
  'horizontal': HorizontalLayoutImpl,
  'magazine': MagazineLayoutImpl,
};

// ============ Unified Layout Component ============

interface UnifiedLayoutProps extends LayoutProps {
  type: LayoutType;
}

/**
 * Unified Layout component that renders the appropriate layout based on type.
 * Use this for new code instead of individual layout components.
 */
export const Layout: React.FC<UnifiedLayoutProps> = ({ type, ...props }) => {
  const LayoutComponent = LAYOUT_COMPONENTS[type] || LAYOUT_COMPONENTS['split'];
  return <LayoutComponent {...props} />;
};

// ============ Legacy Exports (for backward compatibility) ============

export const SplitLayout = SplitLayoutImpl;
export const FullBleedLayout = FullBleedLayoutImpl;
export const StatementLayout = StatementLayoutImpl;
export const GalleryLayout = GalleryLayoutImpl;
export const CardLayout = CardLayoutImpl;
export const HorizontalLayout = HorizontalLayoutImpl;
export const MagazineLayout = MagazineLayoutImpl;

// ============ Helper to get layout component ============

export const getLayoutComponent = (type: LayoutType): React.FC<LayoutProps> =>
  LAYOUT_COMPONENTS[type] || LAYOUT_COMPONENTS['split'];
