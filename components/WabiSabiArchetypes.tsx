
import React from 'react';
import { Quote, Barcode, Triangle, MoveUpRight, Globe, Receipt as ReceiptIcon, Ruler } from 'lucide-react';
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
    
    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-8" style={{ background: contrast.bg }}>
            {/* Texture Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none overflow-hidden leading-[0.8]" style={{ zIndex: LayoutLayer.BACKGROUND, color: contrast.text, fontFamily: theme.fonts.heading, fontSize: '300px', fontWeight: 900, whiteSpace: 'nowrap', wordBreak: 'break-all' }}>
                {Array(20).fill(bgWord).map((w, i) => (
                    <div key={i} style={{ marginLeft: `${rng.range(-20, 0)}vw`, transform: `translateX(${i % 2 === 0 ? '-' : ''}${rng.range(0, 10)}%)` }}>{w} {w} {w}</div>
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
                
                {/* Circle Container - Explicit Z-Index below text */}
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
                        className="text-6xl md:text-8xl font-black uppercase mb-8 mix-blend-hard-light"
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
            {/* Letterbox Bars */}
            <div className="absolute top-0 left-0 w-full h-[12%] bg-black pointer-events-none" style={{ zIndex: LayoutLayer.OVERLAY }} />
            <div className="absolute bottom-0 left-0 w-full h-[12%] bg-black pointer-events-none" style={{ zIndex: LayoutLayer.OVERLAY }} />
            
            <div className="w-full h-full relative animate-in fade-in duration-1000" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <ImageContainer slide={slide} theme={theme} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            <div className="absolute bottom-[15%] w-full text-center px-20" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
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
            
            <div className="relative w-full max-w-5xl h-[80%]">
                <div className="absolute top-0 right-0 w-[60%] h-full bg-white shadow-xl p-12 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO, transform: `rotate(${rot2}deg)`, clipPath: 'polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%)' }}>
                     <EditableTitle slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-5xl md:text-7xl font-serif italic mb-6" style={{ color: '#111', lineHeight: '1' }} />
                     <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-mono text-sm" />
                </div>
                
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

            <div className="relative w-full md:w-1/2 p-8 bg-white shadow-[8px_8px_0_rgba(0,0,0,0.1)] border border-zinc-100" style={{ zIndex: LayoutLayer.CONTENT_BASE, transform: `rotate(${-rotation}deg)`, background: contrast.mode === 'dark' ? '#27272a' : '#ffffff' }}>
                <EditableTitle slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-7xl mb-6 uppercase tracking-tighter" style={{ lineHeight: '0.95' }} />
                <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} />
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
                            className="w-3/4 bg-transparent outline-none resize-none overflow-hidden" 
                        />
                        <span className="w-1/4 text-right font-bold text-zinc-400">{(rng.next() * 100).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
