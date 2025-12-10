import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const TerminalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const promptColor = rng?.pick(['#22c55e', '#06b6d4', '#f59e0b', '#a855f7']) ?? '#22c55e';
    const timestamp = rng
        ? `${rng.range(0, 23).toFixed(0).padStart(2, '0')}:${rng.range(0, 59).toFixed(0).padStart(2, '0')}`
        : '12:00';
    const slideNum = rng?.range(1, 99).toFixed(0) ?? '1';

    return (
        <div className="w-full h-full relative overflow-hidden p-4 md:p-8" style={{ background: '#0d1117' }}>
            <div className="w-full h-full rounded-xl overflow-hidden flex flex-col" style={{ background: '#161b22', border: '1px solid #30363d', zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="h-10 px-4 flex items-center gap-2 border-b" style={{ background: '#0d1117', borderColor: '#30363d' }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                    <span className="ml-4 text-xs" style={{ color: '#8b949e' }}>slide.{slideNum}.tsx — Terminal</span>
                </div>

                <div className="flex-1 p-6 md:p-10 flex flex-col md:flex-row gap-8 overflow-hidden">
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

                        <div className="mt-auto pt-6 flex items-center gap-2">
                            <span style={{ color: promptColor }}>$</span>
                            <span className="text-sm" style={{ color: '#8b949e' }}>_</span>
                            <div className="w-2 h-4 animate-pulse" style={{ background: promptColor }} />
                        </div>
                    </div>

                    <div className="w-full md:w-2/5 aspect-video md:aspect-auto rounded-lg overflow-hidden border" style={{ borderColor: '#30363d', zIndex: LayoutLayer.MEDIA }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
