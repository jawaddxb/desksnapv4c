import React from 'react';
import { DesignSystem, getSystemsByCategory } from './themes';
import { Check, Palette, Type, Layout, Square } from 'lucide-react';

interface ThemeNavProps {
  themes: DesignSystem[];
  activeThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

/**
 * ThemeNav - Sidebar navigation for browsing design systems
 * Groups themes by category with visual indicators for style differences
 */
export const ThemeNav: React.FC<ThemeNavProps> = ({
  themes,
  activeThemeId,
  onSelectTheme,
}) => {
  const systemsByCategory = getSystemsByCategory();
  const categories = Object.keys(systemsByCategory);

  // Get visual style indicators for a theme
  const getStyleIndicators = (theme: DesignSystem) => {
    const indicators: string[] = [];

    // Font style
    if (theme.typography.fontFamily.includes('serif') && !theme.typography.fontFamily.includes('sans')) {
      indicators.push('Serif');
    } else if (theme.typography.fontFamily.includes('Mono') || theme.typography.fontFamily.includes('mono')) {
      indicators.push('Mono');
    }

    // Layout style
    if (theme.layout.gridStyle !== 'traditional') {
      indicators.push(theme.layout.gridStyle.charAt(0).toUpperCase() + theme.layout.gridStyle.slice(1));
    }

    // Border style
    if (theme.borders.radius === '0px') {
      indicators.push('Sharp');
    } else if (theme.borders.radius === '9999px' || parseInt(theme.borders.radius) >= 20) {
      indicators.push('Round');
    }

    return indicators.slice(0, 2); // Max 2 indicators
  };

  return (
    <div className="w-80 h-full bg-[#FAFAFA] border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Design Systems</h2>
            <p className="text-xs text-gray-500">{themes.length} distinct styles</p>
          </div>
        </div>
      </div>

      {/* Theme List */}
      <div className="flex-1 overflow-y-auto p-3">
        {categories.map(category => (
          <div key={category} className="mb-5">
            {/* Category Header */}
            <div className="px-2 py-1.5 mb-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {category}
              </span>
            </div>

            {/* Themes in Category */}
            <div className="space-y-1">
              {systemsByCategory[category].map((theme) => {
                const isActive = theme.id === activeThemeId;
                const globalIndex = themes.findIndex(t => t.id === theme.id);
                const indicators = getStyleIndicators(theme);

                return (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg
                      transition-all duration-150 text-left group
                      ${isActive
                        ? 'bg-white shadow-sm ring-1 ring-gray-200'
                        : 'hover:bg-white/60'
                      }
                    `}
                  >
                    {/* Theme Preview Mini */}
                    <div
                      className="flex-none w-12 h-10 rounded overflow-hidden flex flex-col"
                      style={{
                        backgroundColor: theme.colors.background,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borders.cardRadius === '0px' ? '0px' : '4px',
                      }}
                    >
                      {/* Mini card representation */}
                      <div
                        className="m-1 flex-1 rounded-sm"
                        style={{
                          backgroundColor: theme.colors.surface,
                          boxShadow: theme.shadows.card !== 'none' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                          borderRadius: theme.borders.cardRadius === '0px' ? '0px' : '2px',
                        }}
                      />
                      {/* Mini accent bar */}
                      <div
                        className="h-1.5 mx-1 mb-1 rounded-sm"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>

                    {/* Theme Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm truncate ${isActive ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {theme.name}
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-violet-600 flex-none" />
                        )}
                      </div>
                      {/* Style indicators */}
                      {indicators.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {indicators.map((indicator, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded"
                            >
                              {indicator}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Keyboard shortcut hint */}
                    <span className="flex-none text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {globalIndex < 9 ? globalIndex + 1 : globalIndex === 9 ? '0' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex-none p-4 border-t border-gray-200 bg-white/50">
        <p className="text-[10px] text-gray-400 text-center">
          Use number keys 1-9, 0 for quick access
          <br />
          Arrow keys to navigate
        </p>
      </div>
    </div>
  );
};
