
import React from 'react';
import { Slide, Theme } from '../types';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface LayoutProps {
    slide: Slide;
    theme: Theme;
    children: React.ReactNode;
    printMode?: boolean;
}

export const ImageContainer = ({ slide, theme, className = "", style = {} }: { slide: Slide, theme: Theme, className?: string, style?: React.CSSProperties }) => {
    return (
        <div 
            className={`relative overflow-hidden w-full h-full bg-zinc-100 ${className}`}
            style={style}
        >
             {slide.isImageLoading ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center" style={{ background: theme.colors.surface }}>
                    <div className="relative mb-4">
                        <div className="absolute inset-0 blur-xl opacity-20 animate-pulse" style={{ backgroundColor: theme.colors.accent }} />
                        <Loader2 className="relative z-10 w-8 h-8 animate-spin" strokeWidth={2.5} style={{ color: theme.colors.text }} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: theme.colors.text }}>Generative Fill</div>
                 </div>
            ) : slide.imageUrl ? (
                <img 
                    src={slide.imageUrl} 
                    alt="Slide visual" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
            ) : (
                <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: theme.colors.surface, opacity: 0.1 }}
                >
                    <ImageIcon className="w-12 h-12" />
                </div>
            )}
            
             {theme.colors.backgroundPattern && !slide.isImageLoading && (
                <div 
                    className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: theme.colors.backgroundPattern }}
                />
            )}
        </div>
    );
};

// 1. CLASSIC SPLIT LAYOUT
export const SplitLayout: React.FC<LayoutProps> = ({ slide, theme, children }) => {
    const isRightAligned = slide.alignment === 'right';
    const radiusVal = parseInt(theme.layout.radius) || 0;
    const isOrganic = radiusVal > 8; 

    return (
        <div className="flex flex-col md:flex-row w-full h-full p-6 md:p-8 gap-6 md:gap-12 overflow-hidden">
            <div className={`flex-1 flex flex-col justify-center relative z-20 min-h-0 overflow-hidden shrink-0 ${isRightAligned ? 'md:order-2' : 'md:order-1'}`}>
                {children}
            </div>
            <div className={`md:w-1/2 relative h-64 md:h-full shrink-0 ${isRightAligned ? 'md:order-1' : 'md:order-2'}`}>
                <ImageContainer 
                    slide={slide} 
                    theme={theme} 
                    className="shadow-sm h-full"
                    style={{ borderRadius: isOrganic ? theme.layout.radius : '0px' }}
                />
            </div>
        </div>
    );
};

// 2. FULL BLEED LAYOUT
export const FullBleedLayout: React.FC<LayoutProps> = ({ slide, theme, children }) => {
    const isCenter = slide.alignment === 'center';
    const isRight = slide.alignment === 'right';

    return (
        <div className="relative w-full h-full overflow-hidden group">
            <div className="absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-transform duration-1000">
                <ImageContainer slide={slide} theme={theme} />
            </div>
            <div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: isCenter 
                        ? `linear-gradient(to top, ${theme.colors.surface}F2 0%, ${theme.colors.surface}80 60%, transparent 100%)`
                        : `linear-gradient(to ${isRight ? 'left' : 'right'}, ${theme.colors.surface}F2 0%, ${theme.colors.surface}B3 50%, transparent 100%)`
                }}
            />
            {/* REMOVED max-w-2xl constraints to allow text to flow fully */}
            <div className={`
                relative z-20 p-8 md:p-12 flex flex-col justify-center h-full overflow-hidden min-h-0 shrink-0 w-full
                ${isCenter ? 'items-center text-center mx-auto' : isRight ? 'items-end text-right ml-auto' : 'items-start text-left'}
            `}>
                <div className={`w-full ${isCenter ? 'max-w-5xl' : 'max-w-[85%]'} flex flex-col h-full justify-center`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

// 3. STATEMENT LAYOUT
export const StatementLayout: React.FC<LayoutProps> = ({ slide, theme, children }) => {
    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
            <div className="flex-[2] p-8 md:p-12 flex flex-col justify-center items-center text-center relative z-20 bg-opacity-50 min-h-0 overflow-hidden shrink-0">
                 {children}
            </div>
            <div className="flex-1 relative border-t-2 min-h-[30%] shrink-0" style={{ borderColor: theme.colors.border }}>
                <ImageContainer slide={slide} theme={theme} />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/5 pointer-events-none" />
            </div>
        </div>
    );
};

// 4. GALLERY LAYOUT
export const GalleryLayout: React.FC<LayoutProps> = ({ slide, theme, children }) => {
    return (
        <div className="w-full h-full p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
            <div 
                className="flex-[3] relative overflow-hidden shadow-inner min-h-[40%] shrink-0"
                style={{ 
                    borderRadius: `calc(${theme.layout.radius} - 4px)`,
                    border: `${theme.layout.borderWidth} solid ${theme.colors.border}`
                }}
            >
                <ImageContainer slide={slide} theme={theme} />
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-between gap-12 px-2 overflow-hidden shrink-0">
                 {children}
            </div>
        </div>
    );
};

// 5. CARD LAYOUT
export const CardLayout: React.FC<LayoutProps> = ({ slide, theme, children }) => {
    const isRight = slide.alignment === 'right';
    const isCenter = slide.alignment === 'center';
    
    return (
        <div className="relative w-full h-full flex items-center p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <ImageContainer slide={slide} theme={theme} />
                <div className="absolute inset-0 bg-black/10" />
            </div>
            
            <div 
                className={`
                    relative z-10 p-8 md:p-12 w-full max-w-2xl max-h-[90%] backdrop-blur-md shadow-2xl border flex flex-col justify-center overflow-hidden min-h-0 shrink-0
                    ${isCenter ? 'mx-auto text-center' : isRight ? 'ml-auto text-left' : 'mr-auto text-left'}
                `}
                style={{ 
                    backgroundColor: `${theme.colors.surface}E6`,
                    borderRadius: theme.layout.radius,
                    borderColor: theme.colors.border
                }}
            >
                {children}
            </div>
        </div>
    );
};

// 6. HORIZONTAL LAYOUT
export const HorizontalLayout: React.FC<LayoutProps> = ({ slide, theme, children }) => {
    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="h-[45%] relative border-b shrink-0" style={{ borderColor: theme.colors.border }}>
                <ImageContainer slide={slide} theme={theme} />
            </div>
            <div className="h-[55%] p-8 md:p-12 flex flex-col justify-center relative z-10 min-h-0 overflow-hidden shrink-0" style={{ background: theme.colors.background }}>
                 {children}
            </div>
        </div>
    );
};

// 7. MAGAZINE LAYOUT
export const MagazineLayout: React.FC<LayoutProps> = ({ slide, theme, children }) => {
    const isRight = slide.alignment === 'right';
    
    return (
        <div className="flex w-full h-full overflow-hidden">
            <div className={`w-[35%] relative h-full shrink-0 ${isRight ? 'order-2' : 'order-1'}`}>
                <ImageContainer slide={slide} theme={theme} />
                <div className={`absolute top-0 bottom-0 w-px bg-white/20 z-10 ${isRight ? 'left-0' : 'right-0'}`} />
            </div>
            
            <div className={`w-[65%] p-8 md:p-16 flex flex-col justify-center min-h-0 overflow-hidden shrink-0 ${isRight ? 'order-1' : 'order-2'}`}>
                {children}
            </div>
        </div>
    );
};
