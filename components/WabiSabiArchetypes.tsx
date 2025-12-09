
import React from 'react';
import { Quote, Barcode, Triangle, MoveUpRight, Globe, Receipt as ReceiptIcon, Ruler, Sparkles, Grid, Layers, Sunset, VenetianMask } from 'lucide-react';
import { ImageContainer } from './StandardLayouts';
import { LayoutLayer } from '../lib/themes';
import { SmartText } from './SmartText';
import { ArchetypeProps, DecorativeLabel, EditableTitle, EditableContent, MagazineLayout } from './WabiSabiComponents';

// --- ARCHETYPE DEFINITIONS ---

export const EditorialArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const isVerticalInverted = rng.next() > 0.5;
    const isHorizontalInverted = rng.next() > 0.5;
    
    return (
        <div className="w-full h-full relative overflow-hidden bg-black group">
            <div className="absolute inset-0 opacity-80 transition-transform duration-[2s] group-hover:scale-105" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <ImageContainer slide={slide} theme={theme} />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" style={{ zIndex: LayoutLayer.DECORATION }} />
            
            <div className={`absolute w-full h-full p-8 md:p-16 flex flex-col ${isVerticalInverted ? 'justify-start' : 'justify-end'} ${isHorizontalInverted ? 'items-end' : 'items-start'}`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                 <div className={`flex items-center gap-4 mb-2 border-b border-white/30 pb-4 max-w-xs ${isHorizontalInverted ? 'flex-row-reverse' : ''}`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                    <span className="text-white text-xs font-bold uppercase tracking-widest">{theme.name}</span>
                    <span className="text-white/50 text-xs">/</span>
                    <span className="text-white text-xs font-serif italic">Vol. {rng.range(1, 12).toFixed(0)}</span>
                </div>

                <MagazineLayout 
                    alignRight={isHorizontalInverted}
                    titleNode={
                        <EditableTitle 
                            slide={slide} theme={theme} contrast={{text: '#ffffff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter opacity-90"
                            style={{ lineHeight: '0.9', zIndex: LayoutLayer.CONTENT_BASE }} 
                        />
                    }
                    contentNode={
                        <EditableContent slide={slide} theme={theme} contrast={{text: '#ffffff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="flex-1 text-shadow-sm font-medium" bullet={false} />
                    }
                    footerNode={
                        <span className="text-white">
                             {slide.speakerNotes ? slide.speakerNotes.substring(0, 150) + "..." : "Visual narrative constructed via generative composition engine. Style matches semantic context."}
                        </span>
                    }
                />
            </div>
        </div>
    );
};

export const TypographicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const bgWord = slide.title.split(' ')[0] || "SLIDE";
    // Optimization: Reduced repeating count from 20 to 6 to save memory
    const words = Array(6).fill(bgWord);
    
    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-8" style={{ background: contrast.bg }}>
            {/* Texture Background - Optimized */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none overflow-hidden leading-[0.8] flex flex-col justify-center" style={{ zIndex: LayoutLayer.BACKGROUND, color: contrast.text, fontFamily: theme.fonts.heading, fontSize: '20vh', fontWeight: 900, whiteSpace: 'nowrap' }}>
                {words.map((w, i) => (
                    <div key={i} style={{ marginLeft: `${i * -5}%` }}>{w} {w} {w}</div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-7xl items-center pointer-events-none" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="order-2 md:order-1 pointer-events-auto relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-2 bg-current mb-8" style={{ color: contrast.accent }} />
                    <EditableTitle 
                        slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} 
                        className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight"
                        style={{ lineHeight: '0.9' }}
                    />
                    <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl md:text-2xl font-light" />
                </div>
                
                {/* Circle Container */}
                <div className="order-1 md:order-2 relative aspect-square pointer-events-auto" style={{ zIndex: LayoutLayer.MEDIA }}>
                     <div className="absolute inset-0 border-2 rounded-full opacity-20 scale-110" style={{ borderColor: contrast.text, borderStyle: 'dashed' }} />
                     <div className="w-full h-full rounded-full overflow-hidden border-4 relative shadow-2xl" style={{ borderColor: contrast.bg }}>
                        <ImageContainer slide={slide} theme={theme} />
                     </div>
                     <div className="absolute -bottom-6 -right-6 bg-white p-4 shadow-xl border border-black" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.text, background: contrast.bg }}>
                        <Quote className="w-8 h-8 opacity-50" style={{ color: contrast.text }} />
                     </div>
                </div>
            </div>
        </div>
    );
};

export const ConstructivistArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const angle = rng.range(-15, 15);
    const primaryColor = rng.pick([theme.colors.accent, '#ef4444', '#f59e0b', '#3b82f6']);

    return (
        <div className="w-full h-full relative overflow-hidden p-8 md:p-16 flex items-center" style={{ background: contrast.bg }}>
            {/* Background Geo */}
            <div className="absolute top-0 right-0 w-[60%] h-full opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND, background: primaryColor, clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
            <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full opacity-5 mix-blend-multiply" style={{ zIndex: LayoutLayer.BACKGROUND, background: contrast.text }} />
            
            {/* Image Plane */}
            <div className="absolute right-[5%] top-[10%] w-[45%] h-[70%] border-4 border-black transition-all duration-500 hover:rotate-0" 
                 style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast.text, transform: `rotate(${angle}deg)`, boxShadow: `20px 20px 0px ${primaryColor}` }}>
                <ImageContainer slide={slide} theme={theme} className="grayscale" />
            </div>

            {/* Content Plane - Above Image */}
            <div className="w-full md:w-3/5 flex flex-col justify-center h-full pointer-events-none relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <div className="w-24 h-24 mb-6 rounded-full mix-blend-multiply opacity-90 animate-pulse pointer-events-auto" style={{ backgroundColor: primaryColor }} />
                
                <div className="pointer-events-auto bg-transparent">
                    <EditableTitle
                        slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-6xl md:text-8xl font-black uppercase mb-8"
                        style={{ lineHeight: '0.9' }}
                    />
                    <div className="border-l-4 pl-6 backdrop-blur-sm bg-white/30 p-4 rounded-r-lg" style={{ borderColor: contrast.text }}>
                        <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg font-bold" bullet={false} />
                    </div>
                </div>
            </div>

            {/* Floating Element */}
            <div className="absolute bottom-12 right-12 bg-white border-2 border-black p-4 rotate-3" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.text, background: contrast.bg }}>
                <Barcode className="w-12 h-6 mb-1" style={{ color: contrast.text }} />
                <div className="text-[9px] font-mono text-center">REF-{rng.range(1000,9999).toFixed(0)}</div>
            </div>
        </div>
    );
};

export const BauhausArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const c1 = '#E4002B'; // Red
    const c2 = '#0057B7'; // Blue
    const c3 = '#FFD700'; // Yellow
    
    return (
        <div className="w-full h-full relative bg-[#f0f0f0] p-8 md:p-12 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white" style={{ zIndex: LayoutLayer.BACKGROUND }} />
            
            {/* Geo Shapes */}
            <div className="absolute top-12 right-12 w-32 h-32 rounded-full mix-blend-multiply opacity-90" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: c1 }} />
            <div className="absolute top-32 right-32 w-32 h-32 bg-transparent border-[20px] rounded-full opacity-80" style={{ zIndex: LayoutLayer.DECORATION, borderColor: c2 }} />
            <div className="absolute bottom-12 left-12 w-64 h-12" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: c3 }} />

            <div className="flex gap-8 h-[60%] pointer-events-none" style={{ zIndex: LayoutLayer.MEDIA }}>
                 <div className="w-1/2 h-full relative overflow-hidden rounded-tr-[100px] pointer-events-auto">
                    <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" />
                 </div>
                 <div className="w-1/2 pt-12">
                    <div className="pointer-events-auto relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                        <EditableTitle 
                            slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} 
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
                            style={{ lineHeight: '0.9' }}
                        />
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t-4 border-black pt-6 mt-8" style={{ zIndex: LayoutLayer.CONTENT_BASE, borderColor: '#111' }}>
                <div className="col-span-2 pointer-events-auto">
                    <EditableContent slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" bullet={false} />
                </div>
                <div className="flex justify-end items-end">
                    <Triangle className="w-12 h-12 text-black fill-current" />
                </div>
            </div>
        </div>
    );
};

