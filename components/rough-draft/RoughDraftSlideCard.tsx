/**
 * RoughDraftSlideCard Component
 *
 * Individual slide card in the rough draft grid.
 * Shows loading state, image preview, and inline editing.
 * When selected, expands to show full editing capabilities.
 */

import React, { useState, useCallback, Suspense } from 'react';
import { RoughDraftSlide } from '@/services/agents/roughDraftAgent';
import { Theme } from '@/types';
import { ContentBlock } from '@/types/contentBlocks';
import { RefreshCw, Check, ChevronUp, Plus, Trash2, Sparkles, Search, Wand2 } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { ContentBlockRenderer } from '@/components/content-blocks';

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
  const [editContentBlocks, setEditContentBlocks] = useState<ContentBlock[]>(slide.contentBlocks || []);
  const [editSpeakerNotes, setEditSpeakerNotes] = useState(slide.speakerNotes);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Determine if we're using contentBlocks or legacy content
  const hasContentBlocks = slide.contentBlocks && slide.contentBlocks.length > 0;

  // Sync state when slide changes
  React.useEffect(() => {
    setEditTitle(slide.title);
    setEditImagePrompt(slide.imagePrompt);
    setEditBullets(slide.content);
    setEditContentBlocks(slide.contentBlocks || []);
    setEditSpeakerNotes(slide.speakerNotes);
  }, [slide.title, slide.imagePrompt, slide.content, slide.contentBlocks, slide.speakerNotes]);

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

  // Handler for updating a content block
  const handleUpdateBlock = useCallback((index: number, block: ContentBlock) => {
    const newBlocks = [...editContentBlocks];
    newBlocks[index] = block;
    setEditContentBlocks(newBlocks);
    onUpdate({ contentBlocks: newBlocks, approvalState: 'modified' });
  }, [editContentBlocks, onUpdate]);

  // Helper to extract text preview from contentBlocks
  const getContentPreview = (): string[] => {
    if (!hasContentBlocks) return slide.content || [];
    return editContentBlocks.slice(0, 3).map(block => {
      switch (block.type) {
        case 'paragraph': return block.text.slice(0, 60) + (block.text.length > 60 ? '...' : '');
        case 'bullets': return block.items[0] || '';
        case 'numbered': return block.items[0] || '';
        case 'quote': return `"${block.text.slice(0, 40)}..."`;
        case 'statistic': return `${block.value} - ${block.label}`;
        case 'callout': return block.text.slice(0, 50);
        case 'chart': return `[Chart: ${block.title || block.chartType}]`;
        case 'diagram': return `[Diagram]`;
        default: return '';
      }
    });
  };

  const handleCustomPromptSubmit = useCallback(() => {
    if (customPrompt.trim() && onAIEnhance) {
      onAIEnhance('custom', customPrompt.trim());
      setCustomPrompt('');
      setShowCustomPrompt(false);
    }
  }, [customPrompt, onAIEnhance]);

  // Approval badge color - Bento Matcha palette
  const getApprovalBadge = () => {
    switch (slide.approvalState) {
      case 'approved':
        return { bg: 'bg-[#6B8E6B]/20', text: 'text-[#6B8E6B]', label: 'Approved' };
      case 'modified':
        return { bg: 'bg-[#EDF5F0]', text: 'text-[#4A5D4A]', label: 'Modified' };
      default:
        return { bg: 'bg-[#F5FAF7]', text: 'text-[#8FA58F]', label: 'Pending' };
    }
  };

  const approval = getApprovalBadge();

  // Collapsed card view (grid)
  if (!isSelected) {
    return (
      <div
        className="group relative bg-white border rounded-lg transition-all duration-200 cursor-pointer
          hover:shadow-lg hover:shadow-[#6B8E6B]/10 hover:-translate-y-0.5 border-[#D4E5D4] hover:border-[#6B8E6B]/50"
        onClick={onSelect}
        style={{
          animation: 'fadeInUp 0.3s ease-out forwards',
          animationDelay: `${index * 50}ms`,
          opacity: 0,
        }}
      >
        {/* Slide number */}
        <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-[#6B8E6B] text-white text-xs font-bold flex items-center justify-center rounded">
          {index + 1}
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-bold ${approval.bg} ${approval.text}`}>
            {approval.label}
          </span>
        </div>

        {/* Image area (16:9 aspect) */}
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          {slide.isImageLoading || isRegenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: theme.colors.surface }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#6B8E6B]/5 to-transparent animate-pulse" />
              <div className="w-8 h-8 border-2 border-[#6B8E6B]/30 border-t-[#6B8E6B] rounded-full animate-spin mb-2 relative z-10" />
              <span className="text-[10px] text-[#8FA58F] uppercase tracking-wider relative z-10">
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
            <ImagePlaceholder
              theme={theme}
              onGenerate={onRegenerateImage}
              isGenerating={false}
              size="compact"
            />
          )}
        </div>

        {/* Content preview */}
        <div className="p-3">
          <h3 className="text-sm font-bold text-[#1E2E1E] line-clamp-1">{slide.title}</h3>
          <div className="mt-1.5 space-y-0.5">
            {getContentPreview().slice(0, 2).map((text, i) => (
              <p key={i} className="text-[10px] text-[#8FA58F] line-clamp-1">{text}</p>
            ))}
            {(hasContentBlocks ? editContentBlocks.length : (slide.content?.length || 0)) > 2 && (
              <p className="text-[10px] text-[#8FA58F]/60">
                +{(hasContentBlocks ? editContentBlocks.length : (slide.content?.length || 0)) - 2} more...
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[8px] text-[#8FA58F] uppercase tracking-wider">{slide.layoutType}</span>
            <span className="text-[8px] text-[#D4E5D4]">|</span>
            <span className="text-[8px] text-[#8FA58F] uppercase tracking-wider">{slide.alignment}</span>
            {hasContentBlocks && (
              <>
                <span className="text-[8px] text-[#D4E5D4]">|</span>
                <span className="text-[8px] text-[#6B8E6B] uppercase tracking-wider">Rich</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Expanded card view (full editing)
  return (
    <div
      className="col-span-full bg-white border border-[#6B8E6B] ring-2 ring-[#6B8E6B]/30 rounded-lg"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#D4E5D4]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#6B8E6B] text-white text-xs font-bold flex items-center justify-center rounded">
            {index + 1}
          </div>
          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded ${approval.bg} ${approval.text}`}>
            {approval.label}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="p-1.5 hover:bg-[#EDF5F0] transition-colors rounded-md"
          title="Collapse"
        >
          <ChevronUp className="w-4 h-4 text-[#8FA58F]" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 p-4">
        {/* Left: Image */}
        <div className="space-y-3">
          {/* Image preview */}
          <div className="relative aspect-video bg-[#F5FAF7] overflow-hidden rounded-lg">
            {slide.isImageLoading || isRegenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#6B8E6B]/30 border-t-[#6B8E6B] rounded-full animate-spin mb-2" />
                <span className="text-xs text-[#8FA58F]">{isRegenerating ? 'Regenerating...' : 'Generating...'}</span>
              </div>
            ) : slide.imageUrl ? (
              <>
                <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                {/* Regenerate button for existing images */}
                <button
                  onClick={(e) => { e.stopPropagation(); onRegenerateImage(); }}
                  className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 hover:bg-white text-[#1E2E1E] text-xs flex items-center gap-1 transition-colors rounded"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </>
            ) : (
              <ImagePlaceholder
                theme={theme}
                onGenerate={onRegenerateImage}
                isGenerating={false}
                size="default"
              />
            )}
          </div>

          {/* Image subject (editable) */}
          <div>
            <label className="block text-[10px] text-[#8FA58F] uppercase tracking-wider mb-1">
              Image Subject (editable)
            </label>
            <textarea
              value={editImagePrompt}
              onChange={(e) => setEditImagePrompt(e.target.value)}
              onBlur={handleSaveImagePrompt}
              onClick={(e) => e.stopPropagation()}
              rows={2}
              className="w-full bg-[#F5FAF7] border border-[#D4E5D4] rounded-md text-sm text-[#1E2E1E] p-2 focus:outline-none focus:border-[#6B8E6B] resize-none"
              placeholder="Describe what the image should show..."
            />
          </div>

          {/* Visual style (locked) */}
          <div>
            <label className="block text-[10px] text-[#8FA58F] uppercase tracking-wider mb-1">
              Visual Style (locked from theme)
            </label>
            <div className="bg-[#F5FAF7] border border-[#EDF5F0] rounded-md text-xs text-[#8FA58F] p-2 italic">
              {visualStyle}
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-[10px] text-[#8FA58F] uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-[#F5FAF7] border border-[#D4E5D4] rounded-md text-sm font-bold text-[#1E2E1E] p-2 focus:outline-none focus:border-[#6B8E6B]"
            />
          </div>

          {/* Content - Rich blocks or legacy bullets */}
          <div>
            <label className="block text-[10px] text-[#8FA58F] uppercase tracking-wider mb-1">
              Content {hasContentBlocks && <span className="text-[#6B8E6B]">(Rich Blocks)</span>}
            </label>
            {hasContentBlocks ? (
              // Render content blocks with editing support
              <div className="bg-[#F5FAF7] border border-[#D4E5D4] rounded-md p-3 max-h-[200px] overflow-y-auto">
                <Suspense fallback={<div className="text-xs text-[#8FA58F]">Loading content...</div>}>
                  <ContentBlockRenderer
                    blocks={editContentBlocks}
                    theme={theme}
                    readOnly={false}
                    onUpdateBlock={handleUpdateBlock}
                    compact
                  />
                </Suspense>
              </div>
            ) : (
              // Legacy bullet editing
              <div className="space-y-2">
                {editBullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#8FA58F] text-xs mt-2">•</span>
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
                      className="flex-1 bg-[#F5FAF7] border border-[#D4E5D4] rounded text-xs text-[#1E2E1E] p-1.5 focus:outline-none focus:border-[#6B8E6B]"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveBullet(i); }}
                      className="p-1 text-[#8FA58F] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddBullet(); }}
                  className="flex items-center gap-1 text-[10px] text-[#6B8E6B] hover:text-[#5A7A5A] transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add bullet
                </button>
              </div>
            )}
          </div>

          {/* Speaker Notes */}
          <div>
            <label className="block text-[10px] text-[#8FA58F] uppercase tracking-wider mb-1">Speaker Notes</label>
            <textarea
              value={editSpeakerNotes}
              onChange={(e) => setEditSpeakerNotes(e.target.value)}
              onBlur={handleSaveSpeakerNotes}
              onClick={(e) => e.stopPropagation()}
              rows={2}
              className="w-full bg-[#F5FAF7] border border-[#D4E5D4] rounded-md text-xs text-[#4A5D4A] p-2 focus:outline-none focus:border-[#6B8E6B] resize-none"
              placeholder="Notes for the presenter..."
            />
          </div>

          {/* AI Enhance */}
          {onAIEnhance && (
            <div>
              <label className="block text-[10px] text-[#8FA58F] uppercase tracking-wider mb-1">AI Enhance</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onAIEnhance('research'); }}
                  disabled={isEnhancing}
                  className="flex items-center gap-1 px-2 py-1 bg-[#EDF5F0] hover:bg-[#D4E5D4] border border-[#D4E5D4] rounded text-xs text-[#4A5D4A] disabled:opacity-50 transition-colors"
                >
                  <Search className="w-3 h-3" />
                  Research
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onAIEnhance('rewrite'); }}
                  disabled={isEnhancing}
                  className="flex items-center gap-1 px-2 py-1 bg-[#EDF5F0] hover:bg-[#D4E5D4] border border-[#D4E5D4] rounded text-xs text-[#4A5D4A] disabled:opacity-50 transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  Rewrite
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowCustomPrompt(!showCustomPrompt); }}
                  disabled={isEnhancing}
                  className="flex items-center gap-1 px-2 py-1 bg-[#EDF5F0] hover:bg-[#D4E5D4] border border-[#D4E5D4] rounded text-xs text-[#4A5D4A] disabled:opacity-50 transition-colors"
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
                    className="flex-1 bg-[#F5FAF7] border border-[#D4E5D4] rounded text-xs text-[#1E2E1E] p-1.5 focus:outline-none focus:border-[#6B8E6B]"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCustomPromptSubmit(); }}
                    disabled={!customPrompt.trim()}
                    className="px-2 py-1 bg-[#6B8E6B] text-white rounded text-xs font-bold disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}
              {isEnhancing && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#6B8E6B]">
                  <div className="w-3 h-3 border border-[#6B8E6B]/30 border-t-[#6B8E6B] rounded-full animate-spin" />
                  Enhancing...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-2 p-3 border-t border-[#D4E5D4]">
        {slide.approvalState !== 'approved' && (
          <button
            onClick={(e) => { e.stopPropagation(); onApprove(); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#6B8E6B]/20 hover:bg-[#6B8E6B]/40 text-[#6B8E6B] rounded text-xs font-bold uppercase tracking-wider transition-colors"
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
