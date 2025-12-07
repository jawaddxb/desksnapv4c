import React, { useRef, useEffect, useState } from 'react';

interface SmartTextProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange: (val: string) => void;
    minRows?: number;
    className?: string;
    readOnly?: boolean;
}

export const SmartText: React.FC<SmartTextProps> = ({ 
    value, 
    onChange, 
    className = "", 
    style, 
    minRows = 1,
    readOnly,
    ...props 
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // INTELLIGENT RESIZE LOGIC
    // 1. Reset height to 'auto' to get accurate scrollHeight
    // 2. Add SAFETY BUFFER (48px) to prevent descender slicing (g, j, y)
    // 3. SNAP TO GRID (4px) to prevent sub-pixel jitter/dancing during typing
    const resize = () => {
        if (!textareaRef.current) return;
        
        // Reset to auto to measure content
        textareaRef.current.style.height = 'auto';
        
        const rawHeight = textareaRef.current.scrollHeight;
        
        // PHANTOM BOX LOGIC:
        // We explicitly allocate significantly more vertical space (48px) than the font metrics 
        // demand. This allows massive "Editorial" style fonts with large descenders or swashes 
        // to render fully without clipping, while negative margins in the parent layout 
        // handle the visual tightness/overlap.
        const buffer = 48; 
        const snappedHeight = Math.ceil((rawHeight + buffer) / 4) * 4; 
        
        textareaRef.current.style.height = `${snappedHeight}px`;
    };

    useEffect(() => {
        resize();
        // Double-check resize after a short delay to handle font loading or layout shifts
        const timeout = setTimeout(resize, 50);
        return () => clearTimeout(timeout);
    }, [value, style?.fontSize, style?.lineHeight, style?.fontFamily]);

    // Re-trigger resize when web fonts finish loading to prevent "jumpy" or clipped text
    useEffect(() => {
        if (document.fonts) {
            document.fonts.ready.then(resize);
        }
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={minRows}
            readOnly={readOnly}
            className={`
                bg-transparent 
                outline-none 
                resize-none 
                overflow-hidden 
                w-full 
                block 
                pb-12 
                ${className}
            `}
            style={style}
            {...props}
        />
    );
};