export const BrutalistArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full p-4 md:p-6" style={{ background: contrast.accent }}>
        <div className="w-full h-full border-4 border-black bg-white relative flex flex-col md:flex-row overflow-hidden shadow-[12px_12px_0px_rgba(0,0,0,1)]" style={{ borderColor: contrast.text, background: contrast.bg }}>
             
             {/* Header Strip */}
             <div className="absolute top-0 left-0 w-full h-12 border-b-4 border-black flex items-center justify-between px-4 bg-white" style={{ zIndex: LayoutLayer.UI, borderColor: contrast.text }}>
                <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-red-500" />
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-yellow-400" />
                </div>
                <div className="font-mono text-xs font-bold uppercase">Fig. {rng.range(1, 10).toFixed(0)}</div>
             </div>

             <div className="w-full md:w-1/2 h-1/2 md:h-full pt-12 border-b-4 md:border-b-0 md:border-r-4 border-black relative" style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast.text }}>
                <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" />
                <div className="absolute inset-0 bg-red-500 mix-blend-lighten opacity-30 pointer-events-none" />
             </div>

             <div className="w-full md:w-1/2 h-1/2 md:h-full pt-12 p-8 flex flex-col justify-between bg-white" style={{ zIndex: LayoutLayer.CONTENT_BASE, background: contrast.bg}}>
                <div>
                    <EditableTitle slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-7xl font-black uppercase mb-4" style={{ lineHeight: '1' }} />
                    <div className="w-full h-2 bg-black mb-6" />
                </div>
                <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-mono text-sm md:text-base" />
                <div className="mt-4 flex justify-end">
                    <MoveUpRight className="w-12 h-12" style={{ color: contrast.text }} />
                </div>
             </div>
        </div>
    </div>
);

