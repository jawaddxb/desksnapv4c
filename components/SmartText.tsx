
import React, { useRef, useEffect } from 'react';

interface SmartTextProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    readOnly?: boolean;
    // Content-first: explicit font size, no auto-fitting
    fontSize?: number;
    lineHeight?: number;
    // Style overrides
    fontWeight?: number;
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right';
    // Selection support for per-item styling
    isSelected?: boolean;
    onSelect?: () => void;
}

/**
 * SmartText - Content-First Text Component
 *
 * Philosophy: Text renders at a specified size, container expands to fit.
 * No shrinking, no clipping, no complex measurement.
 *
 * The textarea auto-sizes to its content, and parent containers
 * should use height: auto to accommodate.
 */
export const SmartText: React.FC<SmartTextProps> = ({
    value,
    onChange,
    className = "",
    style,
    readOnly,
    fontSize,
    lineHeight = 1.1,
    fontWeight,
    fontStyle,
    textAlign,
    isSelected,
    onSelect,
    ...props
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea height to fit content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Reset height to auto to get accurate scrollHeight
        textarea.style.height = 'auto';
        // Set height to scrollHeight to show all content
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [value, fontSize, lineHeight]);

    const handleClick = (e: React.MouseEvent) => {
        if (!readOnly) {
            e.stopPropagation();
            onSelect?.();
        }
    };

    return (
        <div
            className={`relative ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 rounded' : ''}`}
            onClick={handleClick}
            data-smarttext="true"
        >
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                readOnly={readOnly}
                className={`
                    bg-transparent outline-none resize-none block w-full
                    ${!readOnly && onSelect ? (isSelected ? 'cursor-text' : 'cursor-pointer') : ''}
                    ${className}
                `}
                style={{
                    ...style,
                    fontSize: fontSize ? `${fontSize}px` : style?.fontSize,
                    lineHeight,
                    fontWeight: fontWeight ?? style?.fontWeight,
                    fontStyle: fontStyle ?? style?.fontStyle,
                    textAlign: textAlign ?? style?.textAlign,
                    // Width constraints for proper text wrapping in export
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    // Text wrapping behavior
                    overflow: readOnly ? 'hidden' : 'visible',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                }}
                {...props}
            />
        </div>
    );
};
