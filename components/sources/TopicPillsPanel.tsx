/**
 * TopicPillsPanel Component
 *
 * Displays detected themes and content types as interactive pills
 * after comprehensive content extraction. Users can filter notes
 * by toggling pills before moving them to the ideation board.
 */

import React, { useState, useMemo } from 'react';
import { NoteCategory } from '@/types/ideation';
import { Check, Filter, ArrowRight, Sparkles } from 'lucide-react';

interface TopicPillsPanelProps {
  themes: string[];
  types: NoteCategory[];
  noteCount: number;
  title: string;
  onAcceptAll: () => void;
  onFilteredAccept: (selectedThemes: string[], selectedTypes: NoteCategory[]) => void;
  onCancel?: () => void;
}

// Pill colors for different note categories
const TYPE_COLORS: Record<NoteCategory, string> = {
  statistic: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  quote: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  framework: 'bg-green-500/20 border-green-500/40 text-green-300',
  example: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  definition: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  insight: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
  trend: 'bg-red-500/20 border-red-500/40 text-red-300',
  comparison: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
};

// Category labels for display
const TYPE_LABELS: Record<NoteCategory, string> = {
  statistic: 'Statistics',
  quote: 'Quotes',
  framework: 'Frameworks',
  example: 'Examples',
  definition: 'Definitions',
  insight: 'Insights',
  trend: 'Trends',
  comparison: 'Comparisons',
};

export const TopicPillsPanel: React.FC<TopicPillsPanelProps> = ({
  themes,
  types,
  noteCount,
  title,
  onAcceptAll,
  onFilteredAccept,
  onCancel,
}) => {
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<NoteCategory>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = selectedThemes.size > 0 || selectedTypes.size > 0;

  // Toggle theme selection
  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => {
      const next = new Set(prev);
      if (next.has(theme)) {
        next.delete(theme);
      } else {
        next.add(theme);
      }
      return next;
    });
  };

  // Toggle type selection
  const toggleType = (type: NoteCategory) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Handle filtered accept
  const handleFilteredAccept = () => {
    onFilteredAccept(
      Array.from(selectedThemes),
      Array.from(selectedTypes)
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedThemes(new Set());
    setSelectedTypes(new Set());
  };

  return (
    <div className="p-4 border-t border-white/10 bg-gradient-to-b from-white/5 to-transparent">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#c5a47e]" />
        <p className="text-sm font-medium text-white">
          Extracted {noteCount} items from "{title}"
        </p>
      </div>

      <p className="text-xs text-white/60 mb-4">
        All content has been categorized. Choose how to proceed:
      </p>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onAcceptAll}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c5a47e] hover:bg-[#d4b38f] text-black font-medium text-sm rounded-lg transition-colors"
        >
          <Check className="w-4 h-4" />
          Use All ({noteCount})
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 border text-sm rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-white/10 border-white/30 text-white'
              : 'bg-transparent border-white/20 text-white/70 hover:bg-white/5'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Filter Panel (expandable) */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          {/* Themes */}
          {themes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 uppercase tracking-wider">Themes</span>
                {selectedThemes.size > 0 && (
                  <button
                    onClick={() => setSelectedThemes(new Set())}
                    className="text-xs text-white/40 hover:text-white/60"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {themes.map(theme => (
                  <button
                    key={theme}
                    onClick={() => toggleTheme(theme)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                      selectedThemes.has(theme)
                        ? 'bg-[#c5a47e]/20 border-[#c5a47e]/50 text-[#c5a47e]'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {selectedThemes.has(theme) && <Check className="w-3 h-3 inline mr-1" />}
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Types */}
          {types.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 uppercase tracking-wider">Content Types</span>
                {selectedTypes.size > 0 && (
                  <button
                    onClick={() => setSelectedTypes(new Set())}
                    className="text-xs text-white/40 hover:text-white/60"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                      selectedTypes.has(type)
                        ? TYPE_COLORS[type]
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {selectedTypes.has(type) && <Check className="w-3 h-3 inline mr-1" />}
                    {TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Action */}
          {hasActiveFilters && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleFilteredAccept}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors border border-white/20"
              >
                <ArrowRight className="w-4 h-4" />
                Use Selected Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-white/50 hover:text-white/70 text-sm transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancel option */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full mt-3 py-2 text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          Cancel and remove source
        </button>
      )}
    </div>
  );
};

export default TopicPillsPanel;
