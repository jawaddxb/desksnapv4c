import React, { useState } from 'react';
import { Theme } from '@/types';
import { CURATED_FONT_PAIRINGS } from '@/lib/fonts';
import { ThemePicker } from './ThemePicker';
import { X, Palette, Type, Check, Search } from 'lucide-react';

interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: Theme;
  viewMode: 'standard' | 'wabi-sabi';
  activeWabiSabiLayout: string;
  onApplyTheme: (themeId: string) => void;
  onApplyTypography?: (headingFont: string, bodyFont: string) => void;
  onSetViewMode: (mode: 'standard' | 'wabi-sabi') => void;
  onSetWabiSabiLayout: (layout: string) => void;
}

type TabType = 'theme' | 'typography';

/**
 * Style Panel - Theme and typography controls
 * accessible from the header. Layout controls are now in the main toolbar.
 */
export const StylePanel: React.FC<StylePanelProps> = ({
  isOpen,
  onClose,
  activeTheme,
  onApplyTheme,
  onApplyTypography,
  // Layout props kept for backward compatibility but no longer used here
  // viewMode, activeWabiSabiLayout, onSetViewMode, onSetWabiSabiLayout
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('theme');
  const [customHeading, setCustomHeading] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [showCustomFonts, setShowCustomFonts] = useState(false);

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'theme', label: 'Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'typography', label: 'Type', icon: <Type className="w-4 h-4" /> },
  ];

  const handleApplyCustomFonts = () => {
    if (customHeading && customBody && onApplyTypography) {
      onApplyTypography(customHeading, customBody);
      setShowCustomFonts(false);
      setCustomHeading('');
      setCustomBody('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E2E1E]/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-20 right-4 w-[480px] max-h-[calc(100vh-100px)] bg-white border border-[#D4E5D4] rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4E5D4]">
          <h2 className="text-sm font-semibold text-[#1E2E1E]">Style Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#EDF5F0] rounded transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#D4E5D4]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium
                transition-all duration-150
                ${activeTab === tab.id
                  ? 'text-[#6B8E6B] border-b-2 border-[#6B8E6B] bg-[#EDF5F0]'
                  : 'text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#EDF5F0]'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <p className="text-xs text-[#8FA58F] mb-4">
                Choose a visual theme for your presentation. This affects colors, fonts, and overall aesthetic.
              </p>
              <ThemePicker
                selectedThemeId={activeTheme.id}
                onSelect={onApplyTheme}
                size="default"
                gap="default"
                maxHeight="50vh"
              />
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && onApplyTypography && (
            <div className="space-y-4">
              <p className="text-xs text-[#8FA58F] mb-4">
                Select a font pairing for your presentation. Good typography enhances readability and visual appeal.
              </p>

              {/* Curated pairings */}
              {!showCustomFonts && (
                <div className="space-y-2">
                  {CURATED_FONT_PAIRINGS.map(pair => (
                    <button
                      key={pair.id}
                      onClick={() => onApplyTypography(pair.heading, pair.body)}
                      className="w-full text-left p-4 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg hover:bg-[#EDF5F0] hover:border-[#6B8E6B]/20 group transition-all duration-150"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-[#1E2E1E] group-hover:text-[#6B8E6B] transition-colors">
                          {pair.name}
                        </span>
                        {activeTheme.fonts.heading.includes(pair.heading) && (
                          <Check className="w-4 h-4 text-[#6B8E6B]" />
                        )}
                      </div>
                      <div
                        className="text-xl text-[#1E2E1E] mb-1"
                        style={{ fontFamily: pair.heading }}
                      >
                        {pair.heading}
                      </div>
                      <div
                        className="text-sm text-[#8FA58F]"
                        style={{ fontFamily: pair.body }}
                      >
                        Body text in {pair.body}
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => setShowCustomFonts(true)}
                    className="w-full text-center py-3 text-xs text-[#8FA58F] hover:text-[#6B8E6B] transition-colors"
                  >
                    Use custom Google Fonts
                  </button>
                </div>
              )}

              {/* Custom fonts input */}
              {showCustomFonts && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg text-xs text-[#8FA58F]">
                    Enter the exact name of any Google Font (e.g., "Playfair Display", "Open Sans").
                  </div>

                  <div>
                    <label className="block text-xs text-[#8FA58F] mb-2">Heading Font</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customHeading}
                        onChange={e => setCustomHeading(e.target.value)}
                        placeholder="e.g. Playfair Display"
                        className="w-full p-3 bg-[#F5FAF7] border border-[#D4E5D4] rounded text-sm text-[#1E2E1E] placeholder:text-[#8FA58F] focus:border-[#6B8E6B] focus:outline-none transition-colors"
                      />
                      <Search className="absolute right-3 top-3 w-4 h-4 text-[#8FA58F]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8FA58F] mb-2">Body Font</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customBody}
                        onChange={e => setCustomBody(e.target.value)}
                        placeholder="e.g. Lato"
                        className="w-full p-3 bg-[#F5FAF7] border border-[#D4E5D4] rounded text-sm text-[#1E2E1E] placeholder:text-[#8FA58F] focus:border-[#6B8E6B] focus:outline-none transition-colors"
                      />
                      <Search className="absolute right-3 top-3 w-4 h-4 text-[#8FA58F]" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCustomFonts(false)}
                      className="flex-1 py-2.5 text-sm text-[#8FA58F] hover:text-[#1E2E1E] border border-[#D4E5D4] rounded transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleApplyCustomFonts}
                      disabled={!customHeading || !customBody}
                      className="flex-1 py-2.5 text-sm bg-[#6B8E6B] text-white font-medium rounded disabled:opacity-50 hover:bg-[#5A7A5A] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </>
  );
};
