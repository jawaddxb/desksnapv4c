/**
 * Archetype Factory
 *
 * Creates archetype components from configuration objects.
 * DRY: Consolidates the identical patterns found across 118 archetype files.
 *
 * Design Goals:
 * - Reduce boilerplate while preserving full flexibility
 * - Support static values, dynamic functions, and escape hatches
 * - Allow gradual migration: factory archetypes + custom archetypes coexist
 */

import React from 'react';
import { Slide, Theme } from '../../types';
import { PRNG } from '../../lib/utils';
import { LayoutLayer } from '../../config';
import { EditableTitle, EditableContent } from '../WabiSabiComponents';
import { ImageContainer } from '../StandardLayouts';

// ============ Types ============

export interface ArchetypeProps {
  slide: Slide;
  theme: Theme;
  contrast: {
    bg: string;
    text: string;
    accent: string;
    secondary: string;
    border: string;
    mode: string;
  };
  rng?: PRNG;
  onUpdateSlide?: (updates: Partial<Slide>) => void;
  readOnly?: boolean;
}

export interface ContrastConfig {
  text: string;
  secondary?: string;
}

/** Context passed to dynamic functions */
export interface ArchetypeContext {
  slide: Slide;
  theme: Theme;
  rng: PRNG;
  contrast: ArchetypeProps['contrast'];
}

/** Value that can be static or computed from context */
export type DynamicValue<T> = T | ((ctx: ArchetypeContext) => T);

/** Resolve a dynamic value */
function resolve<T>(value: DynamicValue<T>, ctx: ArchetypeContext): T {
  return typeof value === 'function' ? (value as (ctx: ArchetypeContext) => T)(ctx) : value;
}

// ============ Configuration Interface ============

export type ArchetypeCategory =
  | 'corporate'
  | 'wabi-sabi'
  | 'editorial'
  | 'natural'
  | 'cultural'
  | 'tech'
  | 'cinematic'
  | 'design-movements'
  | 'cultural-heritage'
  | 'historical-period'
  | 'artisanal-craft'
  | 'atmospheric'
  | 'typography-print'
  | 'contemporary-art'
  | 'future-speculative';

export interface TitleRenderProps {
  slide: Slide;
  theme: Theme;
  contrast: ContrastConfig;
  onUpdateSlide?: (updates: Partial<Slide>) => void;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ContentRenderProps {
  slide: Slide;
  theme: Theme;
  contrast: ContrastConfig;
  onUpdateSlide?: (updates: Partial<Slide>) => void;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  bullet?: boolean;
}

export interface ImageRenderProps {
  slide: Slide;
  theme: Theme;
  position: 'left' | 'right' | 'background' | 'bottom' | 'top' | 'custom';
  className?: string;
}

export interface ArchetypeConfig {
  /** Unique identifier for the archetype */
  id: string;

  /** Display name for the archetype */
  name: string;

  /** Category for organization */
  category: ArchetypeCategory;

  /** Container configuration */
  container: {
    /** Background color/gradient - can be static string or dynamic function */
    background: DynamicValue<string>;
    /** Additional CSS classes */
    className?: DynamicValue<string>;
    /** Inline styles */
    style?: DynamicValue<React.CSSProperties>;
  };

  /** Title configuration */
  title: {
    /** Text contrast settings */
    contrast: DynamicValue<ContrastConfig>;
    /** CSS class overrides */
    className?: DynamicValue<string>;
    /** Style overrides */
    style?: DynamicValue<React.CSSProperties>;
    /** ESCAPE HATCH: Custom render function for unique title styling */
    render?: (props: TitleRenderProps) => React.ReactNode;
  };

  /** Content/body text configuration */
  content: {
    /** Text contrast settings */
    contrast: DynamicValue<ContrastConfig>;
    /** CSS class overrides */
    className?: DynamicValue<string>;
    /** Style overrides */
    style?: DynamicValue<React.CSSProperties>;
    /** Show bullets (default: true) */
    bullet?: boolean;
    /** ESCAPE HATCH: Custom render function for unique content styling */
    render?: (props: ContentRenderProps) => React.ReactNode;
  };

  /** Image configuration (optional - some archetypes don't show images) */
  image?: {
    /** Position of image in layout */
    position: 'left' | 'right' | 'background' | 'bottom' | 'top' | 'custom';
    /** CSS classes */
    className?: DynamicValue<string>;
    /** Container style */
    containerStyle?: DynamicValue<React.CSSProperties>;
    /** ESCAPE HATCH: Custom render function */
    render?: (props: ImageRenderProps) => React.ReactNode;
  };

  /** Layout configuration */
  layout?: {
    /** Direction of main content flex */
    direction?: DynamicValue<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
    /** Gap between elements */
    gap?: DynamicValue<string>;
    /** Content alignment */
    align?: DynamicValue<'start' | 'center' | 'end' | 'stretch'>;
    /** Content justification */
    justify?: DynamicValue<'start' | 'center' | 'end' | 'between' | 'around'>;
    /** Padding */
    padding?: DynamicValue<string>;
  };

