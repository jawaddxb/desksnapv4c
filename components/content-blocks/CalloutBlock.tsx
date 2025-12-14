/**
 * CalloutBlock Component
 *
 * Renders a highlighted callout box with icon based on variant.
 */

import React from 'react';
import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { CalloutBlock as CalloutBlockType, CalloutVariant } from '@/types/contentBlocks';
import { getCalloutStyles, getCalloutVariantStyles } from '@/lib/blockStyles';
import { BlockProps } from './types';

const VARIANT_ICONS: Record<CalloutVariant, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  tip: Lightbulb,
};

const VARIANT_LABELS: Record<CalloutVariant, string> = {
  info: 'Info',
  warning: 'Warning',
  success: 'Success',
  tip: 'Tip',
};

export const CalloutBlock: React.FC<BlockProps<CalloutBlockType>> = ({
  block,
  theme,
  readOnly = true,
  onUpdate,
  className = '',
}) => {
  const styles = getCalloutStyles(theme);
  const variantStyles = getCalloutVariantStyles(styles, block.variant);
  const Icon = VARIANT_ICONS[block.variant];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onUpdate) {
      onUpdate({ text: e.target.value });
    }
  };

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg ${className}`}
      style={{
        background: variantStyles.background,
        border: `1px solid ${variantStyles.border}`,
        borderRadius: styles.radius,
      }}
    >
      <div className="shrink-0 mt-0.5">
        <Icon size={20} style={{ color: variantStyles.icon }} />
      </div>
      <div className="flex-1">
        <div
          className="text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: variantStyles.icon }}
        >
          {VARIANT_LABELS[block.variant]}
        </div>
        {!readOnly && onUpdate ? (
          <textarea
            value={block.text}
            onChange={handleTextChange}
            className="w-full bg-transparent border-none outline-none resize-none"
            style={{
              color: styles.text,
              fontFamily: styles.fontBody,
            }}
            rows={2}
          />
        ) : (
          <p
            className="m-0"
            style={{
              color: styles.text,
              fontFamily: styles.fontBody,
            }}
          >
            {block.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default CalloutBlock;
