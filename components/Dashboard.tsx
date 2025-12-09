
import React, { useRef, useState } from 'react';
import { Presentation } from '../types';
import { THEMES } from '../lib/themes';
import { WabiSabiStage } from './WabiSabiStage';
import { Plus, Trash2, Clock, Play, Upload, BarChart2, Lightbulb } from 'lucide-react';
import { AnalyticsModal } from './AnalyticsModal';

interface DashboardProps {
    savedDecks: Presentation[];
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    onCreateNew: () => void;
    onImport: (file: File) => void;
    onIdeate?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ savedDecks, onLoad, onDelete, onCreateNew, onImport, onIdeate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [analyticsDeck, setAnalyticsDeck] = useState<Presentation | null>(null);

    const handleImportClick = () => fileInputRef.current?.click();
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImport(file);
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-zinc-50 p-8 md:p-12">
            {analyticsDeck && (
                <AnalyticsModal presentation={analyticsDeck} onClose={() => setAnalyticsDeck(null)} />
            )}
            
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Decks</h1>
                        <p className="text-zinc-500">Manage your generated presentations</p>
                    </div>
                    <div className="flex gap-3">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                        <button
                            onClick={handleImportClick}
                            className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-xs transition-all shadow-sm"
                        >
                            <Upload className="w-4 h-4" />
                            Import
                        </button>
                        {onIdeate && (
                            <button
                                onClick={onIdeate}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-xs transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <Lightbulb className="w-4 h-4" />
                                Ideate
                            </button>
                        )}
                        <button
                            onClick={onCreateNew}
                            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-xs transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            <Plus className="w-4 h-4" />
                            New Deck
                        </button>
                    </div>
                </div>

                {savedDecks.length === 0 ? (
                    <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-20 text-center flex flex-col items-center justify-center bg-white/50">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                            <Plus className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">No Decks Yet</h3>
                        <p className="text-zinc-500 mb-8 max-w-md mx-auto">Create your first presentation to get started. All your work will be automatically saved here.</p>
                        <button onClick={onCreateNew} className="text-indigo-600 font-bold hover:underline">Start Creating &rarr;</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedDecks.map(deck => {
                            const theme = THEMES[deck.themeId] || THEMES.neoBrutalist;
                            const coverSlide = deck.slides[0];
                            
                            return (
                                <div key={deck.id} className="group bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col overflow-hidden relative">
                                    <div className="aspect-video w-full bg-zinc-100 relative overflow-hidden cursor-pointer" onClick={() => onLoad(deck.id)}>
                                        {/* Using WabiSabi renderer for high fidelity thumbnail */}
                                        <div className="w-[800%] h-[800%] origin-top-left transform scale-[0.125] pointer-events-none select-none">
                                            <WabiSabiStage 
                                                slide={coverSlide} 
                                                theme={theme}
                                                layoutStyle={deck.wabiSabiLayout}
                                                printMode={true}
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="bg-white/90 text-zinc-900 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                <Play className="w-3 h-3" fill="currentColor" /> Edit Deck
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-zinc-900 line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onLoad(deck.id)}>{deck.topic}</h3>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(deck.lastModified).toLocaleDateString()}</span>
                                                <span className="px-2 py-1 bg-zinc-100 rounded text-zinc-500">{deck.slides.length} Slides</span>
                                            </div>
                                            
                                            {/* Analytics Button */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setAnalyticsDeck(deck); }}
                                                className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                title="View Analytics"
                                            >
                                                <BarChart2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDelete(deck.id); }}
                                        className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm z-10"
                                        title="Delete Deck"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};