/**
 * useSlideStyles Hook
 *
 * Manages text and image style operations for slides.
 * Selection-aware for wabi-sabi mode.
 */

import { useCallback, useMemo } from 'react';
import { Slide, TextStyleOverride } from '@/types';
import { useTextSelection } from '@/contexts/TextSelectionContext';

export interface UseSlideStylesOptions {
  /** Current slide */
  slide: Slide;
  /** Callback to update slide */
  onUpdateSlide: (updates: Partial<Slide>) => void;
  /** Whether in wabi-sabi mode */
  isWabiSabi: boolean;
}

export interface CurrentStyles {
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
}

export interface UseSlideStylesReturn {
  /** Whether there is a selection */
  hasSelection: boolean;
  /** Whether title is selected */
  isTitleSelected: boolean;
  /** Whether content is selected */
  isContentSelected: boolean;
  /** Index of selected content item (-1 if none) */
  selectedContentIndex: number;
  /** Current styles for selected item */
  currentStyles: CurrentStyles;
  /** Whether text is bold */
  isBold: boolean;
  /** Whether text is italic */
  isItalic: boolean;
  /** Toggle bold style */
  toggleBold: () => void;
  /** Toggle italic style */
  toggleItalic: () => void;
  /** Adjust font size by delta */
  adjustFontSize: (delta: number) => void;
  /** Current image opacity */
  currentOpacity: number;
  /** Adjust image opacity */
  adjustOpacity: (delta: number) => void;
  /** Clear selection */
  clearSelection: () => void;
}

export function useSlideStyles({
  slide,
  onUpdateSlide,
  isWabiSabi,
}: UseSlideStylesOptions): UseSlideStylesReturn {
  const { selection, clearSelection } = useTextSelection();

  // Determine what's selected
  const hasSelection = selection !== null;
  const isTitleSelected = selection?.type === 'title';
  const isContentSelected = selection?.type === 'content';
  const selectedContentIndex = isContentSelected ? selection.index : -1;

  // Get text styles
  const titleStyle = slide.textStyles?.title;
  const contentStyle = slide.textStyles?.content;

  // Get current styles for selected item (or global if no selection)
  const currentStyles = useMemo((): CurrentStyles => {
    if (isTitleSelected) {
      return {
        fontSize: slide.titleFontSize ?? 64,
        fontWeight: slide.textStyles?.title?.fontWeight ?? 400,
        fontStyle: slide.textStyles?.title?.fontStyle ?? 'normal',
      };
    }
    if (isContentSelected) {
      const itemStyle = slide.contentItemStyles?.[selectedContentIndex];
      return {
        fontSize: itemStyle?.fontSize ?? slide.contentFontSize ?? 20,
        fontWeight: itemStyle?.fontWeight ?? slide.textStyles?.content?.fontWeight ?? 400,
        fontStyle: itemStyle?.fontStyle ?? slide.textStyles?.content?.fontStyle ?? 'normal',
      };
    }
    // No selection - return title styles for global controls
    return {
      fontSize: slide.titleFontSize ?? 64,
      fontWeight: slide.textStyles?.title?.fontWeight ?? 400,
      fontStyle: slide.textStyles?.title?.fontStyle ?? 'normal',
    };
  }, [slide, isTitleSelected, isContentSelected, selectedContentIndex]);

  const isBold = (currentStyles.fontWeight ?? 400) >= 700;
  const isItalic = currentStyles.fontStyle === 'italic';

  // Toggle bold
  const toggleBold = useCallback(() => {
    const newWeight = isBold ? 400 : 700;

    if (isWabiSabi && isTitleSelected) {
      onUpdateSlide({
        textStyles: {
          ...slide.textStyles,
          title: { ...titleStyle, fontWeight: newWeight },
        },
      });
    } else if (isWabiSabi && isContentSelected) {
      const newItemStyles = { ...slide.contentItemStyles };
      newItemStyles[selectedContentIndex] = {
        ...newItemStyles[selectedContentIndex],
        fontWeight: newWeight,
      };
      onUpdateSlide({ contentItemStyles: newItemStyles });
    } else {
      onUpdateSlide({
        textStyles: {
          ...slide.textStyles,
          title: { ...titleStyle, fontWeight: newWeight },
          content: { ...contentStyle, fontWeight: newWeight },
        },
      });
    }
  }, [isBold, isWabiSabi, isTitleSelected, isContentSelected, selectedContentIndex, slide, titleStyle, contentStyle, onUpdateSlide]);

  // Toggle italic
  const toggleItalic = useCallback(() => {
    const newStyle = isItalic ? 'normal' : 'italic';

    if (isWabiSabi && isTitleSelected) {
      onUpdateSlide({
        textStyles: {
          ...slide.textStyles,
          title: { ...titleStyle, fontStyle: newStyle },
        },
      });
    } else if (isWabiSabi && isContentSelected) {
      const newItemStyles = { ...slide.contentItemStyles };
      newItemStyles[selectedContentIndex] = {
        ...newItemStyles[selectedContentIndex],
        fontStyle: newStyle,
      };
      onUpdateSlide({ contentItemStyles: newItemStyles });
    } else {
      onUpdateSlide({
        textStyles: {
          ...slide.textStyles,
          title: { ...titleStyle, fontStyle: newStyle },
          content: { ...contentStyle, fontStyle: newStyle },
        },
      });
    }
  }, [isItalic, isWabiSabi, isTitleSelected, isContentSelected, selectedContentIndex, slide, titleStyle, contentStyle, onUpdateSlide]);

  // Adjust font size
  const adjustFontSize = useCallback((delta: number) => {
    const currentTitleSize = slide.titleFontSize ?? 64;
    const currentContentSize = slide.contentFontSize ?? 20;

    if (isWabiSabi && isTitleSelected) {
      onUpdateSlide({
        titleFontSize: Math.max(24, Math.min(120, currentTitleSize + delta)),
      });
    } else if (isWabiSabi && isContentSelected) {
      const itemStyle = slide.contentItemStyles?.[selectedContentIndex];
      const currentSize = itemStyle?.fontSize ?? slide.contentFontSize ?? 20;
      const newItemStyles = { ...slide.contentItemStyles };
      newItemStyles[selectedContentIndex] = {
        ...newItemStyles[selectedContentIndex],
        fontSize: Math.max(12, Math.min(48, currentSize + delta)),
      };
      onUpdateSlide({ contentItemStyles: newItemStyles });
    } else {
      onUpdateSlide({
        titleFontSize: Math.max(24, Math.min(120, currentTitleSize + delta)),
        contentFontSize: Math.max(12, Math.min(48, currentContentSize + delta / 2)),
      });
    }
  }, [slide, isWabiSabi, isTitleSelected, isContentSelected, selectedContentIndex, onUpdateSlide]);

  // Image opacity
  const currentOpacity = slide.imageStyles?.opacity ?? 1;

  const adjustOpacity = useCallback((delta: number) => {
    const newOpacity = Math.max(0.1, Math.min(1, currentOpacity + delta));
    onUpdateSlide({
      imageStyles: {
        ...slide.imageStyles,
        opacity: Math.round(newOpacity * 10) / 10,
      },
    });
  }, [currentOpacity, slide.imageStyles, onUpdateSlide]);

  return {
    hasSelection,
    isTitleSelected,
    isContentSelected,
    selectedContentIndex,
    currentStyles,
    isBold,
    isItalic,
    toggleBold,
    toggleItalic,
    adjustFontSize,
    currentOpacity,
    adjustOpacity,
    clearSelection,
  };
}

export default useSlideStyles;
