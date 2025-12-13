/**
 * Mini Slide Previews
 *
 * Consolidated mini layout system for sidebar thumbnails.
 * Uses a registry pattern to eliminate duplication across 7 layout types.
 */

import React from 'react';
import { Slide, Theme } from '@/types';
import { Loader2, Image as ImageIcon } from 'lucide-react';

// ============ Types ============

type LayoutType = 'split' | 'full-bleed' | 'statement' | 'gallery' | 'card' | 'horizontal' | 'magazine';

interface MiniLayoutProps {
  slide: Slide;
  theme: Theme;
}

// ============ Shared Atoms ============

const MiniImage = ({ slide, theme, className = "" }: { slide: Slide; theme: Theme; className?: string }) => (
  <div className={`relative overflow-hidden bg-zinc-100 ${className}`}>
    {slide.isImageLoading ? (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-3 h-3 animate-spin opacity-50" style={{ color: theme.colors.text }} />
      </div>
    ) : slide.imageUrl ? (
      <img src={slide.imageUrl} alt="mini" className="w-full h-full object-cover" />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center opacity-20" style={{ background: theme.colors.surface }}>
        <ImageIcon className="w-4 h-4" style={{ color: theme.colors.text }} />
      </div>
    )}
    {theme.colors.backgroundPattern && !slide.isImageLoading && (
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: theme.colors.backgroundPattern }} />
    )}
  </div>
);

const MiniText = ({ theme, type = 'body' }: { theme: Theme; type?: 'heading' | 'body' }) => (
  <div className="flex flex-col gap-1">
    {type === 'heading' && <div className="h-1.5 w-3/4 rounded-sm" style={{ backgroundColor: theme.colors.text }} />}
    <div className="h-1 w-full rounded-sm opacity-60" style={{ backgroundColor: theme.colors.secondary }} />
    <div className="h-1 w-2/3 rounded-sm opacity-60" style={{ backgroundColor: theme.colors.secondary }} />
  </div>
);

// ============ Layout Implementations ============

const MiniSplitImpl = ({ slide, theme }: MiniLayoutProps) => {
  const isRight = slide.alignment === 'right';
  return (
    <div className="flex w-full h-full">
      <div className={`w-1/2 p-2 flex flex-col justify-center ${isRight ? 'order-2' : 'order-1'}`}>
        <MiniText theme={theme} type="heading" />
      </div>
      <div className={`w-1/2 h-full ${isRight ? 'order-1' : 'order-2'}`}>
        <MiniImage slide={slide} theme={theme} className="w-full h-full" />
      </div>
    </div>
  );
};

const MiniFullBleedImpl = ({ slide, theme }: MiniLayoutProps) => (
  <div className="relative w-full h-full">
    <div className="absolute inset-0">
      <MiniImage slide={slide} theme={theme} className="w-full h-full" />
    </div>
    <div
      className="absolute inset-0 z-10 flex flex-col justify-center p-3"
      style={{ background: `linear-gradient(to right, ${theme.colors.surface}E6 0%, transparent 100%)` }}
    >
      <MiniText theme={theme} type="heading" />
    </div>
  </div>
);

const MiniStatementImpl = ({ slide, theme }: MiniLayoutProps) => (
  <div className="flex flex-col w-full h-full">
    <div className="flex-[2] flex items-center justify-center p-3 text-center bg-opacity-50">
      <div
        className="text-[8px] font-bold leading-tight"
        style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
      >
        {slide.title.substring(0, 20)}{slide.title.length > 20 ? '...' : ''}
      </div>
    </div>
    <div className="flex-1 border-t" style={{ borderColor: theme.colors.border }}>
      <MiniImage slide={slide} theme={theme} className="w-full h-full" />
    </div>
  </div>
);

const MiniGalleryImpl = ({ slide, theme }: MiniLayoutProps) => (
  <div className="flex flex-col w-full h-full p-2 gap-1">
    <div className="flex-[3] rounded-sm overflow-hidden border" style={{ borderColor: theme.colors.border }}>
      <MiniImage slide={slide} theme={theme} className="w-full h-full" />
    </div>
    <div className="flex-1 flex items-center">
      <div className="h-1 w-full rounded-sm bg-zinc-200" />
    </div>
  </div>
);

const MiniCardImpl = ({ slide, theme }: MiniLayoutProps) => (
  <div className="relative w-full h-full">
    <div className="absolute inset-0">
      <MiniImage slide={slide} theme={theme} className="w-full h-full" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="bg-white/90 p-2 rounded-sm shadow-sm w-3/4">
        <MiniText theme={theme} />
      </div>
    </div>
  </div>
);

const MiniHorizontalImpl = ({ slide, theme }: MiniLayoutProps) => (
  <div className="flex flex-col w-full h-full">
    <div className="h-1/2 w-full">
      <MiniImage slide={slide} theme={theme} className="w-full h-full" />
    </div>
    <div
      className="h-1/2 w-full p-2 flex flex-col justify-center"
      style={{ background: theme.colors.background }}
    >
      <MiniText theme={theme} />
    </div>
  </div>
);

const MiniMagazineImpl = ({ slide, theme }: MiniLayoutProps) => {
  const isRight = slide.alignment === 'right';
  return (
    <div className="flex w-full h-full">
      <div className={`w-1/3 h-full ${isRight ? 'order-2' : 'order-1'}`}>
        <MiniImage slide={slide} theme={theme} className="w-full h-full" />
      </div>
      <div className={`w-2/3 h-full p-2 flex flex-col justify-center ${isRight ? 'order-1' : 'order-2'}`}>
        <MiniText theme={theme} type="heading" />
      </div>
    </div>
  );
};

// ============ Layout Registry ============

const MINI_LAYOUT_COMPONENTS: Record<LayoutType, React.FC<MiniLayoutProps>> = {
  'split': MiniSplitImpl,
  'full-bleed': MiniFullBleedImpl,
  'statement': MiniStatementImpl,
  'gallery': MiniGalleryImpl,
  'card': MiniCardImpl,
  'horizontal': MiniHorizontalImpl,
  'magazine': MiniMagazineImpl,
};

// ============ Unified Mini Layout Component ============

interface MiniLayoutUnifiedProps extends MiniLayoutProps {
  type: LayoutType;
}

/**
 * Unified MiniLayout component that renders the appropriate mini preview based on type.
 * Use this for new code instead of individual render functions.
 */
export const MiniLayout: React.FC<MiniLayoutUnifiedProps> = ({ type, ...props }) => {
  const LayoutComponent = MINI_LAYOUT_COMPONENTS[type] || MINI_LAYOUT_COMPONENTS['split'];
  return <LayoutComponent {...props} />;
};

/**
 * Get the mini layout renderer for a given layout type.
 */
export const getMiniLayoutRenderer = (type: LayoutType): React.FC<MiniLayoutProps> =>
  MINI_LAYOUT_COMPONENTS[type] || MINI_LAYOUT_COMPONENTS['split'];

// ============ Legacy Exports (for backward compatibility) ============

export const RenderMiniSplit = MiniSplitImpl;
export const RenderMiniFullBleed = MiniFullBleedImpl;
export const RenderMiniStatement = MiniStatementImpl;
export const RenderMiniGallery = MiniGalleryImpl;
export const RenderMiniCard = MiniCardImpl;
export const RenderMiniHorizontal = MiniHorizontalImpl;
export const RenderMiniMagazine = MiniMagazineImpl;
