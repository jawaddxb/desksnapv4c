/**
 * QRCodeModal Component
 *
 * Modal for sharing presentation via QR code.
 * Generates a scannable QR code that links to the mobile presentation view.
 *
 * Uses QR Server API for reliable QR code generation.
 */

import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, ExternalLink, Loader2 } from 'lucide-react';
import { Theme } from '@/types';

interface QRCodeModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Presentation ID for the URL */
  presentationId: string;
  /** Presentation title for display */
  presentationTitle: string;
  /** Theme for styling */
  theme: Theme;
}

/**
 * QRCodeImage - Renders QR code via QR Server API
 * Includes loading state and error handling.
 */
const QRCodeImage: React.FC<{
  url: string;
  size?: number;
}> = ({ url, size = 180 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Using QR Server API (free, no signup required)
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&margin=10`;

  if (hasError) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-500 text-center px-4">
          Failed to load QR code
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white rounded-lg"
          style={{ width: size, height: size }}
        >
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}
      <img
        src={qrApiUrl}
        alt="QR Code for mobile presentation"
        width={size}
        height={size}
        className="rounded-lg bg-white"
        loading="eager"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

/**
 * QRCodeModal
 *
 * Displays QR code and copyable URL for sharing mobile presentation.
 */
export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  presentationId,
  presentationTitle,
  theme,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate the mobile URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const mobileUrl = `${baseUrl}/mobile/${presentationId}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(mobileUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-black/5"
          style={{ color: theme.colors.secondary }}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
            style={{ backgroundColor: `${theme.colors.accent}20` }}
          >
            <Smartphone className="w-6 h-6" style={{ color: theme.colors.accent }} />
          </div>
          <h2
            id="qr-modal-title"
            className="text-lg font-bold mb-1"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            Share on Mobile
          </h2>
          <p
            className="text-sm truncate max-w-[250px] mx-auto"
            style={{ color: theme.colors.secondary }}
          >
            {presentationTitle}
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-xl shadow-inner">
            <QRCodeImage url={mobileUrl} size={180} />
          </div>
        </div>

        {/* Instructions */}
        <p
          className="text-center text-sm mb-4"
          style={{ color: theme.colors.secondary }}
        >
          Scan with your phone camera to view
        </p>

        {/* URL display and copy */}
        <div
          className="flex items-center gap-2 p-3 rounded-lg mb-4"
          style={{ backgroundColor: theme.colors.background }}
        >
          <input
            type="text"
            value={mobileUrl}
            readOnly
            className="flex-1 bg-transparent text-xs truncate outline-none"
            style={{
              fontFamily: 'monospace',
              color: theme.colors.text,
            }}
            aria-label="Mobile presentation URL"
          />
          <button
            onClick={handleCopyUrl}
            className="p-2 rounded transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            style={{
              backgroundColor: copied ? `${theme.colors.accent}20` : 'transparent',
              color: copied ? theme.colors.accent : theme.colors.secondary,
            }}
            title={copied ? 'Copied!' : 'Copy URL'}
            aria-label={copied ? 'URL copied' : 'Copy URL'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyUrl}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-colors min-h-[44px]"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.surface,
            }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-colors min-h-[44px] min-w-[44px]"
            style={{
              backgroundColor: `${theme.colors.secondary}20`,
              color: theme.colors.text,
            }}
            title="Open in new tab"
            aria-label="Open mobile presentation in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