export const PostModernArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const bgPattern = rng.next() > 0.5 
        ? `radial-gradient(${contrast.accent} 2px, transparent 2px)` 
        : `repeating-linear-gradient(45deg, ${contrast.accent}20 0, ${contrast.accent}20 2px, transparent 0, transparent 50%)`;
        
    const shapeColor = rng.pick(['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C']);

    return (
        <div className="w-full h-full relative overflow-hidden bg-white p-8" style={{ background: contrast.bg }}>
            <div className="absolute inset-0 opacity-20" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: bgPattern, backgroundSize: '20px 20px' }} />
            
            {/* Floating Primitives */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full border-4 border-black shadow-[4px_4px_0_#000]" style={{ zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 transform rotate-12 border-4 border-black shadow-[4px_4px_0_#000]" style={{ zIndex: LayoutLayer.DECORATION }} />
            
            <div className="relative h-full flex flex-col md:flex-row items-center gap-12" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="w-full md:w-1/2">
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] transform -rotate-1 relative" style={{ borderColor: contrast.text }}>
                        <EditableTitle slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: '"Righteous", cursive', lineHeight: '1' }} />
                        <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold" />
                    </div>
                </div>
                <div className="w-full md:w-1/2 aspect-square relative">
                    <div className="absolute inset-0 bg-black translate-x-4 translate-y-4" style={{ backgroundColor: shapeColor }} />
                    <div className="relative w-full h-full border-4 border-black bg-white overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SchematicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const gridColor = contrast.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,100,0.1)';
    const inkColor = contrast.mode === 'dark' ? '#fff' : '#0033cc';

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0a192f] p-12 font-mono" style={{ background: contrast.mode === 'dark' ? '#0f172a' : '#f0f9ff' }}>
            {/* Blueprint Grid */}
            <div className="absolute inset-0" style={{ 
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, 
                backgroundSize: '40px 40px' 
            }} />
            <div className="absolute inset-0 border-[20px] border-double pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, borderColor: inkColor, opacity: 0.3 }} />

            <div className="relative h-full flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="flex justify-between items-end border-b-2 pb-4 mb-8" style={{ borderColor: inkColor }}>
                    <div className="flex flex-col">
                         <span className="text-[10px] uppercase tracking-widest opacity-70" style={{ color: inkColor }}>Project No. {rng.range(100,999).toFixed(0)}</span>
                         <EditableTitle slide={slide} theme={theme} contrast={{ text: inkColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-6xl font-bold uppercase" style={{ fontFamily: '"Space Mono", monospace', lineHeight: '1' }} />
                    </div>
                    <div className="border border-current px-2 py-1 text-xs" style={{ color: inkColor }}>REV A.02</div>
                </div>

                <div className="flex-1 flex gap-8">
                    <div className="w-1/2 relative border" style={{ borderColor: inkColor }}>
                         <div className="absolute top-0 left-0 border-b border-r px-2 py-1 text-[9px] uppercase" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: inkColor, color: inkColor, background: contrast.bg }}>Fig 1.0</div>
                         
                         <div className="w-full h-full p-6">
                            <div className="w-full h-full relative overflow-hidden grayscale contrast-125 opacity-80 mix-blend-multiply dark:mix-blend-normal">
                                <ImageContainer slide={slide} theme={theme} />
                            </div>
                         </div>
                    </div>
                    <div className="w-1/2 pt-4">
                        <div className="flex items-center gap-2 mb-4 opacity-50" style={{ color: inkColor }}>
                            <Ruler className="w-4 h-4" />
                            <span className="text-[10px] uppercase">Specifications</span>
                        </div>
                        <EditableContent slide={slide} theme={theme} contrast={{ text: inkColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm space-y-4" style={{ fontFamily: '"Space Mono", monospace' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CinematicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    return (
        <div className="w-full h-full relative bg-black flex flex-col justify-center overflow-hidden">
            {/* Letterbox Bars - Set to OVERLAY (50) */}
            <div className="absolute top-0 left-0 w-full h-[12%] bg-black pointer-events-none" style={{ zIndex: LayoutLayer.OVERLAY }} />
            <div className="absolute bottom-0 left-0 w-full h-[12%] bg-black pointer-events-none" style={{ zIndex: LayoutLayer.OVERLAY }} />
            
            <div className="w-full h-full relative animate-in fade-in duration-1000" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <ImageContainer slide={slide} theme={theme} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Text Boosted to CONTENT_TOP (60) to sit ABOVE letterbox bars */}
            <div className="absolute bottom-[15%] w-full text-center px-20" style={{ zIndex: LayoutLayer.CONTENT_TOP }}>
                 <EditableTitle 
                    slide={slide} theme={theme} contrast={{text: '#ffffff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} 
                    className="text-5xl md:text-7xl font-bold text-white mb-4 text-shadow-xl drop-shadow-lg tracking-wide opacity-90"
                    style={{ lineHeight: '1.1', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                 />
                 <div className="inline-block bg-black/50 backdrop-blur-sm px-6 py-2 rounded-sm border-y border-white/10">
                    <EditableContent 
                        slide={slide} theme={theme} contrast={{text: '#ddd'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} 
                        className="text-lg md:text-xl text-zinc-200 italic font-serif" 
                        bullet={false} 
                    />
                 </div>
            </div>
        </div>
    );
};

export const CollageArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const rot1 = rng.range(-5, 5);
    const rot2 = rng.range(-3, 3);
    const tapeColor = rng.pick(['#ef4444', '#f59e0b', '#84cc16']);

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#f3f4f6] flex items-center justify-center p-8">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.5'/%3E%3C/svg%3E")` }} />
            
            <div className="relative w-full max-w-5xl h-[80%] flex items-center justify-center">
                {/* Text Content - CONTENT_HERO (40) */}
                <div className="absolute top-0 right-0 w-[60%] h-full bg-white shadow-xl p-12 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO, transform: `rotate(${rot2}deg)`, clipPath: 'polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%)' }}>
                     <EditableTitle slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-5xl md:text-7xl font-serif italic mb-6" style={{ color: '#111', lineHeight: '1' }} />
                     <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-mono text-sm" />
                </div>
                
                {/* Image - CONTENT_BASE (30) so it stays behind text box */}
                <div className="absolute top-10 left-0 w-[45%] aspect-[3/4] bg-white p-2 shadow-2xl transition-transform hover:scale-105 duration-300" style={{ zIndex: LayoutLayer.CONTENT_BASE, transform: `rotate(${rot1}deg)` }}>
                    <div className="w-full h-full relative">
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 opacity-80" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: tapeColor, transform: 'rotate(-2deg)' }} />
                         <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ZineArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const tapeColor = rng.pick(['#ef4444', '#facc15', '#3b82f6']);
    const rotation = rng.range(-2, 2);

    return (
        <div className="w-full h-full relative p-8 flex flex-col md:flex-row gap-8 items-center justify-center overflow-hidden" style={{ background: contrast.bg }}>
            <div className="absolute inset-0 opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: theme.colors.backgroundPattern || `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />

            <div className="relative w-full md:w-1/2 aspect-[4/5] shrink-0 transition-transform hover:scale-105 duration-500" style={{ zIndex: LayoutLayer.MEDIA, transform: `rotate(${rotation}deg)` }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 shadow-sm" style={{ zIndex: LayoutLayer.OVERLAY, background: tapeColor, transform: `rotate(${rng.range(-2, 2)}deg)`, opacity: 0.9, clipPath: `polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)` }} />
                <div className="w-full h-full shadow-2xl border-4 border-white"><ImageContainer slide={slide} theme={theme} /></div>
            </div>

            <div className="relative w-full md:w-1/2 p-10 bg-white shadow-[12px_12px_0_rgba(0,0,0,0.15)] border-2 border-zinc-100/50 backdrop-blur-sm" style={{ zIndex: LayoutLayer.CONTENT_BASE, transform: `rotate(${-rotation}deg)` }}>
                <EditableTitle slide={slide} theme={theme} contrast={{text: '#000'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-7xl mb-6 uppercase tracking-tighter font-black" style={{ lineHeight: '0.95', color: '#111' }} />
                <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" />
            </div>
        </div>
    );
};

export const SwissArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full grid grid-cols-12 grid-rows-6 bg-zinc-50" style={{ background: contrast.bg }}>
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-20 border-r border-black" style={{ zIndex: LayoutLayer.BACKGROUND, borderColor: contrast.border }}>
             {[...Array(12)].map((_, i) => <div key={i} className="border-l border-black h-full" style={{ borderColor: contrast.border }} />)}
        </div>

        <div className="col-span-12 row-span-4 md:col-span-8 md:row-span-6 relative border-b md:border-b-0 md:border-r border-black" style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast.border }}>
            <ImageContainer slide={slide} theme={theme} />
            <div className="absolute top-6 left-6 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-black shadow-sm" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.border, color: contrast.text, background: contrast.bg }}>
                Figure {rng.range(1, 99).toFixed(0)}
            </div>
        </div>
        
        <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-6 p-8 flex flex-col justify-between h-full relative" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
            <div>
                <div className="w-full h-px bg-current mb-2 opacity-50" style={{ color: contrast.text }} />
                <DecorativeLabel text={`Grid Sys. ${rng.range(10,20).toFixed(0)}`} className="mb-8" style={{ color: contrast.text }} />
                <EditableTitle slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8" style={{ textTransform: 'lowercase' }} />
            </div>
            <div className="space-y-4">
                <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-sm md:text-base" bullet={false} />
            </div>
        </div>
    </div>
);

export const CyberDeckArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full bg-[#050505] p-6 md:p-12 font-mono flex flex-col relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-cyan-900/30 rounded-lg pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }} />
        
        <div className="flex flex-col md:flex-row gap-12 h-full" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-6 text-cyan-500/80">
                    <Globe className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] tracking-widest uppercase">Netrunner Link // Active</span>
                 </div>
                 <EditableTitle slide={slide} theme={theme} contrast={{text: '#22d3ee'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-3xl md:text-6xl font-bold mb-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ fontFamily: '"Rajdhani", sans-serif', lineHeight: '1.1' }} />
                 
                 <div className="border-l-2 border-cyan-800 pl-6 space-y-4 relative">
                    {slide.content.map((item: string, i: number) => (
                        <div key={i} className="text-sm md:text-base text-cyan-100/80 font-mono flex gap-3">
                            <span className="text-cyan-600">0{i+1}</span>
                            <SmartText
                                value={item}
                                onChange={(val) => { const newC = [...slide.content]; newC[i] = val; onUpdateSlide?.({ content: newC }); }}
                                readOnly={readOnly}
                                fontSize={16}
                                lineHeight={1.4}
                                className="bg-transparent outline-none w-full"
                            />
                        </div>
                    ))}
                 </div>
            </div>

            <div className="w-full md:w-1/2 relative border border-cyan-900/50 bg-cyan-950/10 p-1">
                <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125 brightness-110 opacity-70" style={{ filter: 'sepia(100%) hue-rotate(130deg) saturate(200%)' }} />
            </div>
        </div>
    </div>
);

