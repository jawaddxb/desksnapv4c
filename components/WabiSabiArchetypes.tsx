
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

// ============================================================================
// BATCH 1: MODERN TECH AESTHETICS
// ============================================================================

// 1. BENTO - Apple-Style Modular Grid
export const BentoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const imagePosition = rng.pick(['top-left', 'top-right', 'bottom-left', 'bottom-right']);

    return (
        <div className="w-full h-full relative overflow-hidden p-6 md:p-10" style={{ background: '#fafafa' }}>
            {/* Bento grid container */}
            <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                {/* Large image module */}
                <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-span-2' : 'col-span-2 col-start-2'} ${imagePosition.includes('top') ? 'row-start-1' : 'row-start-2'} relative overflow-hidden rounded-2xl shadow-sm`} style={{ zIndex: LayoutLayer.MEDIA, background: '#f0f0f0' }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>

                {/* Title module */}
                <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-start-3' : 'col-start-1'} ${imagePosition.includes('top') ? 'row-start-1' : 'row-start-2'} p-6 flex flex-col justify-center rounded-2xl`} style={{ background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', zIndex: LayoutLayer.CONTENT_HERO }}>
                    <span className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: '#9ca3af' }}>Overview</span>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1d1d1f' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-xl md:text-2xl lg:text-3xl"
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                    />
                </div>

                {/* Content modules */}
                <div className={`${imagePosition === 'top-left' ? 'col-span-2 col-start-1' : imagePosition === 'top-right' ? 'col-span-2 col-start-2' : imagePosition === 'bottom-left' ? 'col-span-2 col-start-1' : 'col-span-2 col-start-2'} ${imagePosition.includes('top') ? 'row-start-2' : 'row-start-1'} p-6 flex items-center rounded-2xl`} style={{ background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', zIndex: LayoutLayer.CONTENT_BASE }}>
                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6e6e73' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm md:text-base" style={{ lineHeight: '1.65' }} />
                </div>

                {/* Accent module */}
                <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-start-3' : 'col-start-1'} ${imagePosition.includes('top') ? 'row-start-2' : 'row-start-1'} rounded-2xl flex items-center justify-center`} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', zIndex: LayoutLayer.DECORATION }}>
                    <div className="text-white text-4xl md:text-5xl font-bold opacity-90">{rng.range(1, 9).toFixed(0)}</div>
                </div>
            </div>
        </div>
    );
};

// 2. GLASS - Glassmorphism Frosted Panels
export const GlassArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gradientAngle = rng.range(120, 200);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(${gradientAngle}deg, #667eea 0%, #764ba2 50%, #f093fb 100%)` }}>
            {/* Floating orbs for depth */}
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: '#ffffff', zIndex: LayoutLayer.BACKGROUND }} />
            <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#ffecd2', zIndex: LayoutLayer.BACKGROUND }} />

            <div className="w-full h-full p-8 md:p-16 flex items-center gap-8">
                {/* Glass panel - Image */}
                <div className="w-1/2 h-4/5 relative rounded-3xl overflow-hidden" style={{ zIndex: LayoutLayer.MEDIA, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}>
                    <div className="absolute inset-3 rounded-2xl overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Glass panel - Content */}
                <div className="w-1/2 h-4/5 p-8 md:p-12 rounded-3xl flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}>
                    <div className="w-12 h-1 mb-8 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.85)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};

// 3. LIQUID - Apple Liquid Glass 2025
export const LiquidArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const hueShift = rng.range(0, 60);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, hsl(${220 + hueShift}, 30%, 95%) 0%, hsl(${260 + hueShift}, 40%, 92%) 100%)` }}>
            {/* Liquid reflections */}
            <div className="absolute inset-0 opacity-50" style={{
                background: `radial-gradient(ellipse at 30% 20%, hsla(${280 + hueShift}, 60%, 85%, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(${200 + hueShift}, 70%, 80%, 0.4) 0%, transparent 40%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex flex-col items-center justify-center text-center">
                {/* Liquid glass container */}
                <div className="relative w-full max-w-4xl p-12 md:p-16 rounded-[40px]" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: `0 20px 80px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)`
                }}>
                    {/* Rainbow edge highlight */}
                    <div className="absolute inset-0 rounded-[40px] opacity-30 pointer-events-none" style={{
                        background: `linear-gradient(135deg, hsla(${0 + hueShift}, 80%, 70%, 0.3), hsla(${60 + hueShift}, 80%, 70%, 0.2), hsla(${120 + hueShift}, 80%, 70%, 0.3), hsla(${180 + hueShift}, 80%, 70%, 0.2), hsla(${240 + hueShift}, 80%, 70%, 0.3))`,
                        zIndex: LayoutLayer.DECORATION
                    }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1d1d1f' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6e6e73' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-2xl mx-auto" style={{ lineHeight: '1.6' }} bullet={false} />
                </div>

                {/* Floating image */}
                <div className="absolute bottom-8 right-8 w-48 h-48 rounded-3xl overflow-hidden shadow-2xl" style={{
                    zIndex: LayoutLayer.MEDIA,
                    border: '2px solid rgba(255,255,255,0.5)'
                }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>
            </div>
        </div>
    );
};

// 4. TERMINAL - Developer CLI Aesthetic
export const TerminalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const promptColor = rng.pick(['#22c55e', '#06b6d4', '#f59e0b', '#a855f7']);
    const timestamp = `${rng.range(0, 23).toFixed(0).padStart(2, '0')}:${rng.range(0, 59).toFixed(0).padStart(2, '0')}`;

    return (
        <div className="w-full h-full relative overflow-hidden p-4 md:p-8" style={{ background: '#0d1117' }}>
            {/* Terminal window */}
            <div className="w-full h-full rounded-xl overflow-hidden flex flex-col" style={{ background: '#161b22', border: '1px solid #30363d', zIndex: LayoutLayer.CONTENT_BASE }}>
                {/* Title bar */}
                <div className="h-10 px-4 flex items-center gap-2 border-b" style={{ background: '#0d1117', borderColor: '#30363d' }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                    <span className="ml-4 text-xs" style={{ color: '#8b949e' }}>slide.{rng.range(1, 99).toFixed(0)}.tsx — Terminal</span>
                </div>

                {/* Terminal content */}
                <div className="flex-1 p-6 md:p-10 flex flex-col md:flex-row gap-8 overflow-hidden">
                    {/* Code/Content area */}
                    <div className="flex-1 flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                        <div className="flex items-center gap-2 mb-6">
                            <span style={{ color: promptColor }}>→</span>
                            <span className="text-xs uppercase tracking-wider" style={{ color: '#8b949e' }}>{timestamp} • output</span>
                        </div>

                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#e6edf3' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-4xl md:text-5xl lg:text-6xl mb-6"
                            style={{ fontWeight: 600, lineHeight: '1.15' }}
                        />

                        <div className="border-l-2 pl-4" style={{ borderColor: promptColor }}>
                            <EditableContent slide={slide} theme={theme} contrast={{ text: '#8b949e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm md:text-base" style={{ lineHeight: '1.8' }} />
                        </div>

                        {/* Command line */}
                        <div className="mt-auto pt-6 flex items-center gap-2">
                            <span style={{ color: promptColor }}>$</span>
                            <span className="text-sm" style={{ color: '#8b949e' }}>_</span>
                            <div className="w-2 h-4 animate-pulse" style={{ background: promptColor }} />
                        </div>
                    </div>

                    {/* Image preview */}
                    <div className="w-full md:w-2/5 aspect-video md:aspect-auto rounded-lg overflow-hidden border" style={{ borderColor: '#30363d', zIndex: LayoutLayer.MEDIA }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5. NEON - Cyberpunk Glow
export const NeonArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const neonColors = [
        { primary: '#ff00ff', secondary: '#00ffff' },
        { primary: '#00ffff', secondary: '#ff00ff' },
        { primary: '#ff0080', secondary: '#80ff00' },
        { primary: '#00ff80', secondary: '#8000ff' }
    ];
    const colors = rng.pick(neonColors);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#000000' }}>
            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                zIndex: LayoutLayer.OVERLAY
            }} />

            {/* Neon glow backdrop */}
            <div className="absolute inset-0 opacity-20" style={{
                background: `radial-gradient(ellipse at 20% 80%, ${colors.primary}40 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${colors.secondary}40 0%, transparent 50%)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-8 md:p-16 flex items-center">
                {/* Content */}
                <div className="w-full md:w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="mb-8">
                        <span className="px-4 py-1 text-xs uppercase tracking-[0.3em] border" style={{
                            color: colors.primary,
                            borderColor: colors.primary,
                            boxShadow: `0 0 10px ${colors.primary}60, inset 0 0 10px ${colors.primary}30`
                        }}>System Online</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl lg:text-8xl mb-6"
                        style={{
                            fontWeight: 900,
                            lineHeight: '0.95',
                            textShadow: `0 0 20px ${colors.primary}80, 0 0 40px ${colors.primary}40, 0 0 60px ${colors.primary}20`
                        }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: colors.secondary }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg max-w-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Neon-framed image */}
                <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-2/5 aspect-[4/5] hidden md:block" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute inset-0 rounded-lg" style={{
                        boxShadow: `0 0 30px ${colors.primary}60, 0 0 60px ${colors.primary}30, inset 0 0 30px ${colors.secondary}20`,
                        border: `2px solid ${colors.primary}`
                    }} />
                    <div className="absolute inset-2 rounded-md overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. AURORA - Northern Lights Gradient
export const AuroraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const waveOffset = rng.range(0, 100);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#0a0a1a' }}>
            {/* Aurora waves */}
            <div className="absolute inset-0" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute w-full h-1/2 top-0 opacity-40" style={{
                    background: `linear-gradient(180deg, transparent 0%, #22c55e30 30%, #06b6d440 50%, #8b5cf650 70%, #ec489940 90%, transparent 100%)`,
                    transform: `translateX(${waveOffset - 50}%)`,
                    filter: 'blur(60px)'
                }} />
                <div className="absolute w-full h-1/2 top-1/4 opacity-30" style={{
                    background: `linear-gradient(180deg, transparent 0%, #06b6d430 40%, #8b5cf640 60%, transparent 100%)`,
                    transform: `translateX(${50 - waveOffset}%)`,
                    filter: 'blur(80px)'
                }} />
            </div>

            {/* Stars */}
            <div className="absolute inset-0 opacity-60" style={{
                background: 'radial-gradient(1px 1px at 20% 30%, #ffffff 100%, transparent), radial-gradient(1px 1px at 80% 20%, #ffffff 100%, transparent), radial-gradient(1px 1px at 40% 70%, #ffffff 100%, transparent), radial-gradient(1px 1px at 60% 50%, #ffffff 100%, transparent), radial-gradient(1px 1px at 10% 60%, #ffffff 100%, transparent), radial-gradient(1px 1px at 90% 80%, #ffffff 100%, transparent)',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-10 md:p-20 flex flex-col justify-center items-center text-center">
                <div className="max-w-4xl" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl lg:text-8xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.7)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-2xl mx-auto" style={{ lineHeight: '1.7' }} bullet={false} />
                </div>

                {/* Floating image */}
                <div className="absolute bottom-12 left-12 w-56 h-40 rounded-2xl overflow-hidden opacity-80" style={{
                    zIndex: LayoutLayer.MEDIA,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>
            </div>
        </div>
    );
};

// 7. MESH - Organic Gradient Mesh
export const MeshArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const meshColors = [
        ['#ffecd2', '#fcb69f', '#ee9ca7', '#ffdde1'],
        ['#a8edea', '#fed6e3', '#c3cfe2', '#d299c2'],
        ['#f5f7fa', '#c3cfe2', '#e0c3fc', '#8ec5fc'],
        ['#fbc2eb', '#a6c1ee', '#f5f7fa', '#ffecd2']
    ];
    const colors = rng.pick(meshColors);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
            {/* Mesh gradient background */}
            <div className="absolute inset-0" style={{
                background: `
                    radial-gradient(ellipse at 0% 0%, ${colors[0]} 0%, transparent 50%),
                    radial-gradient(ellipse at 100% 0%, ${colors[1]} 0%, transparent 50%),
                    radial-gradient(ellipse at 100% 100%, ${colors[2]} 0%, transparent 50%),
                    radial-gradient(ellipse at 0% 100%, ${colors[3]} 0%, transparent 50%)
                `,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-10 md:p-16 flex items-center gap-12">
                {/* Content card */}
                <div className="w-1/2 p-10 rounded-3xl" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
                }}>
                    <div className="w-16 h-2 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1a1a2e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a68' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-[40px] overflow-hidden shadow-2xl">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 8. PULSE - Data Heartbeat Visualization
export const PulseArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng.pick(['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']);
    const pulseValue = rng.range(60, 180).toFixed(0);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#0f172a' }}>
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(${accentColor}40 1px, transparent 1px), linear-gradient(90deg, ${accentColor}40 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Pulse line decoration */}
            <div className="absolute left-0 right-0 top-1/3 h-px opacity-40" style={{
                background: `linear-gradient(90deg, transparent 0%, ${accentColor} 20%, ${accentColor} 40%, transparent 50%, ${accentColor} 60%, ${accentColor} 80%, transparent 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
                {/* Data display */}
                <div className="w-full md:w-1/2 flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Metric */}
                    <div className="mb-8">
                        <span className="text-8xl md:text-9xl font-bold" style={{ color: accentColor }}>{pulseValue}</span>
                        <span className="text-2xl ml-2" style={{ color: '#64748b' }}>bpm</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#f1f5f9' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-3xl md:text-4xl lg:text-5xl mb-6"
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#94a3b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />

                    {/* Status bar */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                        <span className="text-xs uppercase tracking-wider" style={{ color: accentColor }}>Live Data</span>
                    </div>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-video rounded-xl overflow-hidden" style={{ border: `1px solid ${accentColor}40` }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    <div className="absolute -inset-2 rounded-xl opacity-20 blur-xl" style={{ background: accentColor }} />
                </div>
            </div>
        </div>
    );
};

// 9. CIRCUIT - PCB Tech Patterns
export const CircuitArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const boardColor = rng.pick(['#0a3d0a', '#0a2540', '#1a1a2e']);
    const traceColor = boardColor === '#0a3d0a' ? '#c9a227' : boardColor === '#0a2540' ? '#60a5fa' : '#a855f7';

    return (
        <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: boardColor }}>
            {/* Circuit traces SVG pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 10 50 L 40 50 L 50 40 L 60 40" fill="none" stroke={traceColor} strokeWidth="2" />
                        <path d="M 50 10 L 50 30 L 60 40" fill="none" stroke={traceColor} strokeWidth="2" />
                        <path d="M 60 40 L 90 40" fill="none" stroke={traceColor} strokeWidth="2" />
                        <circle cx="10" cy="50" r="4" fill={traceColor} />
                        <circle cx="90" cy="40" r="4" fill={traceColor} />
                        <circle cx="50" cy="10" r="4" fill={traceColor} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>

            <div className="w-full h-full flex items-center gap-10">
                {/* Chip-style image container */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square p-4 rounded-lg" style={{ background: '#1a1a1a', border: `2px solid ${traceColor}` }}>
                        {/* Chip pins */}
                        <div className="absolute -left-3 top-1/4 flex flex-col gap-2">
                            {[...Array(4)].map((_, i) => <div key={i} className="w-3 h-1" style={{ background: traceColor }} />)}
                        </div>
                        <div className="absolute -right-3 top-1/4 flex flex-col gap-2">
                            {[...Array(4)].map((_, i) => <div key={i} className="w-3 h-1" style={{ background: traceColor }} />)}
                        </div>
                        <div className="w-full h-full rounded overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>
                    <div className="absolute -bottom-2 left-4 text-[10px] uppercase tracking-wider" style={{ color: traceColor }}>
                        IC-{rng.range(1000, 9999).toFixed(0)}
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rounded-full" style={{ background: traceColor, boxShadow: `0 0 10px ${traceColor}` }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: traceColor }}>Active Module</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.7)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};

// 10. HOLOGRAM - Iridescent Shimmer
export const HologramArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const shimmerAngle = rng.range(30, 60);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fafafa' }}>
            {/* Holographic shimmer overlay */}
            <div className="absolute inset-0 opacity-30" style={{
                background: `linear-gradient(${shimmerAngle}deg, #ff000020 0%, #ff800020 14%, #ffff0020 28%, #00ff0020 42%, #00ffff20 57%, #0000ff20 71%, #ff00ff20 85%, #ff000020 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-10 md:p-16 flex items-center gap-10">
                {/* Content with holographic border */}
                <div className="w-1/2 relative p-10 rounded-2xl" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}>
                    {/* Rainbow border */}
                    <div className="absolute inset-0 rounded-2xl p-[2px] -z-10" style={{
                        background: `linear-gradient(${shimmerAngle}deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)`,
                    }}>
                        <div className="w-full h-full rounded-2xl" style={{ background: '#ffffff' }} />
                    </div>

                    <div className="w-12 h-1 rounded-full mb-8" style={{
                        background: `linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #8a2be2)`
                    }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1a1a2e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a68' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Holographic image frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute inset-0 rounded-2xl" style={{
                        background: `linear-gradient(${shimmerAngle + 90}deg, #ff008040, #ff8c0040, #40e0d040, #8a2be240)`,
                        transform: 'scale(1.02)'
                    }} />
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden" style={{
                        border: '3px solid transparent',
                        backgroundClip: 'padding-box',
                        boxShadow: `0 0 30px rgba(255,0,128,0.2), 0 0 60px rgba(64,224,208,0.1)`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>

                    {/* Prismatic reflection */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full opacity-40 blur-xl" style={{
                        background: `linear-gradient(90deg, #ff0080, #40e0d0, #8a2be2)`
                    }} />
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// BATCH 2: DESIGN MOVEMENTS
// ============================================================================

// 11. MEMPHIS - 80s Bold Geometric
export const MemphisArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bgColors = ['#ffb3d9', '#b3ffb3', '#b3d9ff', '#ffffb3'];
    const bgColor = rng.pick(bgColors);
    const shapeRotation = rng.range(-20, 20);

    return (
        <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: bgColor }}>
            {/* Memphis shapes */}
            <div className="absolute top-10 right-10 w-32 h-32 border-4 border-black" style={{ transform: `rotate(${shapeRotation}deg)`, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full border-4 border-black" style={{ background: '#ff6b6b', zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute top-1/3 left-10 w-0 h-0" style={{
                borderLeft: '30px solid transparent',
                borderRight: '30px solid transparent',
                borderBottom: '52px solid #3b82f6',
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Squiggle line */}
            <svg className="absolute bottom-10 right-1/4 w-48 h-12 opacity-80" viewBox="0 0 100 20" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" stroke="#000" strokeWidth="3" fill="none" />
            </svg>

            {/* Dots pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                backgroundSize: '20px 20px',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full flex flex-col md:flex-row items-center gap-8">
                {/* Image with geometric frame */}
                <div className="w-full md:w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-4 border-black" style={{ transform: 'rotate(3deg)' }} />
                    <div className="w-full aspect-[4/5] border-4 border-black overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-6"
                        style={{ fontWeight: 900, lineHeight: '1.0' }}
                    />

                    <div className="border-l-4 border-black pl-6">
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.6' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 12. DECO - Art Deco Golden Elegance
export const DecoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gold = '#d4af37';
    const navy = '#0a0a14';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: navy }}>
            {/* Sunburst rays */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-1 h-full origin-center" style={{
                        background: gold,
                        transform: `rotate(${i * 30}deg)`
                    }} />
                ))}
            </div>

            {/* Gold border frame */}
            <div className="absolute inset-6 border-2" style={{ borderColor: gold, zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-2" style={{ background: gold }} />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 h-2" style={{ background: gold }} />
            </div>

            {/* Corner ornaments */}
            <div className="absolute top-10 left-10 w-16 h-16" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: gold }} />
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: gold }} />
                <div className="absolute top-4 left-4 w-8 h-8 border-2" style={{ borderColor: gold }} />
            </div>
            <div className="absolute top-10 right-10 w-16 h-16" style={{ zIndex: LayoutLayer.DECORATION, transform: 'scaleX(-1)' }}>
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: gold }} />
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: gold }} />
                <div className="absolute top-4 left-4 w-8 h-8 border-2" style={{ borderColor: gold }} />
            </div>

            <div className="w-full h-full p-16 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-8" style={{ background: gold }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: gold }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.1', letterSpacing: '0.05em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#9ca3af' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Image with deco frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3 border" style={{ borderColor: gold }} />
                    <div className="w-full aspect-[3/4] overflow-hidden" style={{ border: `3px solid ${gold}` }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Chevron ornament */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2" style={{ zIndex: LayoutLayer.OVERLAY }}>
                        <div className="w-0 h-0" style={{
                            borderLeft: '20px solid transparent',
                            borderRight: '20px solid transparent',
                            borderTop: `20px solid ${gold}`
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 13. RETRO - Retrofuturism 50s-60s
export const RetroArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const retro = {
        cream: '#faf8f0',
        turquoise: '#40e0d0',
        coral: '#ff7f50',
        mustard: '#e4a010'
    };
    const accentColor = rng.pick([retro.turquoise, retro.coral, retro.mustard]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: retro.cream }}>
            {/* Atomic starburst */}
            <div className="absolute top-20 right-20 w-40 h-40" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute top-1/2 left-1/2 w-1 h-20 origin-bottom -translate-x-1/2" style={{
                        background: accentColor,
                        transform: `rotate(${i * 45}deg) translateY(-50%)`
                    }} />
                ))}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ background: accentColor }} />
            </div>

            {/* Boomerang shape */}
            <svg className="absolute bottom-20 left-20 w-32 h-32 opacity-60" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10,50 Q30,30 50,30 T90,50" stroke={retro.coral} strokeWidth="8" fill="none" strokeLinecap="round" />
            </svg>

            <div className="w-full h-full p-12 md:p-16 flex items-center gap-12">
                {/* Rounded TV-style image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/3] rounded-[30%] overflow-hidden border-8" style={{ borderColor: '#3d3d3d', background: '#2d2d2d' }}>
                        <div className="w-full h-full rounded-[28%] overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>
                    {/* TV stand */}
                    <div className="absolute -bottom-4 left-1/4 right-1/4 h-2 rounded-b-lg" style={{ background: '#3d3d3d' }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-6">
                        <div className="w-4 h-4 rounded-full" style={{ background: retro.turquoise }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: retro.coral }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: retro.mustard }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};

