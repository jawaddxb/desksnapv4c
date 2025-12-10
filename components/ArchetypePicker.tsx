import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, RefreshCw } from 'lucide-react';
import { ARCHETYPE_CATEGORIES } from '../lib/archetypeCategories';
import { ArchetypeCard } from './ArchetypeCard';

interface ArchetypePickerProps {
  isOpen: boolean;
  onClose: () => void;
  activeArchetype: string;
  onSelect: (archetypeId: string) => void;
  onShuffle: () => void;
}

export const ArchetypePicker: React.FC<ArchetypePickerProps> = ({
  isOpen,
  onClose,
  activeArchetype,
  onSelect,
  onShuffle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setActiveCategory(null);
    }
  }, [isOpen]);

  // Filter categories and archetypes based on search and active category
  const filteredCategories = useMemo(() => {
    let categories = ARCHETYPE_CATEGORIES;

    // Filter by active category tab
    if (activeCategory) {
      categories = categories.filter(c => c.id === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      categories = categories.map(category => ({
        ...category,
        archetypes: category.archetypes.filter(
          a => a.name.toLowerCase().includes(query) ||
            a.description.toLowerCase().includes(query)
        )
      })).filter(c => c.archetypes.length > 0);
    }

    return categories;
  }, [searchQuery, activeCategory]);

  // Count total matching archetypes
  const totalMatches = filteredCategories.reduce((sum, cat) => sum + cat.archetypes.length, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/5"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute top-full right-0 mt-4 w-[600px] max-h-[75vh] bg-white border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right flex flex-col">

        {/* Header with Search */}
        <div className="p-4 border-b border-zinc-100 flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search 70 archetypes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-zinc-400 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 rounded transition-colors"
              >
                <X className="w-3 h-3 text-zinc-400" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Category Tabs */}
        <div
          ref={tabsContainerRef}
          className="flex items-center gap-1 px-4 py-2 border-b border-zinc-100 overflow-x-auto flex-shrink-0 scrollbar-hide"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg whitespace-nowrap transition-all ${activeCategory === null
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'
              }`}
          >
            All
          </button>
          {ARCHETYPE_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg whitespace-nowrap transition-all ${activeCategory === category.id
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'
                }`}
            >
              {category.shortName}
            </button>
          ))}
        </div>

        {/* Archetype Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-zinc-400">No archetypes match "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-zinc-500 hover:text-zinc-900 underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredCategories.map(category => (
              <div key={category.id}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    {category.name}
                  </h3>
                  <span className="text-[10px] text-zinc-300 bg-zinc-100 px-2 py-0.5 rounded-full">
                    {category.archetypes.length}
                  </span>
                </div>

                {/* Archetype Cards Grid */}
                <div className="grid grid-cols-6 gap-2">
                  {category.archetypes.map(archetype => (
                    <ArchetypeCard
                      key={archetype.id}
                      archetype={archetype}
                      isActive={activeArchetype === archetype.id}
                      onClick={() => {
                        onSelect(archetype.id);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/80 flex justify-between items-center flex-shrink-0">
          <button
            onClick={() => {
              onShuffle();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Shuffle
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-400">
              {totalMatches} archetype{totalMatches !== 1 ? 's' : ''}
            </span>
            <div className="h-4 w-px bg-zinc-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              {activeArchetype}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