export const ReceiptArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full flex items-center justify-center p-4 bg-zinc-800 relative">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]" style={{ zIndex: LayoutLayer.BACKGROUND }} />
        
        <div className="w-full max-w-md bg-white shadow-2xl relative flex flex-col p-8 filter drop-shadow-xl" 
             style={{ 
                 zIndex: LayoutLayer.CONTENT_BASE,
                 clipPath: 'polygon(0% 0%, 100% 0%, 100% 98%, 98% 100%, 96% 98%, 94% 100%, 92% 98%, 90% 100%, 88% 98%, 86% 100%, 84% 98%, 82% 100%, 80% 98%, 78% 100%, 76% 98%, 74% 100%, 72% 98%, 70% 100%, 68% 98%, 66% 100%, 64% 98%, 62% 100%, 60% 98%, 58% 100%, 56% 98%, 54% 100%, 52% 98%, 50% 100%, 48% 98%, 46% 100%, 44% 98%, 42% 100%, 40% 98%, 38% 100%, 36% 98%, 34% 100%, 32% 98%, 30% 100%, 28% 98%, 26% 100%, 24% 98%, 22% 100%, 20% 98%, 18% 100%, 16% 98%, 14% 100%, 12% 98%, 10% 100%, 8% 98%, 6% 100%, 4% 98%, 2% 100%, 0% 98%)' 
             }}>
            <div className="text-center border-b-2 border-dashed border-zinc-300 pb-6 mb-6">
                <div className="w-12 h-12 mx-auto mb-3 bg-zinc-900 rounded-full flex items-center justify-center text-white">
                    <ReceiptIcon className="w-6 h-6" />
                </div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Official Record</h3>
                <div className="font-mono text-[10px] text-zinc-400 mt-1">{new Date().toLocaleDateString()} // {new Date().toLocaleTimeString()}</div>
            </div>
            
            <EditableTitle slide={slide} theme={theme} contrast={{text: '#000'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl font-mono text-center mb-8 uppercase" style={{ fontFamily: '"Space Mono", monospace', lineHeight: '1.1' }} />
            
            <div className="space-y-4 mb-8 font-mono text-sm">
                {slide.content.map((item: string, i: number) => (
                    <div key={i} className="flex justify-between items-start border-b border-zinc-100 pb-2">
                        <SmartText
                            value={item}
                            onChange={(val) => { const newC = [...slide.content]; newC[i] = val; onUpdateSlide?.({ content: newC }); }}
                            readOnly={readOnly}
                            fontSize={14}
                            lineHeight={1.3}
                            className="w-3/4 bg-transparent outline-none resize-none"
                        />
                        <span className="w-1/4 text-right font-bold text-zinc-400">{(rng.next() * 100).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const Y2KArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    // Liquid chrome & glossy aesthetic
    return (
        <div className="w-full h-full relative overflow-hidden bg-white flex items-center justify-center p-8">
             {/* Holographic Background */}
             <div className="absolute inset-0 opacity-20" style={{ 
                 background: `radial-gradient(circle at 50% 50%, #e0e7ff 0%, #fae8ff 50%, #dbeafe 100%)`, 
                 zIndex: LayoutLayer.BACKGROUND 
             }} />
             <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)`, zIndex: LayoutLayer.BACKGROUND }} />

             {/* Floating Blobs */}
             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-cyan-300" style={{ zIndex: LayoutLayer.DECORATION }} />
             <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-pink-300" style={{ zIndex: LayoutLayer.DECORATION, animationDelay: '1s' }} />

             <div className="w-full max-w-5xl relative z-20 flex flex-col md:flex-row gap-8 items-center">
                 <div className="w-full md:w-1/2 p-8 backdrop-blur-xl bg-white/40 rounded-[3rem] border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.1)] relative overflow-hidden">
                     {/* Gloss Highlight */}
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                     
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-cyan-700/60">
                            <Sparkles className="w-3 h-3" />
                            <span>Future_Vision.exe</span>
                        </div>
                        <EditableTitle 
                            slide={slide} theme={theme} contrast={{text: '#1e293b'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-5xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-sm" 
                            style={{ lineHeight: '0.9' }}
                        />
                        <EditableContent slide={slide} theme={theme} contrast={{text: '#334155'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium" />
                     </div>
                 </div>

                 <div className="w-full md:w-1/2 aspect-square relative group">
                     <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-pink-500 rounded-[2rem] transform rotate-3 scale-105 opacity-50 blur-lg group-hover:rotate-6 transition-all duration-500" />
                     <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                         <ImageContainer slide={slide} theme={theme} />
                     </div>
                 </div>
             </div>
        </div>
    );
};

export const RisographArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    // Grainy, misaligned print effect
    const colorA = '#FF0055'; // Riso Pink
    const colorB = '#0066CC'; // Riso Blue
    
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#FFFAF0] p-12 flex flex-col justify-center">
             {/* Paper Grain */}
             <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`, zIndex: LayoutLayer.OVERLAY, mixBlendMode: 'multiply' }} />

             <div className="flex gap-12 items-center relative z-10">
                 {/* Image with Fake Duotone/Misalignment */}
                 <div className="w-1/2 relative aspect-[3/4]">
                     <div className="absolute inset-0 bg-blue-500/20 translate-x-2 translate-y-2 mix-blend-multiply" style={{ zIndex: LayoutLayer.DECORATION }} />
                     <div className="absolute inset-0 bg-pink-500/20 -translate-x-2 -translate-y-2 mix-blend-multiply" style={{ zIndex: LayoutLayer.DECORATION }} />
                     
                     <div className="relative w-full h-full grayscale contrast-150 brightness-110 mix-blend-multiply" style={{ zIndex: LayoutLayer.MEDIA }}>
                         <ImageContainer slide={slide} theme={theme} style={{ filter: 'grayscale(100%) contrast(1.2)' }} />
                     </div>
                     
                     {/* Color Overlay for Duotone feel */}
                     <div className="absolute inset-0 bg-blue-900 mix-blend-lighten pointer-events-none opacity-50" style={{ zIndex: LayoutLayer.MEDIA }} />
                 </div>

                 <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                     <div className="w-12 h-12 rounded-full border-4 mb-6 border-blue-600/80 mix-blend-multiply" />
                     <EditableTitle
                         slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                         className="text-6xl md:text-8xl font-black uppercase mb-6 tracking-tighter opacity-90"
                         style={{ color: '#111', lineHeight: '0.9' }}
                     />
                     <div className="p-6 border-l-4 border-pink-500/60 bg-white/50 backdrop-blur-sm">
                        <EditableContent slide={slide} theme={theme} contrast={{text: '#222'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" />
                     </div>
                 </div>
             </div>
        </div>
    );
};

export const VaporwaveArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    // A E S T H E T I C - Gradients, Grid, Windows 95
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#ff9cd6] flex flex-col items-center justify-center">
            {/* Gradient Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#240046] via-[#7b2cbf] to-[#ff9cd6] h-[60%]" style={{ zIndex: LayoutLayer.BACKGROUND }} />
            
            {/* Perspective Grid Floor */}
            <div className="absolute bottom-0 w-full h-[40%] bg-[#240046]" style={{ 
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(transparent 95%, cyan 95%), linear-gradient(90deg, transparent 95%, cyan 95%)`,
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-100px)'
            }} />

            {/* Sun */}
            <div className="absolute top-[20%] w-64 h-64 rounded-full bg-gradient-to-t from-yellow-300 to-pink-500 blur-md" style={{ zIndex: LayoutLayer.BACKGROUND }} />

            <div className="relative z-20 flex items-center justify-center w-full max-w-6xl gap-12">
                {/* Floating Windows 95 Window */}
                <div className="w-1/2 bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                    <div className="bg-blue-800 px-2 py-1 flex justify-between items-center text-white mb-1">
                        <span className="text-[10px] font-bold">visual_explorer.exe</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 bg-[#c0c0c0] border border-gray-500" />
                            <div className="w-3 h-3 bg-[#c0c0c0] border border-gray-500" />
                        </div>
                    </div>
                    <div className="w-full aspect-video bg-black relative">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                <div className="w-1/2 text-left">
                     <div className="text-cyan-300 text-xs font-bold uppercase tracking-[0.5em] mb-4 drop-shadow-md">AESTHETIC // VIBE</div>
                     <EditableTitle 
                        slide={slide} theme={theme} contrast={{text: '#fff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-[2px_2px_0_#ff00ff]"
                        style={{ fontFamily: '"Arial", sans-serif', fontStyle: 'italic' }} 
                     />
                     <div className="bg-black/40 p-6 border border-white/20 backdrop-blur-md">
                        <EditableContent slide={slide} theme={theme} contrast={{text: '#fff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-shadow-sm" />
                     </div>
                </div>
            </div>
            
            {/* Japanese Text Decor */}
            <div className="absolute top-10 right-10 text-white/30 text-6xl font-black writing-vertical-rl pointer-events-none select-none">
                データウェーブ
            </div>
        </div>
    );
};

export const SwissGridArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    // Muller-Brockmann Style - Strict Grid
    return (
        <div className="w-full h-full bg-white relative p-12 flex flex-col">
            {/* The Grid Layer */}
            <div className="absolute inset-0 px-12 py-12 grid grid-cols-4 gap-4 pointer-events-none">
                <div className="border-r border-red-500/20 h-full" />
                <div className="border-r border-red-500/20 h-full" />
                <div className="border-r border-red-500/20 h-full" />
                <div className="border-r border-red-500/20 h-full hidden" />
            </div>

            <div className="w-full h-4 bg-black mb-12 flex items-center justify-between px-2">
                <span className="text-white text-[9px] font-bold uppercase tracking-widest">Grid System 04</span>
                <Grid className="w-3 h-3 text-white" />
            </div>

            <div className="grid grid-cols-4 gap-8 h-full relative z-10">
                <div className="col-span-1 flex flex-col justify-between">
                     <div className="text-9xl font-black tracking-tighter leading-none" style={{ color: '#000' }}>
                         {rng.range(0,9).toFixed(0)}<span className="text-red-600">.</span>
                     </div>
                     <div className="text-xs font-bold uppercase tracking-widest rotate-180 origin-top-left translate-y-full text-zinc-400">
                         International Style
                     </div>
                </div>

                <div className="col-span-2 pt-24">
                    <EditableTitle 
                        slide={slide} theme={theme} contrast={{text: '#000'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8"
                        style={{ fontFamily: '"Helvetica Neue", "Arial", sans-serif' }} 
                    />
                    <div className="w-12 h-2 bg-red-600 mb-8" />
                    <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-lg" bullet={false} />
                </div>

                <div className="col-span-1 h-full relative">
                    <div className="absolute inset-0 bg-zinc-100 grayscale contrast-125">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-red-600 text-white p-2 text-xs font-bold">Fig A.</div>
                </div>
            </div>
        </div>
    );
};

export const NoirArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    // Cinematic Shadow & Light
    return (
        <div className="w-full h-full bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
            {/* Venetian Blind Shadow Effect */}
            <div className="absolute inset-0 pointer-events-none" style={{ 
                zIndex: LayoutLayer.OVERLAY,
                background: `linear-gradient(transparent 50%, rgba(0,0,0,0.8) 50%)`,
                backgroundSize: '100% 40px'
            }} />
            
            <div className="absolute inset-0 opacity-50 grayscale contrast-150" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <ImageContainer slide={slide} theme={theme} />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" style={{ zIndex: LayoutLayer.BACKGROUND }} />

            <div className="relative z-20 w-full max-w-6xl px-12 grid grid-cols-2">
                <div className="col-span-1 pr-12 border-r border-white/20">
                     <div className="flex items-center gap-3 mb-8 text-white/40">
                         <VenetianMask className="w-6 h-6" />
                         <span className="text-xs font-bold uppercase tracking-[0.3em]">Shadow Play</span>
                     </div>
                     
                     {/* Text boosted to CONTENT_TOP (60) to float ABOVE the blinds overlay (50) */}
                     <div style={{ position: 'relative', zIndex: LayoutLayer.CONTENT_TOP }}>
                         <EditableTitle 
                            slide={slide} theme={theme} contrast={{text: '#fff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 drop-shadow-2xl" 
                            style={{ lineHeight: '1.1' }}
                         />
                         <div className="w-24 h-1 bg-white mb-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                         <EditableContent slide={slide} theme={theme} contrast={{text: '#ccc'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-serif text-xl italic opacity-80" />
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- NEW WABI SABI ARCHETYPES ---

// 1. KINTSUGI - Japanese Golden Repair
export const KintsugiArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const goldColor = '#d4af37';
    const isInverted = rng.next() > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#1a1a2e' }}>
            {/* Crackle Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }} />

            {/* Gold Repair Vein - Main Diagonal */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="kintsugiGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#b8860b" />
                            <stop offset="50%" stopColor="#ffd700" />
                            <stop offset="100%" stopColor="#d4af37" />
                        </linearGradient>
                        <filter id="kintsugiGlow">
                            <feGaussianBlur stdDeviation="0.5" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <path d={`M ${isInverted ? 100 : 0} 30 Q 50 50 ${isInverted ? 0 : 100} 70`} stroke="url(#kintsugiGold)" strokeWidth="0.4" fill="none" filter="url(#kintsugiGlow)" />
                    <path d={`M ${isInverted ? 85 : 15} 0 Q 50 35 ${isInverted ? 20 : 80} 100`} stroke="url(#kintsugiGold)" strokeWidth="0.25" fill="none" filter="url(#kintsugiGlow)" opacity="0.7" />
                </svg>
            </div>

            {/* Floating Gold Leaf Fragments */}
            <div className="absolute top-12 right-20 w-4 h-4 rotate-12 opacity-60" style={{ zIndex: LayoutLayer.DECORATION, background: `linear-gradient(135deg, #ffd700 0%, #b8860b 100%)`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <div className="absolute bottom-24 left-16 w-3 h-3 -rotate-6 opacity-40" style={{ zIndex: LayoutLayer.DECORATION, background: `linear-gradient(135deg, #d4af37 0%, #8b7500 100%)`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />

            <div className={`w-full h-full p-12 md:p-20 flex ${isInverted ? 'flex-row-reverse' : 'flex-row'} gap-12 items-center`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                {/* Content Side */}
                <div className="w-1/2 flex flex-col justify-center relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-px mb-8" style={{ background: `linear-gradient(90deg, ${goldColor}, transparent)` }} />
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#e8e0d5' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8 tracking-tight"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />
                    <div className="border-l-2 pl-6" style={{ borderColor: goldColor }}>
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a0a0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg font-light" />
                    </div>
                    <div className="mt-8 text-xs uppercase tracking-[0.3em] opacity-40" style={{ color: goldColor }}>
                        金継ぎ • Kintsugi
                    </div>
                </div>

                {/* Image Side - Organic Shape */}
                <div className="w-1/2 relative aspect-[4/5]" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute inset-0 overflow-hidden" style={{
                        borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
                        border: `2px solid ${goldColor}`,
                        boxShadow: `0 0 30px ${goldColor}40, inset 0 0 20px rgba(0,0,0,0.5)`
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="saturate-75" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8" style={{ background: `linear-gradient(135deg, ${goldColor}, transparent)`, opacity: 0.6 }} />
                </div>
            </div>
        </div>
    );
};

// 2. HYGGE - Scandinavian Warmth
export const HyggeArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const warmAmber = '#e8c87a';
    const creamColor = '#f5f0e8';
    const isFlipped = rng.next() > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#faf9f7' }}>
            {/* Subtle Linen Texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='linen'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23linen)' opacity='0.3'/%3E%3C/svg%3E")`
            }} />

            {/* Soft Ambient Glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, background: warmAmber }} />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, background: '#ffecd2' }} />

            <div className={`w-full h-full p-12 md:p-20 flex ${isFlipped ? 'flex-row-reverse' : 'flex-row'} gap-16 items-center`}>
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6 opacity-50">
                        <div className="w-3 h-3 rounded-full" style={{ background: warmAmber, boxShadow: `0 0 12px ${warmAmber}` }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#8b8178' }}>Hygge</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <div className="p-6 rounded-2xl" style={{ background: creamColor, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" />
                    </div>
                </div>

                {/* Image with Soft Frame */}
                <div className="w-1/2 aspect-square relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]" style={{ border: `8px solid ${creamColor}` }}>
                        <ImageContainer slide={slide} theme={theme} className="saturate-90" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full opacity-60" style={{
                        background: `repeating-linear-gradient(90deg, ${warmAmber} 0px, ${warmAmber} 4px, transparent 4px, transparent 8px)`
                    }} />
                </div>
            </div>
        </div>
    );
};

// 3. TERRAZZO - Italian Composite Stone
export const TerrazzoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const chips = [
        { color: '#a3b18a', x: 15, y: 20, size: 18, rotate: 45 },
        { color: '#c17767', x: 80, y: 15, size: 24, rotate: -30 },
        { color: '#e8b4bc', x: 25, y: 75, size: 16, rotate: 60 },
        { color: '#d4c5b9', x: 70, y: 80, size: 20, rotate: -45 },
        { color: '#a3b18a', x: 90, y: 50, size: 14, rotate: 15 },
        { color: '#c17767', x: 5, y: 45, size: 22, rotate: -60 },
        { color: '#e8b4bc', x: 55, y: 5, size: 12, rotate: 30 },
        { color: '#d4c5b9', x: 45, y: 90, size: 16, rotate: -15 },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fdfbf7' }}>
            {/* Scattered Chips */}
            {chips.map((chip, i) => (
                <div
                    key={i}
                    className="absolute rounded-full opacity-70"
                    style={{
                        zIndex: LayoutLayer.DECORATION,
                        background: chip.color,
                        width: chip.size,
                        height: chip.size * 0.6,
                        left: `${chip.x}%`,
                        top: `${chip.y}%`,
                        transform: `rotate(${chip.rotate}deg)`,
                        borderRadius: '50%'
                    }}
                />
            ))}

            <div className="w-full h-full p-12 md:p-20 flex flex-col md:flex-row gap-12 items-center" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                {/* Image with Organic Blob Shape */}
                <div className="w-full md:w-1/2 aspect-square relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full overflow-hidden shadow-lg" style={{
                        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                        border: '4px solid #fff'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-6">
                        <div className="w-4 h-4 rounded-full" style={{ background: '#a3b18a' }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: '#c17767' }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: '#e8b4bc' }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8 tracking-tight"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" />

                    <div className="mt-8 text-xs uppercase tracking-widest opacity-40" style={{ color: '#8a8a8a' }}>
                        Terrazzo • Milano
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. KINFOLK - Quiet Luxury Editorial
export const KinfolkArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isImageRight = rng.next() > 0.5;
    const dustyRose = '#c9b8b5';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fdfaf6' }}>
            <div className="w-full h-full p-16 md:p-24 lg:p-32">
                <div className={`w-full h-full flex ${isImageRight ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-2/5 flex flex-col justify-end pb-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                        <div className="w-full h-px mb-6" style={{ background: '#e0dcd8' }} />
                        <span className="text-[9px] uppercase tracking-[0.4em] mb-4" style={{ color: '#a89e94' }}>
                            Issue {rng.range(1, 50).toFixed(0)}
                        </span>

                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-4xl md:text-5xl lg:text-6xl mb-8"
                            style={{ fontWeight: 400, lineHeight: '1.15' }}
                        />

                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#7a7a7a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm max-w-xs" style={{ lineHeight: '1.7' }} bullet={false} />
                    </div>

                    <div className="w-1/5" />

                    <div className="w-2/5 flex flex-col justify-start" style={{ zIndex: LayoutLayer.MEDIA }}>
                        <div className="w-full aspect-[3/4] relative">
                            <ImageContainer slide={slide} theme={theme} className="grayscale-[20%]" />
                        </div>
                        <div className="w-full h-px mt-4" style={{ background: dustyRose }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5. MEDITERRANEAN - Sun-Bleached Elegance
export const MediterraneanArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const azure = '#2563eb';
    const terracotta = '#c2714f';
    const olive = '#6b7c5c';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fefefe' }}>
            {/* Stucco Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='stucco'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23stucco)' opacity='0.4'/%3E%3C/svg%3E")`
            }} />

            {/* Tile Pattern Border */}
            <div className="absolute bottom-0 left-0 w-full h-4 opacity-40" style={{
                zIndex: LayoutLayer.DECORATION,
                background: `repeating-linear-gradient(90deg, ${azure} 0px, ${azure} 16px, #fff 16px, #fff 32px)`
            }} />

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                {/* Image with Arch Shape */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden shadow-xl" style={{
                        borderRadius: '50% 50% 4px 4px / 30% 30% 0% 0%',
                        border: `4px solid ${terracotta}20`
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="saturate-90 brightness-105" style={{ filter: 'sepia(10%)' }} />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-[50%] opacity-10" style={{ background: '#000', filter: 'blur(8px)' }} />
                </div>

                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-1" style={{ background: azure }} />
                        <span className="text-xs uppercase tracking-[0.25em]" style={{ color: olive }}>Mediterraneo</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2a2a2a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" />

                    <div className="mt-10 flex gap-4">
                        <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: azure }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: terracotta }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: olive }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. SUMI-E - Japanese Ink Wash
export const SumieArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isLeftAligned = rng.next() > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fefdfb' }}>
            {/* Washi Paper Texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='washi'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23washi)' opacity='0.4'/%3E%3C/svg%3E")`
            }} />

            {/* Ink Splash SVG */}
            <div className="absolute top-10 right-10 w-32 h-32 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 100 100" fill="#000">
                    <circle cx="50" cy="50" r="30" />
                    <ellipse cx="75" cy="40" rx="15" ry="8" />
                    <ellipse cx="30" cy="70" rx="10" ry="20" />
                </svg>
            </div>

            {/* Red Seal (Hanko) */}
            <div className="absolute bottom-16 right-16 w-16 h-16 flex items-center justify-center opacity-80" style={{ zIndex: LayoutLayer.OVERLAY }}>
                <div className="w-full h-full border-2 border-red-600 flex items-center justify-center" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
                    <span className="text-red-600 text-lg font-bold">墨</span>
                </div>
            </div>

            <div className={`w-full h-full p-16 md:p-24 flex ${isLeftAligned ? 'justify-start' : 'justify-end'}`}>
                <div className="w-2/3 md:w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-1 mb-12 opacity-60" style={{ background: 'linear-gradient(90deg, #000 0%, transparent 100%)' }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1a1a1a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-6xl md:text-8xl mb-12"
                        style={{ fontWeight: 700, lineHeight: '1.0' }}
                    />

                    <div className="max-w-md">
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} bullet={false} />
                    </div>
                </div>
            </div>

            {/* Image - Small, Ink-Washed */}
            <div className="absolute bottom-24 left-16 w-48 h-64 shadow-xl" style={{ zIndex: LayoutLayer.MEDIA }}>
                <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" style={{ filter: 'grayscale(100%) contrast(1.2) brightness(1.1)' }} />
            </div>
        </div>
    );
};

