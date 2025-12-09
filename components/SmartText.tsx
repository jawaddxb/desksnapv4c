
import React, { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';

interface SmartTextProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange: (val: string) => void;
    minRows?: number;
    className?: string;
    readOnly?: boolean;
    autoFit?: boolean;
    maxFontSize?: number;
    minFontSize?: number;
    // Container enforcement for WabiSabi
    minContainerHeight?: number;  // Enforce minimum height on wrapper
    minContainerWidth?: number;   // Enforce minimum width on wrapper
    overflowBehavior?: 'visible' | 'hidden' | 'clip';
}

export const SmartText: React.FC<SmartTextProps> = ({
    value,
    onChange,
    className = "",
    style,
    minRows = 1,
    readOnly,
    autoFit = false,
    maxFontSize = 350, // Defaults generous
    minFontSize = 16,
    minContainerHeight,
    minContainerWidth,
    overflowBehavior,
    ...props
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const ghostRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    // Sanitize constraints
    const safeMax = Math.max(maxFontSize, minFontSize);
    const safeMin = Math.min(minFontSize, safeMax);

    // State
    const [fontSize, setFontSize] = useState<number>(safeMax);
    const [isReady, setIsReady] = useState(false); // Anti-flash state
    
    // Track dimensions to prevent ResizeObserver loops
    const prevDims = useRef({ w: 0, h: 0 });

    // Extract relevant style props for dependencies
    const fontFamily = style?.fontFamily;
    const fontWeight = style?.fontWeight;
    const lineHeight = style?.lineHeight || '1.1';
    const letterSpacing = style?.letterSpacing;

    // --- MEASUREMENT ENGINE ---
    const calculateFit = useCallback(() => {
        if (!autoFit || !textareaRef.current || !ghostRef.current || !wrapperRef.current) return;

        const wrapper = wrapperRef.current;
        const ghost = ghostRef.current;

        // 1. ENFORCE MINIMUM CONTAINER DIMENSIONS (WabiSabi text engine)
        if (minContainerHeight && minContainerHeight > 0) {
            wrapper.style.minHeight = `${minContainerHeight}px`;
        }
        if (minContainerWidth && minContainerWidth > 0) {
            wrapper.style.minWidth = `${minContainerWidth}px`;
        }
        if (overflowBehavior) {
            wrapper.style.overflow = overflowBehavior;
        }

        // 2. GET CONSTRAINTS (now includes enforced minimums)
        const { width: wrapperWidth, height: wrapperHeight } = wrapper.getBoundingClientRect();
        if (wrapperWidth === 0 || wrapperHeight === 0) {
            // Fallback to minimum size to prevent permanent invisibility
            setFontSize(safeMin);
            setIsReady(true);
            return;
        }

        // 3. SETUP GHOST
        ghost.style.fontSize = `${safeMax}px`;

        // 4. BINARY SEARCH
        let low = safeMin;
        let high = safeMax;
        let optimal = safeMin;

        // Minimal buffer for sub-pixel rendering only - WabiSabi prioritizes IMPACT over fitting
        const H_BUFFER = 1;
        const W_BUFFER = 1; 

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            ghost.style.fontSize = `${mid}px`;
            
            const ghostW = ghost.scrollWidth;
            const ghostH = ghost.scrollHeight; 

            const fitsWidth = ghostW <= (wrapperWidth - W_BUFFER);
            const fitsHeight = ghostH <= (wrapperHeight - H_BUFFER);

            if (fitsWidth && fitsHeight) {
                optimal = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        setFontSize(optimal);
        setIsReady(true);
    }, [value, autoFit, safeMax, safeMin, fontFamily, fontWeight, lineHeight, letterSpacing, minContainerHeight, minContainerWidth, overflowBehavior]);

    // --- PASS 2: REALITY CHECK (Validation) ---
    useLayoutEffect(() => {
        if (!autoFit || !textareaRef.current) return;
        
        const el = textareaRef.current;
        
        const checkOverflow = () => {
             // RELAXED TOLERANCE:
             // Allow 2px of overflow before panicking. This handles sub-pixel rendering and 
             // browser zoom levels much better than strict equality.
             const overflowY = el.scrollHeight > (el.clientHeight + 2);
             const overflowX = el.scrollWidth > (el.clientWidth + 2);
             return overflowY || overflowX;
        };

        if (checkOverflow() && fontSize > safeMin) {
            let currentSize = fontSize;
            // Cap iterations - balanced for correction without over-shrinking
            for (let i = 0; i < 8; i++) {
                if (currentSize <= safeMin) break;
                currentSize -= 1;
                el.style.fontSize = `${currentSize}px`;
                if (!checkOverflow()) {
                    setFontSize(currentSize);
                    break;
                }
            }
        }
    }, [fontSize, value, autoFit, safeMin, fontFamily, fontWeight, lineHeight]);

    // --- RESIZE OBSERVER ---
    useEffect(() => {
        if (!autoFit || !wrapperRef.current) return;
        
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            const { width, height } = entry.contentRect;
            const dw = Math.abs(width - prevDims.current.w);
            const dh = Math.abs(height - prevDims.current.h);

            // Only trigger on real changes
            if (dw > 2 || dh > 2) {
                prevDims.current = { w: width, h: height };
                // Simple debounce - single calculation
                setTimeout(() => calculateFit(), 50);
            }
        });

        resizeObserver.observe(wrapperRef.current);
        return () => resizeObserver.disconnect();
    }, [calculateFit, autoFit]);

    useLayoutEffect(() => {
        if(autoFit) calculateFit();
        else {
            setIsReady(true);
            setFontSize(style?.fontSize ? parseInt(style.fontSize as string) : safeMax);
        }
    }, [value, autoFit, calculateFit]);

    useEffect(() => {
        const handleFonts = () => { if(autoFit) calculateFit(); };
        document.fonts.ready.then(handleFonts);
        const fontListener = () => handleFonts();
        document.fonts.addEventListener('loadingdone', fontListener);
        return () => document.fonts.removeEventListener('loadingdone', fontListener);
    }, [autoFit, calculateFit]);

    return (
        <div 
            ref={wrapperRef} 
            className={`w-full ${autoFit ? 'h-full relative overflow-hidden' : ''}`}
        >
            {autoFit && (
                <div 
                    ref={ghostRef}
                    aria-hidden="true"
                    className={className}
                    style={{
                        ...style,
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%',
                        height: 'auto',
                        visibility: 'hidden',
                        pointerEvents: 'none',
                        zIndex: -999,
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'normal', 
                        wordBreak: 'normal',
                        lineHeight: style?.lineHeight || '1.1',
                        padding: 0
                    }}
                >
                    {value || ' '}
                </div>
            )}

            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={minRows}
                readOnly={readOnly}
                className={`
                    bg-transparent outline-none resize-none block w-full
                    ${autoFit ? 'absolute inset-0 h-full p-0' : 'pb-12 pt-4 px-2'}
                    ${className}
                `}
                style={{
                    ...style,
                    fontSize: autoFit ? `${fontSize}px` : style?.fontSize,
                    lineHeight: style?.lineHeight || '1.1',
                    overflowWrap: 'normal', 
                    wordBreak: 'normal',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    opacity: (autoFit && !isReady) ? 0 : 1,
                    transition: 'opacity 0.2s ease-in'
                }}
                {...props}
            />
        </div>
    );
};
