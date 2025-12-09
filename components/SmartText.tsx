
import React, { useRef, useEffect } from 'react';

interface SmartTextProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    readOnly?: boolean;
    // Content-first: explicit font size, no auto-fitting
    fontSize?: number;
    lineHeight?: number;
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

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            className={`
                bg-transparent outline-none resize-none block w-full
                ${className}
            `}
            style={{
                ...style,
                fontSize: fontSize ? `${fontSize}px` : style?.fontSize,
                lineHeight,
                overflow: 'visible',
                whiteSpace: 'pre-wrap',
                wordBreak: 'normal',
                overflowWrap: 'break-word',
            }}
            {...props}
        />
    );
};