// 14. NEUE - Neubrutalism Bold Borders
export const NeueArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bgColors = ['#fef08a', '#fecaca', '#bbf7d0', '#bfdbfe'];
    const bgColor = rng.pick(bgColors);
    const shadowOffset = 8;

    return (
        <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: bgColor }}>
            <div className="w-full h-full flex flex-col md:flex-row items-center gap-8">
                {/* Image with brutal frame */}
                <div className="w-full md:w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-2xl border-4 border-black overflow-hidden" style={{
                        boxShadow: `${shadowOffset}px ${shadowOffset}px 0px #000000`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content card */}
                <div className="w-full md:w-3/5 p-8 rounded-2xl border-4 border-black" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: '#ffffff',
                    boxShadow: `${shadowOffset}px ${shadowOffset}px 0px #000000`
                }}>
                    <div className="inline-block px-4 py-1 rounded-full border-2 border-black mb-6 text-sm font-bold uppercase">
                        Featured
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 900, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.6' }} />

                    <div className="mt-8 flex gap-3">
                        <div className="px-6 py-3 rounded-xl border-3 border-black text-sm font-bold" style={{
                            background: bgColor,
                            boxShadow: '4px 4px 0px #000000'
                        }}>
                            Learn More
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 15. CLAY - Claymorphism Soft 3D
export const ClayArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const clayColors = [
        { bg: '#f0f4ff', card: '#e8edff' },
        { bg: '#fff0f4', card: '#ffe8ed' },
        { bg: '#f0fff4', card: '#e8ffe8' },
        { bg: '#fffff0', card: '#ffffe8' }
    ];
    const colors = rng.pick(clayColors);

    return (
        <div className="w-full h-full relative overflow-hidden p-10 md:p-16" style={{ background: colors.bg }}>
            {/* Soft background shapes */}
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-50" style={{
                background: colors.card,
                boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.05), inset -8px -8px 16px rgba(255,255,255,0.8)',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full flex items-center gap-12">
                {/* Clay card - Content */}
                <div className="w-1/2 p-10 rounded-[32px]" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: colors.card,
                    boxShadow: `
                        20px 20px 60px rgba(0,0,0,0.08),
                        -20px -20px 60px rgba(255,255,255,0.9),
                        inset 2px 2px 4px rgba(255,255,255,0.8),
                        inset -2px -2px 4px rgba(0,0,0,0.04)
                    `
                }}>
                    <div className="w-16 h-4 rounded-full mb-8" style={{
                        background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.3)'
                    }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Clay image container */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-[40px] overflow-hidden" style={{
                        boxShadow: `
                            20px 20px 60px rgba(0,0,0,0.1),
                            -20px -20px 60px rgba(255,255,255,0.9),
                            inset 4px 4px 8px rgba(255,255,255,0.6),
                            inset -4px -4px 8px rgba(0,0,0,0.05)
                        `
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 16. POP - Pop Art Comic Bold
export const PopArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const primaryColor = rng.pick(['#ef4444', '#3b82f6', '#fbbf24']);
    const secondaryColor = primaryColor === '#ef4444' ? '#fbbf24' : primaryColor === '#3b82f6' ? '#ef4444' : '#3b82f6';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
            {/* Ben-Day dots */}
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(${primaryColor} 2px, transparent 2px)`,
                backgroundSize: '12px 12px',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Explosion burst behind content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <polygon
                        points="100,10 115,75 180,75 125,110 145,175 100,140 55,175 75,110 20,75 85,75"
                        fill={secondaryColor}
                        stroke="#000"
                        strokeWidth="3"
                    />
                </svg>
            </div>

            <div className="w-full h-full p-10 md:p-16 flex items-center gap-10 relative">
                {/* Image with halftone */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square border-4 border-black overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} className="contrast-110 saturate-150" />
                    </div>
                    {/* Halftone overlay */}
                    <div className="absolute inset-0 mix-blend-multiply opacity-30" style={{
                        backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                        backgroundSize: '4px 4px'
                    }} />
                </div>

                {/* Speech bubble content */}
                <div className="w-3/5 relative p-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="absolute inset-0 bg-white border-4 border-black rounded-3xl" />
                    {/* Bubble tail */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                        <div className="w-0 h-0" style={{
                            borderTop: '20px solid transparent',
                            borderBottom: '20px solid transparent',
                            borderRight: '30px solid #000'
                        }} />
                        <div className="absolute left-1 w-0 h-0" style={{
                            borderTop: '16px solid transparent',
                            borderBottom: '16px solid transparent',
                            borderRight: '26px solid #fff',
                            top: '-16px'
                        }} />
                    </div>

                    <div className="relative">
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-5xl md:text-6xl lg:text-7xl mb-4"
                            style={{ fontWeight: 900, lineHeight: '0.95' }}
                        />

                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl" style={{ lineHeight: '1.5' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 17. MOD - Mid-Century Modern
export const ModArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mod = {
        cream: '#f5f0e6',
        mustard: '#d4a03c',
        teal: '#2d8c8c',
        olive: '#6b7c4c',
        orange: '#d96c3c'
    };
    const accentColor = rng.pick([mod.mustard, mod.teal, mod.olive, mod.orange]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: mod.cream }}>
            {/* Organic blob shape */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[60%] aspect-square opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path d="M45,65 Q65,30 115,45 T165,95 Q180,140 135,165 T55,155 Q25,130 35,95 T45,65" fill={accentColor} />
                </svg>
            </div>

            {/* Hairpin leg accent */}
            <div className="absolute bottom-0 left-20 w-1 h-40" style={{ background: '#2d2d2d', zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-0 left-24 w-1 h-32" style={{ background: '#2d2d2d', zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-3 mb-8">
                        <div className="w-8 h-8 rounded-full" style={{ background: mod.mustard }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: mod.teal }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: mod.orange }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Image in organic blob mask */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <defs>
                                <clipPath id="blob-clip">
                                    <path d="M45,55 Q75,20 125,35 T175,85 Q190,135 145,170 T60,165 Q20,135 30,90 T45,55" />
                                </clipPath>
                            </defs>
                            <foreignObject width="200" height="200" clipPath="url(#blob-clip)">
                                <div className="w-full h-full">
                                    <ImageContainer slide={slide} theme={theme} />
                                </div>
                            </foreignObject>
                            <path d="M45,55 Q75,20 125,35 T175,85 Q190,135 145,170 T60,165 Q20,135 30,90 T45,55" fill="none" stroke={accentColor} strokeWidth="3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 18. GOTHIC - Dark Romantic Elegance
export const GothicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gothic = {
        black: '#0a0a0a',
        burgundy: '#4a1c2a',
        gold: '#c9a227',
        purple: '#2a1a3a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${gothic.black} 0%, ${gothic.burgundy} 100%)` }}>
            {/* Vintage texture overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Ornate corner flourishes */}
            <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 opacity-50" style={{ borderColor: gothic.gold, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 opacity-50" style={{ borderColor: gothic.gold, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Ornate framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-2 opacity-40" style={{ borderColor: gothic.gold }} />
                    <div className="absolute -inset-2 border opacity-60" style={{ borderColor: gothic.gold }} />
                    <div className="w-full aspect-[3/4] overflow-hidden" style={{ border: `3px solid ${gothic.gold}` }}>
                        <ImageContainer slide={slide} theme={theme} className="sepia-[.2] contrast-110" />
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px" style={{ background: gothic.gold }} />
                        <div className="w-2 h-2 rotate-45" style={{ background: gothic.gold }} />
                        <div className="flex-1 h-px" style={{ background: gothic.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#f5f0e6' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15', letterSpacing: '0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#9ca3af' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex-1 h-px" style={{ background: gothic.gold }} />
                        <div className="w-2 h-2 rotate-45" style={{ background: gothic.gold }} />
                        <div className="flex-1 h-px" style={{ background: gothic.gold }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 19. ROCOCO - Ornate Decorative Flourish
export const RococoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const rococo = {
        blush: '#fdf2f4',
        powder: '#e8f4f8',
        gold: '#c9a227',
        cream: '#faf8f0'
    };
    const bgColor = rng.pick([rococo.blush, rococo.powder, rococo.cream]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: bgColor }}>
            {/* Scrollwork decoration */}
            <svg className="absolute top-0 left-0 w-64 h-64 opacity-20" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10,50 Q30,20 50,50 T90,50 M50,10 Q20,30 50,50 T50,90" stroke={rococo.gold} strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="5" fill={rococo.gold} />
            </svg>
            <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-20 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10,50 Q30,20 50,50 T90,50 M50,10 Q20,30 50,50 T50,90" stroke={rococo.gold} strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="5" fill={rococo.gold} />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Ornate header */}
                    <div className="flex items-center gap-2 mb-8">
                        <svg className="w-8 h-8" viewBox="0 0 24 24">
                            <path d="M12,2 Q8,6 12,10 T12,18 M2,12 Q6,8 10,12 T18,12" stroke={rococo.gold} strokeWidth="1" fill="none" />
                        </svg>
                        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: rococo.gold }}>Exquisite</span>
                        <svg className="w-8 h-8 rotate-180" viewBox="0 0 24 24">
                            <path d="M12,2 Q8,6 12,10 T12,18 M2,12 Q6,8 10,12 T18,12" stroke={rococo.gold} strokeWidth="1" fill="none" />
                        </svg>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.2', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Gilded frame image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    {/* Outer ornate frame */}
                    <div className="absolute -inset-6 rounded-lg" style={{
                        background: `linear-gradient(135deg, ${rococo.gold} 0%, #e8d48a 50%, ${rococo.gold} 100%)`,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                    }}>
                        <div className="absolute inset-2 rounded" style={{ background: bgColor }} />
                    </div>
                    <div className="relative w-full aspect-[4/5] rounded overflow-hidden" style={{ border: `4px solid ${rococo.gold}` }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 20. STARK - Ultra-Minimal Single Element
export const StarkArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isDark = rng.next() > 0.5;
    const bg = isDark ? '#000000' : '#ffffff';
    const text = isDark ? '#ffffff' : '#000000';

    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-16 md:p-24" style={{ background: bg }}>
            {/* Single content element - Maximum breathing room */}
            <div className="max-w-3xl text-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <EditableTitle
                    slide={slide} theme={theme} contrast={{ text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-5xl md:text-7xl lg:text-8xl"
                    style={{ fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' }}
                />
            </div>

            {/* Minimal image - Small, positioned */}
            {slide.imageUrl && (
                <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full overflow-hidden opacity-60" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>
            )}

            {/* Single dot accent */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: text, opacity: 0.3, zIndex: LayoutLayer.DECORATION }} />
        </div>
    );
};

// ============================================================================
// BATCH 3: NATURAL/ORGANIC
// ============================================================================

// 21. TERRA - Terracotta & Sage Earthy
export const TerraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const terra = {
        cream: '#faf7f2',
        terracotta: '#c17767',
        sage: '#87a68a',
        brown: '#8b6f5c'
    };
    const accentColor = rng.pick([terra.terracotta, terra.sage]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: terra.cream }}>
            {/* Organic curved shapes */}
            <div className="absolute bottom-0 right-0 w-1/2 h-1/3 opacity-20" style={{
                background: accentColor,
                borderRadius: '100% 0 0 0',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-8">
                        <div className="w-3 h-3 rounded-full" style={{ background: terra.terracotta }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: terra.sage }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: terra.brown }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Image with organic frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/5] overflow-hidden" style={{
                        borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
                        border: `4px solid ${accentColor}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 22. FOREST - Deep Greens Moss Nature
export const ForestArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const forest = {
        deep: '#1a2e1a',
        moss: '#4a6741',
        fern: '#6b8e23',
        bark: '#5d4e37'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: forest.deep }}>
            {/* Organic shapes representing foliage */}
            <div className="absolute top-0 right-0 w-2/3 h-1/2 opacity-20" style={{
                background: `radial-gradient(ellipse at 100% 0%, ${forest.moss} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/3 opacity-15" style={{
                background: `radial-gradient(ellipse at 0% 100%, ${forest.fern} 0%, transparent 60%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Image with natural edge */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-tr-[100px] rounded-bl-[100px]">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Moss accent */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-60" style={{ background: forest.moss }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-8 rounded-full" style={{ background: forest.fern }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#e8f0e8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8c0a8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};

// 23. STONE - Marble Slate Geological
export const StoneArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isMarble = rng.next() > 0.5;
    const stone = isMarble ? {
        bg: '#f5f5f0',
        vein: '#c9c5b8',
        accent: '#d4af37'
    } : {
        bg: '#3d4852',
        vein: '#5a6a78',
        accent: '#c9a227'
    };
    const textColor = isMarble ? '#2d2d2d' : '#e8e8e8';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: stone.bg }}>
            {/* Marble/slate veining pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <path d="M0,50 Q100,30 200,60 T400,50 T600,70" stroke={stone.vein} strokeWidth="2" fill="none" />
                <path d="M0,150 Q150,120 300,160 T600,140" stroke={stone.vein} strokeWidth="1" fill="none" />
                <path d="M0,250 Q80,220 200,260 T500,230" stroke={stone.vein} strokeWidth="1.5" fill="none" />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-8" style={{ background: stone.accent }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: isMarble ? '#6b6b6b' : '#b8c0c8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Stone slab image frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2 opacity-30" style={{
                        background: stone.vein,
                        transform: 'rotate(1deg)'
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Gold vein accent */}
                    <div className="absolute bottom-0 right-0 w-1/3 h-1" style={{ background: stone.accent }} />
                </div>
            </div>
        </div>
    );
};

// 24. BLOOM - Floral Botanical Garden
export const BloomArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bloom = {
        cream: '#faf8f5',
        blush: '#f5e6e8',
        green: '#6b8e6b',
        petal: '#e8b4b8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: bloom.cream }}>
            {/* Botanical corner accents */}
            <svg className="absolute top-0 left-0 w-48 h-48 opacity-20" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0,100 Q30,70 50,80 Q70,90 60,60 Q50,30 80,20 Q90,60 70,80" stroke={bloom.green} strokeWidth="2" fill="none" />
                <circle cx="80" cy="20" r="8" fill={bloom.petal} opacity="0.5" />
                <circle cx="50" cy="80" r="5" fill={bloom.petal} opacity="0.3" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-15 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0,100 Q30,70 50,80 Q70,90 60,60 Q50,30 80,20 Q90,60 70,80" stroke={bloom.green} strokeWidth="2" fill="none" />
                <circle cx="80" cy="20" r="10" fill={bloom.petal} opacity="0.5" />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Image with botanical frame */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] rounded-t-full overflow-hidden" style={{
                        border: `3px solid ${bloom.green}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-8">
                        <div className="w-8 h-2 rounded-full" style={{ background: bloom.petal }} />
                        <div className="w-4 h-2 rounded-full" style={{ background: bloom.green }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.2', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};

// 25. DESERT - Sand Ochre Southwest
export const DesertArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const desert = {
        sand: '#e8dcc8',
        ochre: '#c98b4a',
        terracotta: '#b85c38',
        dusty: '#d4a574'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: desert.sand }}>
            {/* Sun-bleached gradient */}
            <div className="absolute inset-0 opacity-30" style={{
                background: `linear-gradient(180deg, transparent 0%, ${desert.ochre}30 100%)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Geometric southwest pattern */}
            <div className="absolute top-8 right-8 w-24 h-24" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="w-full h-full" style={{
                    background: `repeating-linear-gradient(45deg, ${desert.terracotta} 0, ${desert.terracotta} 4px, transparent 4px, transparent 12px)`
                }} />
            </div>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-2 mb-8" style={{ background: desert.terracotta }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d2e1e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b5c4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Sun-washed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square overflow-hidden" style={{
                        clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="sepia-[.2] saturate-90" />
                    </div>
                    {/* Ochre accent line */}
                    <div className="absolute -bottom-2 left-0 w-2/3 h-1" style={{ background: desert.ochre }} />
                </div>
            </div>
        </div>
    );
};

// 26. FROST - Ice Winter Crystalline
export const FrostArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const frost = {
        ice: '#f0f7ff',
        blue: '#a8d8ff',
        silver: '#c8d8e8',
        white: '#ffffff'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: frost.ice }}>
            {/* Crystalline patterns */}
            <svg className="absolute top-0 right-0 w-96 h-96 opacity-20" viewBox="0 0 200 200" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M100,10 L100,190 M10,100 L190,100 M30,30 L170,170 M170,30 L30,170" stroke={frost.blue} strokeWidth="1" />
                <path d="M100,40 L80,60 M100,40 L120,60 M100,160 L80,140 M100,160 L120,140" stroke={frost.blue} strokeWidth="1" />
            </svg>

            {/* Frost overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                background: `radial-gradient(circle at 70% 30%, ${frost.white} 0%, transparent 50%)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-px mb-8" style={{ background: frost.blue }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2a4a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.15', letterSpacing: '0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a7a9a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Frosted image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden" style={{
                        boxShadow: `0 0 60px ${frost.blue}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Frost border effect */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                        border: `2px solid ${frost.white}80`,
                        boxShadow: `inset 0 0 30px ${frost.white}40`
                    }} />
                </div>
            </div>
        </div>
    );
};

// 27. EMBER - Warm Fire Amber Glow
export const EmberArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ember = {
        charcoal: '#1a1410',
        amber: '#f59e0b',
        orange: '#ea580c',
        red: '#dc2626'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: ember.charcoal }}>
            {/* Warm glow effects */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2/3 opacity-30" style={{
                background: `radial-gradient(ellipse at 50% 100%, ${ember.amber}60 0%, ${ember.orange}30 30%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Image with warm vignette */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-lg overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Warm vignette overlay */}
                    <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
                        background: `radial-gradient(circle, transparent 40%, ${ember.charcoal}90 100%)`
                    }} />
                    {/* Ember glow */}
                    <div className="absolute -inset-4 -z-10 rounded-xl opacity-40 blur-xl" style={{
                        background: `linear-gradient(180deg, ${ember.amber}40, ${ember.orange}20)`
                    }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-1 mb-8">
                        <div className="w-2 h-6 rounded-full" style={{ background: ember.amber }} />
                        <div className="w-2 h-4 rounded-full" style={{ background: ember.orange }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: ember.red }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#fef3c7' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#d4a574' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};

// 28. MIST - Fog Atmospheric Soft
export const MistArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mist = {
        light: '#f5f5f5',
        gray: '#d4d4d4',
        dark: '#a8a8a8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${mist.light} 0%, ${mist.gray} 100%)` }}>
            {/* Mist layers */}
            <div className="absolute inset-0" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute w-full h-1/3 bottom-0 opacity-60" style={{
                    background: `linear-gradient(180deg, transparent 0%, ${mist.light}80 100%)`,
                    filter: 'blur(20px)'
                }} />
                <div className="absolute w-full h-1/2 top-1/4 opacity-40" style={{
                    background: `linear-gradient(90deg, transparent 0%, ${mist.light}60 50%, transparent 100%)`,
                    filter: 'blur(40px)'
                }} />
            </div>

            <div className="w-full h-full p-16 md:p-24 flex flex-col items-center justify-center text-center">
                <div className="max-w-3xl" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#7a7a7a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-xl mx-auto" style={{ lineHeight: '1.7' }} bullet={false} />
                </div>

                {/* Fading image */}
                <div className="absolute bottom-8 left-8 w-48 h-32 rounded-lg overflow-hidden opacity-50" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <ImageContainer slide={slide} theme={theme} />
                    <div className="absolute inset-0" style={{
                        background: `linear-gradient(90deg, transparent 0%, ${mist.light} 100%)`
                    }} />
                </div>
            </div>
        </div>
    );
};

// 29. GRAIN - Wood Fiber Natural
export const GrainArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const grain = {
        light: '#f5ebe0',
        honey: '#ddb892',
        brown: '#b08968',
        dark: '#7f5539'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: grain.light }}>
            {/* Wood grain pattern simulation */}
            <div className="absolute inset-0 opacity-10" style={{
                background: `repeating-linear-gradient(90deg, ${grain.honey} 0px, ${grain.honey} 2px, transparent 2px, transparent 20px)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-1 mb-8" style={{ background: grain.brown }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: grain.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: grain.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Image with natural frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-lg" style={{ background: grain.honey, opacity: 0.3 }} />
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden" style={{
                        border: `4px solid ${grain.brown}`,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 30. MINERAL - Crystal Gem Shimmer
export const MineralArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mineralColors = [
        { bg: '#1a1a2e', gem: '#8b5cf6', name: 'amethyst' },
        { bg: '#0a2e2a', gem: '#10b981', name: 'emerald' },
        { bg: '#1e2a4a', gem: '#3b82f6', name: 'sapphire' },
        { bg: '#2e1a1a', gem: '#ef4444', name: 'ruby' }
    ];
    const mineral = rng.pick(mineralColors);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: mineral.bg }}>
            {/* Crystal facets */}
            <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: LayoutLayer.DECORATION }}>
                <polygon points="100,10 150,60 130,120 70,120 50,60" fill="none" stroke={mineral.gem} strokeWidth="1" />
                <polygon points="300,50 350,100 330,160 270,160 250,100" fill="none" stroke={mineral.gem} strokeWidth="1" />
                <polygon points="500,80 550,130 530,190 470,190 450,130" fill="none" stroke={mineral.gem} strokeWidth="1" />
            </svg>

            {/* Gem glow */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-20 blur-3xl" style={{
                background: mineral.gem,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Crystal frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden" style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        boxShadow: `0 0 60px ${mineral.gem}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Sparkle accents */}
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse" style={{ background: mineral.gem, boxShadow: `0 0 10px ${mineral.gem}` }} />
                    <div className="absolute bottom-8 left-8 w-1 h-1 rounded-full" style={{ background: mineral.gem, boxShadow: `0 0 6px ${mineral.gem}` }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-8" style={{ background: mineral.gem }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#f5f5f5' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a8b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// BATCH 4: CULTURAL/REGIONAL
// ============================================================================

// 31. TOKYO - Neon Urban Japanese
export const TokyoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tokyo = {
        dark: '#0a0a12',
        pink: '#ff1493',
        cyan: '#00ffff',
        yellow: '#ffff00'
    };
    const accentColor = rng.pick([tokyo.pink, tokyo.cyan, tokyo.yellow]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${tokyo.dark} 0%, #1a1a2e 100%)` }}>
            {/* Neon glow backdrop */}
            <div className="absolute inset-0 opacity-30" style={{
                background: `radial-gradient(ellipse at 20% 80%, ${tokyo.pink}40 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${tokyo.cyan}40 0%, transparent 50%)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Vertical text element */}
            <div className="absolute right-8 top-8 bottom-8 w-8 flex flex-col items-center justify-center opacity-30" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="writing-vertical text-xs tracking-[0.5em] rotate-180" style={{ color: accentColor, writingMode: 'vertical-rl' }}>TOKYO DESIGN</div>
            </div>

            <div className="w-full h-full p-10 md:p-16 flex items-center gap-10">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="mb-6">
                        <span className="px-3 py-1 text-[10px] uppercase tracking-[0.3em] border" style={{
                            color: accentColor,
                            borderColor: accentColor,
                            boxShadow: `0 0 10px ${accentColor}40`
                        }}>Featured</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-8xl mb-6"
                        style={{
                            fontWeight: 900,
                            lineHeight: '0.95',
                            textShadow: `0 0 30px ${accentColor}60`
                        }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a8b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg max-w-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Neon billboard image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2 rounded-lg" style={{
                        boxShadow: `0 0 30px ${accentColor}40, 0 0 60px ${accentColor}20`,
                        border: `2px solid ${accentColor}`
                    }} />
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 32. SEOUL - K-Design Clean Minimal
export const SeoulArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const seoul = {
        white: '#ffffff',
        blush: '#fff0f5',
        lavender: '#e6e6fa',
        mint: '#e0fff0'
    };
    const bgColor = rng.pick([seoul.white, seoul.blush, seoul.lavender, seoul.mint]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: bgColor }}>
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 opacity-50" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
                {/* Image with soft glow */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-3xl overflow-hidden" style={{
                        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Soft glow behind */}
                    <div className="absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl" style={{ background: '#f0c0d0' }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-8 h-8 rounded-full mb-8" style={{
                        background: 'linear-gradient(135deg, #f0c0d0 0%, #c0e0f0 100%)'
                    }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};

// 33. PARIS - French Elegant Romance
export const ParisArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const paris = {
        cream: '#faf8f5',
        blush: '#f5e6e8',
        black: '#1a1a1a',
        gold: '#c9a227'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: paris.cream }}>
            {/* Art Nouveau curve */}
            <svg className="absolute bottom-0 left-0 w-full h-1/3 opacity-10" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0,100 Q100,50 200,80 T400,60 L400,100 Z" fill={paris.black} />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-px" style={{ background: paris.gold }} />
                        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: paris.gold }}>Paris</span>
                        <div className="w-12 h-px" style={{ background: paris.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: paris.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.15', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Elegant thin frame image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden" style={{
                        border: `1px solid ${paris.black}`,
                        padding: '8px'
                    }}>
                        <div className="w-full h-full overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>
                    {/* Gold accent corner */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8" style={{ background: paris.gold }} />
                </div>
            </div>
        </div>
    );
};

// 34. MILANO - Italian Fashion Bold
export const MilanoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const milano = {
        white: '#ffffff',
        black: '#000000',
        red: '#dc2626'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: milano.white }}>
            {/* Bold diagonal accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full" style={{
                background: milano.black,
                clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center">
                {/* Hero image - Full prominence */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} className="contrast-110" />
                    </div>
                    {/* Red accent bar */}
                    <div className="absolute -bottom-4 left-0 w-full h-2" style={{ background: milano.red }} />
                </div>

                {/* Content */}
                <div className="w-1/2 pl-16 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: milano.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl lg:text-8xl mb-8"
                        style={{ fontWeight: 900, lineHeight: '0.9', textTransform: 'uppercase' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />

                    <div className="mt-8 flex gap-4">
                        <div className="w-3 h-3" style={{ background: milano.red }} />
                        <div className="w-3 h-3" style={{ background: milano.black }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 35. BROOKLYN - Industrial Raw Loft
export const BrooklynArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const brooklyn = {
        concrete: '#9ca3af',
        brick: '#8b4513',
        steel: '#374151',
        copper: '#b87333'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#e5e5e5' }}>
            {/* Concrete texture simulation */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(${brooklyn.steel} 1px, transparent 1px)`,
                backgroundSize: '4px 4px',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Exposed brick accent */}
            <div className="absolute left-0 top-0 bottom-0 w-8 opacity-30" style={{
                background: `repeating-linear-gradient(0deg, ${brooklyn.brick} 0px, ${brooklyn.brick} 20px, #d4a574 20px, #d4a574 24px)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Industrial frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: brooklyn.steel,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 90%, 4px 90%, 4px 10%, 0 10%)'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `4px solid ${brooklyn.steel}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="grayscale-[30%]" />
                    </div>
                    {/* Copper pipe accent */}
                    <div className="absolute -right-4 top-1/4 w-2 h-1/2 rounded-full" style={{ background: brooklyn.copper }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <span className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: brooklyn.steel }}>Est. Brooklyn</span>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 800, lineHeight: '1.0' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};

// 36. NORDIC - Pure Scandinavian Light
export const NordicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const nordic = {
        white: '#ffffff',
        gray: '#f5f5f5',
        wood: '#d4b896',
        blue: '#e0e8f0'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: nordic.white }}>
            {/* Wood accent element */}
            <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: nordic.wood, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Content - Maximum negative space */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-12"
                        style={{ fontWeight: 300, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />
                </div>

                {/* Image - Minimal treatment */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 37. HAVANA - Cuban Tropical Vintage
export const HavanaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const havana = {
        pink: '#ffb6c1',
        yellow: '#fffacd',
        turquoise: '#40e0d0',
        coral: '#ff7f50'
    };
    const bgColor = rng.pick([havana.pink, havana.yellow, havana.turquoise]);
    const fadedBg = bgColor + '80';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${bgColor} 0%, ${fadedBg} 100%)` }}>
            {/* Sun-faded texture */}
            <div className="absolute inset-0 opacity-20" style={{
                background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Art deco typography hint */}
            <div className="absolute top-8 left-8 flex flex-col gap-1 opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="w-8 h-1" style={{ background: '#3d3d3d' }} />
                <div className="w-12 h-1" style={{ background: '#3d3d3d' }} />
                <div className="w-6 h-1" style={{ background: '#3d3d3d' }} />
            </div>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Vintage-treated image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/5] rounded-lg overflow-hidden" style={{
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="sepia-[.3] contrast-90 saturate-90" />
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-8">
                        <div className="w-4 h-4 rounded-full" style={{ background: havana.coral }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: havana.turquoise }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: havana.yellow }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};

// 38. MARRAKECH - Moroccan Tiles Warm
export const MarrakechArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const marrakech = {
        terracotta: '#c17767',
        blue: '#1e3a5f',
        gold: '#c9a227',
        cream: '#faf5e8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: marrakech.cream }}>
            {/* Zellige tile pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <defs>
                    <pattern id="zellige" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <rect width="60" height="60" fill="none" stroke={marrakech.blue} strokeWidth="1" />
                        <path d="M0,30 L30,0 L60,30 L30,60 Z" fill="none" stroke={marrakech.blue} strokeWidth="1" />
                        <circle cx="30" cy="30" r="10" fill="none" stroke={marrakech.terracotta} strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#zellige)" />
            </svg>

            {/* Gold brass accent */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-full opacity-40" style={{ background: marrakech.gold, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-8">
                        <div className="w-2 h-8" style={{ background: marrakech.blue }} />
                        <div className="w-2 h-8" style={{ background: marrakech.terracotta }} />
                        <div className="w-2 h-8" style={{ background: marrakech.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: marrakech.blue }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b5c4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Tile border image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-lg" style={{
                        background: `linear-gradient(45deg, ${marrakech.blue}, ${marrakech.terracotta})`,
                        opacity: 0.2
                    }} />
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden" style={{
                        border: `6px solid ${marrakech.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 39. KYOTO - Traditional Japanese Tranquil
export const KyotoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const kyoto = {
        cream: '#f5f2e8',
        sage: '#8a9a7a',
        stone: '#9a9a8a',
        ink: '#2a2a2a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: kyoto.cream }}>
            {/* Subtle wave pattern (Seigaiha) */}
            <svg className="absolute bottom-0 left-0 w-full h-1/4 opacity-5" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax slice" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(8)].map((_, i) => (
                    <circle key={i} cx={50 + i * 50} cy="100" r="40" fill="none" stroke={kyoto.ink} strokeWidth="1" />
                ))}
            </svg>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-20">
                {/* Maximum Ma (empty space) - Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-1 h-16 mb-12" style={{ background: kyoto.sage }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: kyoto.ink }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-12"
                        style={{ fontWeight: 300, lineHeight: '1.3' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: kyoto.stone }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />
                </div>

                {/* Image with subtle natural frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/5] overflow-hidden" style={{
                        borderLeft: `1px solid ${kyoto.sage}40`,
                        paddingLeft: '20px'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 40. VIENNA - Austrian Classical Ornate
export const ViennaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const vienna = {
        cream: '#faf8f0',
        gold: '#c9a227',
        burgundy: '#722f37',
        forest: '#2f4f4f'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: vienna.cream }}>
            {/* Klimt-inspired pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="w-full h-full" style={{
                    background: `repeating-linear-gradient(45deg, ${vienna.gold} 0, ${vienna.gold} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(-45deg, ${vienna.gold} 0, ${vienna.gold} 10px, transparent 10px, transparent 20px)`
                }} />
            </div>

            {/* Ornate border */}
            <div className="absolute inset-8 border-2 pointer-events-none" style={{ borderColor: vienna.gold, zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4" style={{ background: vienna.cream }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t-2 border-r-2" style={{ borderColor: vienna.gold }} />
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
                {/* Gilded frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4" style={{
                        background: `linear-gradient(135deg, ${vienna.gold} 0%, #e8d48a 50%, ${vienna.gold} 100%)`,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}>
                        <div className="absolute inset-2" style={{ background: vienna.cream }} />
                    </div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        border: `4px solid ${vienna.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center pl-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-4 h-4 rotate-45" style={{ background: vienna.gold }} />
                        <div className="flex-1 h-px" style={{ background: vienna.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2a2a2a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Decorative footer */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex-1 h-px" style={{ background: vienna.gold }} />
                        <div className="w-4 h-4 rotate-45" style={{ background: vienna.gold }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// CULTURAL HERITAGE ARCHETYPES (8 archetypes)
// ============================================================================

// 1. MUGHAL - Indian royal court aesthetic with jewel tones and jali patterns
export const MughalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mughal = {
        emerald: '#046307',
        ruby: '#9b1b30',
        gold: '#d4af37',
        ivory: '#fffff0',
        sapphire: '#0f52ba'
    };
    const accentColor = rng.pick([mughal.emerald, mughal.ruby, mughal.sapphire]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: mughal.ivory }}>
            {/* Jali (lattice) pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="jali" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke={mughal.gold} strokeWidth="1" />
                        <circle cx="30" cy="30" r="8" fill="none" stroke={mughal.gold} strokeWidth="1" />
                        <circle cx="30" cy="30" r="4" fill={mughal.gold} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#jali)" />
            </svg>

            {/* Gold filigree border */}
            <div className="absolute inset-6 border-2 pointer-events-none" style={{ borderColor: mughal.gold, zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: accentColor }} />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: accentColor }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: accentColor }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: accentColor }} />
            </div>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Arch-framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
                        border: `4px solid ${mughal.gold}`,
                        boxShadow: `0 0 0 2px ${accentColor}, 0 8px 32px rgba(0,0,0,0.2)`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Paisley decoration */}
                    <svg className="absolute -bottom-4 -right-4 w-16 h-16" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.OVERLAY }}>
                        <path d="M50 10 C80 10, 90 50, 50 90 C10 50, 20 10, 50 10" fill={mughal.gold} opacity="0.8" />
                        <circle cx="50" cy="50" r="15" fill={accentColor} />
                    </svg>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rotate-45" style={{ background: mughal.gold }} />
                        <div className="w-3 h-3 rotate-45" style={{ background: accentColor }} />
                        <div className="w-3 h-3 rotate-45" style={{ background: mughal.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1a1a1a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    <div className="flex items-center gap-3 mt-8">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${mughal.gold}, transparent)` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. ANKARA - West African wax print textile with bold geometric patterns
export const AnkaraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ankara = {
        orange: '#ff6b35',
        yellow: '#f7c531',
        blue: '#004e89',
        green: '#2e7d32',
        red: '#c62828',
        black: '#1a1a1a'
    };
    const primary = rng.pick([ankara.orange, ankara.blue, ankara.green]);
    const secondary = rng.pick([ankara.yellow, ankara.red]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: ankara.black }}>
            {/* Bold geometric pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="ankara-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                        <circle cx="40" cy="40" r="35" fill="none" stroke={primary} strokeWidth="4" />
                        <circle cx="40" cy="40" r="25" fill="none" stroke={secondary} strokeWidth="3" />
                        <circle cx="40" cy="40" r="15" fill={primary} />
                        <rect x="0" y="38" width="80" height="4" fill={secondary} />
                        <rect x="38" y="0" width="4" height="80" fill={secondary} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ankara-pattern)" />
            </svg>

            {/* Vibrant accent bars */}
            <div className="absolute left-0 top-0 w-3 h-full" style={{ background: primary, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute right-0 top-0 w-3 h-full" style={{ background: secondary, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-10 md:p-16 flex flex-col justify-center">
                {/* Top color band */}
                <div className="flex gap-2 mb-8" style={{ zIndex: LayoutLayer.DECORATION }}>
                    <div className="h-2 flex-1" style={{ background: primary }} />
                    <div className="h-2 w-16" style={{ background: secondary }} />
                    <div className="h-2 flex-1" style={{ background: primary }} />
                </div>

                <div className="flex items-center gap-10">
                    {/* Circular image with patterned border */}
                    <div className="w-1/3 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                        <div className="absolute -inset-3 rounded-full" style={{
                            background: `conic-gradient(from 0deg, ${primary}, ${secondary}, ${primary}, ${secondary}, ${primary})`,
                            opacity: 0.8
                        }} />
                        <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                            border: `6px solid ${ankara.black}`
                        }}>
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-5xl md:text-6xl lg:text-7xl mb-6 uppercase tracking-wide"
                            style={{ fontWeight: 900, lineHeight: '1.0', textShadow: `3px 3px 0 ${primary}` }}
                        />

                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#e0e0e0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                    </div>
                </div>

                {/* Bottom color band */}
                <div className="flex gap-2 mt-8" style={{ zIndex: LayoutLayer.DECORATION }}>
                    <div className="h-2 w-24" style={{ background: secondary }} />
                    <div className="h-2 flex-1" style={{ background: primary }} />
                    <div className="h-2 w-24" style={{ background: secondary }} />
                </div>
            </div>
        </div>
    );
};

// 3. TALAVERA - Mexican ceramic tile aesthetic with cobalt blue and terracotta
export const TalaveraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const talavera = {
        cobalt: '#0047ab',
        terracotta: '#e2725b',
        yellow: '#ffd700',
        cream: '#faf6e9',
        green: '#228b22'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: talavera.cream }}>
            {/* Tile pattern border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="talavera-tile" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill={talavera.cream} />
                        <circle cx="25" cy="25" r="20" fill="none" stroke={talavera.cobalt} strokeWidth="2" />
                        <path d="M25 5 L25 15 M25 35 L25 45 M5 25 L15 25 M35 25 L45 25" stroke={talavera.terracotta} strokeWidth="2" />
                        <circle cx="25" cy="25" r="8" fill={talavera.cobalt} />
                        <circle cx="25" cy="25" r="4" fill={talavera.yellow} />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="40" fill="url(#talavera-tile)" opacity="0.4" />
                <rect x="0" y="calc(100% - 40px)" width="100%" height="40" fill="url(#talavera-tile)" opacity="0.4" />
            </svg>

            {/* Hand-painted style border */}
            <div className="absolute inset-8 border-4 pointer-events-none" style={{
                borderColor: talavera.cobalt,
                borderStyle: 'double',
                zIndex: LayoutLayer.DECORATION
            }}>
                {/* Corner florals */}
                {['-top-3 -left-3', '-top-3 -right-3', '-bottom-3 -left-3', '-bottom-3 -right-3'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-6 h-6 rounded-full`} style={{ background: talavera.terracotta, border: `2px solid ${talavera.cobalt}` }} />
                ))}
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative header line */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-4 h-4 rotate-45" style={{ background: talavera.terracotta }} />
                        <div className="h-1 flex-1" style={{ background: talavera.cobalt }} />
                        <div className="w-4 h-4 rotate-45" style={{ background: talavera.terracotta }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: talavera.cobalt }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Decorative footer */}
                    <div className="flex items-center gap-2 mt-8">
                        <div className="w-3 h-3 rounded-full" style={{ background: talavera.yellow }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: talavera.cobalt }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: talavera.terracotta }} />
                    </div>
                </div>

                {/* Scalloped frame image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-lg" style={{
                        background: talavera.cobalt,
                        clipPath: 'polygon(5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%, 0% 5%)'
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg" style={{
                        border: `3px solid ${talavera.terracotta}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. PERSIAN - Iranian carpet/miniature painting aesthetic with arabesque patterns
export const PersianArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const persian = {
        burgundy: '#722f37',
        gold: '#d4af37',
        turquoise: '#30d5c8',
        cream: '#f5f0e1',
        navy: '#1a2744'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: persian.burgundy }}>
            {/* Arabesque pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="arabesque" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M50 0 Q75 25 50 50 Q25 75 50 100 M50 0 Q25 25 50 50 Q75 75 50 100" fill="none" stroke={persian.gold} strokeWidth="1" />
                        <circle cx="50" cy="50" r="10" fill="none" stroke={persian.gold} strokeWidth="1" />
                        <path d="M0 50 Q25 25 50 50 Q25 75 0 50 M100 50 Q75 25 50 50 Q75 75 100 50" fill="none" stroke={persian.gold} strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#arabesque)" />
            </svg>

            {/* Multi-layer border frame */}
            <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: persian.gold, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute inset-8 border-2 pointer-events-none" style={{ borderColor: persian.turquoise, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute inset-10 border pointer-events-none" style={{ borderColor: persian.gold, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-16 md:p-24 flex flex-col items-center justify-center">
                {/* Medallion center composition */}
                <div className="relative w-full max-w-4xl flex items-center gap-12">
                    {/* Central medallion image */}
                    <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                        <div className="absolute -inset-6" style={{
                            background: `radial-gradient(ellipse at center, ${persian.gold} 0%, transparent 70%)`,
                            opacity: 0.3
                        }} />
                        <div className="relative w-full aspect-square overflow-hidden" style={{
                            borderRadius: '50%',
                            border: `6px solid ${persian.gold}`,
                            boxShadow: `0 0 0 3px ${persian.turquoise}, 0 0 0 6px ${persian.gold}`
                        }}>
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>

                    {/* Content panel */}
                    <div className="flex-1 p-8 relative" style={{
                        background: persian.cream,
                        borderRadius: '4px',
                        border: `2px solid ${persian.gold}`,
                        zIndex: LayoutLayer.CONTENT_HERO
                    }}>
                        <div className="absolute top-2 left-2 right-2 h-px" style={{ background: persian.turquoise }} />

                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: persian.burgundy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-4xl md:text-5xl lg:text-6xl mb-6"
                            style={{ fontWeight: 600, lineHeight: '1.15' }}
                        />

                        <EditableContent slide={slide} theme={theme} contrast={{ text: persian.navy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />

                        <div className="absolute bottom-2 left-2 right-2 h-px" style={{ background: persian.turquoise }} />
                    </div>
                </div>

                {/* Bottom ornament */}
                <div className="flex items-center gap-4 mt-8" style={{ zIndex: LayoutLayer.DECORATION }}>
                    <div className="w-16 h-px" style={{ background: persian.gold }} />
                    <div className="w-4 h-4 rotate-45" style={{ background: persian.turquoise }} />
                    <div className="w-16 h-px" style={{ background: persian.gold }} />
                </div>
            </div>
        </div>
    );
};

// 5. BATIK - Indonesian wax-resist textile with indigo and cream
export const BatikArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const batik = {
        indigo: '#1a237e',
        brown: '#5d4037',
        cream: '#faf8f0',
        tan: '#d7ccc8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: batik.cream }}>
            {/* Crackle texture overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 48 50 52 T100 48 T150 55 T200 50' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 100 Q30 95 60 105 T120 98 T180 102 T200 100' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 150 Q20 148 40 152 T80 147 T120 153 T160 149 T200 151' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px'
            }} />

            {/* Organic flowing pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="batik-flow" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                        <path d="M60 10 Q90 30 60 60 Q30 90 60 110" fill="none" stroke={batik.indigo} strokeWidth="2" />
                        <path d="M10 60 Q30 30 60 60 Q90 90 110 60" fill="none" stroke={batik.brown} strokeWidth="2" />
                        <circle cx="60" cy="60" r="8" fill="none" stroke={batik.indigo} strokeWidth="1.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#batik-flow)" />
            </svg>

            {/* Wax drip edge effect - left side */}
            <div className="absolute left-0 top-0 w-4 h-full" style={{
                zIndex: LayoutLayer.DECORATION,
                background: batik.indigo,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 3%, 80% 5%, 100% 8%, 70% 12%, 100% 15%, 90% 20%, 100% 25%, 60% 30%, 100% 35%, 80% 40%, 100% 45%, 70% 50%, 100% 55%, 90% 60%, 100% 65%, 60% 70%, 100% 75%, 80% 80%, 100% 85%, 70% 90%, 100% 95%, 80% 100%, 0% 100%)'
            }} />

            <div className="w-full h-full p-12 md:p-20 pl-16 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: batik.indigo }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: batik.indigo }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: batik.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    <div className="flex gap-2 mt-8">
                        <div className="w-2 h-2 rounded-full" style={{ background: batik.indigo }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: batik.brown }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: batik.indigo }} />
                    </div>
                </div>

                {/* Organic shape image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        borderRadius: '60% 40% 50% 50% / 50% 50% 50% 50%',
                        border: `4px solid ${batik.indigo}`,
                        boxShadow: `8px 8px 0 ${batik.tan}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. CELTIC - Irish knotwork illumination with green and gold
export const CelticArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const celtic = {
        green: '#006400',
        gold: '#d4af37',
        cream: '#f5f0dc',
        brown: '#654321'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: celtic.cream }}>
            {/* Interlaced knot border pattern */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="celtic-knot" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M30 0 Q45 15 30 30 Q15 45 30 60" fill="none" stroke={celtic.green} strokeWidth="3" />
                        <path d="M0 30 Q15 15 30 30 Q45 45 60 30" fill="none" stroke={celtic.green} strokeWidth="3" />
                        <circle cx="30" cy="30" r="5" fill={celtic.gold} />
                    </pattern>
                </defs>
                {/* Top and bottom borders */}
                <rect x="0" y="0" width="100%" height="30" fill="url(#celtic-knot)" opacity="0.3" />
                <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#celtic-knot)" opacity="0.3" />
            </svg>

            {/* Manuscript page border */}
            <div className="absolute inset-6 border-4 pointer-events-none" style={{
                borderColor: celtic.green,
                borderStyle: 'double',
                zIndex: LayoutLayer.DECORATION
            }}>
                {/* Corner knots */}
                {['-top-4 -left-4', '-top-4 -right-4', '-bottom-4 -left-4', '-bottom-4 -right-4'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-8 h-8 rounded-full border-4`} style={{
                        borderColor: celtic.gold,
                        background: celtic.green
                    }} />
                ))}
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Illuminated initial / Image */}
                <div className="w-1/3 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-4" style={{
                        borderColor: celtic.gold,
                        background: `linear-gradient(135deg, ${celtic.gold}22, transparent)`
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `3px solid ${celtic.green}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Decorative corner spirals */}
                    <svg className="absolute -bottom-6 -right-6 w-12 h-12" viewBox="0 0 50 50" style={{ zIndex: LayoutLayer.OVERLAY }}>
                        <path d="M25 25 Q35 25 35 35 Q35 45 25 45 Q15 45 15 35 Q15 25 25 25" fill="none" stroke={celtic.gold} strokeWidth="3" />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Uncial-style decorative header */}
                    <div className="flex items-center gap-4 mb-8">
                        <svg className="w-8 h-8" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="15" fill="none" stroke={celtic.green} strokeWidth="2" />
                            <circle cx="20" cy="20" r="8" fill={celtic.gold} />
                        </svg>
                        <div className="flex-1 h-1" style={{ background: celtic.green }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: celtic.green }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: celtic.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Footer ornament */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex-1 h-1" style={{ background: celtic.green }} />
                        <div className="w-4 h-4 rotate-45" style={{ background: celtic.gold }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 7. AZTEC - Mesoamerican geometric with step-fret patterns
export const AztecArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const aztec = {
        turquoise: '#00ced1',
        gold: '#d4af37',
        terracotta: '#cd5c5c',
        black: '#1a1a1a',
        stone: '#a0896c'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: aztec.stone }}>
            {/* Step-fret pattern border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="step-fret" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0 20 L10 20 L10 10 L20 10 L20 0 L30 0 L30 10 L40 10 L40 20 L30 20 L30 30 L20 30 L20 40 L10 40 L10 30 L0 30 Z"
                              fill="none" stroke={aztec.black} strokeWidth="2" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="50" fill="url(#step-fret)" opacity="0.2" />
                <rect x="0" y="calc(100% - 50px)" width="100%" height="50" fill="url(#step-fret)" opacity="0.2" />
            </svg>

            {/* Bold geometric accents */}
            <div className="absolute top-0 left-0 w-full h-2" style={{ background: aztec.turquoise, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: aztec.gold, zIndex: LayoutLayer.DECORATION }} />

            {/* Sun stone inspired circle decoration */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 w-48 h-48 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke={aztec.gold} strokeWidth="4" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke={aztec.turquoise} strokeWidth="3" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke={aztec.terracotta} strokeWidth="2" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <line key={i} x1="50" y1="5" x2="50" y2="20" stroke={aztec.gold} strokeWidth="3"
                              transform={`rotate(${angle} 50 50)`} />
                    ))}
                </svg>
            </div>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Angular header decoration */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-6 h-6" style={{
                            background: aztec.turquoise,
                            clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)'
                        }} />
                        <div className="w-6 h-6" style={{
                            background: aztec.gold,
                            clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)'
                        }} />
                        <div className="flex-1 h-2" style={{
                            background: `linear-gradient(to right, ${aztec.turquoise}, ${aztec.gold})`
                        }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: aztec.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
                        style={{ fontWeight: 900, lineHeight: '1.0' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Step pattern footer */}
                    <div className="flex gap-1 mt-8">
                        {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                            <div key={i} className="w-4" style={{
                                height: `${h * 8}px`,
                                background: i % 2 === 0 ? aztec.turquoise : aztec.gold
                            }} />
                        ))}
                    </div>
                </div>

                {/* Stepped frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: aztec.black,
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Corner accents */}
                    <div className="absolute -top-4 -left-4 w-8 h-8" style={{ background: aztec.turquoise }} />
                    <div className="absolute -bottom-4 -right-4 w-8 h-8" style={{ background: aztec.gold }} />
                </div>
            </div>
        </div>
    );
};

