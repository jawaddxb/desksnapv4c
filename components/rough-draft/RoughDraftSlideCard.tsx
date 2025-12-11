/**
 * RoughDraftSlideCard Component
 *
 * Individual slide card in the rough draft grid.
 * Shows loading state, image preview, and inline editing.
 */

import React, { useState, useCallback } from 'react';
import { RoughDraftSlide } from '../../services/agents/roughDraftAgent';
import { Theme } from '../../types';

interface RoughDraftSlideCardProps {
  slide: RoughDraftSlide;
  index: number;
  theme: Theme;
  isSelected: boolean;
  isRegenerating: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<RoughDraftSlide>) => void;
  onApprove: () => void;
  onRegenerateImage: () => void;
}

export const RoughDraftSlideCard: React.FC<RoughDraftSlideCardProps> = ({
  slide,
  index,
  theme,
  isSelected,
  isRegenerating,
  onSelect,
  onUpdate,
  onApprove,
  onRegenerateImage,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(slide.title);

  // Save title on blur or enter
  const handleTitleSave = useCallback(() => {
    if (editTitle.trim() !== slide.title) {
      onUpdate({ title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  }, [editTitle, slide.title, onUpdate]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(slide.title);
      setIsEditingTitle(false);
    }
  }, [handleTitleSave, slide.title]);

  // Approval badge color - Studio Noir palette (gold + white only)
  const getApprovalBadge = () => {
    switch (slide.approvalState) {
      case 'approved':
        return { bg: 'bg-[#c5a47e]/20', text: 'text-[#c5a47e]', label: 'Approved' };
      case 'modified':
        return { bg: 'bg-white/10', text: 'text-white/70', label: 'Modified' };
      default:
        return { bg: 'bg-white/5', text: 'text-white/40', label: 'Pending' };
    }
  };

  const approval = getApprovalBadge();

  return (
    <div
      className={`group relative bg-[#111111] border transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:shadow-black/50 hover:-translate-y-0.5 ${
        isSelected
          ? 'border-[#c5a47e] ring-2 ring-[#c5a47e]/30 ring-offset-2 ring-offset-black'
          : 'border-white/10 hover:border-[#c5a47e]/50'
      }`}
      onClick={onSelect}
      style={{
        animation: 'fadeInUp 0.3s ease-out forwards',
        animationDelay: `${index * 50}ms`,
        opacity: 0,
      }}
    >
      {/* Slide number */}
      <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-black/80 text-white text-xs font-bold flex items-center justify-center">
        {index + 1}
      </div>

      {/* Status badges */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
        <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-bold ${approval.bg} ${approval.text}`}>
          {approval.label}
        </span>
      </div>

      {/* Image area (16:9 aspect) */}
      <div className="relative aspect-video overflow-hidden">
        {slide.isImageLoading || isRegenerating ? (
          // Loading state with pulsing background
          <div
            className="w-full h-full flex flex-col items-center justify-center relative"
            style={{ background: theme.colors.surface }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#c5a47e]/5 to-transparent animate-pulse" />
            <div className="w-8 h-8 border-2 border-[#c5a47e]/30 border-t-[#c5a47e] rounded-full animate-spin mb-2 relative z-10" />
            <span className="text-[10px] text-white/40 uppercase tracking-wider relative z-10">
              {isRegenerating ? 'Regenerating...' : 'Generating...'}
            </span>
          </div>
        ) : slide.imageError ? (
          // Error state
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4"
            style={{ background: theme.colors.surface }}
          >
            <svg className="w-6 h-6 text-red-400 mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span className="text-[10px] text-red-400 text-center line-clamp-2">{slide.imageError}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRegenerateImage();
              }}
              className="mt-2 text-[10px] text-[#c5a47e] hover:text-white uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
        ) : slide.imageUrl ? (
          // Image loaded with fade-in
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        ) : (
          // Placeholder
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: theme.colors.surface }}
          >
            <svg className="w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        )}

        {/* Hover overlay with actions */}
        {!slide.isImageLoading && !isRegenerating && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRegenerateImage();
              }}
              className="p-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Regenerate image"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
            {slide.approvalState !== 'approved' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                }}
                className="p-2 bg-[#c5a47e]/20 hover:bg-[#c5a47e]/40 text-[#c5a47e] transition-colors"
                title="Approve slide"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-3">
        {/* Title - editable */}
        {isEditingTitle ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="w-full bg-transparent text-sm font-bold text-white border-b border-[#c5a47e] focus:outline-none"
          />
        ) : (
          <h3
            className="text-sm font-bold text-white line-clamp-1 cursor-text hover:text-[#c5a47e] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
            title="Double-click to edit"
          >
            {slide.title}
          </h3>
        )}

        {/* Bullet preview */}
        <div className="mt-1.5 space-y-0.5">
          {slide.content.slice(0, 2).map((bullet, i) => (
            <p key={i} className="text-[10px] text-white/50 line-clamp-1">
              {bullet}
            </p>
          ))}
          {slide.content.length > 2 && (
            <p className="text-[10px] text-white/30">
              +{slide.content.length - 2} more...
            </p>
          )}
        </div>

        {/* Layout badge */}
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[8px] text-white/30 uppercase tracking-wider">
            {slide.layoutType}
          </span>
          <span className="text-[8px] text-white/20">|</span>
          <span className="text-[8px] text-white/30 uppercase tracking-wider">
            {slide.alignment}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoughDraftSlideCard;