// 7. MONOLITH - Architectural Minimalism
export const MonolithArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isDark = rng.next() > 0.5;
    const bgColor = isDark ? '#0d0d0d' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0d0d0d';
    const accentColor = rng.pick(['#ef4444', '#3b82f6', '#000000']);

    return (
        <div className="w-full h-full relative overflow-hidden flex" style={{ background: bgColor }}>
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
            }} />

            {/* Image Block */}
            <div className="w-1/2 h-full relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                <ImageContainer slide={slide} theme={theme} className={isDark ? 'brightness-90' : ''} />
                <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: accentColor }} />
            </div>

            {/* Content Block */}
            <div className="w-1/2 h-full flex flex-col justify-center px-16 md:px-24" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <div className="w-8 h-8 mb-12" style={{ background: accentColor }} />

                <EditableTitle
                    slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-6xl md:text-8xl lg:text-9xl uppercase mb-12 tracking-tighter"
                    style={{ fontWeight: 400, lineHeight: '0.9' }}
                />

                <div className="w-full h-px mb-8" style={{ background: textColor, opacity: 0.2 }} />

                <EditableContent slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm uppercase tracking-widest opacity-60" bullet={false} />
            </div>
        </div>
    );
};

// 8. HERBARIUM - Pressed Botanical Specimens
export const HerbariumArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const specimenNumber = rng.range(1000, 9999).toFixed(0);
    const dateStr = `${rng.range(1, 28).toFixed(0)}.${rng.range(1, 12).toFixed(0)}.${rng.range(1920, 2024).toFixed(0)}`;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#f5f0e6' }}>
            {/* Paper Fiber Texture */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.3'/%3E%3C/svg%3E")`
            }} />

            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="w-full h-full p-12 md:p-16 flex gap-12">
                {/* Specimen Card */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full bg-white p-4 shadow-md border border-gray-200 relative">
                        {/* Tape Corners */}
                        <div className="absolute -top-2 left-8 w-16 h-6 bg-amber-100/80 opacity-70" style={{ transform: 'rotate(-2deg)' }} />
                        <div className="absolute -top-2 right-8 w-16 h-6 bg-amber-100/80 opacity-70" style={{ transform: 'rotate(3deg)' }} />

                        <div className="w-full h-full border border-gray-300 overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} className="sepia-[20%]" />
                        </div>

                        {/* Specimen Label */}
                        <div className="absolute bottom-8 left-8 right-8 bg-white/90 border border-gray-300 p-3">
                            <div className="text-[10px] font-mono text-gray-500">Specimen No. {specimenNumber}</div>
                            <div className="text-xs font-mono mt-1" style={{ fontFamily: '"Caveat", cursive' }}>{slide.title}</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[9px] uppercase tracking-widest font-mono" style={{ color: '#6b7c5c' }}>Herbarium Collection</span>
                        <div className="flex-1 h-px" style={{ background: '#c9c4bc' }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl mb-6"
                        style={{ fontWeight: 400, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm font-mono" />

                    <div className="mt-8 flex items-center gap-4 text-xs font-mono" style={{ color: '#8a8a8a' }}>
                        <span>Date: {dateStr}</span>
                        <span>•</span>
                        <span>Loc: Field Collection</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 9. COASTAL - Weathered Maritime
export const CoastalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const seaGlass = '#87a5a5';
    const driftwood = '#b8a99a';
    const saltWhite = '#faf8f5';
    const isDark = rng.next() > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: isDark
                ? 'linear-gradient(180deg, #1e3a4c 0%, #2d4a5e 100%)'
                : `linear-gradient(180deg, ${saltWhite} 0%, #f0ebe3 100%)`
        }}>
            {/* Weathered Wood Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(139,119,101,0.3) 40px, rgba(139,119,101,0.3) 42px)`
            }} />

            {/* Wave Pattern */}
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0 10 Q 25 0, 50 10 T 100 10 V 20 H 0 Z" fill={seaGlass} />
                </svg>
            </div>

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-1" style={{ background: seaGlass }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: isDark ? driftwood : '#7a7a7a' }}>Coastal</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: isDark ? saltWhite : '#2d3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8 tracking-wide"
                        style={{ fontWeight: 300, lineHeight: '1.15', letterSpacing: '0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: isDark ? '#a8b5b5' : '#5a6a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ letterSpacing: '0.01em' }} />
                </div>

                {/* Image with Vignette */}
                <div className="w-1/2 aspect-[4/5] relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full overflow-hidden rounded-lg shadow-xl" style={{ border: `4px solid ${driftwood}40` }}>
                        <ImageContainer slide={slide} theme={theme} />
                        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.15)' }} />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full opacity-40" style={{ background: driftwood }} />
                </div>
            </div>
        </div>
    );
};

// 10. ATELIER - Artist's Studio
export const AtelierArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ochre = '#cc9933';
    const burntSienna = '#a0522d';
    const rawUmber = '#734222';
    const canvas = '#f8f6f1';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: canvas }}>
            {/* Canvas/Linen Texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23d4c5b9' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
            }} />

            {/* Paint Swatches */}
            <div className="absolute top-12 right-12 flex gap-2" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="w-6 h-12 rounded-sm shadow-sm" style={{ background: ochre }} />
                <div className="w-6 h-10 rounded-sm shadow-sm" style={{ background: burntSienna }} />
                <div className="w-6 h-14 rounded-sm shadow-sm" style={{ background: rawUmber }} />
            </div>

            {/* Paint Drip */}
            <div className="absolute top-0 left-1/4 w-3 h-24 opacity-20" style={{
                zIndex: LayoutLayer.DECORATION,
                background: `linear-gradient(180deg, ${ochre} 0%, transparent 100%)`,
                borderRadius: '0 0 50% 50%'
            }} />

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                {/* Image on "Easel" */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-4 border-amber-900/20 -rotate-1" />

                    <div className="w-full aspect-[3/4] relative shadow-xl bg-white p-2 rotate-1">
                        <div className="absolute -top-3 left-8 w-20 h-6 bg-amber-100 opacity-80" style={{ transform: 'rotate(-3deg)' }} />
                        <div className="absolute -top-3 right-8 w-16 h-6 bg-amber-100 opacity-80" style={{ transform: 'rotate(2deg)' }} />

                        <ImageContainer slide={slide} theme={theme} />
                    </div>

                    <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: canvas, border: `2px solid ${burntSienna}` }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: ochre }} />
                    </div>
                </div>

                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-2 rounded-full" style={{ background: burntSienna }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: rawUmber, fontFamily: '"Caveat", cursive' }}>Studio Notes</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.2' }}
                    />

                    <div className="w-48 h-1 mb-8 opacity-60" style={{
                        background: ochre,
                        borderRadius: '50%',
                        transform: 'rotate(-1deg)'
                    }} />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ fontSize: '20px' }} />
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// CORPORATE PITCH DECK ARCHETYPES
// Professional presentation layouts inspired by top pitch decks
// ============================================================================

