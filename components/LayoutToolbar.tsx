
import React, { useState } from 'react';
import { Slide, TextStyleOverride, ToneType, ContentRefinementType, ImageStylePreset } from '../types';
import {
    Columns, Maximize2, Type, LayoutTemplate,
    AlignLeft, AlignCenter, AlignRight,
    Type as TypeIcon, CaseSensitive, Check,
    Smartphone, Square, Rows,
    Bold, Italic, Plus, Minus, Image as ImageIcon,
    Sparkles, MessageSquare, Wand2, ChevronRight, ChevronLeft, Loader2
} from 'lucide-react';

interface LayoutToolbarProps {
    slide: Slide;
    onUpdateSlide: (updates: Partial<Slide>) => void;
    mode?: 'standard' | 'wabi-sabi';
    onRefineContent?: (type: 'tone' | 'content', subType: string) => Promise<void>;
    onEnhanceImage?: (preset: ImageStylePreset) => Promise<void>;
    isRefining?: boolean;
}

export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({
    slide,
    onUpdateSlide,
    mode = 'standard',
    onRefineContent,
    onEnhanceImage,
    isRefining = false
}) => {
    const [activeLabel, setActiveLabel] = useState<string>(mode === 'wabi-sabi' ? "Text Styling" : "Layout Designer");
    const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
    const [activeAISubmenu, setActiveAISubmenu] = useState<'tone' | 'content' | 'visual' | null>(null);
    const isWabiSabi = mode === 'wabi-sabi';

    const handleUpdate = (updates: Partial<Slide>) => {
        onUpdateSlide(updates);
    };

    // Text style helpers
    const titleStyle = slide.textStyles?.title;
    const contentStyle = slide.textStyles?.content;
    const isBold = (titleStyle?.fontWeight ?? 400) >= 700;
    const isItalic = titleStyle?.fontStyle === 'italic';

    const toggleBold = () => {
        const newWeight = isBold ? 400 : 700;
        handleUpdate({
            textStyles: {
                ...slide.textStyles,
                title: { ...titleStyle, fontWeight: newWeight },
                content: { ...contentStyle, fontWeight: newWeight },
            }
        });
    };

    const toggleItalic = () => {
        const newStyle = isItalic ? 'normal' : 'italic';
        handleUpdate({
            textStyles: {
                ...slide.textStyles,
                title: { ...titleStyle, fontStyle: newStyle },
                content: { ...contentStyle, fontStyle: newStyle },
            }
        });
    };

    // Font size helpers (±8px increments)
    const currentTitleSize = slide.titleFontSize ?? 64;
    const currentContentSize = slide.contentFontSize ?? 20;

    const adjustFontSize = (delta: number) => {
        handleUpdate({
            titleFontSize: Math.max(24, Math.min(120, currentTitleSize + delta)),
            contentFontSize: Math.max(12, Math.min(48, currentContentSize + (delta / 2))),
        });
    };

    // Image opacity helper
    const currentOpacity = slide.imageStyles?.opacity ?? 1;

    const adjustOpacity = (delta: number) => {
        const newOpacity = Math.max(0.1, Math.min(1, currentOpacity + delta));
        handleUpdate({
            imageStyles: {
                ...slide.imageStyles,
                opacity: Math.round(newOpacity * 10) / 10, // Round to 1 decimal
            }
        });
    };

    const Button = ({ 
        active, 
        onClick, 
        icon: Icon, 
        label, 
        text 
    }: { 
        active: boolean, 
        onClick: () => void, 
        icon?: React.FC<any>, 
        label: string,
        text?: string
    }) => (
        <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onMouseEnter={() => setActiveLabel(label)}
            onMouseLeave={() => setActiveLabel("Layout Designer")}
            className={`
                relative group flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200
                ${active 
                    ? 'bg-zinc-900 text-white shadow-md scale-105' 
                    : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 hover:scale-105'
                }
            `}
        >
            {Icon && <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />}
            {text && <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-current'}`}>{text}</span>}
            
            {/* Active Indicator Dot */}
            {active && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 border border-white"></span>
                </span>
            )}
        </button>
    );

    const Divider = () => <div className="w-px h-6 bg-zinc-200 mx-1" />;

    const FilterSlider = ({
        label,
        value,
        min,
        max,
        onChange
    }: {
        label: string;
        value: number;
        min: number;
        max: number;
        onChange: (v: number) => void;
    }) => (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 w-16">{label}</span>
            <input
                type="range"
                min={min}
                max={max}
                step={0.05}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-900"
            />
            <span className="text-[10px] text-zinc-400 w-8 text-right">{Math.round(value * 100)}%</span>
        </div>
    );

    return (
        // Z-Index boosted to 200 to sit above Content Layers
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-3 opacity-0 group-hover/stage:opacity-100 transition-all duration-500 translate-y-8 group-hover/stage:translate-y-0">
            
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xl shadow-2xl p-2 border border-white/20 rounded-2xl ring-1 ring-zinc-900/5">

                {/* LAYOUT GROUP - Standard mode only */}
                {!isWabiSabi && (
                    <>
                        <div className="flex gap-1">
                            <Button
                                active={slide.layoutType === 'split'}
                                onClick={() => handleUpdate({ layoutType: 'split' })}
                                icon={Columns}
                                label="Split Layout"
                            />
                            <Button
                                active={slide.layoutType === 'magazine'}
                                onClick={() => handleUpdate({ layoutType: 'magazine' })}
                                icon={Smartphone}
                                label="Magazine Column"
                            />
                            <Button
                                active={slide.layoutType === 'horizontal'}
                                onClick={() => handleUpdate({ layoutType: 'horizontal' })}
                                icon={Rows}
                                label="Horizontal Split"
                            />
                            <Button
                                active={slide.layoutType === 'card'}
                                onClick={() => handleUpdate({ layoutType: 'card' })}
                                icon={Square}
                                label="Floating Card"
                            />
                            <Button
                                active={slide.layoutType === 'full-bleed'}
                                onClick={() => handleUpdate({ layoutType: 'full-bleed' })}
                                icon={Maximize2}
                                label="Full Bleed"
                            />
                            <Button
                                active={slide.layoutType === 'statement'}
                                onClick={() => handleUpdate({ layoutType: 'statement' })}
                                icon={Type}
                                label="Statement"
                            />
                            <Button
                                active={slide.layoutType === 'gallery'}
                                onClick={() => handleUpdate({ layoutType: 'gallery' })}
                                icon={LayoutTemplate}
                                label="Gallery Grid"
                            />
                        </div>

                        <Divider />

                        {/* ALIGNMENT GROUP - Standard mode only */}
                        <div className="flex gap-1">
                            <Button
                                active={slide.alignment === 'left'}
                                onClick={() => handleUpdate({ alignment: 'left' })}
                                icon={AlignLeft}
                                label="Align Left"
                            />
                            <Button
                                active={slide.alignment === 'center'}
                                onClick={() => handleUpdate({ alignment: 'center' })}
                                icon={AlignCenter}
                                label="Align Center"
                            />
                            <Button
                                active={slide.alignment === 'right'}
                                onClick={() => handleUpdate({ alignment: 'right' })}
                                icon={AlignRight}
                                label="Align Right"
                            />
                        </div>

                        <Divider />
                    </>
                )}

                {/* TYPOGRAPHY GROUP */}
                <div className="flex gap-1">
                    <Button
                        active={slide.fontScale === 'compact'}
                        onClick={() => handleUpdate({ fontScale: 'compact' })}
                        text="S"
                        label="Compact Text"
                    />
                    <Button
                        active={!slide.fontScale || slide.fontScale === 'auto'}
                        onClick={() => handleUpdate({ fontScale: 'auto' })}
                        text="M"
                        label="Auto Scale"
                    />
                    <Button
                        active={slide.fontScale === 'hero'}
                        onClick={() => handleUpdate({ fontScale: 'hero' })}
                        text="L"
                        label="Hero Text"
                    />
                </div>

                <Divider />

                {/* TEXT STYLE GROUP */}
                <div className="flex gap-1">
                    <Button
                        active={isBold}
                        onClick={toggleBold}
                        icon={Bold}
                        label="Bold"
                    />
                    <Button
                        active={isItalic}
                        onClick={toggleItalic}
                        icon={Italic}
                        label="Italic"
                    />
                    <Button
                        active={false}
                        onClick={() => adjustFontSize(8)}
                        icon={Plus}
                        label="Increase Font Size"
                    />
                    <Button
                        active={false}
                        onClick={() => adjustFontSize(-8)}
                        icon={Minus}
                        label="Decrease Font Size"
                    />
                </div>

                <Divider />

                {/* IMAGE OPACITY GROUP */}
                {slide.imageUrl && (
                    <div className="flex gap-1 items-center">
                        <ImageIcon className="w-3.5 h-3.5 text-zinc-400 mx-1" />
                        <Button
                            active={false}
                            onClick={() => adjustOpacity(-0.1)}
                            icon={Minus}
                            label="Decrease Image Opacity"
                        />
                        <span className="text-[10px] font-medium text-zinc-500 w-8 text-center">
                            {Math.round(currentOpacity * 100)}%
                        </span>
                        <Button
                            active={false}
                            onClick={() => adjustOpacity(0.1)}
                            icon={Plus}
                            label="Increase Image Opacity"
                        />
                    </div>
                )}

                {/* AI REFINEMENT MENU */}
                {(onRefineContent || onEnhanceImage) && (
                    <>
                        <Divider />
                        <div className="relative">
                            <Button
                                active={isAIMenuOpen}
                                onClick={() => { setIsAIMenuOpen(!isAIMenuOpen); setActiveAISubmenu(null); }}
                                icon={Sparkles}
                                label="AI Refinement"
                            />

                            {/* Dropdown Menu */}
                            {isAIMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-[199]" onClick={() => { setIsAIMenuOpen(false); setActiveAISubmenu(null); }} />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden z-[201] animate-in fade-in zoom-in-95 duration-200 origin-bottom">

                                        {/* Loading Overlay */}
                                        {isRefining && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
                                                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                                            </div>
                                        )}

                                        {/* Main Menu */}
                                        {!activeAISubmenu && (
                                            <div className="p-2">
                                                <button onClick={() => setActiveAISubmenu('tone')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                                                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                                                    <div className="text-left flex-1">
                                                        <div className="text-xs font-bold text-zinc-900">Adjust Tone</div>
                                                        <div className="text-[10px] text-zinc-400">Professional, Casual, Executive...</div>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-zinc-300" />
                                                </button>
                                                <button onClick={() => setActiveAISubmenu('content')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                                                    <Wand2 className="w-4 h-4 text-zinc-400" />
                                                    <div className="text-left flex-1">
                                                        <div className="text-xs font-bold text-zinc-900">Refine Content</div>
                                                        <div className="text-[10px] text-zinc-400">Expand, Simplify, Clarify...</div>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-zinc-300" />
                                                </button>
                                                {slide.imageUrl && (
                                                    <button onClick={() => setActiveAISubmenu('visual')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                                                        <ImageIcon className="w-4 h-4 text-zinc-400" />
                                                        <div className="text-left flex-1">
                                                            <div className="text-xs font-bold text-zinc-900">Enhance Visual</div>
                                                            <div className="text-[10px] text-zinc-400">Filters & Style Presets</div>
                                                        </div>
                                                        <ChevronRight className="w-3 h-3 text-zinc-300" />
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Tone Submenu */}
                                        {activeAISubmenu === 'tone' && (
                                            <div className="p-2">
                                                <button onClick={() => setActiveAISubmenu(null)} className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600">
                                                    <ChevronLeft className="w-3 h-3" /> Back
                                                </button>
                                                {(['professional', 'casual', 'technical', 'persuasive', 'executive'] as ToneType[]).map(tone => (
                                                    <button
                                                        key={tone}
                                                        onClick={() => { onRefineContent?.('tone', tone); setIsAIMenuOpen(false); setActiveAISubmenu(null); }}
                                                        className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-700 rounded-lg hover:bg-zinc-50 capitalize"
                                                    >
                                                        {tone}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Content Submenu */}
                                        {activeAISubmenu === 'content' && (
                                            <div className="p-2">
                                                <button onClick={() => setActiveAISubmenu(null)} className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600">
                                                    <ChevronLeft className="w-3 h-3" /> Back
                                                </button>
                                                {(['expand', 'simplify', 'clarify', 'storytelling'] as ContentRefinementType[]).map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => { onRefineContent?.('content', type); setIsAIMenuOpen(false); setActiveAISubmenu(null); }}
                                                        className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-700 rounded-lg hover:bg-zinc-50 capitalize"
                                                    >
                                                        {type === 'storytelling' ? 'Add Storytelling' : type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Visual Submenu */}
                                        {activeAISubmenu === 'visual' && (
                                            <div className="p-2">
                                                <button onClick={() => setActiveAISubmenu(null)} className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600">
                                                    <ChevronLeft className="w-3 h-3" /> Back
                                                </button>

                                                {/* CSS Filter Sliders */}
                                                <div className="px-3 py-2 space-y-3 border-b border-zinc-100 mb-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Filters</label>
                                                    <FilterSlider
                                                        label="Brightness"
                                                        value={slide.imageStyles?.brightness ?? 1}
                                                        min={0.5}
                                                        max={1.5}
                                                        onChange={(v) => handleUpdate({ imageStyles: { ...slide.imageStyles, brightness: v } })}
                                                    />
                                                    <FilterSlider
                                                        label="Contrast"
                                                        value={slide.imageStyles?.contrast ?? 1}
                                                        min={0.5}
                                                        max={1.5}
                                                        onChange={(v) => handleUpdate({ imageStyles: { ...slide.imageStyles, contrast: v } })}
                                                    />
                                                    <FilterSlider
                                                        label="Saturation"
                                                        value={slide.imageStyles?.saturation ?? 1}
                                                        min={0}
                                                        max={2}
                                                        onChange={(v) => handleUpdate({ imageStyles: { ...slide.imageStyles, saturation: v } })}
                                                    />
                                                </div>

                                                {/* AI Style Presets */}
                                                <label className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">AI Style Presets</label>
                                                {(['vivid', 'muted', 'high-contrast', 'soft'] as ImageStylePreset[]).map(preset => (
                                                    <button
                                                        key={preset}
                                                        onClick={() => { onEnhanceImage?.(preset); setIsAIMenuOpen(false); setActiveAISubmenu(null); }}
                                                        className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-700 rounded-lg hover:bg-zinc-50 capitalize flex items-center gap-2"
                                                    >
                                                        <Sparkles className="w-3 h-3 text-purple-400" />
                                                        {preset.replace('-', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Dynamic Label Tag */}
            <div className="px-3 py-1 bg-zinc-900 text-white rounded-full shadow-lg transform transition-all duration-200">
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    {activeLabel === "Layout Designer" ? (
                        <span className="opacity-50">{activeLabel}</span>
                    ) : (
                        <>
                            <span className="w-1 h-1 rounded-full bg-indigo-400" />
                            {activeLabel}
                        </>
                    )}
                </span>
            </div>
        </div>
    );
};
