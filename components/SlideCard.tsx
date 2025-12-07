
import React from 'react';
import { Slide, Theme } from '../types';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { RenderMiniFullBleed, RenderMiniGallery, RenderMiniSplit, RenderMiniStatement } from './MiniSlidePreviews';
import { WabiSabiStage } from './WabiSabiStage';

interface SlideCardProps {
  slide: Slide;
  isActive: boolean;
  onClick: () => void;
  theme: Theme;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  viewMode?: 'standard' | 'wabi-sabi';
  activeWabiSabiLayout?: string;
}

export const SlideCard: React.FC<SlideCardProps> = ({ 
    slide, isActive, onClick, theme, onMoveUp, onMoveDown,
    viewMode = 'standard', activeWabiSabiLayout
}) => {
    
    const renderMiniLayout = () => {
        if (viewMode === 'wabi-sabi') {
            return (
                <div className="w-full h-full relative overflow-hidden bg-white pointer-events-none select-none">
                     <div className="absolute top-0 left-0 w-[800%] h-[800%] origin-top-left transform scale-[0.125]">
                        <WabiSabiStage 
                            slide={slide} 
                            theme={theme} 
                            layoutStyle={activeWabiSabiLayout}
                            printMode={true} 
                        />
                     </div>
                </div>
            );
        }

        switch(slide.layoutType) {
            case 'full-bleed': return <RenderMiniFullBleed slide={slide} theme={theme} />;
            case 'statement': return <RenderMiniStatement slide={slide} theme={theme} />;
            case 'gallery': return <RenderMiniGallery slide={slide} theme={theme} />;
            case 'split': default: return <RenderMiniSplit slide={slide} theme={theme} />;
        }
    };

    return (
        <div 
            onClick={onClick}
            className={`
                group relative w-full aspect-video rounded-lg cursor-pointer transition-all duration-300 border-2 overflow-hidden
                ${isActive ? 'ring-2 ring-offset-2 ring-zinc-900 scale-[1.02] shadow-lg' : 'hover:border-zinc-300 hover:shadow-md opacity-80 hover:opacity-100'}
            `}
            style={{ 
                backgroundColor: theme.colors.background,
                borderColor: isActive ? theme.colors.accent : theme.colors.border 
            }}
        >
            {renderMiniLayout()}
            
            {/* Hover Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-20">
                {onMoveUp && (
                    <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-1 bg-white/90 hover:bg-white rounded shadow-sm text-zinc-600 hover:text-zinc-900">
                        <ArrowUp className="w-3 h-3" />
                    </button>
                )}
                {onMoveDown && (
                    <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="p-1 bg-white/90 hover:bg-white rounded shadow-sm text-zinc-600 hover:text-zinc-900">
                        <ArrowDown className="w-3 h-3" />
                    </button>
                )}
            </div>
            
            {isActive && <div className="absolute inset-0 border-2 pointer-events-none z-10" style={{ borderColor: theme.colors.accent }} />}
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[8px] font-bold text-white uppercase tracking-widest z-10">
                {slide.id.split('-').pop()}
            </div>
        </div>
    );
};