// 1. VENTURE - VC Pitch Minimalism (Sequoia/YC inspired)
export const VentureArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng.pick(['#1e40af', '#059669', '#7c3aed']);
    const isImageLeft = rng.next() > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
            {/* Subtle accent dot */}
            <div className="absolute top-12 right-12 w-3 h-3 rounded-full" style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }} />

            <div className={`w-full h-full p-16 md:p-24 flex ${isImageLeft ? 'flex-row' : 'flex-row-reverse'} gap-20 items-center`}>
                {/* Image - Clean presentation */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content - Extreme minimalism */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-12 h-1 mb-8" style={{ background: accentColor }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#111827' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl lg:text-8xl mb-10"
                        style={{ fontWeight: 700, lineHeight: '1.0', letterSpacing: '-0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-xl" style={{ lineHeight: '1.6' }} />
                </div>
            </div>
        </div>
    );
};

// 2. KEYNOTE - Apple-Style Product Reveal
export const KeynoteArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center" style={{ background: '#000000' }}>
            {/* Spotlight gradient */}
            <div className="absolute inset-0 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)'
            }} />

            {/* Content - Centered hero */}
            <div className="w-full max-w-5xl px-12 flex flex-col items-center text-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <EditableTitle
                    slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-5xl md:text-7xl lg:text-8xl mb-8"
                    style={{ fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' }}
                />

                <EditableContent slide={slide} theme={theme} contrast={{ text: '#a1a1aa' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl md:text-2xl max-w-2xl mb-16" style={{ lineHeight: '1.5' }} bullet={false} />
            </div>

            {/* Image - Hero product */}
            <div className="w-full max-w-3xl px-12 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                <div className="w-full aspect-[16/9] overflow-hidden rounded-xl" style={{
                    boxShadow: '0 0 80px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)'
                }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>
            </div>

            {/* Floating accent */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full opacity-40" style={{ background: 'linear-gradient(90deg, transparent, #ffffff, transparent)' }} />
        </div>
    );
};

// 3. GRADIENT - Modern SaaS Aesthetic
export const GradientArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gradients = [
        'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
        'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
        'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
    ];
    const gradient = rng.pick(gradients);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: gradient }}>
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`
            }} />

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.85)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Image - Glassmorphism card */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square overflow-hidden rounded-3xl" style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '16px'
                    }}>
                        <div className="w-full h-full rounded-2xl overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. SIGNAL - Enterprise Fintech
export const SignalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const emerald = '#10b981';
    const amber = '#f59e0b';
    const isGrowth = rng.next() > 0.5;
    const accentColor = isGrowth ? emerald : amber;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#0f172a' }}>
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            {/* Top border accent */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-16 flex gap-12">
                {/* Left - Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#64748b' }}>Signal</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#f8fafc' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <div className="border-l-2 pl-6" style={{ borderColor: accentColor }}>
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#94a3b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />
                    </div>
                </div>

                {/* Right - Image with data overlay */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/3] relative overflow-hidden rounded-lg" style={{ border: '1px solid #1e293b' }}>
                        <ImageContainer slide={slide} theme={theme} className="saturate-75" />
                        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(transparent, rgba(15,23,42,0.9))' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-2 rounded-full" style={{ background: accentColor }} />
                                <span className="text-xs" style={{ color: '#64748b' }}>Live Data</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5. METRIC - Numbers-First Hero
export const MetricArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const metricValue = rng.pick(['$2.4M', '147%', '10K+', '99.9%', '3.2x']);
    const metricLabel = rng.pick(['Revenue', 'Growth', 'Users', 'Uptime', 'ROI']);
    const accentColor = '#22c55e';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fafafa' }}>
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
            }} />

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                {/* Hero metric */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <span className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: '#6b7280' }}>{metricLabel}</span>
                    <div className="text-8xl md:text-9xl lg:text-[160px] mb-8" style={{ color: '#111827', fontWeight: 800, lineHeight: '0.9', letterSpacing: '-0.03em' }}>
                        {metricValue}
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-3 h-3 rounded-full" style={{ background: accentColor }} />
                        <span className="text-sm" style={{ color: accentColor }}>+24% this quarter</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-2xl md:text-3xl mb-4"
                        style={{ fontWeight: 500, lineHeight: '1.3' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base max-w-md" style={{ lineHeight: '1.6' }} />
                </div>

                {/* Image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square overflow-hidden rounded-2xl shadow-xl">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. NARRATIVE - Magazine Editorial
export const NarrativeArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isImageLeft = rng.next() > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fdfbf8' }}>
            <div className={`w-full h-full flex ${isImageLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Image - Full bleed */}
                <div className="w-1/2 h-full relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>

                {/* Content - Editorial layout */}
                <div className="w-1/2 h-full p-12 md:p-16 lg:p-20 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-full h-px mb-8" style={{ background: '#e5e1d8' }} />

                    <span className="text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: '#9ca3af' }}>Feature Story</span>

                    <div className="flex">
                        <div className="w-1 mr-6" style={{ background: '#d4d0c8' }} />
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-4xl md:text-5xl lg:text-6xl mb-8"
                            style={{ fontWeight: 400, lineHeight: '1.15' }}
                        />
                    </div>

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base max-w-sm" style={{ lineHeight: '1.8' }} />

                    <div className="w-full h-px mt-12" style={{ background: '#e5e1d8' }} />
                </div>
            </div>
        </div>
    );
};

