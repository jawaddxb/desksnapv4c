
import React, { useRef, useEffect } from 'react';

interface AutoResizeTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string; 
    onChange: (val: string) => void; 
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({ 
    value, 
    onChange, 
    className = "", 
    style, 
    ...props
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const resize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            // MASSIVE BUFFER: +24px added to scrollHeight to account for aggressive line-heights and custom font descenders.
            // This prevents the "slicing" effect at the bottom of text blocks.
            textareaRef.current.style.height = (textareaRef.current.scrollHeight + 24) + 'px';
        }
    };

    useEffect(() => {
        resize();
        // Safety check for layout shifts
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
            // Added pb-6: Large bottom padding ensures glyphs are never rendered outside the box boundary
            className={`bg-transparent outline-none resize-none overflow-hidden px-1 pb-6 block ${className}`}
            style={style}
            rows={1}
            {...props}
        />
    );
};
