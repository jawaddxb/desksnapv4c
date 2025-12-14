/**
 * ImagePlaceholder Component
 *
 * Shows DeckSnap branding as a placeholder when slide image is not yet generated.
 * User can trigger image generation manually.
 *
 * Design: Subtle gradient with DeckSnap logo, "Generate Image" button on hover.
 */

import React from 'react';
import { Sparkles, ImageIcon } from 'lucide-react';
import { Theme } from '@/types';

interface ImagePlaceholderProps {
  /** Theme for styling */
  theme: Theme;
  /** Called when user wants to generate image */
  onGenerate: () => void;
  /** Whether image generation is in progress */
  isGenerating?: boolean;
  /** Size variant */
  size?: 'compact' | 'default' | 'large';
  /** Additional class name */
  className?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  theme,
  onGenerate,
  isGenerating = false,
  size = 'default',
  className = '',
}) => {
  const iconSize = size === 'compact' ? 20 : size === 'large' ? 32 : 24;
  const textSize = size === 'compact' ? 'text-[8px]' : size === 'large' ? 'text-xs' : 'text-[10px]';
  const buttonPadding = size === 'compact' ? 'px-2 py-1' : 'px-3 py-1.5';

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center group ${className}`}
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%)`,
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.colors.accent} 2px, transparent 2px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* DeckSnap branding */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon */}
        <div
          className="w-12 h-12 flex items-center justify-center mb-2"
          style={{
            background: `${theme.colors.accent}20`,
            borderRadius: theme.layout.radius,
          }}
        >
          <ImageIcon
            size={iconSize}
            style={{ color: theme.colors.accent }}
            strokeWidth={1.5}
          />
        </div>

        {/* Brand text */}
        <div className={`${textSize} font-bold uppercase tracking-[0.2em] opacity-40 mb-1`} style={{ color: theme.colors.text }}>
          DeckSnap
        </div>
        <div className={`${textSize} opacity-30`} style={{ color: theme.colors.secondary }}>
          Image will be generated here
        </div>
      </div>

      {/* Generate button - visible on hover or always on mobile */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isGenerating) onGenerate();
          }}
          disabled={isGenerating}
          className={`
            ${buttonPadding} flex items-center gap-2
            bg-[#c5a47e] text-black text-xs font-bold uppercase tracking-wider
            opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
            transition-all duration-200 disabled:opacity-50
            hover:bg-white
          `}
        >
          {isGenerating ? (
            <>
              <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              Generate Image
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImagePlaceholder;
