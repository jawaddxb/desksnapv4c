/**
 * ThemePicker Component
 *
 * Reusable theme grid for selecting themes.
 * Used by AppHeader and RemixDialog.
 *
 * Single Responsibility: Display and handle theme selection.
 */

import React from 'react';
import { Check, FileSpreadsheet } from 'lucide-react';
import { Theme } from '@/types';
import { THEMES } from '@/config/themes';
import { isPptxSafe } from '@/lib/fontCompatibility';
import { getThemeThumbnailPath } from '@/services/thumbnailService';

export interface ThemePickerProps {
  /** Currently selected theme ID */
  selectedThemeId: string;
  /** Called when a theme is selected */
  onSelect: (themeId: string) => void;
  /** Optional: show "Current" badge on this theme ID (for comparison UIs) */
  currentThemeId?: string;
  /** Thumbnail height variant */
  size?: 'default' | 'compact';
  /** Grid gap size */
  gap?: 'default' | 'compact';
  /** Max height for scrollable area */
  maxHeight?: string;
  /** Class name for the container */
  className?: string;
}

/**
 * ThemePicker - Reusable theme selection grid
 */
export const ThemePicker: React.FC<ThemePickerProps> = ({
  selectedThemeId,
  onSelect,
  currentThemeId,
  size = 'default',
  gap = 'default',
  maxHeight = '60vh',
  className = '',
}) => {
  const isDefault = size === 'default';
  const thumbnailHeight = isDefault ? 'h-32' : 'h-24';
  const thumbnailMarginBottom = isDefault ? 'mb-3' : 'mb-2';
  const textSize = isDefault ? 'text-sm' : 'text-xs';
  const previewTextSize = isDefault ? 'text-2xl' : 'text-xl';
  const checkSize = isDefault ? 'w-6 h-6' : 'w-5 h-5';
  const checkIconSize = isDefault ? 'w-3.5 h-3.5' : 'w-3 h-3';
  const checkPosition = isDefault ? 'top-3 right-3' : 'top-2 right-2';
  const badgePosition = isDefault ? 'bottom-2 left-2' : 'bottom-1 left-1';
  const paddingInner = isDefault ? 'p-4' : 'p-3';
  const gridGap = gap === 'default' ? 'gap-4' : 'gap-3';

  return (
    <div
      className={`grid grid-cols-2 ${gridGap} overflow-y-auto p-1 ${className}`}
      style={{ maxHeight }}
    >
      {Object.values(THEMES).map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`group relative flex flex-col items-start text-left transition-all duration-150 p-1 rounded-lg ${
            selectedThemeId === theme.id
              ? 'bg-[#6B8E6B]/10 ring-1 ring-[#6B8E6B]'
              : 'hover:bg-[#EDF5F0]'
          }`}
        >
          <div
            className={`w-full ${thumbnailHeight} ${thumbnailMarginBottom} relative overflow-hidden shadow-sm transition-transform duration-150 group-hover:scale-[1.01]`}
            style={{
              background: theme.colors.background,
              border: `${theme.layout.borderWidth} solid ${theme.colors.border}`,
              borderRadius: theme.layout.radius,
            }}
          >
            {/* Thumbnail image with fallback */}
            <img
              src={getThemeThumbnailPath(theme.id)}
              alt={theme.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />

            {/* Fallback: inline color preview */}
            <div
              className={`hidden absolute inset-0 flex-col ${paddingInner}`}
              style={{ background: theme.colors.background }}
            >
              <div className="relative z-10 mt-auto">
                <div
                  className={`${previewTextSize} leading-none mb-2`}
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors.text,
                  }}
                >
                  Aa
                </div>
              </div>
            </div>

            {/* Selected indicator */}
            {selectedThemeId === theme.id && (
              <div
                className={`absolute ${checkPosition} ${checkSize} bg-[#6B8E6B] text-white rounded-md flex items-center justify-center shadow-md z-20`}
              >
                <Check className={checkIconSize} strokeWidth={3} />
              </div>
            )}

            {/* Current theme badge (for comparison UIs like RemixDialog) */}
            {currentThemeId && currentThemeId === theme.id && selectedThemeId !== theme.id && (
              <div className={`absolute ${checkPosition} px-1.5 py-0.5 bg-[#8FA58F] text-white rounded text-[8px] font-bold uppercase tracking-wider z-20`}>
                Current
              </div>
            )}

            {/* PowerPoint Safe Badge */}
            {isPptxSafe(theme) && (
              <div
                className={`absolute ${badgePosition} px-1.5 py-0.5 bg-emerald-500/90 text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 z-20`}
              >
                <FileSpreadsheet className="w-2.5 h-2.5" />
                PPT
              </div>
            )}
          </div>

          <div className="px-2 pb-2 w-full">
            <span className={`${textSize} font-bold text-[#1E2E1E]`}>{theme.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemePicker;
