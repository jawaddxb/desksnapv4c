/**
 * MobileDeviceFrame Component
 *
 * Wraps mobile view content in a phone-shaped frame when viewed on desktop.
 * Shows a realistic iPhone-style device preview for desktop users.
 *
 * KISS: Simple wrapper that detects screen size and applies frame styling.
 */

import React from 'react';
import { X } from 'lucide-react';

interface MobileDeviceFrameProps {
  /** Content to display inside the device frame */
  children: React.ReactNode;
  /** Callback when clicking the exit button */
  onExit: () => void;
  /** Optional device name to display */
  deviceLabel?: string;
}

// Phone dimensions (iPhone 14 Pro aspect ratio)
const DEVICE_WIDTH = 390;
const DEVICE_HEIGHT = 844;
const FRAME_PADDING = 12;
const NOTCH_WIDTH = 120;
const NOTCH_HEIGHT = 32;
const HOME_INDICATOR_WIDTH = 134;
const HOME_INDICATOR_HEIGHT = 5;

/**
 * MobileDeviceFrame
 *
 * On desktop (min-width: 768px), shows content in a phone-shaped frame.
 * On mobile, content takes up full screen (no frame needed).
 */
export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  onExit,
  deviceLabel = 'Mobile Preview',
}) => {
  return (
    <div className="fixed inset-0 z-[900] bg-[#1E2E1E]/80 backdrop-blur-sm flex items-center justify-center">
      {/* Desktop view: Device frame */}
      <div className="hidden md:flex flex-col items-center gap-4">
        {/* Header with label and exit */}
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm font-medium">{deviceLabel}</span>
          <button
            onClick={onExit}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Exit mobile preview"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Device frame */}
        <div
          className="relative bg-[#1a1a1a] rounded-[50px] shadow-2xl"
          style={{
            width: DEVICE_WIDTH + FRAME_PADDING * 2,
            height: DEVICE_HEIGHT + FRAME_PADDING * 2,
            padding: FRAME_PADDING,
          }}
        >
          {/* Side buttons (left) */}
          <div className="absolute left-0 top-[120px] w-[3px] h-[35px] bg-[#2a2a2a] rounded-l-md -translate-x-[3px]" />
          <div className="absolute left-0 top-[170px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-l-md -translate-x-[3px]" />
          <div className="absolute left-0 top-[240px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-l-md -translate-x-[3px]" />

          {/* Side button (right) */}
          <div className="absolute right-0 top-[180px] w-[3px] h-[80px] bg-[#2a2a2a] rounded-r-md translate-x-[3px]" />

          {/* Screen */}
          <div
            className="relative bg-black rounded-[38px] overflow-hidden"
            style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
          >
            {/* Dynamic Island / Notch */}
            <div
              className="absolute top-[12px] left-1/2 -translate-x-1/2 bg-black rounded-full z-50"
              style={{ width: NOTCH_WIDTH, height: NOTCH_HEIGHT }}
            />

            {/* Screen content */}
            <div className="w-full h-full">
              {children}
            </div>

            {/* Home indicator */}
            <div
              className="absolute bottom-[8px] left-1/2 -translate-x-1/2 bg-white/30 rounded-full z-50"
              style={{ width: HOME_INDICATOR_WIDTH, height: HOME_INDICATOR_HEIGHT }}
            />
          </div>
        </div>

        {/* Instructions */}
        <p className="text-white/40 text-xs">
          Use arrow keys or swipe to navigate
        </p>
      </div>

      {/* Mobile view: Full screen (no frame) */}
      <div className="md:hidden w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default MobileDeviceFrame;
