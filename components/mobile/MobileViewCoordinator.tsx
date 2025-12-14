/**
 * MobileViewCoordinator Component
 *
 * Main orchestrator for the mobile presentation view.
 * Manages slide navigation (touch + keyboard), renders slides,
 * and displays header/progress indicators.
 *
 * KISS: Simple coordinator, delegates to child components.
 * DRY: Reuses existing keyboard navigation hook.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Presentation, Theme } from '@/types';
import { useTouchNavigation } from '@/hooks/useTouchNavigation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { MobileSlideView } from './MobileSlideView';
import { MobileHeader } from './MobileHeader';
import { MobileProgressIndicator } from './MobileProgressIndicator';
import { MobileDeviceFrame } from './MobileDeviceFrame';

interface MobileViewCoordinatorProps {
  /** The presentation to display */
  presentation: Presentation;
  /** Theme for styling */
  theme: Theme;
  /** Callback when exiting mobile view */
  onExit: () => void;
  /** Initial slide index (default: 0) */
  initialSlideIndex?: number;
  /** Optional callback to share the presentation */
  onShare?: () => void;
  /** Whether to show device frame (default: true for desktop preview) */
  showDeviceFrame?: boolean;
}

/**
 * Auto-hide UI hook - manages header visibility on inactivity
 */
const useAutoHideUI = (hideDelay: number = 3000) => {
  const [visible, setVisible] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, hideDelay);

    return () => clearTimeout(timer);
  }, [lastInteraction, hideDelay]);

  const show = useCallback(() => {
    setVisible(true);
    setLastInteraction(Date.now());
  }, []);

  const recordInteraction = useCallback(() => {
    setLastInteraction(Date.now());
  }, []);

  return { visible, show, recordInteraction };
};

/**
 * Swipe hint shown on first view
 */
const SwipeHint: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('mobileSwipeHintSeen');
    if (hasSeenHint) {
      setVisible(false);
      return;
    }

    // Hide after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      localStorage.setItem('mobileSwipeHintSeen', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm animate-pulse"
      style={{
        backgroundColor: `${theme.colors.surface}E6`,
        color: theme.colors.secondary,
      }}
      role="status"
      aria-live="polite"
    >
      Swipe left or right to navigate
    </div>
  );
};

/**
 * MobileViewContent - The actual mobile presentation content
 */
const MobileViewContent: React.FC<{
  presentation: Presentation;
  theme: Theme;
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
  onExit: () => void;
  onShare?: () => void;
}> = ({ presentation, theme, currentSlideIndex, setCurrentSlideIndex, onExit, onShare }) => {
  const totalSlides = presentation.slides.length;
  const currentSlide = presentation.slides[currentSlideIndex];
  const { visible: headerVisible, show: showHeader, recordInteraction } = useAutoHideUI(3000);

  // Navigation callbacks
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      recordInteraction();
    }
  }, [currentSlideIndex, totalSlides, setCurrentSlideIndex, recordInteraction]);

  const goToPreviousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      recordInteraction();
    }
  }, [currentSlideIndex, setCurrentSlideIndex, recordInteraction]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
      recordInteraction();
    }
  }, [totalSlides, setCurrentSlideIndex, recordInteraction]);

  // Touch navigation
  const { handlers: touchHandlers } = useTouchNavigation({
    enabled: true,
    onNext: goToNextSlide,
    onPrevious: goToPreviousSlide,
    onExit: onExit,
    threshold: 50,
    exitThreshold: 150,
  });

  // Keyboard navigation (for desktop testing and accessibility)
  useKeyboardNavigation({
    isPresenting: true,
    presentation,
    activeSlideIndex: currentSlideIndex,
    setActiveSlideIndex: setCurrentSlideIndex,
    onExitPresentation: onExit,
  });

  // Handle screen tap (show header, but don't navigate)
  const handleScreenTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Only handle taps, not swipes
    if ('touches' in e && e.touches.length > 1) return;
    showHeader();
  }, [showHeader]);

  if (!currentSlide) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <p style={{ color: theme.colors.text }}>No slides available</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full overflow-hidden relative"
      style={{ backgroundColor: theme.colors.background }}
      {...touchHandlers}
      onClick={handleScreenTap}
    >
      {/* Header */}
      <MobileHeader
        title={presentation.topic}
        theme={theme}
        onExit={onExit}
        onShare={onShare}
        visible={headerVisible}
      />

      {/* Main slide area */}
      <div className="w-full h-full pt-14 pb-16">
        <MobileSlideView slide={currentSlide} theme={theme} />
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <MobileProgressIndicator
          currentSlide={currentSlideIndex}
          totalSlides={totalSlides}
          onDotClick={goToSlide}
          theme={theme}
        />
      </div>

      {/* Swipe hint (shown only on first view) */}
      <SwipeHint theme={theme} />
    </div>
  );
};

/**
 * MobileViewCoordinator
 *
 * Renders a full-screen mobile presentation experience:
 * - Swipe left/right to navigate slides
 * - Tap progress dots to jump to slides
 * - Keyboard navigation (arrows, space, escape) for testing
 * - Auto-hiding header on scroll/swipe
 * - Device frame wrapper for desktop preview
 */
export const MobileViewCoordinator: React.FC<MobileViewCoordinatorProps> = ({
  presentation,
  theme,
  onExit,
  initialSlideIndex = 0,
  onShare,
  showDeviceFrame = true,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);

  const content = (
    <MobileViewContent
      presentation={presentation}
      theme={theme}
      currentSlideIndex={currentSlideIndex}
      setCurrentSlideIndex={setCurrentSlideIndex}
      onExit={onExit}
      onShare={onShare}
    />
  );

  // On desktop with device frame enabled, wrap in frame
  if (showDeviceFrame) {
    return (
      <MobileDeviceFrame onExit={onExit} deviceLabel={`${presentation.topic} - Mobile Preview`}>
        {content}
      </MobileDeviceFrame>
    );
  }

  // On actual mobile or when frame disabled, show full-screen
  return (
    <div className="fixed inset-0 z-[900]">
      {content}
    </div>
  );
};

export default MobileViewCoordinator;
