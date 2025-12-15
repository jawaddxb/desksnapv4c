/**
 * ArchetypeGallery
 *
 * Full gallery of 60+ archetypes with categories and search.
 * Replaces limited dropdown with comprehensive selection.
 *
 * KISS: Filterable grid < 120 lines
 * SOLID-S: Gallery renders, filtering logic is simple inline
 * DRY: Uses existing archetype data from config
 */

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ARCHETYPE_CATEGORY_DEFINITIONS, searchArchetypes } from '@/config/archetypes';

interface ArchetypeGalleryProps {
  selectedArchetype: string;
  onSelect: (archetype: string) => void;
  onClose?: () => void;
}

export const ArchetypeGallery: React.FC<ArchetypeGalleryProps> = ({
  selectedArchetype,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter archetypes based on search and category
  const filteredCategories = useMemo(() => {
    if (searchQuery.trim()) {
      // Search mode: show flat list of matching archetypes
      const matches = searchArchetypes(searchQuery);
      return [{
        id: 'search-results',
        name: `Results for "${searchQuery}"`,
        shortName: 'Results',
        icon: 'Search',
        description: '',
        archetypes: matches,
      }];
    }

    if (activeCategory) {
      return ARCHETYPE_CATEGORY_DEFINITIONS.filter(c => c.id === activeCategory);
    }

    return ARCHETYPE_CATEGORY_DEFINITIONS;
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* Header with search */}
      <div className="flex-none p-4 border-b border-[#D4E5D4]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FA58F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archetypes..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#D4E5D4] rounded-lg text-sm text-[#1E2E1E] placeholder-[#8FA58F] focus:outline-none focus:border-[#6B8E6B] focus:ring-2 focus:ring-[#6B8E6B]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA58F] hover:text-[#1E2E1E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category pills */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                !activeCategory
                  ? 'bg-[#6B8E6B] text-white'
                  : 'bg-[#EDF5F0] text-[#4A5D4A] hover:bg-[#D4E5D4]'
              }`}
            >
              All
            </button>
            {ARCHETYPE_CATEGORY_DEFINITIONS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#6B8E6B] text-white'
                    : 'bg-[#EDF5F0] text-[#4A5D4A] hover:bg-[#D4E5D4]'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Archetype grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="mb-6 last:mb-0">
            <h3 className="text-xs font-bold text-[#8FA58F] uppercase tracking-wider mb-3">
              {category.name}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {category.archetypes.map((archetype) => {
                const isSelected = archetype === selectedArchetype;
                return (
                  <button
                    key={archetype}
                    onClick={() => {
                      onSelect(archetype);
                      onClose?.();
                    }}
                    className={`p-3 rounded-lg text-xs font-medium text-center transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#6B8E6B] text-white ring-2 ring-[#6B8E6B] ring-offset-2'
                        : 'bg-white border border-[#D4E5D4] text-[#4A5D4A] hover:border-[#6B8E6B]/50 hover:bg-[#F5FAF7]'
                    }`}
                  >
                    {archetype}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex-none px-4 py-3 border-t border-[#D4E5D4] bg-[#F5FAF7]">
        <p className="text-xs text-[#8FA58F] text-center">
          {ARCHETYPE_CATEGORY_DEFINITIONS.reduce((sum, c) => sum + c.archetypes.length, 0)} archetypes available
        </p>
      </div>
    </div>
  );
};
