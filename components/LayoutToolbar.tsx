
import React, { useState } from 'react';
import { Slide } from '../types';
import { 
    Columns, Maximize2, Type, LayoutTemplate, 
    AlignLeft, AlignCenter, AlignRight, 
    Type as TypeIcon, CaseSensitive, Check,
    Smartphone, Square, Rows
} from 'lucide-react';

interface LayoutToolbarProps {
    slide: Slide;
    onUpdateSlide: (updates: Partial<Slide>) => void;
}

export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({ slide, onUpdateSlide }) => {
    const [activeLabel, setActiveLabel] = useState<string>("Layout Designer");

    const handleUpdate = (updates: Partial<Slide>) => {
        onUpdateSlide(updates);
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

    return (
        // Z-Index boosted to 200 to sit above Content Layers
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-3 opacity-0 group-hover/stage:opacity-100 transition-all duration-500 translate-y-8 group-hover/stage:translate-y-0">
            
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xl shadow-2xl p-2 border border-white/20 rounded-2xl ring-1 ring-zinc-900/5">
                
                {/* LAYOUT GROUP */}
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

                {/* ALIGNMENT GROUP */}
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