// 8. ABORIGINAL - Australian dot painting with ochre tones and concentric circles
export const AboriginalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const aboriginal = {
        ochre: '#cc7722',
        terracotta: '#8b4513',
        white: '#f5f5dc',
        black: '#1a1a1a',
        red: '#8b0000'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: aboriginal.terracotta }}>
            {/* Dot pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="dot-paint" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="5" cy="5" r="2" fill={aboriginal.white} />
                        <circle cx="15" cy="5" r="2" fill={aboriginal.ochre} />
                        <circle cx="25" cy="5" r="2" fill={aboriginal.white} />
                        <circle cx="10" cy="15" r="2" fill={aboriginal.ochre} />
                        <circle cx="20" cy="15" r="2" fill={aboriginal.white} />
                        <circle cx="5" cy="25" r="2" fill={aboriginal.white} />
                        <circle cx="15" cy="25" r="2" fill={aboriginal.ochre} />
                        <circle cx="25" cy="25" r="2" fill={aboriginal.white} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dot-paint)" />
            </svg>

            {/* Concentric circle motifs */}
            <svg className="absolute top-1/2 left-8 -translate-y-1/2 w-32 h-32 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[40, 32, 24, 16, 8].map((r, i) => (
                    <circle key={i} cx="64" cy="64" r={r} fill="none"
                            stroke={i % 2 === 0 ? aboriginal.white : aboriginal.ochre} strokeWidth="3" />
                ))}
            </svg>

            <svg className="absolute bottom-12 right-12 w-24 h-24 opacity-25 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[30, 22, 14, 6].map((r, i) => (
                    <circle key={i} cx="48" cy="48" r={r} fill="none"
                            stroke={i % 2 === 0 ? aboriginal.ochre : aboriginal.white} strokeWidth="2" />
                ))}
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Circular image with dot border */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)]">
                        {[...Array(24)].map((_, i) => {
                            const angle = (i / 24) * 2 * Math.PI;
                            const x = 50 + 48 * Math.cos(angle);
                            const y = 50 + 48 * Math.sin(angle);
                            return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="4"
                                          fill={i % 2 === 0 ? aboriginal.ochre : aboriginal.white} />;
                        })}
                    </svg>
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `6px solid ${aboriginal.black}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Dot line header */}
                    <div className="flex gap-2 mb-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full"
                                 style={{ background: i % 2 === 0 ? aboriginal.white : aboriginal.ochre }} />
                        ))}
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: aboriginal.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#e8e8e8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Dot line footer */}
                    <div className="flex gap-2 mt-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full"
                                 style={{ background: i % 3 === 0 ? aboriginal.red : aboriginal.ochre }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// HISTORICAL PERIOD ARCHETYPES (6 archetypes)
// ============================================================================

// 9. VICTORIAN - 19th century ornate elegance
export const VictorianArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const victorian = {
        burgundy: '#722f37',
        forest: '#228b22',
        gold: '#d4af37',
        cream: '#f5f5dc',
        black: '#1a1a1a'
    };
    const accent = rng.pick([victorian.burgundy, victorian.forest]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: victorian.cream }}>
            {/* Ornate frame borders */}
            <div className="absolute inset-4 border-2 pointer-events-none" style={{ borderColor: victorian.gold, zIndex: LayoutLayer.DECORATION }}>
                {/* Ornate corner decorations */}
                {[
                    { pos: 'top-0 left-0', transform: '' },
                    { pos: 'top-0 right-0', transform: 'scale(-1, 1)' },
                    { pos: 'bottom-0 left-0', transform: 'scale(1, -1)' },
                    { pos: 'bottom-0 right-0', transform: 'scale(-1, -1)' }
                ].map((corner, i) => (
                    <svg key={i} className={`absolute ${corner.pos} w-16 h-16`} viewBox="0 0 50 50" style={{ transform: corner.transform }}>
                        <path d="M0 0 L50 0 L50 5 L5 5 L5 50 L0 50 Z" fill={victorian.gold} />
                        <path d="M10 0 Q10 10 0 10" fill="none" stroke={accent} strokeWidth="2" />
                        <circle cx="15" cy="15" r="4" fill={accent} />
                    </svg>
                ))}
            </div>

            {/* Inner decorative border */}
            <div className="absolute inset-10 border pointer-events-none" style={{ borderColor: accent, borderStyle: 'double', zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-20 md:p-28 flex items-center gap-16">
                {/* Engraved-style framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-6 border-8" style={{
                        borderColor: victorian.gold,
                        background: `linear-gradient(135deg, ${victorian.gold} 0%, #e8d48a 30%, ${victorian.gold} 70%, #b8960f 100%)`
                    }}>
                        <div className="absolute inset-2 border" style={{ borderColor: accent }} />
                    </div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        border: `4px solid ${victorian.black}`,
                        filter: 'sepia(20%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative header */}
                    <div className="flex items-center gap-4 mb-8">
                        <svg className="w-12 h-6" viewBox="0 0 60 30">
                            <path d="M0 15 Q15 0 30 15 Q45 30 60 15" fill="none" stroke={victorian.gold} strokeWidth="2" />
                            <circle cx="30" cy="15" r="4" fill={accent} />
                        </svg>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: victorian.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Decorative footer flourish */}
                    <svg className="w-32 h-8 mt-8" viewBox="0 0 120 30">
                        <path d="M0 15 Q30 0 60 15 Q90 30 120 15" fill="none" stroke={victorian.gold} strokeWidth="1.5" />
                        <path d="M40 15 Q60 5 80 15" fill="none" stroke={accent} strokeWidth="2" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// 10. DISCO - 1970s glam and sparkle
