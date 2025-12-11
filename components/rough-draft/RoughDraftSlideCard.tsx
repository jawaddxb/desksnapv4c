/**
 * RoughDraftSlideCard Component
 *
 * Individual slide card in the rough draft grid.
 * Shows loading state, image preview, and inline editing.
 * When selected, expands to show full editing capabilities.
 */

import React, { useState, useCallback } from 'react';
import { RoughDraftSlide } from '../../services/agents/roughDraftAgent';
import { Theme } from '../../types';
import { RefreshCw, Check, ChevronUp, Plus, Trash2, Sparkles, Search, Wand2 } from 'lucide-react';

interface RoughDraftSlideCardProps {
  slide: RoughDraftSlide;
  index: number;
  theme: Theme;
  visualStyle: string;
  isSelected: boolean;
  isRegenerating: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<RoughDraftSlide>) => void;
  onApprove: () => void;
  onRegenerateImage: () => void;
  onAIEnhance?: (mode: 'research' | 'rewrite' | 'custom', customPrompt?: string) => void;
  isEnhancing?: boolean;
}

export const RoughDraftSlideCard: React.FC<RoughDraftSlideCardProps> = ({
  slide,
  index,
  theme,
  visualStyle,
  isSelected,
  isRegenerating,
  onSelect,
  onUpdate,
  onApprove,
  onRegenerateImage,
  onAIEnhance,
  isEnhancing = false,
}) => {
  // Editing states
  const [editTitle, setEditTitle] = useState(slide.title);
  const [editImagePrompt, setEditImagePrompt] = useState(slide.imagePrompt);
  const [editBullets, setEditBullets] = useState(slide.content);
  const [editSpeakerNotes, setEditSpeakerNotes] = useState(slide.speakerNotes);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Sync state when slide changes
  React.useEffect(() => {
    setEditTitle(slide.title);
    setEditImagePrompt(slide.imagePrompt);
    setEditBullets(slide.content);
    setEditSpeakerNotes(slide.speakerNotes);
  }, [slide.title, slide.imagePrompt, slide.content, slide.speakerNotes]);

  // Save handlers
  const handleSaveTitle = useCallback(() => {
    if (editTitle.trim() !== slide.title) {
      onUpdate({ title: editTitle.trim(), approvalState: 'modified' });
    }
  }, [editTitle, slide.title, onUpdate]);

  const handleSaveImagePrompt = useCallback(() => {
    if (editImagePrompt.trim() !== slide.imagePrompt) {
      onUpdate({ imagePrompt: editImagePrompt.trim(), approvalState: 'modified' });
    }
  }, [editImagePrompt, slide.imagePrompt, onUpdate]);

  const handleSaveBullet = useCallback((idx: number, value: string) => {
    const newBullets = [...editBullets];
    newBullets[idx] = value;
    setEditBullets(newBullets);
    if (newBullets[idx] !== slide.content[idx]) {
      onUpdate({ content: newBullets, approvalState: 'modified' });
    }
  }, [editBullets, slide.content, onUpdate]);

  const handleAddBullet = useCallback(() => {
    const newBullets = [...editBullets, ''];
    setEditBullets(newBullets);
    onUpdate({ content: newBullets, approvalState: 'modified' });
  }, [editBullets, onUpdate]);

  const handleRemoveBullet = useCallback((idx: number) => {
    const newBullets = editBullets.filter((_, i) => i !== idx);
    setEditBullets(newBullets);
    onUpdate({ content: newBullets, approvalState: 'modified' });
  }, [editBullets, onUpdate]);

  const handleSaveSpeakerNotes = useCallback(() => {
    if (editSpeakerNotes !== slide.speakerNotes) {
      onUpdate({ speakerNotes: editSpeakerNotes, approvalState: 'modified' });
    }
  }, [editSpeakerNotes, slide.speakerNotes, onUpdate]);

  const handleCustomPromptSubmit = useCallback(() => {
    if (customPrompt.trim() && onAIEnhance) {
      onAIEnhance('custom', customPrompt.trim());
      setCustomPrompt('');
      setShowCustomPrompt(false);
    }
  }, [customPrompt, onAIEnhance]);

  // Approval badge color - Studio Noir palette
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

  // Collapsed card view (grid)
  if (!isSelected) {
    return (
      <div
        className="group relative bg-[#111111] border transition-all duration-200 cursor-pointer
          hover:shadow-lg hover:shadow-black/50 hover:-translate-y-0.5 border-white/10 hover:border-[#c5a47e]/50"
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

        {/* Status badge */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-bold ${approval.bg} ${approval.text}`}>
            {approval.label}
          </span>
        </div>

        {/* Image area (16:9 aspect) */}
        <div className="relative aspect-video overflow-hidden">
          {slide.isImageLoading || isRegenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: theme.colors.surface }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#c5a47e]/5 to-transparent animate-pulse" />
              <div className="w-8 h-8 border-2 border-[#c5a47e]/30 border-t-[#c5a47e] rounded-full animate-spin mb-2 relative z-10" />
              <span className="text-[10px] text-white/40 uppercase tracking-wider relative z-10">
                {isRegenerating ? 'Regenerating...' : 'Generating...'}
              </span>
            </div>
          ) : slide.imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4" style={{ background: theme.colors.surface }}>
              <span className="text-[10px] text-red-400 text-center line-clamp-2">{slide.imageError}</span>
            </div>
          ) : slide.imageUrl ? (
            <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: theme.colors.surface }}>
              <svg className="w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Content preview */}
        <div className="p-3">
          <h3 className="text-sm font-bold text-white line-clamp-1">{slide.title}</h3>
          <div className="mt-1.5 space-y-0.5">
            {slide.content.slice(0, 2).map((bullet, i) => (
              <p key={i} className="text-[10px] text-white/50 line-clamp-1">{bullet}</p>
            ))}
            {slide.content.length > 2 && (
              <p className="text-[10px] text-white/30">+{slide.content.length - 2} more...</p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[8px] text-white/30 uppercase tracking-wider">{slide.layoutType}</span>
            <span className="text-[8px] text-white/20">|</span>
            <span className="text-[8px] text-white/30 uppercase tracking-wider">{slide.alignment}</span>
          </div>
        </div>
      </div>
    );
  }

  // Expanded card view (full editing)
  return (
    <div
      className="col-span-full bg-[#111111] border border-[#c5a47e] ring-2 ring-[#c5a47e]/30"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#c5a47e] text-black text-xs font-bold flex items-center justify-center">
            {index + 1}
          </div>
          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold ${approval.bg} ${approval.text}`}>
            {approval.label}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="p-1.5 hover:bg-white/10 transition-colors"
          title="Collapse"
        >
          <ChevronUp className="w-4 h-4 text-white/60" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 p-4">
        {/* Left: Image */}
        <div className="space-y-3">
          {/* Image preview */}
          <div className="relative aspect-video bg-black/50 overflow-hidden">
            {slide.isImageLoading || isRegenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#c5a47e]/30 border-t-[#c5a47e] rounded-full animate-spin mb-2" />
                <span className="text-xs text-white/40">{isRegenerating ? 'Regenerating...' : 'Generating...'}</span>
              </div>
            ) : slide.imageUrl ? (
              <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
            )}
            {/* Regenerate overlay */}
            {!slide.isImageLoading && !isRegenerating && (
              <button
                onClick={(e) => { e.stopPropagation(); onRegenerateImage(); }}
                className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 hover:bg-black text-white text-xs flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </button>
            )}
          </div>

          {/* Image subject (editable) */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">
              Image Subject (editable)
            </label>
            <textarea
              value={editImagePrompt}
              onChange={(e) => setEditImagePrompt(e.target.value)}
              onBlur={handleSaveImagePrompt}
              onClick={(e) => e.stopPropagation()}
              rows={2}
              className="w-full bg-black/30 border border-white/10 text-sm text-white p-2 focus:outline-none focus:border-[#c5a47e]/50 resize-none"
              placeholder="Describe what the image should show..."
            />
          </div>

          {/* Visual style (locked) */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">
              Visual Style (locked from theme)
            </label>
            <div className="bg-black/20 border border-white/5 text-xs text-white/60 p-2 italic">
              {visualStyle}
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-black/30 border border-white/10 text-sm font-bold text-white p-2 focus:outline-none focus:border-[#c5a47e]/50"
            />
          </div>

          {/* Bullets */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Content</label>
            <div className="space-y-2">
              {editBullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-white/30 text-xs mt-2">•</span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const newBullets = [...editBullets];
                      newBullets[i] = e.target.value;
                      setEditBullets(newBullets);
                    }}
                    onBlur={() => handleSaveBullet(i, editBullets[i])}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-black/30 border border-white/10 text-xs text-white p-1.5 focus:outline-none focus:border-[#c5a47e]/50"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveBullet(i); }}
                    className="p-1 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={(e) => { e.stopPropagation(); handleAddBullet(); }}
                className="flex items-center gap-1 text-[10px] text-[#c5a47e] hover:text-white transition-colors"
              >
                <Plus className="w-3 h-3" /> Add bullet
              </button>
            </div>
          </div>

          {/* Speaker Notes */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Speaker Notes</label>
            <textarea
              value={editSpeakerNotes}
              onChange={(e) => setEditSpeakerNotes(e.target.value)}
              onBlur={handleSaveSpeakerNotes}
              onClick={(e) => e.stopPropagation()}
              rows={2}
              className="w-full bg-black/30 border border-white/10 text-xs text-white/70 p-2 focus:outline-none focus:border-[#c5a47e]/50 resize-none"
              placeholder="Notes for the presenter..."
            />
          </div>

          {/* AI Enhance */}
          {onAIEnhance && (
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">AI Enhance</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onAIEnhance('research'); }}
                  disabled={isEnhancing}
                  className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white disabled:opacity-50 transition-colors"
                >
                  <Search className="w-3 h-3" />
                  Research
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onAIEnhance('rewrite'); }}
                  disabled={isEnhancing}
                  className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white disabled:opacity-50 transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  Rewrite
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowCustomPrompt(!showCustomPrompt); }}
                  disabled={isEnhancing}
                  className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Custom...
                </button>
              </div>
              {showCustomPrompt && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomPromptSubmit()}
                    placeholder="Enter custom instruction..."
                    className="flex-1 bg-black/30 border border-white/10 text-xs text-white p-1.5 focus:outline-none focus:border-[#c5a47e]/50"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCustomPromptSubmit(); }}
                    disabled={!customPrompt.trim()}
                    className="px-2 py-1 bg-[#c5a47e] text-black text-xs font-bold disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}
              {isEnhancing && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#c5a47e]">
                  <div className="w-3 h-3 border border-[#c5a47e]/30 border-t-[#c5a47e] rounded-full animate-spin" />
                  Enhancing...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-2 p-3 border-t border-white/10">
        {slide.approvalState !== 'approved' && (
          <button
            onClick={(e) => { e.stopPropagation(); onApprove(); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#c5a47e]/20 hover:bg-[#c5a47e]/40 text-[#c5a47e] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Check className="w-3 h-3" />
            Approve Slide
          </button>
        )}
      </div>
    </div>
  );
};

export default RoughDraftSlideCard;