// 7. BEACON - Bold Statement Slides
export const BeaconArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const schemes = [
        { bg: '#2563eb', text: '#ffffff' },
        { bg: '#000000', text: '#ffffff' },
        { bg: '#ffffff', text: '#000000' },
        { bg: '#7c3aed', text: '#ffffff' },
        { bg: '#dc2626', text: '#ffffff' }
    ];
    const scheme = rng.pick(schemes);

    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center" style={{ background: scheme.bg }}>
            {/* Single geometric accent */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full opacity-40" style={{ background: scheme.text, zIndex: LayoutLayer.DECORATION }} />

            {/* Content - Centered statement */}
            <div className="w-full max-w-5xl px-12 md:px-20 text-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <EditableTitle
                    slide={slide} theme={theme} contrast={{ text: scheme.text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-5xl md:text-7xl lg:text-8xl"
                    style={{ fontWeight: 700, lineHeight: '1.1' }}
                />

                <div className="mt-12 opacity-60">
                    <EditableContent slide={slide} theme={theme} contrast={{ text: scheme.text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl" style={{ lineHeight: '1.5' }} bullet={false} />
                </div>
            </div>
        </div>
    );
};

// 8. SLIDE - Classic Pitch Deck (Airbnb/LinkedIn style)
export const SlideArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng.pick(['#2563eb', '#dc2626', '#059669', '#7c3aed']);
    const isImageRight = rng.next() > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
            <div className={`w-full h-full p-12 md:p-16 flex ${isImageRight ? 'flex-row' : 'flex-row-reverse'} gap-12 items-center`}>
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.15' }}
                    />

                    <div className="space-y-3">
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <div className="px-4 py-2 rounded-full text-sm" style={{ background: `${accentColor}15`, color: accentColor }}>
                            Key Insight
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 9. CANVAS - Creative Agency
export const CanvasArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng.pick(['#f97316', '#ec4899', '#8b5cf6', '#06b6d4']);
    const rotation = rng.range(-2, 2);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#f5f5f4' }}>
            {/* Background accent shape */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20" style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-16 flex gap-12 items-center">
                {/* Image - Artistic presentation */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-2xl" style={{ background: accentColor, opacity: 0.1, transform: `rotate(${rotation}deg)` }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-2xl" style={{ transform: `rotate(${rotation}deg)` }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-xl" style={{ background: accentColor, opacity: 0.8, zIndex: LayoutLayer.DECORATION }} />
                </div>

                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-8 h-2 mb-8 rounded-full" style={{ background: accentColor }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />

                    <div className="mt-8 flex gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: accentColor }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: accentColor, opacity: 0.25 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 10. DECK - Boardroom Classic (McKinsey/BCG style)
export const DeckArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const navy = '#1e3a5f';
    const slideNumber = rng.range(1, 24).toFixed(0);

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col" style={{ background: '#ffffff' }}>
            {/* Header bar */}
            <div className="w-full px-12 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e5e7eb', zIndex: LayoutLayer.OVERLAY }}>
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: '#9ca3af' }}>Confidential</span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>Page {slideNumber}</span>
            </div>

            {/* Main content */}
            <div className="flex-1 p-12 md:p-16 flex gap-12">
                {/* Left - Content */}
                <div className="w-1/2 flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: navy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-3xl md:text-4xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.25' }}
                    />

                    <div className="flex-1">
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />
                    </div>

                    <div className="mt-auto pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
                        <span className="text-xs uppercase tracking-[0.1em]" style={{ color: '#9ca3af' }}>Source: Internal Analysis</span>
                    </div>
                </div>

                {/* Right - Image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full overflow-hidden rounded-lg" style={{ border: '1px solid #e5e7eb' }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>

            {/* Footer bar */}
            <div className="w-full h-1" style={{ background: navy }} />
        </div>
    );
};