export const DiscoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const disco = {
        gold: '#ffd700',
        silver: '#c0c0c0',
        purple: '#8b008b',
        pink: '#ff1493',
        black: '#0a0a0a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: disco.black }}>
            {/* Mirror ball reflection pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(20)].map((_, i) => {
                    const x = rng.range(0, 100);
                    const y = rng.range(0, 100);
                    const size = rng.range(2, 8);
                    return (
                        <div key={i} className="absolute rounded-full animate-pulse"
                             style={{
                                 left: `${x}%`,
                                 top: `${y}%`,
                                 width: `${size}px`,
                                 height: `${size}px`,
                                 background: rng.pick([disco.gold, disco.silver, disco.pink]),
                                 animationDelay: `${rng.range(0, 2)}s`
                             }} />
                    );
                })}
            </div>

            {/* Starburst light rays */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <radialGradient id="disco-ray" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={disco.gold} stopOpacity="1" />
                        <stop offset="100%" stopColor={disco.gold} stopOpacity="0" />
                    </radialGradient>
                </defs>
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <line key={i} x1="50%" y1="50%" x2={`${50 + 50 * Math.cos(angle * Math.PI / 180)}%`} y2={`${50 + 50 * Math.sin(angle * Math.PI / 180)}%`}
                          stroke="url(#disco-ray)" strokeWidth="3" />
                ))}
            </svg>

            {/* Metallic gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-2" style={{
                background: `linear-gradient(to right, ${disco.gold}, ${disco.silver}, ${disco.pink}, ${disco.purple}, ${disco.gold})`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-full h-2" style={{
                background: `linear-gradient(to right, ${disco.purple}, ${disco.pink}, ${disco.silver}, ${disco.gold}, ${disco.purple})`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Disco ball image frame */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-full" style={{
                        background: `conic-gradient(from 0deg, ${disco.gold}, ${disco.silver}, ${disco.pink}, ${disco.purple}, ${disco.gold})`,
                        opacity: 0.8
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `4px solid ${disco.silver}`,
                        boxShadow: `0 0 30px ${disco.gold}40, 0 0 60px ${disco.pink}20`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: disco.gold }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-8xl mb-8 uppercase tracking-widest"
                        style={{
                            fontWeight: 900,
                            lineHeight: '1.0',
                            background: `linear-gradient(135deg, ${disco.gold}, ${disco.silver}, ${disco.pink})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#e0e0e0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Sparkle decoration */}
                    <div className="flex gap-4 mt-8">
                        {[disco.gold, disco.silver, disco.pink, disco.purple].map((color, i) => (
                            <div key={i} className="w-3 h-3 rotate-45" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 11. GRUNGE - 1990s alternative aesthetic
export const GrungeArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const grunge = {
        mustard: '#c9a227',
        brown: '#5d4037',
        gray: '#757575',
        black: '#1a1a1a',
        cream: '#e8e4d9'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: grunge.cream }}>
            {/* Distressed texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='5' height='3' fill='%23000' opacity='0.3'/%3E%3Crect x='50' y='30' width='8' height='2' fill='%23000' opacity='0.2'/%3E%3Crect x='70' y='60' width='4' height='4' fill='%23000' opacity='0.25'/%3E%3Crect x='20' y='80' width='6' height='2' fill='%23000' opacity='0.15'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px'
            }} />

            {/* Torn paper edge effect - top */}
            <div className="absolute top-0 left-0 w-full h-8" style={{
                zIndex: LayoutLayer.DECORATION,
                background: grunge.brown,
                clipPath: 'polygon(0% 0%, 3% 100%, 8% 50%, 12% 100%, 18% 60%, 22% 100%, 28% 40%, 33% 100%, 38% 70%, 45% 100%, 50% 50%, 55% 100%, 62% 60%, 68% 100%, 75% 40%, 80% 100%, 85% 70%, 92% 100%, 95% 50%, 100% 100%, 100% 0%)'
            }} />

            <div className="w-full h-full p-12 md:p-20 pt-16 flex items-center gap-12">
                {/* Photocopied-style image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-1 bg-black opacity-80" style={{ transform: 'rotate(-2deg)' }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        border: `3px solid ${grunge.black}`,
                        filter: 'contrast(1.2) grayscale(30%)',
                        transform: 'rotate(1deg)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Tape pieces */}
                    <div className="absolute -top-3 left-1/4 w-16 h-6 rotate-12" style={{ background: `${grunge.mustard}90` }} />
                    <div className="absolute -bottom-2 right-1/4 w-12 h-5 -rotate-6" style={{ background: `${grunge.cream}90` }} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-1 mb-6" style={{ background: grunge.mustard }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: grunge.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
                        style={{ fontWeight: 900, lineHeight: '0.95', letterSpacing: '-0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: grunge.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />

                    {/* X marks */}
                    <div className="flex gap-4 mt-8">
                        {[...Array(3)].map((_, i) => (
                            <span key={i} className="text-3xl font-black" style={{ color: grunge.mustard }}>×</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 12. ATOMIC - 1950s Space Age optimism
export const AtomicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const atomic = {
        turquoise: '#40e0d0',
        coral: '#ff7f50',
        chartreuse: '#7fff00',
        white: '#ffffff',
        black: '#1a1a1a'
    };
    const accent = rng.pick([atomic.turquoise, atomic.coral, atomic.chartreuse]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: atomic.white }}>
            {/* Atomic starburst shapes */}
            <svg className="absolute top-8 right-8 w-32 h-32 opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[0, 45, 90, 135].map((angle, i) => (
                    <ellipse key={i} cx="64" cy="64" rx="60" ry="8" fill={accent}
                             transform={`rotate(${angle} 64 64)`} />
                ))}
                <circle cx="64" cy="64" r="12" fill={atomic.black} />
            </svg>

            {/* Boomerang curves */}
            <svg className="absolute bottom-12 left-8 w-48 h-24 opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0 60 Q60 0 120 30 Q180 60 240 20" fill="none" stroke={atomic.coral} strokeWidth="4" />
                <path d="M0 80 Q60 20 120 50 Q180 80 240 40" fill="none" stroke={atomic.turquoise} strokeWidth="3" />
            </svg>

            {/* Googie-style accent bar */}
            <div className="absolute top-0 left-0 w-full h-3" style={{
                background: `linear-gradient(to right, ${atomic.turquoise}, ${atomic.coral}, ${atomic.chartreuse})`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Atomic orbital header */}
                    <svg className="w-16 h-16 mb-6" viewBox="0 0 64 64">
                        {[0, 60, 120].map((angle, i) => (
                            <ellipse key={i} cx="32" cy="32" rx="28" ry="10" fill="none" stroke={accent} strokeWidth="2"
                                     transform={`rotate(${angle} 32 32)`} />
                        ))}
                        <circle cx="32" cy="32" r="6" fill={atomic.black} />
                    </svg>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: atomic.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
                        style={{ fontWeight: 800, lineHeight: '1.0' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Color dots */}
                    <div className="flex gap-3 mt-8">
                        <div className="w-4 h-4 rounded-full" style={{ background: atomic.turquoise }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: atomic.coral }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: atomic.chartreuse }} />
                    </div>
                </div>

                {/* Kidney-shaped image frame */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: accent,
                        borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
                        border: `4px solid ${atomic.white}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 13. NOUVEAU - Art Nouveau organic curves
export const NouveauArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const nouveau = {
        sage: '#9dc183',
        mauve: '#e0b0ff',
        gold: '#d4af37',
        cream: '#faf8f0',
        brown: '#5d4037'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: nouveau.cream }}>
            {/* Flowing organic line borders */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <linearGradient id="nouveau-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={nouveau.sage} />
                        <stop offset="100%" stopColor={nouveau.mauve} />
                    </linearGradient>
                </defs>
                {/* Top whiplash curve */}
                <path d="M0 40 Q100 10, 200 50 T400 30 T600 60 T800 20 T1000 50 T1200 30"
                      fill="none" stroke="url(#nouveau-grad)" strokeWidth="3" opacity="0.4" />
                {/* Bottom whiplash curve */}
                <path d="M0 calc(100% - 40) Q100 calc(100% - 70), 200 calc(100% - 30) T400 calc(100% - 50) T600 calc(100% - 20)"
                      fill="none" stroke="url(#nouveau-grad)" strokeWidth="3" opacity="0.4" />
                {/* Vertical side flourish */}
                <path d="M30 100 Q10 200, 30 300 Q50 400, 30 500" fill="none" stroke={nouveau.gold} strokeWidth="2" opacity="0.3" />
            </svg>

            {/* Decorative corner flourishes */}
            <svg className="absolute top-4 left-4 w-24 h-24 opacity-50" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10 90 Q10 50, 30 30 Q50 10, 90 10" fill="none" stroke={nouveau.sage} strokeWidth="3" />
                <circle cx="90" cy="10" r="5" fill={nouveau.gold} />
            </svg>
            <svg className="absolute bottom-4 right-4 w-24 h-24 opacity-50 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10 90 Q10 50, 30 30 Q50 10, 90 10" fill="none" stroke={nouveau.mauve} strokeWidth="3" />
                <circle cx="90" cy="10" r="5" fill={nouveau.gold} />
            </svg>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Mucha-style framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)]" viewBox="0 0 120 150">
                        {/* Organic frame */}
                        <path d="M10 20 Q0 75, 10 130 Q60 145, 110 130 Q120 75, 110 20 Q60 5, 10 20"
                              fill="none" stroke={nouveau.gold} strokeWidth="3" />
                        <path d="M15 25 Q5 75, 15 125 Q60 138, 105 125 Q115 75, 105 25 Q60 12, 15 25"
                              fill="none" stroke={nouveau.sage} strokeWidth="2" />
                    </svg>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        borderRadius: '20% 20% 30% 30% / 5% 5% 10% 10%',
                        border: `2px solid ${nouveau.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Flowing header decoration */}
                    <svg className="w-32 h-8 mb-6" viewBox="0 0 120 30">
                        <path d="M0 15 Q30 5, 60 15 Q90 25, 120 15" fill="none" stroke={nouveau.gold} strokeWidth="2" />
                        <circle cx="60" cy="15" r="4" fill={nouveau.mauve} />
                    </svg>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: nouveau.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Flowing footer */}
                    <svg className="w-48 h-12 mt-8" viewBox="0 0 180 40">
                        <path d="M0 20 Q45 5, 90 20 Q135 35, 180 20" fill="none" stroke={nouveau.sage} strokeWidth="2" />
                        <path d="M30 20 Q90 10, 150 20" fill="none" stroke={nouveau.mauve} strokeWidth="1.5" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// 14. TUDOR - English Renaissance heraldic
export const TudorArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tudor = {
        red: '#8b0000',
        navy: '#000080',
        gold: '#d4af37',
        cream: '#f5f0dc',
        black: '#1a1a1a'
    };
    const primary = rng.pick([tudor.red, tudor.navy]);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: tudor.cream }}>
            {/* Heraldic pattern border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="tudor-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect width="20" height="20" fill={primary} opacity="0.1" />
                        <rect x="20" y="20" width="20" height="20" fill={primary} opacity="0.1" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="30" fill="url(#tudor-pattern)" />
                <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#tudor-pattern)" />
            </svg>

            {/* Ornate border frame */}
            <div className="absolute inset-6 border-4 pointer-events-none" style={{
                borderColor: tudor.gold,
                zIndex: LayoutLayer.DECORATION
            }}>
                {/* Shield corners */}
                {['-top-4 -left-4', '-top-4 -right-4', '-bottom-4 -left-4', '-bottom-4 -right-4'].map((pos, i) => (
                    <svg key={i} className={`absolute ${pos} w-8 h-10`} viewBox="0 0 30 40">
                        <path d="M15 0 L30 10 L30 25 L15 40 L0 25 L0 10 Z" fill={primary} stroke={tudor.gold} strokeWidth="2" />
                    </svg>
                ))}
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
                {/* Shield-framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4" style={{
                        background: tudor.gold,
                        clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)'
                    }}>
                        <div className="absolute inset-2" style={{
                            background: primary,
                            clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)'
                        }} />
                    </div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        clipPath: 'polygon(50% 2%, 98% 16%, 98% 68%, 50% 98%, 2% 68%, 2% 16%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Crown decoration */}
                    <svg className="w-16 h-12 mb-6" viewBox="0 0 60 40">
                        <path d="M5 35 L10 15 L20 25 L30 10 L40 25 L50 15 L55 35 Z" fill={tudor.gold} />
                        <circle cx="30" cy="10" r="4" fill={primary} />
                    </svg>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: tudor.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
                        style={{ fontWeight: 900, lineHeight: '1.0', letterSpacing: '0.05em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Heraldic footer */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="w-6 h-6" style={{ background: primary }} />
                        <div className="w-6 h-6" style={{ background: tudor.gold }} />
                        <div className="flex-1 h-1" style={{ background: tudor.gold }} />
                        <div className="w-6 h-6" style={{ background: tudor.gold }} />
                        <div className="w-6 h-6" style={{ background: primary }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// ARTISANAL CRAFT ARCHETYPES (6 archetypes)
// ============================================================================

// 15. INDIGO - Shibori dye craft
export const IndigoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const indigo = {
        deep: '#1a237e',
        medium: '#3949ab',
        light: '#7986cb',
        white: '#fafafa',
        cream: '#f5f5f0'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: indigo.cream }}>
            {/* Tie-dye pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="shibori" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                        <circle cx="40" cy="40" r="35" fill="none" stroke={indigo.deep} strokeWidth="2" strokeDasharray="5 3" />
                        <circle cx="40" cy="40" r="25" fill="none" stroke={indigo.medium} strokeWidth="1.5" strokeDasharray="3 5" />
                        <circle cx="40" cy="40" r="15" fill={indigo.light} opacity="0.3" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#shibori)" />
            </svg>

            {/* Organic dye bleed edges */}
            <div className="absolute top-0 left-0 w-full h-4" style={{
                background: `linear-gradient(to bottom, ${indigo.deep}, transparent)`,
                opacity: 0.3,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-full h-4" style={{
                background: `linear-gradient(to top, ${indigo.deep}, transparent)`,
                opacity: 0.3,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Fabric-like image container */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: indigo.deep,
                        borderRadius: '45% 55% 50% 50% / 55% 45% 55% 45%'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        borderRadius: '40% 60% 50% 50% / 50% 50% 50% 50%',
                        border: `3px solid ${indigo.white}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-6" style={{ background: indigo.deep }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: indigo.deep }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: indigo.medium }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Dye gradient dots */}
                    <div className="flex gap-2 mt-8">
                        {[indigo.deep, indigo.medium, indigo.light, indigo.medium, indigo.deep].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 16. COPPER - Oxidized metalwork
export const CopperArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const copper = {
        base: '#b87333',
        verdigris: '#4a9c8c',
        patina: '#6b8e7d',
        dark: '#2d1810',
        light: '#d4a574'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(135deg, ${copper.base} 0%, ${copper.light} 50%, ${copper.base} 100%)`
        }}>
            {/* Metal texture grain overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23000' stroke-width='0.5' opacity='0.2'/%3E%3Cline x1='20' y1='0' x2='120' y2='100' stroke='%23000' stroke-width='0.3' opacity='0.15'/%3E%3Cline x1='40' y1='0' x2='140' y2='100' stroke='%23000' stroke-width='0.4' opacity='0.1'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
            }} />

            {/* Oxidation gradient effects */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-40 pointer-events-none" style={{
                background: `radial-gradient(ellipse at top right, ${copper.verdigris} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 opacity-30 pointer-events-none" style={{
                background: `radial-gradient(ellipse at bottom left, ${copper.patina} 0%, transparent 60%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: copper.verdigris }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: copper.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a2a20' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Hammered surface hints */}
                    <div className="flex gap-3 mt-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{
                                background: `radial-gradient(circle at 30% 30%, ${copper.light}, ${copper.base})`
                            }} />
                        ))}
                    </div>
                </div>

                {/* Circular hammered frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-full" style={{
                        background: `conic-gradient(from 0deg, ${copper.base}, ${copper.light}, ${copper.base}, ${copper.verdigris}, ${copper.base})`,
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `4px solid ${copper.dark}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 17. RAKU - Japanese pottery glaze
export const RakuArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const raku = {
        copper: '#8b4513',
        black: '#1a1a1a',
        cream: '#f5f0e1',
        gold: '#c9a227',
        gray: '#6b6b6b'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: raku.cream }}>
            {/* Crackle glaze pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="crackle" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M20 0 L25 30 L50 35 L45 60 L70 65 L60 100" fill="none" stroke={raku.black} strokeWidth="0.5" />
                        <path d="M0 50 L30 55 L35 80 L60 75 L65 100" fill="none" stroke={raku.black} strokeWidth="0.5" />
                        <path d="M80 0 L75 25 L100 30" fill="none" stroke={raku.black} strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#crackle)" />
            </svg>

            {/* Kiln fire marks */}
            <div className="absolute bottom-0 left-1/4 w-1/2 h-32 opacity-10 pointer-events-none" style={{
                background: `radial-gradient(ellipse at bottom, ${raku.copper} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Organic form image container */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: raku.black,
                        borderRadius: '40% 60% 55% 45% / 60% 40% 60% 40%'
                    }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        borderRadius: '35% 65% 50% 50% / 55% 45% 55% 45%',
                        border: `3px solid ${raku.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-6">
                        <div className="w-8 h-1" style={{ background: raku.copper }} />
                        <div className="w-4 h-1" style={{ background: raku.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: raku.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: raku.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Glaze drip accent */}
                    <svg className="w-8 h-16 mt-8" viewBox="0 0 30 60">
                        <path d="M15 0 Q20 20 15 40 Q10 50 15 60" fill="none" stroke={raku.copper} strokeWidth="3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// 18. WEAVE - Textile loom patterns
export const WeaveArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const weave = {
        natural: '#d4c4a8',
        brown: '#8b7355',
        cream: '#f5f0e6',
        dark: '#4a3c2a',
        accent: '#a0522d'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: weave.cream }}>
            {/* Woven grid texture overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="woven" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="10" height="10" fill={weave.natural} />
                        <rect x="10" y="10" width="10" height="10" fill={weave.natural} />
                        <rect x="0" y="10" width="10" height="10" fill={weave.brown} opacity="0.5" />
                        <rect x="10" y="0" width="10" height="10" fill={weave.brown} opacity="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#woven)" />
            </svg>

            {/* Warp/weft line accents */}
            <div className="absolute left-0 top-0 w-1 h-full" style={{
                background: `repeating-linear-gradient(to bottom, ${weave.brown} 0px, ${weave.brown} 10px, transparent 10px, transparent 20px)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute right-0 top-0 w-1 h-full" style={{
                background: `repeating-linear-gradient(to bottom, ${weave.accent} 0px, ${weave.accent} 10px, transparent 10px, transparent 20px)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Woven header decoration */}
                    <div className="flex gap-1 mb-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-2 h-6" style={{
                                background: i % 2 === 0 ? weave.brown : weave.accent
                            }} />
                        ))}
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: weave.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: weave.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Fringe decoration */}
                    <div className="flex gap-2 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-1 h-8" style={{
                                background: weave.brown,
                                opacity: 0.5 + (i % 2) * 0.3
                            }} />
                        ))}
                    </div>
                </div>

                {/* Fabric-framed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-8" style={{
                        borderColor: weave.natural,
                        background: weave.brown
                    }}>
                        <div className="absolute inset-2 border-4" style={{ borderColor: weave.accent }} />
                    </div>
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 19. CERAMIC - Hand-thrown pottery
export const CeramicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ceramic = {
        glaze: '#7eb8da',
        clay: '#c9b8a5',
        speckle: '#8b7355',
        white: '#fafafa',
        dark: '#3a3530'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: ceramic.clay }}>
            {/* Speckled stoneware texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(50)].map((_, i) => {
                    const x = rng.range(0, 100);
                    const y = rng.range(0, 100);
                    const size = rng.range(1, 3);
                    return (
                        <div key={i} className="absolute rounded-full"
                             style={{
                                 left: `${x}%`,
                                 top: `${y}%`,
                                 width: `${size}px`,
                                 height: `${size}px`,
                                 background: ceramic.speckle
                             }} />
                    );
                })}
            </div>

            {/* Glaze drip effect - top */}
            <div className="absolute top-0 left-0 w-full h-24" style={{
                background: ceramic.glaze,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 95% 60%, 90% 55%, 85% 70%, 80% 50%, 75% 65%, 70% 55%, 65% 75%, 60% 50%, 55% 60%, 50% 80%, 45% 55%, 40% 70%, 35% 50%, 30% 65%, 25% 55%, 20% 75%, 15% 50%, 10% 60%, 5% 55%, 0% 70%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 pt-28 flex items-center gap-12">
                {/* Rounded pottery-shaped image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: ceramic.glaze,
                        borderRadius: '50% 50% 45% 45% / 40% 40% 60% 60%'
                    }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        borderRadius: '48% 52% 42% 42% / 38% 38% 62% 62%',
                        border: `3px solid ${ceramic.white}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Rim highlight */}
                    <div className="absolute -top-1 left-1/4 w-1/2 h-2 rounded-full" style={{
                        background: `linear-gradient(to right, transparent, ${ceramic.white}50, transparent)`
                    }} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-2 rounded-full mb-6" style={{ background: ceramic.glaze }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: ceramic.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5550' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Kiln variation marks */}
                    <div className="flex gap-3 mt-8">
                        {[ceramic.glaze, ceramic.speckle, ceramic.glaze].map((color, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 20. PATINA - Aged brass/bronze
export const PatinaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const patina = {
        brass: '#b5a642',
        tarnish: '#6b5b3a',
        verdigris: '#4a7c6c',
        dark: '#2a2520',
        cream: '#f0ebe0'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(145deg, ${patina.brass} 0%, ${patina.tarnish} 50%, ${patina.brass} 100%)`
        }}>
            {/* Oxidation pattern overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                background: `radial-gradient(ellipse at 20% 30%, ${patina.verdigris} 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, ${patina.verdigris} 0%, transparent 35%)`
            }} />

            {/* Vintage wear aesthetic edges */}
            <div className="absolute inset-4 border-2 pointer-events-none" style={{
                borderColor: patina.dark,
                opacity: 0.3,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Aged frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4" style={{
                        background: `linear-gradient(135deg, ${patina.brass} 0%, ${patina.tarnish} 40%, ${patina.verdigris} 70%, ${patina.brass} 100%)`,
                        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)'
                    }} />
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        border: `4px solid ${patina.dark}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content on aged panel */}
                <div className="flex-1 p-8 relative" style={{
                    background: patina.cream,
                    border: `2px solid ${patina.tarnish}`,
                    zIndex: LayoutLayer.CONTENT_HERO
                }}>
                    {/* Worn corner accents */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: patina.brass }} />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: patina.brass }} />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: patina.brass }} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: patina.brass }} />

                    <div className="w-16 h-1 mb-6" style={{ background: patina.verdigris }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: patina.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: patina.tarnish }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />

                    <div className="flex gap-2 mt-6">
                        <div className="w-3 h-3 rounded-full" style={{ background: patina.brass }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: patina.verdigris }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: patina.tarnish }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// ATMOSPHERIC/MOOD ARCHETYPES (6 archetypes)
