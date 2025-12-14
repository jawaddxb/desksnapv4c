/**
 * DraftSetupPanel Component
 *
 * Combined content density + theme selection panel.
 * Universal entry point before rough draft generation.
 *
 * Used by:
 * - Copilot chat flow
 * - Ideation flow
 * - Sources flow
 *
 * Design: Studio Noir style with stepped wizard feel.
 */

import React, { useState } from 'react';
import { Theme } from '@/types';
import { ThemeSuggestion } from '@/types/ideation';
import { THEMES, THEME_CATEGORIES, getThemesByCategory } from '@/config/themes';
import { ContentDensity } from '@/lib/contentBlockPrompts';
import { ContentDensitySelector } from './ContentDensitySelector';

interface DraftSetupPanelProps {
  /** AI-suggested theme (optional) */
  suggestion?: ThemeSuggestion;
  /** Currently selected theme ID */
  selectedThemeId: string;
  /** Called when theme is changed */
  onSelectTheme: (themeId: string) => void;
  /** Currently selected density */
  contentDensity: ContentDensity;
  /** Called when density is changed */
  onSelectDensity: (density: ContentDensity) => void;
  /** Called when user confirms. mode: 'direct' builds immediately, 'draft' goes to rough draft review */
  onConfirm: (mode: 'direct' | 'draft') => void;
  /** Called when user wants to go back */
  onBack: () => void;
  /** Whether generation is in progress */
  isLoading?: boolean;
  /** Hide the back button */
  hideBack?: boolean;
  /** Show only draft mode button (hide direct build) */
  draftOnly?: boolean;
}

type ThemeCategory = 'recommended' | 'core' | 'business' | 'luxury' | 'nature' | 'retro' | 'artistic';

const CATEGORY_LABELS: Record<ThemeCategory, string> = {
  recommended: 'Recommended',
  core: 'Modern',
  business: 'Business',
  luxury: 'Luxury',
  nature: 'Nature',
  retro: 'Retro',
  artistic: 'Artistic',
};

const CATEGORY_ORDER: ThemeCategory[] = ['recommended', 'core', 'business', 'luxury', 'nature', 'retro', 'artistic'];

