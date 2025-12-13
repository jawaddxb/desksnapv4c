
import React from 'react';
import { Presentation, Theme } from '@/types';
import { MainStage } from './MainStage';

interface PrintViewProps {
    presentation: Presentation | null;
    theme: Theme;
    activeWabiSabiLayout?: string;
    viewMode: 'standard' | 'wabi-sabi';
}

export const PrintView: React.FC<PrintViewProps> = ({ presentation, theme, activeWabiSabiLayout, viewMode }) => {
    if (!presentation) return null;

    return (
        <div id="print-container" className="hidden">
            {presentation.slides.map((slide, idx) => (
                <div key={idx} className="w-[100vw] h-[100vh] overflow-hidden" style={{ pageBreakAfter: 'always' }}>
                    <MainStage 
                        slide={slide} 
                        theme={theme} 
                        activeWabiSabiLayout={activeWabiSabiLayout}
                        printMode={true} 
                        viewMode={viewMode} 
                    />
                </div>
            ))}
        </div>
    );
};