  /** Decorations - static elements, dynamic function, or render function */
  decorations?: DynamicValue<React.ReactNode>;

  /** Header section (optional - for archetypes with header bars) */
  header?: {
    /** Render function for header content */
    render: (ctx: ArchetypeContext) => React.ReactNode;
    /** Header styles */
    style?: DynamicValue<React.CSSProperties>;
    /** Header classes */
    className?: DynamicValue<string>;
  };

  /** Footer section (optional - for archetypes with footer bars) */
  footer?: {
    /** Render function for footer content */
    render: (ctx: ArchetypeContext) => React.ReactNode;
    /** Footer styles */
    style?: DynamicValue<React.CSSProperties>;
    /** Footer classes */
    className?: DynamicValue<string>;
  };

  /** ULTIMATE ESCAPE HATCH: Completely override the factory render */
  customRender?: (props: ArchetypeProps) => React.ReactNode;
}

// ============ Factory Function ============

/**
 * Creates an archetype component from a configuration object.
 *
 * @example Simple archetype
 * ```typescript
 * const DeckArchetype = createArchetype({
 *   id: 'deck',
 *   name: 'Deck',
 *   category: 'corporate',
 *   container: { background: '#ffffff' },
 *   title: { contrast: { text: '#1e3a5f' } },
 *   content: { contrast: { text: '#4b5563' } },
 *   image: { position: 'right' },
 * });
 * ```
 *
 * @example Dynamic archetype
 * ```typescript
 * const KintsugiArchetype = createArchetype({
 *   id: 'kintsugi',
 *   name: 'Kintsugi',
 *   category: 'wabi-sabi',
 *   container: {
 *     background: (ctx) => ctx.rng.pick(['#1a1a2e', '#1e1e2f']),
 *   },
 *   title: {
 *     contrast: (ctx) => ({ text: ctx.rng.pick(['#e8e0d5', '#f0e8dd']) }),
 *   },
 *   content: { contrast: { text: '#a8a0a0' } },
 *   decorations: (ctx) => <GoldCrackSVG seed={ctx.slide.id} />,
 * });
 * ```
 */
export function createArchetype(config: ArchetypeConfig): React.FC<ArchetypeProps> {
  const ArchetypeComponent: React.FC<ArchetypeProps> = (props) => {
    const { slide, theme, contrast, rng, onUpdateSlide, readOnly } = props;

    // Create context for dynamic value resolution
    // Use a stable RNG - if none provided, create one from slide ID
    const stableRng = rng ?? new PRNG(slide.id);
    const ctx: ArchetypeContext = { slide, theme, rng: stableRng, contrast };

    // ESCAPE HATCH: If customRender is provided, use it entirely
    if (config.customRender) {
      return <>{config.customRender(props)}</>;
    }

    // Resolve all dynamic values
    const background = resolve(config.container.background, ctx);
    const containerClassName = resolve(config.container.className, ctx) || '';
    const containerStyle = resolve(config.container.style, ctx) || {};

    const titleContrast = resolve(config.title.contrast, ctx);
    const titleClassName = resolve(config.title.className, ctx) || '';
    const titleStyle = resolve(config.title.style, ctx) || {};

    const contentContrast = resolve(config.content.contrast, ctx);
    const contentClassName = resolve(config.content.className, ctx) || '';
    const contentStyle = resolve(config.content.style, ctx) || {};
    const showBullets = config.content.bullet !== false;

    const layout = config.layout || {};
    const direction = resolve(layout.direction, ctx) || 'row';
    const gap = resolve(layout.gap, ctx) || '3rem';
    const align = resolve(layout.align, ctx) || 'center';
    const justify = resolve(layout.justify, ctx) || 'start';
    const padding = resolve(layout.padding, ctx) || '3rem';

    // Build flex direction class
    const directionClass =
      direction === 'row'
        ? 'flex-row'
        : direction === 'column'
          ? 'flex-col'
          : direction === 'row-reverse'
            ? 'flex-row-reverse'
            : 'flex-col-reverse';

    const alignClass = `items-${align}`;
    const justifyClass = justify === 'between' ? 'justify-between' : justify === 'around' ? 'justify-around' : `justify-${justify}`;

    // Render decorations
    const decorations = config.decorations ? resolve(config.decorations, ctx) : null;

    // Determine content/image split
    const imagePosition = config.image?.position || 'right';
    const imageClassName = config.image ? resolve(config.image.className, ctx) || '' : '';
    const imageContainerStyle = config.image ? resolve(config.image.containerStyle, ctx) || {} : {};

    // Render title
    const renderTitle = () => {
      if (config.title.render) {
        return config.title.render({
          slide,
          theme,
          contrast: titleContrast,
          onUpdateSlide,
          readOnly,
          className: titleClassName,
          style: titleStyle,
        });
      }
      return (
        <EditableTitle
          slide={slide}
          theme={theme}
          contrast={titleContrast}
          onUpdateSlide={onUpdateSlide}
          readOnly={readOnly}
          className={titleClassName}
          style={titleStyle}
        />
      );
    };

    // Render content
    const renderContent = () => {
      if (config.content.render) {
        return config.content.render({
          slide,
          theme,
          contrast: contentContrast,
          onUpdateSlide,
          readOnly,
          className: contentClassName,
          style: contentStyle,
          bullet: showBullets,
        });
      }
      return (
        <EditableContent
          slide={slide}
          theme={theme}
          contrast={contentContrast}
          onUpdateSlide={onUpdateSlide}
          readOnly={readOnly}
          className={contentClassName}
          style={contentStyle}
          bullet={showBullets}
        />
      );
    };

    // Render image
    const renderImage = () => {
      if (!config.image) return null;

      if (config.image.render) {
        return config.image.render({
          slide,
          theme,
          position: imagePosition,
          className: imageClassName,
        });
      }

      return (
        <div className={`relative ${imageClassName}`} style={{ zIndex: LayoutLayer.MEDIA, ...imageContainerStyle }}>
          <ImageContainer slide={slide} theme={theme} />
        </div>
      );
    };

    // Render header
    const renderHeader = () => {
      if (!config.header) return null;
      const headerClassName = resolve(config.header.className, ctx) || '';
      const headerStyle = resolve(config.header.style, ctx) || {};
      return (
        <div className={headerClassName} style={{ zIndex: LayoutLayer.OVERLAY, ...headerStyle }}>
          {config.header.render(ctx)}
        </div>
      );
    };

    // Render footer
    const renderFooter = () => {
      if (!config.footer) return null;
      const footerClassName = resolve(config.footer.className, ctx) || '';
      const footerStyle = resolve(config.footer.style, ctx) || {};
      return (
        <div className={footerClassName} style={{ zIndex: LayoutLayer.OVERLAY, ...footerStyle }}>
          {config.footer.render(ctx)}
        </div>
      );
    };

    // Build content area based on image position
    const renderMainContent = () => {
      const contentArea = (
        <div className="flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
          {renderTitle()}
          {renderContent()}
        </div>
      );

      const imageArea = renderImage();

      // Background image position
      if (imagePosition === 'background') {
        return (
          <>
            <div className="absolute inset-0" style={{ zIndex: LayoutLayer.BACKGROUND }}>
              {imageArea}
            </div>
            <div className="relative z-10 w-full h-full flex flex-col justify-center" style={{ padding }}>
              {contentArea}
            </div>
          </>
        );
      }

      // Split layouts (row/column with image)
      if (imageArea) {
        const contentFirst = imagePosition === 'right' || imagePosition === 'bottom';

        return (
          <div className={`flex ${directionClass} ${alignClass} ${justifyClass} w-full h-full`} style={{ padding, gap }}>
            {contentFirst ? (
              <>
                <div className="flex-1">{contentArea}</div>
                <div className="flex-1">{imageArea}</div>
              </>
            ) : (
              <>
                <div className="flex-1">{imageArea}</div>
                <div className="flex-1">{contentArea}</div>
              </>
            )}
          </div>
        );
      }

      // No image - just content
      return (
        <div className={`flex ${directionClass} ${alignClass} ${justifyClass} w-full h-full`} style={{ padding, gap }}>
          {contentArea}
        </div>
      );
    };

    return (
      <div
        className={`w-full h-full relative overflow-hidden ${containerClassName}`}
        style={{ background, ...containerStyle }}
      >
        {/* Decorations layer */}
        {decorations}

        {/* Header */}
        {renderHeader()}

        {/* Main content */}
        {renderMainContent()}

        {/* Footer */}
        {renderFooter()}
      </div>
    );
  };

  ArchetypeComponent.displayName = `${config.name}Archetype`;
  return ArchetypeComponent;
}

// ============ Helper: Register Custom Archetype ============

/**
 * For archetypes that are too unique for the factory pattern.
 * Use this to maintain consistent naming while using a fully custom component.
 *
 * @example
 * ```typescript
 * export const ComplexAnimatedArchetype = registerCustomArchetype(
 *   'complex-animated',
 *   ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
 *     // Fully custom implementation
 *     return <CustomComplexComponent ... />;
 *   }
 * );
 * ```
 */
export function registerCustomArchetype(
  id: string,
  component: React.FC<ArchetypeProps>
): React.FC<ArchetypeProps> {
  component.displayName = `${id}Archetype`;
  return component;
}

// ============ Type Exports ============

export type { ArchetypeProps as ArchetypeComponentProps };