// ============================================================================

// 21. DUSK - Golden hour twilight
export const DuskArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const dusk = {
        amber: '#ff8c00',
        purple: '#4b0082',
        blue: '#191970',
        gold: '#ffd700',
        cream: '#fff8e7'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(to bottom, ${dusk.amber} 0%, ${dusk.purple} 50%, ${dusk.blue} 100%)`
        }}>
            {/* Sun ray light beams */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <radialGradient id="sun-glow" cx="50%" cy="30%" r="50%">
                        <stop offset="0%" stopColor={dusk.gold} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={dusk.gold} stopOpacity="0" />
                    </radialGradient>
                </defs>
                <ellipse cx="50%" cy="30%" rx="30%" ry="20%" fill="url(#sun-glow)" />
                {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI;
                    return (
                        <line key={i} x1="50%" y1="30%" x2={`${50 + 50 * Math.cos(angle)}%`} y2={`${30 + 40 * Math.sin(angle)}%`}
                              stroke={dusk.gold} strokeWidth="2" opacity="0.3" />
                    );
                })}
            </svg>

            {/* Silhouette horizon */}
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-30 pointer-events-none" style={{
                background: dusk.blue,
                clipPath: 'polygon(0% 60%, 10% 50%, 20% 65%, 30% 45%, 40% 55%, 50% 40%, 60% 55%, 70% 45%, 80% 60%, 90% 50%, 100% 55%, 100% 100%, 0% 100%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Warm glowing image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-full opacity-50" style={{
                        background: `radial-gradient(circle, ${dusk.gold} 0%, transparent 70%)`
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `4px solid ${dusk.gold}40`,
                        boxShadow: `0 0 40px ${dusk.gold}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: dusk.gold }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: dusk.cream }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#e8e0d0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Warm-to-cool transition dots */}
                    <div className="flex gap-2 mt-8">
                        {[dusk.gold, dusk.amber, dusk.purple, dusk.blue].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 22. MONSOON - Tropical rain atmosphere
export const MonsoonArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const monsoon = {
        teal: '#006666',
        gray: '#708090',
        silver: '#c0c0c0',
        dark: '#2f4f4f',
        white: '#f8f8f8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: monsoon.dark }}>
            {/* Rain streak overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="rain" x="0" y="0" width="20" height="100" patternUnits="userSpaceOnUse">
                        <line x1="10" y1="0" x2="10" y2="30" stroke={monsoon.silver} strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#rain)" />
            </svg>

            {/* Mist/fog layer effects */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-30 pointer-events-none" style={{
                background: `linear-gradient(to top, ${monsoon.gray} 0%, transparent 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute top-1/4 left-0 w-full h-32 opacity-10 pointer-events-none" style={{
                background: monsoon.silver,
                filter: 'blur(30px)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-6" style={{ background: monsoon.teal }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: monsoon.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: monsoon.silver }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Rain drop accents */}
                    <div className="flex gap-3 mt-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-2 h-4 rounded-full" style={{
                                background: monsoon.silver,
                                opacity: 0.3 + i * 0.2
                            }} />
                        ))}
                    </div>
                </div>

                {/* Misty framed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute inset-0 opacity-20" style={{
                        background: monsoon.gray,
                        filter: 'blur(20px)'
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
                        border: `2px solid ${monsoon.silver}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 23. TUNDRA - Arctic frozen landscape
export const TundraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tundra = {
        ice: '#e0f7fa',
        blue: '#b3e5fc',
        white: '#ffffff',
        gray: '#b0bec5',
        dark: '#37474f'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: tundra.ice }}>
            {/* Crystalline frost patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="frost" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M30 0 L30 60 M0 30 L60 30 M10 10 L50 50 M50 10 L10 50" fill="none" stroke={tundra.blue} strokeWidth="1" />
                        <circle cx="30" cy="30" r="3" fill={tundra.blue} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#frost)" />
            </svg>

            {/* Aurora subtle hints */}
            <div className="absolute top-0 left-0 w-full h-1/3 opacity-10 pointer-events-none" style={{
                background: `linear-gradient(to bottom, #7fffd4 0%, #00ced1 30%, transparent 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Cold minimal stark lines */}
            <div className="absolute top-8 left-8 right-8 h-px" style={{ background: tundra.gray, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-8 left-8 right-8 h-px" style={{ background: tundra.gray, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Ice crystal framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: tundra.white,
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        clipPath: 'polygon(50% 2%, 98% 26%, 98% 74%, 50% 98%, 2% 74%, 2% 26%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-px mb-8" style={{ background: tundra.dark }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: tundra.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
                        style={{ fontWeight: 300, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: tundra.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Crystal dots */}
                    <div className="flex gap-3 mt-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rotate-45" style={{ background: tundra.blue }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 24. SAVANNA - African golden grassland
export const SavannaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const savanna = {
        gold: '#d4a03a',
        sienna: '#a0522d',
        brown: '#5d4037',
        cream: '#f5e6c8',
        dark: '#2d1b0e'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(to bottom, ${savanna.cream} 0%, ${savanna.gold} 100%)`
        }}>
            {/* Tall grass silhouette overlay */}
            <div className="absolute bottom-0 left-0 w-full h-32 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION
            }}>
                <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
                    {[...Array(40)].map((_, i) => {
                        const x = i * 20 + rng.range(-5, 5);
                        const height = rng.range(60, 95);
                        const curve = rng.range(-10, 10);
                        return (
                            <path key={i} d={`M${x} 100 Q${x + curve} ${100 - height/2} ${x + curve/2} ${100 - height}`}
                                  fill="none" stroke={savanna.brown} strokeWidth="2" />
                        );
                    })}
                </svg>
            </div>

            {/* Warm sun glow */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-30 pointer-events-none" style={{
                background: `radial-gradient(circle, ${savanna.gold} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Horizon line */}
            <div className="absolute top-2/3 left-0 w-full h-px" style={{ background: savanna.sienna, opacity: 0.3, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: savanna.sienna }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: savanna.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: savanna.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Earth tone dots */}
                    <div className="flex gap-2 mt-8">
                        {[savanna.gold, savanna.sienna, savanna.brown].map((color, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>

                {/* Sunset-framed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3 rounded-lg" style={{
                        background: `linear-gradient(135deg, ${savanna.gold} 0%, ${savanna.sienna} 100%)`
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg" style={{
                        border: `3px solid ${savanna.cream}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 25. VOLCANO - Molten earth energy
export const VolcanoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const volcano = {
        black: '#0a0a0a',
        red: '#8b0000',
        orange: '#ff4500',
        amber: '#ff8c00',
        dark: '#1a1a1a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: volcano.black }}>
            {/* Lava crack pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <linearGradient id="lava-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={volcano.red} />
                        <stop offset="50%" stopColor={volcano.orange} />
                        <stop offset="100%" stopColor={volcano.amber} />
                    </linearGradient>
                </defs>
                <path d="M0 200 Q50 180, 100 200 T200 180 T300 200 L300 250 L0 250 Z" fill="url(#lava-glow)" opacity="0.5" />
                <path d="M400 100 Q450 80, 500 100 T600 80 L600 150 L400 150 Z" fill="url(#lava-glow)" opacity="0.4" />
            </svg>

            {/* Ember glow effects */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-40 pointer-events-none" style={{
                background: `linear-gradient(to top, ${volcano.red} 0%, transparent 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Primal energy lines */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: volcano.red, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: volcano.orange, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Molten framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: `linear-gradient(135deg, ${volcano.red} 0%, ${volcano.orange} 50%, ${volcano.amber} 100%)`,
                        boxShadow: `0 0 30px ${volcano.red}`
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `3px solid ${volcano.black}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: volcano.orange }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: volcano.amber }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
                        style={{ fontWeight: 900, lineHeight: '1.0' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#c0c0c0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Heat gradient dots */}
                    <div className="flex gap-2 mt-8">
                        {[volcano.amber, volcano.orange, volcano.red, volcano.red].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 26. REEF - Underwater coral world
export const ReefArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const reef = {
        coral: '#ff6b6b',
        turquoise: '#20b2aa',
        purple: '#9370db',
        gold: '#ffd700',
        deep: '#1a3a4a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(to bottom, ${reef.turquoise} 0%, ${reef.deep} 100%)`
        }}>
            {/* Organic coral shapes */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M50 400 Q80 350, 70 300 Q60 250, 90 200 Q100 150, 80 100" fill="none" stroke={reef.coral} strokeWidth="8" strokeLinecap="round" />
                <path d="M700 400 Q680 350, 720 300 Q740 250, 710 200" fill="none" stroke={reef.purple} strokeWidth="6" strokeLinecap="round" />
                <circle cx="100" cy="300" r="20" fill={reef.coral} opacity="0.3" />
                <circle cx="150" cy="280" r="15" fill={reef.coral} opacity="0.4" />
            </svg>

            {/* Light caustic patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="caustic" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <ellipse cx="30" cy="30" rx="25" ry="15" fill="none" stroke={reef.gold} strokeWidth="1" />
                        <ellipse cx="70" cy="70" rx="20" ry="12" fill="none" stroke={reef.gold} strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#caustic)" />
            </svg>

            {/* Bioluminescent hints */}
            <div className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full opacity-50" style={{
                background: reef.gold,
                boxShadow: `0 0 20px ${reef.gold}`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-6" style={{ background: reef.coral }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#b0e0e6' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Coral color dots */}
                    <div className="flex gap-2 mt-8">
                        {[reef.coral, reef.turquoise, reef.purple, reef.gold].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>

                {/* Organic coral-shaped frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: reef.coral,
                        borderRadius: '60% 40% 55% 45% / 55% 60% 40% 45%',
                        opacity: 0.8
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
                        border: `3px solid ${reef.gold}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