export const DraftSetupPanel: React.FC<DraftSetupPanelProps> = ({
  suggestion,
  selectedThemeId,
  onSelectTheme,
  contentDensity,
  onSelectDensity,
  onConfirm,
  onBack,
  isLoading,
  hideBack,
  draftOnly,
}) => {
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>(suggestion ? 'recommended' : 'core');
  const selectedTheme = THEMES[selectedThemeId];
  const recommendedTheme = suggestion ? THEMES[suggestion.themeId] : null;

  // Get themes for the active category
  const getCategoryThemes = (): Theme[] => {
    if (activeCategory === 'recommended' && suggestion && recommendedTheme) {
      const themes = [recommendedTheme];
      if (suggestion.alternativeIds) {
        suggestion.alternativeIds.forEach(id => {
          const theme = THEMES[id];
          if (theme && !themes.find(t => t.id === id)) {
            themes.push(theme);
          }
        });
      }
      return themes;
    }
    return getThemesByCategory(activeCategory as keyof typeof THEME_CATEGORIES);
  };

  const categoryThemes = getCategoryThemes();
  const categoryList = suggestion ? CATEGORY_ORDER : CATEGORY_ORDER.filter(c => c !== 'recommended');

  return (
    <div className="flex flex-col h-full bg-[#111111] border-l border-white/10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#c5a47e] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wide text-sm">Setup Your Draft</h3>
            <p className="text-xs text-white/50">Choose content depth and visual style</p>
          </div>
        </div>
      </div>

      {/* Step 1: Content Density */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#c5a47e] text-black text-xs font-bold flex items-center justify-center">
            1
          </div>
          <span className="text-xs text-white/60 uppercase tracking-wider font-bold">Content Depth</span>
        </div>
        <ContentDensitySelector
          value={contentDensity}
          onChange={onSelectDensity}
        />
      </div>

      {/* Step 2: Theme Selection */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#c5a47e] text-black text-xs font-bold flex items-center justify-center">
              2
            </div>
            <span className="text-xs text-white/60 uppercase tracking-wider font-bold">Visual Style</span>
          </div>
        </div>

        {/* AI Recommendation Banner (if available) */}
        {suggestion && (
          <div className="px-4 pb-3">
            <div className="p-3 bg-[#c5a47e]/10 border border-[#c5a47e]/20">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#c5a47e] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
                <div>
                  <p className="text-xs text-[#c5a47e] uppercase tracking-wider font-bold mb-0.5">AI Recommendation</p>
                  <p className="text-xs text-white/70">{suggestion.reasoning}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-black/50 scrollbar-hide">
          {categoryList.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === cat
                  ? 'text-[#c5a47e] border-b-2 border-[#c5a47e] bg-white/5'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Theme Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {categoryThemes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedThemeId === theme.id}
                isRecommended={suggestion ? theme.id === suggestion.themeId : false}
                onClick={() => onSelectTheme(theme.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Selected Theme Preview */}
      <div className="px-4 py-3 border-t border-white/10 bg-black/50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/50 uppercase tracking-wider">Selected</p>
            <p className="text-sm font-bold text-white truncate">{selectedTheme?.name}</p>
          </div>
          <div
            className="w-16 h-10 flex-shrink-0 ml-3 relative overflow-hidden"
            style={{
              background: selectedTheme?.colors.background,
              borderRadius: selectedTheme?.layout.radius,
              border: `1px solid ${selectedTheme?.colors.border}`,
            }}
          >
            <div className="absolute inset-1 flex flex-col justify-end">
              <div
                className="text-[8px] font-bold leading-none mb-0.5"
                style={{
                  fontFamily: selectedTheme?.fonts.heading,
                  color: selectedTheme?.colors.text,
                }}
              >
                Aa
              </div>
              <div
                className="w-2/3 h-0.5"
                style={{ background: selectedTheme?.colors.accent }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-white/10 bg-black">
        <div className="flex gap-2 mb-2">
          {!hideBack && (
            <button
              onClick={onBack}
              disabled={isLoading}
              className="px-4 py-3 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-wider
                         hover:border-white/40 hover:text-white transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={() => onConfirm('draft')}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-3
                       ${draftOnly
                         ? 'bg-[#c5a47e] text-black hover:bg-white'
                         : 'border border-[#c5a47e] text-[#c5a47e] hover:bg-[#c5a47e]/10'
                       }
                       font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50`}
          >
            {isLoading ? (
              <>
                <div className={`w-4 h-4 border-2 ${draftOnly ? 'border-black/30 border-t-black' : 'border-[#c5a47e]/30 border-t-[#c5a47e]'} rounded-full animate-spin`} />
                Preparing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                {draftOnly ? 'Generate Draft' : 'Review Draft'}
              </>
            )}
          </button>
        </div>
        {!draftOnly && (
          <>
            <button
              onClick={() => onConfirm('direct')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#c5a47e] text-black
                         font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Build Now
                </>
              )}
            </button>
            <p className="text-[10px] text-white/40 text-center mt-2">
              Review Draft lets you preview and edit slides before finalizing
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Theme Card Sub-component
const ThemeCard: React.FC<{
  theme: Theme;
  isSelected: boolean;
  isRecommended: boolean;
  onClick: () => void;
}> = ({ theme, isSelected, isRecommended, onClick }) => (
  <button
    onClick={onClick}
    className={`relative text-left p-2 transition-all duration-150 ${
      isSelected
        ? 'ring-2 ring-[#c5a47e] bg-white/5'
        : 'border border-white/10 hover:border-white/30 hover:bg-white/5'
    }`}
  >
    {/* Color Preview */}
    <div
      className="w-full h-16 mb-2 relative overflow-hidden"
      style={{
        background: theme.colors.background,
        borderRadius: theme.layout.radius,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Mini preview content */}
      <div className="absolute inset-2 flex flex-col justify-end">
        <div
          className="text-sm font-bold leading-none mb-0.5"
          style={{
            fontFamily: theme.fonts.heading,
            color: theme.colors.text,
            textTransform: theme.layout.headingTransform,
          }}
        >
          Aa
        </div>
        <div
          className="w-2/3 h-1"
          style={{ background: theme.colors.accent }}
        />
      </div>

      {/* Badges */}
      {isRecommended && (
        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#c5a47e] text-black text-[8px] font-bold uppercase tracking-wider">
          AI Pick
        </div>
      )}
      {isSelected && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-[#c5a47e] text-black flex items-center justify-center">
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor" strokeWidth={3}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      )}
    </div>

    {/* Theme Info */}
    <p className="text-xs font-bold text-white truncate">{theme.name}</p>
    <p className="text-[10px] text-white/50 truncate">{theme.description}</p>
  </button>
);

export default DraftSetupPanel;
