
import React from 'react';
import { Slide, Theme } from '../types';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { 
    RenderMiniFullBleed, RenderMiniGallery, RenderMiniSplit, RenderMiniStatement,
    RenderMiniCard, RenderMiniHorizontal, RenderMiniMagazine 
} from './MiniSlidePreviews';
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
            case 'card': return <RenderMiniCard slide={slide} theme={theme} />;
            case 'horizontal': return <RenderMiniHorizontal slide={slide} theme={theme} />;
            case 'magazine': return <RenderMiniMagazine slide={slide} theme={theme} />;
            case 'split': default: return <RenderMiniSplit slide={slide} theme={theme} />;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
                group relative w-full max-w-[140px] aspect-video rounded-md cursor-pointer transition-all duration-300 border overflow-hidden
                ${isActive ? 'ring-2 ring-offset-1 ring-zinc-900 scale-[1.02] shadow-md' : 'hover:border-zinc-300 hover:shadow-sm opacity-80 hover:opacity-100'}
            `}
            style={{ 
                backgroundColor: theme.colors.background,
                borderColor: isActive ? theme.colors.accent : theme.colors.border 
            }}
        >
            {renderMiniLayout()}
            
            {/* Hover Actions */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5 z-20">
                {onMoveUp && (
                    <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-0.5 bg-white/90 hover:bg-white rounded shadow-sm text-zinc-600 hover:text-zinc-900">
                        <ArrowUp className="w-2.5 h-2.5" />
                    </button>
                )}
                {onMoveDown && (
                    <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="p-0.5 bg-white/90 hover:bg-white rounded shadow-sm text-zinc-600 hover:text-zinc-900">
                        <ArrowDown className="w-2.5 h-2.5" />
                    </button>
                )}
            </div>

            {isActive && <div className="absolute inset-0 border pointer-events-none z-10" style={{ borderColor: theme.colors.accent }} />}
            <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[6px] font-bold text-white uppercase tracking-widest z-10">
                {slide.id.split('-').pop()}
            </div>
        </div>
    );
};
