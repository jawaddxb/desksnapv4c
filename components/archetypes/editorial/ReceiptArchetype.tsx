import React from 'react';
import { Receipt as ReceiptIcon } from 'lucide-react';
import { ArchetypeProps, EditableTitle } from '../../WabiSabiComponents';
import { SmartText } from '../../SmartText';
import { LayoutLayer } from '../../../lib/themes';

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
                        <span className="w-1/4 text-right font-bold text-zinc-400">{((rng?.next() ?? Math.random()) * 100).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
